export interface User {
  _id: string;
  email: string;
  hashedPassword: string;
  treeIds: string[];
}