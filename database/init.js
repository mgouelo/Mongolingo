const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017"; 
const client = new MongoClient(uri);
const dbName = "mongolingo_db";
async function run() {
  try {

    await client.connect();
    console.log("SUCCESS : connexion à MongoDB réussie");
    const db = client.db(dbName);

    // nettoyage
    console.log("INFO : nettoyage des anciennes collections...");
    const collections = await db.listCollections().toArray();
    for (let col of collections) {
        await db.collection(col.name).drop();
    }

    // creation collection avec validation
    console.log("INFO : création des collections avec validation JSON Schema...");
    
    await db.createCollection("livres", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["titre", "auteur", "annee_publication"],
          properties: {
            titre: { bsonType: "string" },
            auteur: { bsonType: "string" },
            annee_publication: { bsonType: "int" }
          },
          additionalProperties: true
        }
      }
    });

    await db.createCollection("abonnes", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nom", "email", "date_inscription"],
          properties: {
            nom: { bsonType: "string" },
            email: { bsonType: "string" },
            date_inscription: { bsonType: "date" }
          },
          additionalProperties: true
        }
      }
    });

    await db.createCollection("emprunts", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_abonne", "id_livre", "date_emprunt", "statut"],
          properties: {
            id_abonne: { bsonType: "objectId" },
            id_livre: { bsonType: "objectId" },
            date_emprunt: { bsonType: "date" },
            statut: { enum: ["en cours", "rendu", "en retard"] }
          },
          additionalProperties: true
        }
      }
    });

    // insertion des données
    console.log("INFO : insertion des données par défaut");

    const livresData = [
      { _id: new ObjectId("650c1f1a1c9d440000000001"), titre: "Le Pouvoir de la rhétorique", auteur: "Clément Viktorovitch", annee_publication: 2021, tags: ["Essai", "Politique", "Communication"] },
      { _id: new ObjectId("650c1f1a1c9d440000000002"), titre: "La Promesse de l'aube", auteur: "Romain Gary", annee_publication: 1960, tags: ["Roman", "Autobiographie"], prix_goncourt: true },
      { _id: new ObjectId("650c1f1a1c9d440000000003"), titre: "L'Interprétation du rêve", auteur: "Sigmund Freud", annee_publication: 1899, langue_originale: "Allemand" },
      { _id: new ObjectId("650c1f1a1c9d440000000004"), titre: "Huis clos", auteur: "Jean-Paul Sartre", annee_publication: 1944, tags: ["Théâtre", "Philosophie", "Existentialisme"] },
      { _id: new ObjectId("650c1f1a1c9d440000000005"), titre: "Tintin au Tibet", auteur: "Hergé", annee_publication: 1960, format: "Bande dessinée" },
      { _id: new ObjectId("650c1f1a1c9d440000000006"), titre: "Une Saison en enfer", auteur: "Arthur Rimbaud", annee_publication: 1873, tags: ["Poésie"] },
      { _id: new ObjectId("650c1f1a1c9d440000000007"), titre: "Les Origines du totalitarisme", auteur: "Hannah Arendt", annee_publication: 1951, tags: ["Essai", "Philosophie politique"] }
    ];

    const abonnesData = [
      { _id: new ObjectId("650c2f2b2d9e550000000001"), nom: "Gouélo", prenom: "Matthieu", email: "matth.gouelo@gmail.com", date_inscription: new Date("2017-05-14T00:00:00Z"), actif: true },
      { _id: new ObjectId("650c2f2b2d9e550000000002"), nom: "Weis", prenom: "Marin", email: "marin.weis@gmail.com", date_inscription: new Date("2020-08-22T00:00:00Z"), actif: true },
      { _id: new ObjectId("650c2f2b2d9e550000000003"), nom: "Lescops", prenom: "Nolann", email: "nolann.lescops@gmail.com", date_inscription: new Date("2015-11-02T00:00:00Z"), penalites: 1 }
    ];

    const empruntsData = [
      { id_abonne: new ObjectId("650c2f2b2d9e550000000001"), id_livre: new ObjectId("650c1f1a1c9d440000000001"), date_emprunt: new Date("2024-03-01T10:00:00Z"), statut: "en cours" },
      { id_abonne: new ObjectId("650c2f2b2d9e550000000002"), id_livre: new ObjectId("650c1f1a1c9d440000000004"), date_emprunt: new Date("2023-12-15T14:30:00Z"), statut: "en retard" },
      { id_abonne: new ObjectId("650c2f2b2d9e550000000003"), id_livre: new ObjectId("650c1f1a1c9d440000000005"), date_emprunt: new Date("2024-01-10T09:15:00Z"), statut: "rendu" },
      { id_abonne: new ObjectId("650c2f2b2d9e550000000001"), id_livre: new ObjectId("650c1f1a1c9d440000000007"), date_emprunt: new Date("2024-03-10T11:00:00Z"), statut: "en cours" }
    ];

    await db.collection("livres").insertMany(livresData);
    await db.collection("abonnes").insertMany(abonnesData);
    await db.collection("emprunts").insertMany(empruntsData);

    console.log("SUCCESS : chargement des données terminé avec succès !");

  } catch (error) {
    console.error("ERROR : ", error);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);