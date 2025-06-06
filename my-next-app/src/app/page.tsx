"use client";

import { useState } from "react";
import neo4j from "neo4j-driver";
import { MongoClient } from "mongodb";
import "@/app/page.css";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export default function mainPage() {
  const [europeanStudents, setEuropeanStudents] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [europeanPercentage, setEuropeanPercentage] = useState(0);

  const [analitica3Results, setAnalitica3Results] = useState([] as string[]);

  const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "12345678")
  );

  const mongodbName = "Progetto_MAADB";
  let client = new MongoClient("mongodb://localhost:27017");

  async function getDb() {
    let clientPromise = await client.connect();
    return clientPromise.db(mongodbName);
  }

  async function analitica_query1() {
    const session = driver.session();

    try {
      const result = await session.run(
        "MATCH (p:person)-[:studyat]->(:organisation) " +
          "MATCH (p)-[:islocatedin]->(:place)-[:ispartof*0..2]->(continent:place {name: 'Europe'}) " +
          "WITH count(p) AS europe_students " +
          "MATCH (p2:person)-[:studyat]->(:organisation) " +
          "WITH europe_students, count(p2) AS total_students " +
          "RETURN europe_students, total_students, round(toFloat(europe_students) / total_students * 100, 2) AS percentage_in_europe"
      );
      const fields = result.records[0]["keys"] as string[];
      const values = result.records[0]["_fields"];
      setEuropeanStudents(values[0].toNumber());
      setTotalStudents(values[1].toNumber());
      setEuropeanPercentage(values[2]);

      /*values.forEach((val: any, index: number) => {
        if (neo4j.isInt(val)) {
          console.log(fields[index] + ": " + val.toNumber());
        } else {
          console.log(fields[index] + ": " + val);
        }
      });*/
    } catch (error) {
      console.error(error);
    } finally {
      await session.close();
    }
  }

  async function analitica_query2() {}

  async function analitica_query3() {
    const session = driver.session();

    try {
      const db = await getDb();
      const collection = db.collection("person");
      const users = await collection.find({ gender: "male" });
      console.log(users);

      /*const result = await session.run(
        "MATCH (p:person)-[:studyat]->(:organisation) " +
          "WHERE p.id IN $studentsList " +
          "WITH collect(p.id) AS studentsIDs " +
          "MATCH (pe:person)-[:workat]->(:organisation) " +
          "WHERE pe.id IN studentsIDs " +
          "RETURN DISTINCT pe AS studentID ",
        (studentsList = "")
      );
      console.log(result);
      const fields = result.records[0]["keys"] as string[];
      const values = result.records[0]["_fields"];*/
    } catch (error) {
      console.error(error);
    } finally {
      await session.close();
    }
  }

  return (
    <>
      <main className="">
        <h1 style={{ fontWeight: "bold" }}>Progetto MAADB</h1>

        <div className="divBorder">
          <p>
            Percentuale di studenti europei sul totale degli studenti nel mondo
          </p>
          <button onClick={() => analitica_query1()}>Query 1</button>
          <div>
            <p>Studenti europei: {europeanStudents}</p>
            <p>Studenti totali: {totalStudents}</p>
            <p>Percentuale di europei sul totale: {europeanPercentage}%</p>
          </div>
        </div>

        <div className="divBorder hiddenDiv">
          <p>Seleziona i tag dei top 10 forum</p>
          <button onClick={() => analitica_query2()}>Query 2</button>
          <div>
            <p>Studenti europei: {europeanStudents}</p>
            <p>Studenti totali: {totalStudents}</p>
            <p>Percentuale di europei sul totale: {europeanPercentage}%</p>
          </div>
        </div>

        <div className="divBorder">
          <p>Contare il numero di studenti lavoratori per città e per sesso</p>
          <button onClick={() => analitica_query3()}>Query 3</button>
          <div></div>
        </div>
      </main>
    </>
  );
}
