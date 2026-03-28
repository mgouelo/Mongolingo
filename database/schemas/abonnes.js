db.createCollection("abonnes", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["nom", "email", "date_inscription"], // champs obligatoires
         properties: {
            nom: { bsonType: "string" },
            prenom: { bsonType: "string" },
            email: { 
               bsonType: "string", 
               pattern: "^.+@.+$", // regex pour s'assurer de la validité de l'email
               description: "Email est requis." 
            },
            date_inscription: { 
               bsonType: "date",
               description: "Requis pour les filtres"
            }
         },
         additionalProperties: true
      }
   }
});