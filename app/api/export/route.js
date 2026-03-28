import clientPromise from '@/lib/mongodb';
import { BSON, EJSON } from 'bson';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // regarde quel format l'utilisateur a demandé dans l'url http://../../?format=json ou bson
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    const client = await clientPromise;
    const db = client.db("mongolingo_db");

    // récupère tout le contenu de la base
    const livres = await db.collection('livres').find({}).toArray();
    const abonnes = await db.collection('abonnes').find({}).toArray();
    const emprunts = await db.collection('emprunts').find({}).toArray();

    const backupData = { livres, abonnes, emprunts };

    if (format === 'bson') {
      // serialisation en bson 
      const bsonData = BSON.serialize(backupData);
      return new NextResponse(bsonData, {
        headers: {
          'Content-Type': 'application/bson',
          'Content-Disposition': 'attachment; filename="mongolingo_backup.bson"',
        },
      });
    } else {
      // serailisation en Extended json (qui preserve les objet Dates et ObjectIds au lieu de texte brut)
      const jsonData = EJSON.stringify(backupData, { relaxed: false }, 2);
      return new NextResponse(jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="mongolingo_backup.json"',
        },
      });
    }
  } catch (error) {
    console.error("Erreur d'exportation :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}