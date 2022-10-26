// External Dependencies
import * as dotenv from "dotenv";
import { Collection, Db, MongoClient } from "mongodb";
import { isPresent } from "ts-is-present";

let collections: { users: Collection };

// Initialize Connection
export async function connect() {
  dotenv.config();
  const uri = process.env.DB_CONN_STRING;
  let client: MongoClient;

  if (isPresent(uri)) client = new MongoClient(uri);
  else {
    console.error("Database connection url is not set.");
    return;
  }
  try {
    await client.connect();
    console.log("Connected to database.");
  } catch (error) {
    console.error(error);
  }

  const db = client.db();
  await initCollections(db);
}

async function initCollections(db: Db) {
  const users = db.collection("User");
  collections = { users };
}

export function getCollection() {
  return collections;
}
