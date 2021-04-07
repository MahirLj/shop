import { Document } from "mongoose";

export default interface IArticles extends Document {
  name: string;
  listId: string;
  count: Int16Array;
}
