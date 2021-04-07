import { NextFunction, Request, Response } from "express";
import List from "../models/list";
import Article from "../models/article";
import jwt from "jsonwebtoken";
import User from "../models/user";


const createList = (req: Request, res: Response, next: NextFunction) => {
  let { name, userId, articles } = req.body;
  const _list = new List({
    name,
    userId,
  });

  _list
    .save()
    .then(async (list) => {
      const articlesResponse = await Article.insertMany(
        articles.map((x: typeof Article) => ({
          ...x,
          listId: list._id,
        }))
      );
      for (const v of Object.values(articlesResponse)) {
        _list.articles.push(v._id);
      }
      await _list.save();
      return res.status(201).json({
        list: list,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const updateList = async (req: Request, res: Response, next: NextFunction) => {
  let { id, name, userId, articles } = req.body;
  const list = await List.findOne({ _id: id });
  if (list && list.userId !== userId)
    return res.status(401).json({
      message: "Not authorized",
    });
  try {
    if (articles && articles.length) {
      Article.deleteMany({ listId: id }).then(async () => {
        let articlesIds = [];
        const articlesResponse = await Article.insertMany(
          articles.map((x: typeof Article) => ({
            ...x,
            listId: id,
          }))
        );
        for (const v of Object.values(articlesResponse)) {
          articlesIds.push(v._id);
        }
        List.findByIdAndUpdate(
          {
            _id: id
          },
          {
            name,
            articles: articlesIds
          }
        ).then(() => {
          return res.status(200).json({
            message: "record updated",
          });
        });
      })
    } else {
      List.findByIdAndUpdate(
        {
          _id: id
        },
        {
          name
        }
      ).then(() => {
        return res.status(200).json({
          message: "record updated",
        });
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    List.find({}).then((lists) => {
      return res.status(200).json({
        message: lists,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const deleteList = async (req: Request, res: Response, next: NextFunction) => {
  let list = await List.findOne({ _id: req.params.id });
  if (!list) {
    return res.status(500).json({
      message: 'Invalid id',
    });
  }
  let auth: any = req.headers['authorization'] || '';
  auth = auth.replace('Bearer ', '')
  const decoded: any = jwt.verify(auth, 'superencryptedsecret')
  const user: any = await User.findOne({ email: decoded.email })
  if (String(list.userId) !== String(user._id)) {
    return res.status(500).json({
      message: 'Not authorized',
    });
  }
  try {
    Article.deleteMany({ listId: list._id }).then(() => {
      List.deleteOne({ _id: req.params.id }).then(() => {
        return res.status(200).json({
          message: "successfully removed",
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export default { createList, updateList, getAll, deleteList };
