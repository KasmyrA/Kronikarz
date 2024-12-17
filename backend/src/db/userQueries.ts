import { ObjectId } from "mongodb";
import { User } from "../types/userInterfaces.js";
import { db } from "./db.js";

interface DbUser extends Omit<User, "_id"> {
  _id: ObjectId;
}

function dbUserToUser(usr: DbUser): User {
  return {
    ...usr,
    _id: usr._id.toString()
  }
}

const usersCollection = db.collection<DbUser>("users");;

export async function getUserByEmail(email: string): Promise<User> {
  const usr = await usersCollection.findOne({ email });
  return dbUserToUser(usr);
}

export async function getUserById(_id: string): Promise<User> {
  const usr = await usersCollection.findOne({ _id: new ObjectId(_id) });
  return dbUserToUser(usr);
}

export async function createUser(user: Omit<User, "_id">): Promise<string> {
  const { insertedId } = await usersCollection.insertOne(user as DbUser);
  return insertedId.toString();
}