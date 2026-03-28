import clientPromise from '@/lib/mongodb';
import { BSON, EJSON } from 'bson';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    let data;

    // décodage en fonction de l'extension du fichier (bson ou json)
    if (file.name.endsWith('.bson')) {
      data = BSON.deserialize(new Uint8Array(bytes));
    } else if (file.name.endsWith('.json')) {
      const text = new TextDecoder().decode(bytes);

      // EJSON.parse reconstruit le texte en objets Date et ObjectId de mongodb
      data = EJSON.parse(text); 
    } else {
      return NextResponse.json({ error: "Format non supporté. Utilisez un fichier .json ou .bson" }, { status: 400 });
    }

    // verification du contenu du fichier importé
    if (!data.livres || !data.abonnes || !data.emprunts) {
      return NextResponse.json({ error: "Le fichier de sauvegarde est invalide." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mongolingo_db");

    // nettoyage et réinsertion
    await db.collection('livres').deleteMany({});
    await db.collection('abonnes').deleteMany({});
    await db.collection('emprunts').deleteMany({});

    if (data.livres.length > 0) await db.collection('livres').insertMany(data.livres);
    if (data.abonnes.length > 0) await db.collection('abonnes').insertMany(data.abonnes);
    if (data.emprunts.length > 0) await db.collection('emprunts').insertMany(data.emprunts);

    return NextResponse.json({ success: true, message: "Base de données restaurée avec succès !" });

  } catch (error) {
    console.error("Erreur d'importation :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}