import { NextResponse } from "next/server";
import clientPromise from "@/app/api/mongo_init";
import driver from "@/app/api/neo_init";

export async function GET() {
  const session = driver.session();

  try {
    const client = await clientPromise;
    const db = client.db("Progetto_MAADB");
    let tag = "Che_Guevara";

    // Seleziona tutti gli id delle persone con un determinato interesse in input
    const result = await session.run("MATCH (p:person)-[:hasinterest]->(t:tag) WHERE t.name = $tag RETURN collect(DISTINCT p.id) AS peopleIDs", { tag });
    let temp = result.records.map((record) => record.get("peopleIDs"))[0];
    let peopleIDs = [] as number[];
    temp.forEach((record: any) => {
      peopleIDs.push(record.toNumber());
    });

    // Seleziona tutti i commenti di queste persone
    const commentPersonAggregate = await db
      .collection("comment_hasCreator_person")
      .aggregate([
        { $match: { Person_id: { $in: peopleIDs } } },
        {
          $group: {
            _id: "$Person_id",
            Comment_ids: { $addToSet: "$Comment_id" },
          },
        },
      ])
      .toArray();

    let res = [] as any;
    for (let element of commentPersonAggregate) {
      let person = (await db.collection("person").findOne({ id: (element as any)._id })) as unknown as any;
      let personRes = person.firstName + " " + person.lastName;

      let comments = await db
        .collection("comment")
        .find({ id: { $in: (element as any).Comment_ids } })
        .toArray();
      let commentsRes = comments.map((record) => [record.id, record.content]);

      res.push([personRes, commentsRes]);
    }

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}
