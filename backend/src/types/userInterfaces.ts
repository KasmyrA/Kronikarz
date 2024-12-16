import { ObjectId } from "mongodb";
import { Tree } from "./treeInterfaces.js";

export interface User {
  _id: ObjectId;
  email: string;
  hashedPassword: string;
  trees: Tree[];
}