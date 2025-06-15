"use client";

import { useState } from "react";
import axios from "axios";
import "@/app/page.css";

export default function mainPage() {
  const [europeanStudents, setEuropeanStudents] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [europeanPercentage, setEuropeanPercentage] = useState(0);

  const [analitica3Results, setAnalitica3Results] = useState([] as string[]);

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

  async function analitiche_query2() {}

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

        <div className="border-[2px] border-solid border-[red] px-[20px] hidden">
          <p>Seleziona i tag dei top 10 forum</p>
          <button onClick={() => analitiche_query2()}>Query 2</button>
          <div>
            <p>Studenti europei: {europeanStudents}</p>
            <p>Studenti totali: {totalStudents}</p>
            <p>Percentuale di europei sul totale: {europeanPercentage}%</p>
          </div>
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
      </main>
    </>
  );
}
