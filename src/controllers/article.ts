import { NextFunction, Request, Response } from "express";
import List from "../models/list";
import Article from "../models/article";

const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { listId, articles } = req.body;
  let list = await List.findOne({ _id: listId });
  if (!list)
    return res.status(500).json({
      message: "Invalid listId",
    });
  try {
    const articlesResponse = await Article.insertMany(
      articles.map((x: typeof Article) => ({
        ...x,
        listId: listId._id,
      }))
    );
    for (const v of Object.values(articlesResponse)) {
      list.articles.push(v._id);
    }
    await list.save();
    return res.status(201).json({
      list: list,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { articles } = req.body;

  try {
    for (const article of articles) {
      Article.findByIdAndUpdate(
        {
          _id: article._id,
        },
        {
          name: article.name,
        }
      );
    }
    return res.status(200).json({
      message: "successfully updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const article = await Article.findOne({ _id: req.params.id });
    if (!article)
      return res.status(500).json({
        message: "invalidId",
      });
    List.findByIdAndUpdate(
      {
        _id: article.listId,
      },
      {
        $pull: { articles: article._id },
      }
    ).then(async () => {
      await Article.deleteOne({ _id: article._id });
      return res.status(200).json({
        message: "successfully removed",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const getReport = async (req: Request, res: Response, next: NextFunction) => {
  let { startDate, endDate } = req.body;
  try {
    const articles = await Article.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lt: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: { name: "$name" },
          count: { $sum: "$count" },
        },
      },
    ]);
    return res.status(200).json({
      results: articles,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export default { createArticle, updateArticle, deleteArticle, getReport };
