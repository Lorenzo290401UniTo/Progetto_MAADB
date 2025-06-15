import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client = new MongoClient("mongodb://localhost:27017");
//export const db = client.db("Progetto_MAADB");

let clientPromise = client.connect();

export default clientPromise;
