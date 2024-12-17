import { ObjectId } from "mongodb";
import { Tree } from "../types/treeInterfaces.js";
import { db } from "./db.js";
import { addTreeToUser } from "./userQueries.js";

interface DbTree {
  _id: ObjectId;
  name: string;
  peopleIds: ObjectId[];
  relationshipsIds: ObjectId[];
  parenthoodsIds: ObjectId[];
}

function dbTreeToTree(tree: DbTree): Tree {
  return {
    name: tree.name,
    _id: tree._id.toString(),
    peopleIds: tree.peopleIds.map(t => t.toString()),
    relationshipsIds: tree.relationshipsIds.map(t => t.toString()),
    parenthoodsIds: tree.parenthoodsIds.map(t => t.toString()),
  }
}

const treesCollection = db.collection<DbTree>("trees");

export async function createTree(treeName: string, userId: string) {
  const tree: Omit<DbTree, '_id'> = {
    name: treeName,
    parenthoodsIds: [],
    peopleIds: [],
    relationshipsIds: []
  }

  const { insertedId } = await treesCollection.insertOne(tree as DbTree);
  const treeId = insertedId.toString();
  await addTreeToUser(userId, treeId);
  return treeId;
}