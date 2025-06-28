"use client";
import Image from "next/image"
import { useState } from "react";
import axios from "axios";
import "@/app/page.css";
import CityAnaliticBox from "./components/cityAnalit";
import MsgParamBox from "./components/msgParam";
import ForumsListBox from "./components/forumsList";
import MsgListBox from "./components/msgListParam";

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
  const [isLoadingAnalitQuery1, setIsLoadingAnalitQuery1] = useState(false)
  const [timer1, setTimer1] = useState("");

  // risultati query analitica 2
  const [analitica2Results, setAnalitica2Results] = useState<string[]>([])
  const [isLoadingAnalitQuery2, setIsLoadingAnalitQuery2] = useState(false)
  const [showResultsQuery2, setShowResultsQuery2] = useState(false)
  const [timer2, setTimer2] = useState("");

  // risultati query analitica 3
  const [analitica3Results, setAnalitica3Results] = useState([] as string[]);
  const [isLoadingAnalitQuery3, setIsLoadingAnalitQuery3] = useState(false)
  const [timer3, setTimer3] = useState("");

  // risultati query parametrica 1
  const [parametrica1Results, setParametrica1Results] = useState<[string, string][]>([]);
  const [genderInput, setGenderInput] = useState("male")
  const [query1ParamError, setQuery1ParamError] = useState("")
  const [isLoadingParamQuery1, setIsLoadingParamQuery1] = useState(false)
  const [timer4, setTimer4] = useState("");

  // risultati query parametrica 2
  const [parametrica2Results, setParametrica2Results] = useState<resType[]>([]);
  const [tagInput, setTagInput] = useState("")
  const [query2ParamError, setQuery2ParamError] = useState("")
  const [isLoadingParamQuery2, setIsLoadingParamQuery2] = useState(false)
  const [timer5, setTimer5] = useState("");

  // risultati query parametrica 3
  const [parametrica3Results, setParametrica3Results] = useState<[string, string[]][]>([]);
  const [userIDInput, setUserIDInput] = useState("")
  const [query3ParamError, setQuery3ParamError] = useState("")
  const [isLoadingParamQuery3, setIsLoadingParamQuery3] = useState(false)
  const [timer6, setTimer6] = useState("");

  /* ----------- CHIAMATE API (QUERY ANALITICHE) ----------- */

  async function analitiche_query1() {
    try {
      const start = performance.now();

      setIsLoadingAnalitQuery1(true)
      setShowResultsQuery1(false)
      const res = await axios.get("/api/analitiche_query1");
      setEuropeanStudents(res.data[0]["low"]);
      setTotalStudents(res.data[1]["low"]);
      setEuropeanPercentage(res.data[2]);
      setShowResultsQuery1(true)

      const end = performance.now();
      setTimer1(((end - start) / 1000).toFixed(2));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAnalitQuery1(false)
    }
  }

  async function analitiche_query2() {
    try {
      const start = performance.now();

      setIsLoadingAnalitQuery2(true)
      setShowResultsQuery2(false)
      const res = await axios.get("/api/analitiche_query2");
      let result = [] as string[]
      res.data.forEach((record: any) => {
        record[1].forEach((element: string) => {
          result = [...result, element]
        });
      });
      setAnalitica2Results(result);
      setShowResultsQuery2(true)

      const end = performance.now();
      setTimer2(((end - start) / 1000).toFixed(2));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAnalitQuery2(false)
    }
  }

  async function analitiche_query3() {
    try {
      const start = performance.now();

      setIsLoadingAnalitQuery3(true)
      const res = await axios.get("/api/analitiche_query3");
      let result = [] as string[];
      res.data.forEach((element: any) => {
        result.push(element.join("#"));
      });
      setAnalitica3Results(result);

      const end = performance.now();
      setTimer3(((end - start) / 1000).toFixed(2));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAnalitQuery3(false)
    }
  }

  /* ----------- CHIAMATE API (QUERY PARAMETRICHE) ----------- */

  async function parametriche_query1() {
    try {
      const start = performance.now();

      setIsLoadingParamQuery1(true)
      setQuery1ParamError("")
      setParametrica1Results([])
      const res = await axios.get("/api/parametriche_query1", {
        params: {
          gender: genderInput.toLowerCase()
        }
      });
      if(res.data.error == undefined){
        if(res.data.length != 0){
          for (const record of Object.entries(res.data)) {
            const dateStr = new Date((record[1] as unknown as any)._creation_date).toISOString().split("T")[0];
            let content = `${(record[1] as unknown as any).id}(###)${(record[1] as unknown as any).content}(###)${dateStr}`;
            setParametrica1Results((prev) => [...prev, [record[0], content]]);
          }
        }else{
          setQuery1ParamError("Nessun dato trovato")
        }
      }else{
        setQuery1ParamError(res.data.error)
      }

      const end = performance.now();
      setTimer4(((end - start) / 1000).toFixed(2));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingParamQuery1(false)
    }
  }

  async function parametriche_query2() {
    try {
      const start = performance.now();

      setIsLoadingParamQuery2(true)
      setQuery2ParamError("")
      setParametrica2Results([])
      const res = await axios.get("/api/parametriche_query2", {
        params: {
          tag: tagInput
        }
      });
      if(res.data.error == undefined){
        if(res.data.length != 0){
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
        }else{
          setQuery2ParamError("Nessun dato trovato")
        }
      }else{
        setQuery2ParamError(res.data.error)
      }

      const end = performance.now();
      setTimer5(((end - start) / 1000).toFixed(2));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingParamQuery2(false)
    }
  }

  async function parametriche_query3() {
    try {
      const start = performance.now();

      setIsLoadingParamQuery3(true)
      setQuery3ParamError("")
      setParametrica3Results([])
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
          setQuery3ParamError("Nessun dato trovato")
        }
      }else{
        setQuery3ParamError(res.data.error)
      }

      const end = performance.now();
      setTimer6(((end - start) / 1000).toFixed(2));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingParamQuery3(false)
    }
  }

  return (
    <>
      <main className="text-[18px]">
        <h1 className="text-[42px] text-center text-[#235284]" style={{ fontWeight: "bold" }}>
          Progetto MAADB
        </h1>
        <div className="w-full h-[80vh] flex">
          <div className="w-[15%] h-[100vdh] flex flex-col gap-[5px] pr-[25px]" style={{borderRight: "1px solid black"}}>
            <p className="text-[20px]">Query analitiche:</p>
            <button className="w-full h-[50px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(0)}>Query 1</button>
            <button className="w-full h-[50px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(1)}>Query 2</button>
            <button className="w-full h-[50px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(2)}>Query 3</button>
            <p className="text-[20px]">Query parametriche:</p>
            <button className="w-full h-[50px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(3)}>Query 1</button>
            <button className="w-full h-[50px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(4)}>Query 2</button>
            <button className="w-full h-[50px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => setSelectedQuery(5)}>Query 3</button>
          </div>
          <div className="w-[85%] ml-[25px]">

            <div className="flex flex-col gap-[10px]" style={selectedQuery != 0 ? {display: "none"} : {}}>
              <p>Percentuale di studenti europei sul totale degli studenti nel mondo</p>
              <button className="w-[150px] h-[50px] bg-[#012231] text-[white] px-[20px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => analitiche_query1()}>Esegui query</button>
              <Image src="/loading_icon.gif" style={!isLoadingAnalitQuery1 ? {display: "none"} : {}} width={250} height={150} alt="loading_icon" priority/>
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
                <p className="text-[14px] text-[grey] mt-[20px]">Tempo di esecuzione: {timer1} secondi</p>
              </div>
            </div>

            <div className="flex flex-col gap-[10px]" style={selectedQuery != 1 ? {display: "none"} : {}}>
              <p>Seleziona i tag dei top 10 forum</p>
              <button className="w-[150px] min-h-[50px] bg-[#012231] text-[white] px-[20px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => analitiche_query2()}>Esegui query</button>
              <Image src="/loading_icon.gif" style={!isLoadingAnalitQuery2 ? {display: "none"} : {}} width={250} height={150} alt="loading_icon" priority/>
              <div className="overflow-y-scroll overflow-x-hidden" style={!showResultsQuery2 ? {display : "none"} : {}}>
                {
                  <div>
                    <p><span style={{fontWeight: "bold"}}>Tag trovati:</span> {analitica2Results.join(", ")}</p> 
                  </div>
                }
                <p className="text-[14px] text-[grey] mt-[20px]">Tempo di esecuzione: {timer2} secondi</p>
              </div>
            </div>

            <div className="max-h-[100%] flex flex-col gap-[10px] overflow-hidden" style={selectedQuery != 2 ? {display: "none"} : {}}>
              <p>Contare il numero di studenti lavoratori per città e per sesso</p>
              <button className="w-[150px] min-h-[50px] bg-[#012231] text-[white] px-[20px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => analitiche_query3()}>Esegui query</button>
              <Image src="/loading_icon.gif" style={!isLoadingAnalitQuery3 ? {display: "none"} : {}} width={250} height={150} alt="loading_icon" priority/>
              <div className="overflow-y-scroll overflow-x-hidden grid grid-cols-5 gap-[10px]">
                {analitica3Results.map((element, index) => (
                  <CityAnaliticBox key={index} cityName={element.split("#")[0]} maleNum={element.split("#")[1]} femaleNum={element.split("#")[2]}></CityAnaliticBox>
                ))}
              </div>
              <p className="text-[14px] text-[grey] mt-[20px]" style={timer3 == "" ? {display :"none"} : {}}>Tempo di esecuzione: {timer3} secondi</p>
            </div>

            <div className="max-h-[100%] flex flex-col gap-[10px] overflow-hidden" style={selectedQuery != 3 ? {display: "none"} : {}}>
              <p>Selezionare l'ultimo messaggio creato da ogni utente di un determinato genere</p>
              <div className="flex gap-[15px] items-center">
                <label>Genere: </label>
                <select className="h-[30px] rounded-[6px] outline-none text-[18px]" value={genderInput} onChange={(event) => setGenderInput(event.target.value)}>
                  <option value={"male"}>Male</option>
                  <option value={"female"}>Female</option>
                </select>
                <button className="w-[150px] h-[50px] bg-[#012231] text-[white] px-[20px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => parametriche_query1()}>Esegui query</button>
              </div>
              <Image src="/loading_icon.gif" style={!isLoadingParamQuery1 ? {display: "none"} : {}} width={250} height={150} alt="loading_icon" priority/>
              <div className="overflow-y-scroll grid grid-cols-3 gap-[10px]">
                {
                  query1ParamError == "" ?
                    parametrica1Results.map((record, index) => (
                      <MsgParamBox key={index} user={record[0]} msg={record[1]}></MsgParamBox>
                    )) : query1ParamError
                }
              </div>
              <p className="text-[14px] text-[grey] mt-[20px]" style={timer4 == "" ? {display :"none"} : {}}>Tempo di esecuzione: {timer4} secondi</p>
            </div>

            <div className="max-h-[100%] flex flex-col gap-[10px] overflow-hidden" style={selectedQuery != 4 ? {display: "none"} : {}}>
              <p>Selezionare tutti i commenti ai messaggi scritti da persone con un certo interesse</p>
              <div className="flex gap-[15px] items-center">
                <label>Tag: </label>
                <input type="text" className="h-[30px] rounded-[6px] outline-none text-[18px]" value={tagInput} onChange={(event) => setTagInput(event.target.value)}></input>
                <button className="w-[150px] h-[50px] bg-[#012231] text-[white] px-[20px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => parametriche_query2()}>Esegui query</button>
              </div>
              <p className="text-[grey]" style={{margin: 0}}>esempio: Elvis_Presley, Che_Guevara</p>
              <Image src="/loading_icon.gif" style={!isLoadingParamQuery2 ? {display: "none"} : {}} width={250} height={150} alt="loading_icon" priority/>
              <div className="overflow-y-scroll flex flex-col gap-[20px]">
                {
                  query2ParamError == "" ? 
                    parametrica2Results.map((element, index) => (
                      <MsgListBox key={index} user={element.name} msgs={element.msgs}></MsgListBox>
                    )) : query2ParamError
                }
              </div>
              <p className="text-[14px] text-[grey] mt-[20px]" style={timer5 == "" ? {display :"none"} : {}}>Tempo di esecuzione: {timer5} secondi</p>
            </div>

            <div className="max-h-[100%] flex flex-col gap-[10px] overflow-hidden" style={selectedQuery != 5 ? {display: "none"} : {}}>
              <p>Considerando una persona con un determinato ID, restituire i forum di cui sono membri i conoscenti di tale persona localizzati nella sua stessa città</p>
              <div className="flex gap-[15px] items-center">
                <label>Person ID: </label>
                <input type="text" className="h-[30px] rounded-[6px] outline-none text-[18px]" value={userIDInput} onChange={(event) => setUserIDInput(event.target.value)}></input>
                <button className="w-[150px] h-[50px] bg-[#012231] text-[white] px-[20px] text-[16px] rounded-[6px] cursor-pointer" onClick={() => parametriche_query3()}>Esegui query</button>
              </div>
              <p className="text-[grey]" style={{margin: 0}}>esempio: 2199023262994</p>
              <Image src="/loading_icon.gif" style={!isLoadingParamQuery3 ? {display: "none"} : {}} width={250} height={150} alt="loading_icon" priority/>
              <div className="overflow-y-scroll flex flex-col gap-[20px]">
                {
                  query3ParamError == "" ?
                    parametrica3Results.map((record, index) => (
                      <ForumsListBox key={index} user={record[0]} forums={record[1]}></ForumsListBox>
                    )) : query3ParamError
                }
              </div>
              <p className="text-[14px] text-[grey] mt-[20px]" style={timer6 == "" ? {display :"none"} : {}}>Tempo di esecuzione: {timer6} secondi</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
