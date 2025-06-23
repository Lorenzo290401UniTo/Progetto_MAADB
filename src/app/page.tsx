"use client";
import Image from "next/image"
import { useState } from "react";
import axios from "axios";
import "@/app/page.css";

type resType = {
  name: string;
  msgs: {
    id: number;
    content: string;
  }[];
};

export default function mainPage() {
  // gestione UI
  const [selectedQuery, setSelectedQuery] = useState(0)

  // risultati query analitica 1
  const [europeanStudents, setEuropeanStudents] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [europeanPercentage, setEuropeanPercentage] = useState(0);
  const [showResultsQuery1, setShowResultsQuery1] = useState(false)
  const [isLoadingQuery1, setIsLoadingQuery1] = useState(false)

  // risultati query analitica 3
  const [analitica3Results, setAnalitica3Results] = useState([] as string[]);

  // risultati query parametrica 1
  const [parametrica1Results, setParametrica1Results] = useState<[string, string][]>([]);

  // risultati query parametrica 2
  const [parametrica2Results, setParametrica2Results] = useState<resType[]>([]);

  // risultati query parametrica 3
  const [parametrica3Results, setParametrica3Results] = useState<[string, string[]][]>([]);
  const [userIDInput, setUserIDInput] = useState("")
  const [query3Error, setQuery3Error] = useState("")

  /* ----------- CHIAMATE API (QUERY ANALITICHE) ----------- */

  async function analitiche_query1() {
    try {
      setIsLoadingQuery1(true)
      setShowResultsQuery1(false)
      const res = await axios.get("/api/analitiche_query1");

      setEuropeanStudents(res.data[0]["low"]);
      setTotalStudents(res.data[1]["low"]);
      setEuropeanPercentage(res.data[2]);
      setShowResultsQuery1(true)
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingQuery1(false)
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
      // manca input genere (male/female)
      const res = await axios.get("/api/parametriche_query1");

      for (const record of Object.entries(res.data)) {
        const dateStr = new Date((record[1] as unknown as any)._creation_date).toISOString().split("T")[0];
        let content = `   - ID: ${(record[1] as unknown as any).id}, Content: ${(record[1] as unknown as any).content}, Date: ${dateStr}`;
        setParametrica1Results((prev) => [...prev, [record[0], content]]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function parametriche_query2() {
    try {
      // manca parametro "tag" da passare in input
      const res = await axios.get("/api/parametriche_query2");
      let result = [] as resType[];
      res.data.forEach((record: any) => {
        let comments = [] as {
          id: number;
          content: string;
        }[];

        record[1].forEach((comment: any) => {
          comments.push({
            id: comment[0],
            content: comment[1],
          });
        });
        result.push({
          name: record[0] as string,
          msgs: comments,
        });
      });
      setParametrica2Results(result);
    } catch (error) {
      console.error(error);
    }
  }

  async function parametriche_query3() {
    try {
      setQuery3Error("")
      const res = await axios.get("/api/parametriche_query3", {
        params: {
          id: userIDInput
        }
      });
      if(res.data.error == undefined){
        if(res.data.length != 0){
          res.data.forEach((record: any) => {
            setParametrica3Results((prev) => [...prev, [record.user, record.forums]]);
          });
        }else{
          setQuery3Error("Nessun dato trovato")
        }
      }else{
        setQuery3Error(res.data.error)
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main className="text-[white] text-[18px]">   {/* mr-[15%] */}
        <h1 className="text-[42px]" style={{ fontWeight: "bold" }}>
          Progetto MAADB
        </h1>
        <div className="w-full h-[80vh] flex">
          <div className="w-[15%] h-[100vdh] flex flex-col gap-[5px] pr-[25px]" style={{borderRight: "1px solid white"}}>
            <p className="text-[20px]">Query analitiche:</p>
            <button className="w-full h-[50px] bg-[#FFFFC5] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(0)}>Query 1</button>
            <button className="w-full h-[50px] bg-[#FF7F7F] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(1)}>Query 2</button>
            <button className="w-full h-[50px] bg-[#FFFFC5] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(2)}>Query 3</button>
            <p className="text-[20px]">Query parametriche:</p>
            <button className="w-full h-[50px] bg-[#FFFFC5] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(3)}>Query 1</button>
            <button className="w-full h-[50px] bg-[#FFFFC5] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(4)}>Query 2</button>
            <button className="w-full h-[50px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(5)}>Query 3</button>
          </div>
          <div className="w-[85%] ml-[25px]">
            <div className="flex flex-col" style={selectedQuery != 0 ? {display: "none"} : {}}>
              <p className="text-[20px]">Percentuale di studenti europei sul totale degli studenti nel mondo</p>
              <button className="w-[150px] h-[50px] px-[20px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => analitiche_query1()}>Esegui query</button>
              <Image src="/loading_icon.gif" style={!isLoadingQuery1 ? {display: "none"} : {}} width={250} height={150} alt="loading_icon" priority/>
              <div style={!showResultsQuery1 ? {display : "none"} : {}}>
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

            <div className="pb-[20px]" style={selectedQuery != 1 ? {display: "none"} : {}}>
              <p>Seleziona i tag dei top 10 forum</p>
              <button onClick={() => analitiche_query2()}>Query 2</button>
            </div>

            <div className="pb-[20px]" style={selectedQuery != 2 ? {display: "none"} : {}}>
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

            <div className="pb-[20px" style={selectedQuery != 3 ? {display: "none"} : {}}>
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

            <div className="max-h-[100%] flex flex-col pb-[20px] overflow-hidden" style={selectedQuery != 4 ? {display: "none"} : {}}>
              <p>Selezionare tutti i commenti ai messaggi scritti da persone con un certo interesse</p>
              <button onClick={() => parametriche_query2()}>Query 2</button>
              <div className="overflow-y-scroll">
                {parametrica2Results.map((element, index) => (
                  <p key={index} style={{ fontWeight: "bold" }}>
                    {element.name}
                    <br />
                    {element.msgs.map((element, index) => (
                      <span key={index} style={{ fontWeight: "normal" }}>
                        - {element.id}: {element.content}
                        <br />
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>

            <div className="pb-[20px] flex flex-col gap-[10px]" style={selectedQuery != 5 ? {display: "none"} : {}}>
              <p>Considerando una persona con un determinato ID, restituire i forum di cui sono membri i conoscenti di tale persona localizzati nella sua stessa città</p>
              <div className="flex gap-[15px] items-center">
                <label>Person ID: </label>
                <input type="text" className="h-[30px] rounded-[6px] outline-none text-[18px]" value={userIDInput} onChange={(event) => setUserIDInput(event.target.value)}></input>
                <button className="w-[150px] h-[50px] px-[20px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => parametriche_query3()}>Esegui query</button>
              </div>
              <div>
                {
                  query3Error == "" ?
                    parametrica3Results.map((record, index) => (
                      <p key={index}>
                        <span style={{ fontWeight: "bold" }}>{record[0]}</span><br/>
                        {
                          record[1].map((element, index) => {
                            return <span key={index}> - {element}<br/></span>
                          })
                        }
                      </p>
                    )) : query3Error
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
