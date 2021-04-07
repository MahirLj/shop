import { Document } from "mongoose";
import IArticles from "./articles";

export default interface IList extends Document {
  name: string;
  userId: string;
  articles: [IArticles];
}
