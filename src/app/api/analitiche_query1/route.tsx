import { NextResponse } from "next/server";
import driver from "@/app/api/neo_init";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run("MATCH (p:person)-[:studyat]->(:organisation) MATCH (p)-[:islocatedin]->(:place)-[:ispartof*0..2]->(continent:place {name: 'Europe'}) WITH count(p) AS europe_students MATCH (p2:person)-[:studyat]->(:organisation) WITH europe_students, count(p2) AS total_students RETURN europe_students, total_students, round(toFloat(europe_students) / total_students * 100, 2) AS percentage_in_europe");
    const values = result.records[0]["_fields"];

    return NextResponse.json(values);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}
