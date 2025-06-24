import { NextResponse } from "next/server";
import clientPromise from "@/app/api/mongo_init";
import driver from "@/app/api/neo_init";

export async function GET(req: Request) {
  const session = driver.session();

  const url = new URL(req.url);
  let personId = 0;
  let param = url.searchParams.get("id");
  if (param != null && param != "") {
    personId = parseInt(param);
  } else {
    return NextResponse.json({ error: "User ID non inserito" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Progetto_MAADB");

    // Seleziona la città di una certa persona
    const result = await session.run(`MATCH (p:person {id: $personId})-[:islocatedin]->(pl:place) WHERE pl.type = "city" RETURN pl.name AS city`, { personId });
    let city = result.records.map((record) => record.get("city"))[0];
    //console.log(city);

    // Seleziona tutti gli abitanti di quella città
    let people_list;
    if (city != undefined) {
      const people = await session.run(`MATCH (p:person)-[:islocatedin]->(pl:place {type: "city", name: $city}) RETURN p.id AS person_id`, { city });
      people_list = people.records.map((record) => record.get("person_id").toNumber());
      people_list = people_list.filter((item) => item != personId);
    } else {
      return NextResponse.json({ error: "Nessuna città associata all'utente " + personId });
    }
    //console.log(people_list);

    // Seleziona i conoscenti della persona in input
    const users = await db.collection("person_knows_person").find({ Person_id: personId }).toArray();
    let knownPeople = users.map((record) => record.Person_id_1);
    //console.log(knownPeople);

    // Incrocio i conoscenti dell'utente con quelli della sua stessa città
    let finalList = [] as number[];
    people_list.forEach((element) => {
      if (knownPeople.includes(element)) {
        finalList.push(element);
      }
    });
    //console.log(finalList);

    // Seleziona i forum dei conoscenti della persona in input
    const forums = await db
      .collection("forum_hasMember_person")
      .aggregate([
        { $match: { Person_id: { $in: finalList } } },
        {
          $group: {
            _id: "$Person_id",
            forums: { $push: "$$ROOT" },
          },
        },
      ])
      .toArray();

    // Conversione id => dati
    let res = [] as any;
    for (let element of forums) {
      let person_res = await db
        .collection("person")
        .find({ id: (element as unknown as any)._id }, { projection: { _id: 0, firstName: 1, lastName: 1 } })
        .toArray();
      let person_name = person_res.map((record) => record.firstName + " " + record.lastName)[0];

      let forums = (element as unknown as any).forums.map((record: any) => record.Forum_id);

      let f_titles = await db
        .collection("forum")
        .find({ id: { $in: forums } }, { projection: { _id: 0, title: 1 } })
        .toArray();
      f_titles = f_titles.map((record) => record.title);

      res.push({
        user: person_name,
        forums: f_titles,
      });
    }
    //console.log(res);

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}
