import { NextResponse } from "next/server";
import clientPromise from "@/app/api/mongo_init";
import driver from "@/app/api/neo_init";

export async function GET(req: Request) {
  const session = driver.session();

  const url = new URL(req.url);
  let genderInput = url.searchParams.get("gender");
  if (genderInput == null || genderInput == "") {
    return NextResponse.json({ error: "Genere non inserito" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Progetto_MAADB");

    // Prende tutti gli utenti di un determinato genere
    const users = await db
      .collection("person")
      .find({ gender: genderInput }, { projection: { id: 1, firstName: 1, lastName: 1 } })
      .toArray();
    let usersList = users.map((record) => record.id);

    // Prende i commenti di quegli utenti
    const comments_rel = await db
      .collection("comment_hasCreator_person")
      .find({ Person_id: { $in: usersList } }, { projection: { Comment_id: 1, Person_id: 1 } })
      .toArray();
    let commentIds = comments_rel.map((record) => record.Comment_id);
    if(commentIds.length == 0){
      return NextResponse.json({ error: "Nessun commento trovato" });
    }

    // Richiede le informazioni complete dei commenti trovati
    const comments = await db
      .collection("comment")
      .find({ id: { $in: commentIds } })
      .toArray();
    let recentComments = groupCommentsByPerson(users, comments_rel, comments);  // controllare
    //console.log(recentComments);

    return NextResponse.json(recentComments);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}

function groupCommentsByPerson(persons: any, commentLinks: any, comments: any): Record<string, any> {
  // Map person ID to full name
  const personMap: Record<string, string> = {};
  for (const p of persons) {
    personMap[String(p.id)] = `${p.firstName} ${p.lastName}`;
  }

  // Map comment ID to comment object
  const commentMap: Record<string, any> = {};
  for (const c of comments) {
    commentMap[String(c.id)] = c;
  }

  const mostRecent: Record<string, any> = {};

  for (const link of commentLinks) {
    const personId = String(link.Person_id);
    const commentId = String(link.Comment_id);

    if (commentMap[commentId]) {
      const comment = commentMap[commentId];
      const creationDateStr = comment.creationDate;

      if (creationDateStr) {
        const creationDate = new Date(creationDateStr);
        const personName = personMap[personId];

        if (!mostRecent[personName] || creationDate > new Date(mostRecent[personName]._creation_date)) {
          comment._creation_date = creationDate.toISOString(); // store ISO string or keep Date object as you prefer
          mostRecent[personName] = comment;
        }
      }
    }
  }

  return mostRecent;
}
