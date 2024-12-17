import { Tree } from "./treeInterfaces.js";

export interface User {
  _id: string;
  email: string;
  hashedPassword: string;
  trees: Tree[];
}