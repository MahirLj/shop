import mongoose, { Schema } from "mongoose";
import IArticles from "../interfaces/articles";

const ArticleSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    count: { type: Number, required: true },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "List",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IArticles>("Article", ArticleSchema);
