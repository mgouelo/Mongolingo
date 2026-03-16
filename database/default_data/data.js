const livres = [
  { 
    _id: "650c1f1a1c9d440000000001", 
    titre: "Le Pouvoir de la rhétorique", 
    auteur: "Clément Viktorovitch", 
    annee_publication: 2021, 
    tags: ["Essai", "Politique", "Communication"]
  },
  { 
    _id: "650c1f1a1c9d440000000002", 
    titre: "La Promesse de l'aube", 
    auteur: "Romain Gary", 
    annee_publication: 1960, 
    tags: ["Roman", "Autobiographie"],
    prix_goncourt: true
  },
  { 
    _id: "650c1f1a1c9d440000000003", 
    titre: "L'Interprétation du rêve", 
    auteur: "Sigmund Freud", 
    annee_publication: 1899, 
    langue_originale: "Allemand"
  },
  { 
    _id: "650c1f1a1c9d440000000004", 
    titre: "Huis clos", 
    auteur: "Jean-Paul Sartre", 
    annee_publication: 1944, 
    tags: ["Théâtre", "Philosophie", "Existentialisme"] 
  },
  { 
    _id: "650c1f1a1c9d440000000005", 
    titre: "Tintin au Tibet", 
    auteur: "Hergé", 
    annee_publication: 1960, 
    format: "Bande dessinée"
  },
  { 
    _id: "650c1f1a1c9d440000000006", 
    titre: "Une Saison en enfer", 
    auteur: "Arthur Rimbaud", 
    annee_publication: 1873, 
    tags: ["Poésie"] 
  },
  { 
    _id: "650c1f1a1c9d440000000007", 
    titre: "Les Origines du totalitarisme", 
    auteur: "Hannah Arendt", 
    annee_publication: 1951, 
    tags: ["Essai", "Philosophie politique"] 
  }
];



const abonnes = [
  {
    _id: "650c2f2b2d9e550000000001",
    nom: "Gouélo",
    prenom: "Matthieu",
    email: "matth.gouelo@gmail.com",
    date_inscription: new Date("2017-05-14T00:00:00Z"),
    actif: true
  },
  {
    _id: "650c2f2b2d9e550000000002",
    nom: "Weis",
    prenom: "Marin",
    email: "marin.weis@gmail.com",
    date_inscription: new Date("2020-08-22T00:00:00Z"),
    actif: true
  },
  {
    _id: "650c2f2b2d9e550000000003",
    nom: "Lescops",
    prenom: "Nolann",
    email: "nolann.lescops@gmail.com",
    date_inscription: new Date("2015-11-02T00:00:00Z"),
    penalites: 1
  }
];


const emprunts = [
  {
    // Matthieu emprunte "Le Pouvoir de la rhétorique" et c'est en cours
    id_abonne: "650c2f2b2d9e550000000001",
    id_livre: "650c1f1a1c9d440000000001",
    date_emprunt: new Date("2024-03-01T10:00:00Z"),
    statut: "en cours"
  },
  {
    // Marin emprunte "Huis clos" mais c'est en retard
    id_abonne: "650c2f2b2d9e550000000002",
    id_livre: "650c1f1a1c9d440000000004",
    date_emprunt: new Date("2023-12-15T14:30:00Z"),
    statut: "en retard"
  },
  {
    // Nolann emprunte "Tintin au Tibet" et l'a déjà rendu
    id_abonne: "650c2f2b2d9e550000000003",
    id_livre: "650c1f1a1c9d440000000005",
    date_emprunt: new Date("2024-01-10T09:15:00Z"),
    statut: "rendu"
  },
  {
    // Matthieu emprunte Hannah Arendt
    id_abonne: "650c2f2b2d9e550000000001",
    id_livre: "650c1f1a1c9d440000000007",
    date_emprunt: new Date("2024-03-10T11:00:00Z"),
    statut: "en cours"
  }
];