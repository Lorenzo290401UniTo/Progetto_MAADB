"use client";

import { useState } from "react";
import axios from "axios";
import "@/app/page.css";

export default function mainPage() {
  // risultati query analitica 1
  const [europeanStudents, setEuropeanStudents] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [europeanPercentage, setEuropeanPercentage] = useState(0);

  // risultati query analitica 3
  const [analitica3Results, setAnalitica3Results] = useState([] as string[]);

  const [parametrica1Results, setParametrica1Results] = useState<[string, string][]>([]);

  /* ----------- CHIAMATE API (QUERY ANALITICHE) ----------- */

  async function analitiche_query1() {
    try {
      const res = await axios.get("/api/analitiche_query1");

      setEuropeanStudents(res.data[0]["low"]);
      setTotalStudents(res.data[1]["low"]);
      setEuropeanPercentage(res.data[2]);
    } catch (error) {
      console.error(error);
    }
  }

  async function analitiche_query2() {
    try {
      const res = await axios.get("/api/analitiche_query2");
      let result = [] as string[];
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  async function analitiche_query3() {
    try {
      const res = await axios.get("/api/analitiche_query3");
      let result = [] as string[];
      res.data.forEach((element: any) => {
        result.push(element.join("#"));
      });
      setAnalitica3Results(result);
    } catch (error) {
      console.error(error);
    }
  }

  /* ----------- CHIAMATE API (QUERY PARAMETRICHE) ----------- */

  async function parametriche_query1() {
    try {
      const res = await axios.get("/api/parametriche_query1");

      for (const record of Object.entries(res.data)) {
        //console.log(`${record[0]}:`);
        const dateStr = new Date((record[1] as unknown as any)._creation_date).toISOString().split("T")[0];
        let content = `   - ID: ${(record[1] as unknown as any).id}, Content: ${(record[1] as unknown as any).content}, Date: ${dateStr}`;
        //console.log(`  - ID: ${(record[1] as unknown as any).id}, Content: ${(record[1] as unknown as any).content}, Date: ${dateStr}`);
        setParametrica1Results((prev) => [...prev, [record[0], content]]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main className="mx-[15%]">
        <h1 className="text-[40px]" style={{ fontWeight: "bold" }}>
          Progetto MAADB
        </h1>

        <div className="border-[2px] border-solid border-[red] px-[20px]">
          <p>Percentuale di studenti europei sul totale degli studenti nel mondo</p>
          <button onClick={() => analitiche_query1()}>Query 1</button>
          <div>
            <p>
              <span style={{ fontWeight: "bold" }}>Studenti europei</span>: {europeanStudents}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Studenti totali</span>: {totalStudents}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Percentuale di europei sul totale</span>: {europeanPercentage}%
            </p>
          </div>
        </div>

        <div className="border-[2px] border-solid border-[red] px-[20px] pb-[20px]">
          <p>Seleziona i tag dei top 10 forum</p>
          <button onClick={() => analitiche_query2()}>Query 2</button>
        </div>

        <div className="border-[2px] border-solid border-[red] px-[20px] pb-[20px]">
          <p>Contare il numero di studenti lavoratori per città e per sesso</p>
          <button onClick={() => analitiche_query3()}>Query 3</button>
          <div>
            {analitica3Results.map((element, index) => (
              <p key={index}>
                <span style={{ fontWeight: "bold" }}>{element.split("#")[0]}</span>
                <br />
                Males: {element.split("#")[1]}
                <br />
                Females: {element.split("#")[2]}
              </p>
            ))}
          </div>
        </div>

        <div className="border-[2px] border-solid border-[blue] px-[20px] pb-[20px] mt-[50px]">
          <p>Selezionare tutti i messaggi creati da un determinato (genere group by ID)</p>
          <button onClick={() => parametriche_query1()}>Query 1</button>
          <div>
            {parametrica1Results.map((record, index) => (
              <p key={index}>
                {record[0]}
                <br />
                {record[1]}
              </p>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
