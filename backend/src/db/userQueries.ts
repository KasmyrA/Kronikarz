import { User } from "../types/userInterfaces.js";
import { db, IdType } from "./db.js";

const usersCollection = db.collection<User>("users");;

export async function getUserByEmail(email: string) {
  return usersCollection.findOne({ email });
}

export async function getUserById(_id: IdType) {
  return usersCollection.findOne({ _id });
}

export async function createUser(user: Omit<User, "_id">): Promise<IdType> {
  const { insertedId } = await usersCollection.insertOne(user as User);
  return insertedId;
}