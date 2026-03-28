// Fichier : app/api/execute/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { query } = body; // ex: "db.livres.find({ actif: true })"

    if (!query) {
      return NextResponse.json({ error: "Aucune requête fournie" }, { status: 400 });
    }

    // connexion à la bdd
    const client = await clientPromise;
    const db = client.db("mongolingo_db");

    // La synthaxe du terminal mongodb n'est pa la même que celle du driver node.js --> l'api agit comme traducteur
    // parsing de la requête (extraction collection + méthode + arguments)
    // la regex cherche : db.COLLECTION.METHODE(ARGUMENTS)
    const match = query.match(/^db\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\((.*)\)(.*)$/s);

    if (!match) {
      return NextResponse.json({ error: "Syntaxe non reconnue. Format attendu : db.collection.methode(...)" }, { status: 400 });
    }

    const collectionName = match[1];
    const methodName = match[2]; // find, countDocuments, aggregate
    const argsString = match[3]; // le JSON à l'intérieur des parenthèses
    const chainedMethods = match[4]; // éventuels .sort() ou .limit()


    let args = [];
    if (argsString.trim() !== "") {
      args = eval(`[${argsString}]`); 
    }

    const collection = db.collection(collectionName);
    let resultat;

    // exécution dynamique selon la méthode MongoDB
    switch (methodName) {
      case 'countDocuments':
        resultat = await collection.countDocuments(...args);
        break;

      case 'find':
        let cursor = collection.find(...args);
        
        // gestion des méthodes chaînées comme .sort() ou .limit()
        if (chainedMethods) {
          if (chainedMethods.includes('.sort')) {
            const sortMatch = chainedMethods.match(/\.sort\((.*?)\)/);
            if (sortMatch) cursor = cursor.sort(eval(`(${sortMatch[1]})`));
          }
          if (chainedMethods.includes('.limit')) {
            const limitMatch = chainedMethods.match(/\.limit\((.*?)\)/);
            if (limitMatch) cursor = cursor.limit(parseInt(limitMatch[1]));
          }
        }
        resultat = await cursor.toArray();
        break;

      case 'aggregate':
        resultat = await collection.aggregate(...args).toArray();
        break;

      case 'insertOne':
        resultat = await collection.insertOne(...args);
        break;

      case 'insertMany':
        // args[0] contient le tableau d'objets
        resultat = await collection.insertMany(args[0]); 
        break;

      case 'updateOne':
        resultat = await collection.updateOne(args[0], args[1]);
        break;

      case 'updateMany':
        resultat = await collection.updateMany(args[0], args[1]);
        break;

      case 'deleteOne':
        resultat = await collection.deleteOne(...args);
        break;

      case 'deleteMany':
        resultat = await collection.deleteMany(...args);
        break;

      default:
        return NextResponse.json({ error: `La méthode ${methodName} n'est pas supportée par cette API.` }, { status: 400 });
    }

    // feedback du resultat au front
    return NextResponse.json({ success: true, data: resultat });

  } catch (error) {
    console.error("Erreur d'exécution Mongo:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}