import { NextResponse } from "next/server";
import clientPromise from "@/app/api/mongo_init";
import driver from "@/app/api/neo_init";

export async function GET() {
  const session = driver.session();

  try {
    const client = await clientPromise;
    const db = client.db("Progetto_MAADB");
    const genders = ["male", "female"];

    let res = [];
    for (let g of genders) {
      // Prende tutti gli studenti di un determinato genere
      const users = await db.collection("person").find({ gender: g }).toArray();
      let studentsList = users.map((record) => record.id);

      // Seleziona solo quelli che studiano e lavorano
      const result = await session.run("MATCH (p:person)-[:studyat]->(:organisation) WHERE p.id IN $studentsList WITH collect(p.id) AS studentsIDs MATCH (pe:person)-[:workat]->(:organisation) WHERE pe.id IN studentsIDs RETURN DISTINCT pe AS studentID ", { studentsList });
      let studentsWorkers = result.records.map((record) => record.get("studentID")["properties"]["id"].toNumber());

      // Raggruppa gli studenti per città
      const result2 = await session.run("MATCH (p:person)-[:islocatedin]->(l:place) WHERE p.id IN $studentsWorkers WITH l.name AS city, count(*) AS studentsCount RETURN city, studentsCount", { studentsWorkers });
      let data = result2.records.map((record) => [record.get("city"), record.get("studentsCount").toNumber()]);
      res.push(data);
    }

    const result = res[0].map(([city, maleCount]) => {
      const femaleEntry = res[1].find(([c]) => c === city);
      const femaleCount = femaleEntry ? femaleEntry[1] : 0;
      return [city, maleCount, femaleCount];
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}
