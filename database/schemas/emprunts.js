db.createCollection("emprunts", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["id_abonne", "id_livre", "date_emprunt", "statut"],
         properties: {
            id_abonne: { 
               bsonType: "objectId",
               description: "Référence a l'abonné"
            },
            id_livre: { 
               bsonType: "objectId",
               description: "Référence au livre"
            },
            date_emprunt: { bsonType: "date" },
            statut: { 
               enum: ["en cours", "rendu", "en retard"],
               description: "Statut doit être une de ces trois valeurs"
            }
         },
         additionalProperties: true
      }
   }
});