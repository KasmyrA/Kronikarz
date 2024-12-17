import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb://localhost:27017";
const dbName = "kronikarz";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

try {
  await client.connect();
  await client.db(dbName).command({ ping: 1 });
} catch (error) {
  console.error(error);
  process.exit(1);
}

export const db = client.db(dbName);