// Fichier : lib/questions.js

export const questions = [


  // NIVEAU FACILE (1 -> 10) - Enumérations / filtres / comparaisons
  {
    id: 1,
    niveau: "facile",
    question: "Combien de livres y a-t-il dans la bibliothèque ?",
    solutionAttendue: "db.livres.countDocuments({})",
    blocs: ["db.livres", ".find({})", ".countDocuments({})", "db.abonnes", "()"], 
    explication: "La méthode countDocuments() est optimisée pour compter le nombre de documents. Un filtre vide {} cible toute la collection."
  },
  {
    id: 2,
    niveau: "facile",
    question: "Trouver tous les abonnés enregistrés.",
    solutionAttendue: "db.abonnes.find({})",
    blocs: ["db.abonnes", ".find", "({})", ".findOne", "db.livres"],
    explication: "La méthode find({}) sans critères renvoie tous les documents de la collection."
  },
  {
    id: 3,
    niveau: "facile",
    question: "Trouver le livre dont le titre exact est \"Huis clos\".",
    solutionAttendue: "db.livres.find({ titre: \"Huis clos\" })",
    blocs: ["db.livres", ".find(", "{ titre: ", "\"Huis clos\"", " })"],
    explication: "Pour faire une recherche exacte, on passe un objet JSON avec le champ et la valeur recherchée."
  },
  {
    id: 4,
    niveau: "facile",
    question: "Combien de clients se sont inscrits avant 2019 ?",
    solutionAttendue: "db.abonnes.countDocuments({ date_inscription: { $lt: new Date(\"2019-01-01\") } })",
    blocs: ["db.abonnes", ".countDocuments(", "{ date_inscription: ", "{ $lt: ", "new Date(\"2019-01-01\") }", " })", "$gt:"],
    explication: "L'opérateur $lt (less than) permet de filtrer les dates strictement antérieures à celle spécifiée."
  },
  {
    id: 5,
    niveau: "facile",
    question: "Trouver tous les livres publiés après 1950.",
    solutionAttendue: "db.livres.find({ annee_publication: { $gt: 1950 } })",
    blocs: ["db.livres", ".find(", "{ annee_publication: ", "{ $gt: ", "1950 }", " })"],
    explication: "L'opérateur $gt (greater than) filtre les valeurs strictement supérieures."
  },
  {
    id: 6,
    niveau: "facile",
    question: "Trouver uniquement les abonnés qui sont actuellement \"actifs\".",
    solutionAttendue: "db.abonnes.find({ actif: true })",
    blocs: ["db.abonnes", ".find(", "{ actif: ", "true", " })", "\"true\""],
    explication: "Les booléens s'écrivent sans guillemets en MongoDB, tout comme en JavaScript."
  },
  {
    id: 7,
    niveau: "facile",
    question: "Trouver tous les emprunts qui sont \"en retard\".",
    solutionAttendue: "db.emprunts.find({ statut: \"en retard\" })",
    blocs: ["db.emprunts", ".find(", "{ statut: ", "\"en retard\"", " })"],
    explication: "On effectue une recherche de correspondance exacte sur le champ texte 'statut'."
  },
  {
    id: 8,
    niveau: "facile",
    question: "Trouver tous les livres écrits par \"Romain Gary\".",
    solutionAttendue: "db.livres.find({ auteur: \"Romain Gary\" })",
    blocs: ["db.livres", ".find(", "{ auteur: ", "\"Romain Gary\"", " })"],
    explication: "Une requête simple d'égalité sur le champ auteur."
  },
  {
    id: 9,
    niveau: "facile",
    question: "Trouver tous les livres qui possèdent le tag \"Essai\".",
    solutionAttendue: "db.livres.find({ tags: \"Essai\" })",
    blocs: ["db.livres", ".find(", "{ tags: ", "\"Essai\"", " })", "{ $in: "],
    explication: "MongoDB gère intelligemment les tableaux : chercher une valeur directement dans le champ tableau trouvera tous les documents où le tableau contient cette valeur."
  },
  {
    id: 10,
    niveau: "facile",
    question: "Trouver le premier abonné par ordre alphabétique de nom.",
    solutionAttendue: "db.abonnes.find().sort({ nom: 1 }).limit(1)",
    blocs: ["db.abonnes", ".find()", ".sort(", "{ nom: 1 }", ")", ".limit(1)", "{ nom: -1 }"],
    explication: ".sort({ nom: 1 }) trie par ordre croissant (alphabétique) et .limit(1) ne garde que le premier résultat renvoyé."
  },


  // NIVEAU MOYEN (11 -> 20) - Opérateurs logiques / tableaux / projections
  {
    id: 11,
    niveau: "moyen",
    question: "Trouver les livres écrits soit par \"Jean-Paul Sartre\", soit par \"Sigmund Freud\".",
    solutionAttendue: "db.livres.find({ auteur: { $in: [\"Jean-Paul Sartre\", \"Sigmund Freud\"] } })",
    blocs: ["db.livres", ".find(", "{ auteur: ", "{ $in: ", "[\"Jean-Paul Sartre\", \"Sigmund Freud\"]", " } })", "$and:"],
    explication: "L'opérateur $in permet de vérifier si la valeur du document fait partie d'une liste (tableau) de possibilités données."
  },
  {
    id: 12,
    niveau: "moyen",
    question: "Trouver les livres publiés entre 1900 et 1950 (inclus).",
    solutionAttendue: "db.livres.find({ annee_publication: { $gte: 1900, $lte: 1950 } })",
    blocs: ["db.livres", ".find(", "{ annee_publication: ", "{ $gte: 1900,", " $lte: 1950 }", " })"],
    explication: "On peut combiner $gte (supérieur ou égal) et $lte (inférieur ou égal) dans le même objet de condition pour créer un intervalle."
  },
  {
    id: 13,
    niveau: "moyen",
    question: "Trouver tous les emprunts qui ne sont pas encore rendus.",
    solutionAttendue: "db.emprunts.find({ statut: { $ne: \"rendu\" } })",
    blocs: ["db.emprunts", ".find(", "{ statut: ", "{ $ne: ", "\"rendu\"", " } })", "$eq:"],
    explication: "L'opérateur $ne (not equal) exclut les documents ayant exactement cette valeur."
  },
  {
    id: 14,
    niveau: "moyen",
    question: "Trouver les abonnés actifs qui ont au moins une pénalité.",
    solutionAttendue: "db.abonnes.find({ actif: true, penalites: { $exists: true } })",
    blocs: ["db.abonnes", ".find(", "{ actif: true,", " penalites: ", "{ $exists: true }", " })"],
    explication: "L'opérateur $exists permet de trouver les documents où un champ spécifique est présent, peu importe sa valeur."
  },
  {
    id: 15,
    niveau: "moyen",
    question: "Afficher tous les livres, mais ne renvoyer que leur titre (sans l'auteur, ni l'année, ni l'ID).",
    solutionAttendue: "db.livres.find({}, { _id: 0, titre: 1 })",
    blocs: ["db.livres", ".find(", "{}, ", "{ _id: 0, titre: 1 }", ")"],
    explication: "Le deuxième paramètre de find() est la projection. 1 inclut le champ, 0 l'exclut. Par défaut, l'_id est toujours inclus sauf si on force à 0."
  },
  {
    id: 16,
    niveau: "moyen",
    question: "Trouver les 3 livres les plus anciens de la bibliothèque.",
    solutionAttendue: "db.livres.find({}).sort({ annee_publication: 1 }).limit(3)",
    blocs: ["db.livres", ".find({})", ".sort(", "{ annee_publication: 1 }", ")", ".limit(3)"],
    explication: "On combine .sort() pour trier par année croissante (du plus ancien au plus récent) et .limit() pour restreindre le nombre de résultats."
  },
  {
    id: 17,
    niveau: "moyen",
    question: "Trouver les abonnés dont l'adresse email contient \"gmail\".",
    solutionAttendue: "db.abonnes.find({ email: { $regex: \"gmail\" } })",
    blocs: ["db.abonnes", ".find(", "{ email: ", "{ $regex: ", "\"gmail\"", " } })"],
    explication: "L'opérateur $regex permet d'effectuer une recherche par expression régulière, utile pour chercher une sous-chaîne dans un texte."
  },
  {
    id: 18,
    niveau: "moyen",
    question: "Trouver les livres qui possèdent à la fois les tags \"Essai\" ET \"Politique\".",
    solutionAttendue: "db.livres.find({ tags: { $all: [\"Essai\", \"Politique\"] } })",
    blocs: ["db.livres", ".find(", "{ tags: ", "{ $all: ", "[\"Essai\", \"Politique\"]", " } })"],
    explication: "Contrairement à $in qui fait un 'OU', l'opérateur $all s'assure que TOUTES les valeurs spécifiées sont présentes dans le tableau."
  },
  {
    id: 19,
    niveau: "moyen",
    question: "Combien d'abonnés sont actuellement actifs ?",
    solutionAttendue: "db.abonnes.countDocuments({ actif: true })",
    blocs: ["db.abonnes", ".countDocuments(", "{ actif: true }", ")", ".find("],
    explication: "Plutôt que de faire un .find() suivi d'un .count(), on passe directement le filtre de recherche dans countDocuments() pour plus de performance."
  },
  {
    id: 20,
    niveau: "moyen",
    question: "Trouver les livres publiés après 1950, triés du plus récent au plus ancien.",
    solutionAttendue: "db.livres.find({ annee_publication: { $gt: 1950 } }).sort({ annee_publication: -1 })",
    blocs: ["db.livres", ".find(", "{ annee_publication: { $gt: 1950 } }", ")", ".sort(", "{ annee_publication: -1 }", ")"],
    explication: "La valeur -1 dans le sort() permet d'inverser le sens de tri pour le rendre décroissant."
  },


  // NIVEAU DIFFICILE (21 -> 30) - Agrégations
  {
    id: 21,
    niveau: "difficile",
    question: "Afficher le nombre total d'emprunts pour chaque statut (en cours, rendu, en retard).",
    solutionAttendue: "db.emprunts.aggregate([ { $group: { _id: \"$statut\", total: { $sum: 1 } } } ])",
    blocs: ["db.emprunts", ".aggregate([", "{ $group: ", "{ _id: \"$statut\", ", "total: { $sum: 1 } } }", " ])", "{ $count: "],
    explication: "L'étape $group permet de regrouper les documents selon un champ (ici le statut). L'opérateur $sum: 1 agit comme un compteur qui s'incrémente pour chaque document du groupe."
  },
  {
    id: 22,
    niveau: "difficile",
    question: "Récupérer tous les emprunts en y associant les détails complets du livre emprunté.",
    solutionAttendue: "db.emprunts.aggregate([ { $lookup: { from: \"livres\", localField: \"id_livre\", foreignField: \"_id\", as: \"details_livre\" } } ])",
    blocs: ["db.emprunts", ".aggregate([", "{ $lookup: ", "{ from: \"livres\",", " localField: \"id_livre\",", " foreignField: \"_id\",", " as: \"details_livre\" } }", " ])", "$join:"],
    explication: "Le $lookup est l'équivalent du JOIN en SQL. Il va chercher dans la collection 'from' les documents où le 'foreignField' correspond au 'localField' du document actuel."
  },
  {
    id: 23,
    niveau: "difficile",
    question: "Trouver les emprunts \"en retard\" et joindre les informations de l'abonné fautif.",
    solutionAttendue: "db.emprunts.aggregate([ { $match: { statut: \"en retard\" } }, { $lookup: { from: \"abonnes\", localField: \"id_abonne\", foreignField: \"_id\", as: \"abonne_fautif\" } } ])",
    blocs: ["db.emprunts.aggregate([", "{ $match: { statut: \"en retard\" } },", "{ $lookup: ", "{ from: \"abonnes\", localField: \"id_abonne\", foreignField: \"_id\", as: \"abonne_fautif\" } }", "])", "{ $where: "],
    explication: "Dans un pipeline d'agrégation, on utilise $match pour filtrer les documents (comme un find) avant de faire la jointure $lookup pour optimiser les performances."
  },
  {
    id: 24,
    niveau: "difficile",
    question: "Trouver l'auteur qui a écrit le plus de livres dans notre bibliothèque.",
    solutionAttendue: "db.livres.aggregate([ { $group: { _id: \"$auteur\", nb_livres: { $sum: 1 } } }, { $sort: { nb_livres: -1 } }, { $limit: 1 } ])",
    blocs: ["db.livres.aggregate([", "{ $group: { _id: \"$auteur\", nb_livres: { $sum: 1 } } },", "{ $sort: { nb_livres: -1 } },", "{ $limit: 1 }", "])"],
    explication: "On groupe d'abord par auteur pour compter les livres ($group), puis on trie par ordre décroissant sur le total ($sort), et on ne garde que le premier résultat ($limit)."
  },
  {
    id: 25,
    niveau: "difficile",
    question: "Lister chaque tag (Essai, Roman...) et compter combien de livres le possèdent.",
    solutionAttendue: "db.livres.aggregate([ { $unwind: \"$tags\" }, { $group: { _id: \"$tags\", count: { $sum: 1 } } } ])",
    blocs: ["db.livres.aggregate([", "{ $unwind: \"$tags\" },", "{ $group: { _id: \"$tags\", count: { $sum: 1 } } }", "])", "{ $split: "],
    explication: "L'opérateur $unwind 'déroule' un tableau. Un livre avec 3 tags deviendra 3 documents distincts dans le pipeline, ce qui permet ensuite de les grouper et les compter facilement."
  },
  {
    id: 26,
    niveau: "difficile",
    question: "Afficher le statut de tous les emprunts et le titre du livre concerné, en masquant les ID.",
    solutionAttendue: "db.emprunts.aggregate([ { $lookup: { from: \"livres\", localField: \"id_livre\", foreignField: \"_id\", as: \"livre\" } }, { $project: { _id: 0, statut: 1, \"livre.titre\": 1 } } ])",
    blocs: ["db.emprunts.aggregate([", "{ $lookup: { from: \"livres\", localField: \"id_livre\", foreignField: \"_id\", as: \"livre\" } },", "{ $project: ", "{ _id: 0, statut: 1, \"livre.titre\": 1 } }", "])", "{ $select: "],
    explication: "Après une jointure, on utilise l'étape $project pour nettoyer les données renvoyées et ne sélectionner que les champs pertinents. La syntaxe pointée 'livre.titre' permet d'accéder aux sous-documents."
  },
  {
    id: 27,
    niveau: "difficile",
    question: "Calculer l'année de publication moyenne des livres pour chaque auteur.",
    solutionAttendue: "db.livres.aggregate([ { $group: { _id: \"$auteur\", annee_moyenne: { $avg: \"$annee_publication\" } } } ])",
    blocs: ["db.livres.aggregate([", "{ $group: ", "{ _id: \"$auteur\", ", "annee_moyenne: { $avg: \"$annee_publication\" } } }", "])", "$mean:"],
    explication: "L'opérateur $avg calcule la moyenne d'un champ numérique pour tous les documents d'un même groupe."
  },
  {
    id: 28,
    niveau: "difficile",
    question: "Trouver les identifiants des abonnés qui ont effectué strictement plus d'un emprunt au total.",
    solutionAttendue: "db.emprunts.aggregate([ { $group: { _id: \"$id_abonne\", total_emprunts: { $sum: 1 } } }, { $match: { total_emprunts: { $gt: 1 } } } ])",
    blocs: ["db.emprunts.aggregate([", "{ $group: { _id: \"$id_abonne\", total_emprunts: { $sum: 1 } } },", "{ $match: ", "{ total_emprunts: { $gt: 1 } } }", "])", "{ $having: "],
    explication: "Dans MongoDB, il n'y a pas de mot-clé 'HAVING' comme en SQL. On utilise simplement une étape $match après une étape $group pour filtrer sur les résultats agrégés."
  },
  {
    id: 29,
    niveau: "difficile",
    question: "Obtenir en une seule requête l'année du livre le plus ancien et l'année du livre le plus récent de toute la bibliothèque.",
    solutionAttendue: "db.livres.aggregate([ { $group: { _id: null, plus_ancien: { $min: \"$annee_publication\" }, plus_recent: { $max: \"$annee_publication\" } } } ])",
    blocs: ["db.livres.aggregate([", "{ $group: ", "{ _id: null, ", "plus_ancien: { $min: \"$annee_publication\" },", " plus_recent: { $max: \"$annee_publication\" } } }", "])"],
    explication: "En mettant _id à null dans un $group, on indique à MongoDB qu'on veut regrouper absolument toute la collection en un seul document final pour y appliquer des calculs ($min et $max)."
  },
  {
    id: 30,
    niveau: "difficile",
    question: "Récupérer les emprunts avec les détails complets du livre et de l'abonné associé.",
    solutionAttendue: "db.emprunts.aggregate([ { $lookup: { from: \"livres\", localField: \"id_livre\", foreignField: \"_id\", as: \"livre\" } }, { $lookup: { from: \"abonnes\", localField: \"id_abonne\", foreignField: \"_id\", as: \"abonne\" } } ])",
    blocs: ["db.emprunts.aggregate([", "{ $lookup: { from: \"livres\", localField: \"id_livre\", foreignField: \"_id\", as: \"livre\" } },", "{ $lookup: { from: \"abonnes\", localField: \"id_abonne\", foreignField: \"_id\", as: \"abonne\" } }", "])"],
    explication: "Le pipeline d'agrégation est séquentiel. On peut parfaitement enchaîner plusieurs étapes $lookup à la suite pour rapatrier des données provenant de multiples collections."
  },

  // NIVEAU EXTREME (31 -> 35) - Insertion / modification / suppression de données
  {
    id: 31,
    niveau: "extrême",
    question: "Insérer un nouveau livre de Hergé intitulé \"Le Lotus bleu\", publié en 1936.",
    solutionAttendue: "db.livres.insertOne({titre:\"Le Lotus bleu\",auteur:\"Hergé\",annee_publication:1936})",
    blocs: [], 
    explication: "La méthode insertOne() permet d'ajouter un seul document. Attention à bien respecter le JSON Schema que nous avons défini (titre, auteur et annee_publication sont obligatoires)."
  },
  {
    id: 32,
    niveau: "extrême",
    question: "Mettre à jour le livre \"La Promesse de l'aube\" pour lui ajouter un champ stock avec la valeur 10.",
    solutionAttendue: "db.livres.updateOne({titre:\"La Promesse de l'aube\"},{$set:{stock:10}})",
    blocs: [],
    explication: "updateOne() prend deux paramètres : le filtre pour trouver le document, et l'opérateur de mise à jour. Ici, $set permet d'ajouter ou de modifier un champ spécifique sans écraser le reste du document."
  },
  {
    id: 33,
    niveau: "extrême",
    question: "Ajouter 1 pénalité à tous les abonnés qui se sont inscrits avant l'année 2018.",
    solutionAttendue: "db.abonnes.updateMany({date_inscription:{$lt:new Date(\"2018-01-01\")}},{$inc:{penalites:1}})",
    blocs: [],
    explication: "updateMany() modifie plusieurs documents d'un coup. L'opérateur $inc (increment) est parfait pour ajouter une valeur numérique à un champ existant (ou le créer s'il n'existe pas)."
  },
  {
    id: 34,
    niveau: "extrême",
    question: "Insérer d'un seul coup deux livres : \"Condition de l'homme moderne\" de Hannah Arendt (1958) et \"L'Être et le Néant\" de Jean-Paul Sartre (1943).",
    solutionAttendue: "db.livres.insertMany([{titre:\"Condition de l'homme moderne\",auteur:\"Hannah Arendt\",annee_publication:1958},{titre:\"L'Être et le Néant\",auteur:\"Jean-Paul Sartre\",annee_publication:1943}])",
    blocs: [],
    explication: "insertMany() attend un tableau d'objets (entouré de crochets []). C'est beaucoup plus performant que de faire plusieurs insertOne() à la suite."
  },
  {
    id: 35,
    niveau: "extrême",
    question: "Supprimer définitivement de la base tous les emprunts dont le statut est \"rendu\".",
    solutionAttendue: "db.emprunts.deleteMany({statut:\"rendu\"})",
    blocs: [],
    explication: "deleteMany() supprime tous les documents correspondant au filtre. C'est une opération irréversible en NoSQL."
  }
];