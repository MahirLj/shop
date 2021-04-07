import mongoose, { Schema } from "mongoose";
import IList from "../interfaces/list";

const ListSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IList>("List", ListSchema);
