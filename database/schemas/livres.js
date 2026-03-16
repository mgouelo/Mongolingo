db.createCollection("livres", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["titre", "auteur", "annee_publication"],
         properties: {
            titre: { 
               bsonType: "string", 
               description: "Titre requis et doit être une chaîne de caractères." 
            },
            auteur: { 
               bsonType: "string", 
               description: "L'auteur est requis." 
            },
            annee_publication: { 
               bsonType: "int",
               minimum: 1000,
               maximum: 2026,
               description: "Année de publication requise et doit être un entier valide." 
            },
            tags: { 
               bsonType: "array",
               items: { bsonType: "string" },
               description: "Optionnel : un tableau de mots-clés (ex: ['SF', 'Dystopie', 'Biographie'])."
            }
         },
         additionalProperties: true // on laisse la pobbibilité d'ajouter des nouveaux champs
      }
   }
});