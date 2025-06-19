import { NextResponse } from "next/server";
import clientPromise from "@/app/api/mongo_init";
import driver from "@/app/api/neo_init";

export async function GET() {
  const session = driver.session();

  try {
    const client = await clientPromise;
    const db = client.db("Progetto_MAADB");
    let personId = 8333;

    // Seleziona la città di una certa persona
    const result = await session.run(`MATCH (p:person {id: $personId})-[:islocatedin]->(pl:place) WHERE pl.type = "city" RETURN pl.name AS city`, { personId });
    let city = result.records.map((record) => record.get("city"))[0];
    //console.log(city);

    // Seleziona tutti gli abitanti di quella città
    const people = await session.run(`MATCH (p:person)-[:islocatedin]->(pl:place {type: "city", name: $city}) RETURN p.id AS person_id`, { city });
    let people_list = people.records.map((record) => record.get("person_id").toNumber());
    people_list = people_list.filter((item) => item != personId);
    //console.log(people_list);

    // Seleziona i conoscenti della persona in input
    const users = await db.collection("person_knows_person").find({ Person_id: personId }).toArray();
    let knownPeople = users.map((record) => record.Person_id_1);
    //console.log(studentsList)

    let finalList = [] as number[];
    people_list.forEach((element) => {
      if (knownPeople.includes(element)) {
        finalList.push(element);
      }
    });
    //console.log(finalList);

    const forums = await db
      .collection("forum_hasMember_person")
      .find({ Person_id: { $in: knownPeople } })  // finalList
      .toArray();
    let res = forums.map((record) => [record.Person_id, record.Forum_id]);

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}
