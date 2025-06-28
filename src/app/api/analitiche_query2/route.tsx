import { NextResponse } from "next/server";
import clientPromise from "@/app/api/mongo_init";
import driver from "@/app/api/neo_init";

export async function GET() {
  const session = driver.session();

  try {
    const client = await clientPromise;
    const db = client.db("Progetto_MAADB");

    // Seleziona i top 10 forum più popolati
    let top_forums = await db
      .collection("forum_hasMember_person")
      .aggregate([{ $group: { _id: "$Forum_id", memberCount: { $sum: 1 } } }, { $sort: { memberCount: -1 } }, { $limit: 10 }])
      .toArray();
    top_forums = top_forums.map((record) => record._id);
    //console.log(top_forums);

    // Seleziona i tag dei top 10 forum
    const result = await session.run("MATCH (f:forum)-[:forumhastag]->(t:tag) WHERE f.id IN $top_forums RETURN f.id AS forumId, collect(t.name) AS tags", { top_forums });
    let final_res = result.records.map((record) => [record.get("forumId"), record.get("tags")]);
    //console.log(final_res);

    return NextResponse.json(final_res);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}
