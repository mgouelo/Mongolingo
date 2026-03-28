'use client';

import { useState, useEffect, useRef } from 'react';
import { questions } from '@/lib/questions';
import Image from 'next/image';

export default function MongolingoApp() {
  const fileInputRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  
  const [dbResult, setDbResult] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [textInput, setTextInput] = useState(""); // stocker la saisie libre des questions extrême

  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false); // afficher un pop-up avec les schémas 

  // Charger une question aléatoire
  const loadRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const q = questions[randomIndex];
    setCurrentQuestion(q);
    
    const shuffledBlocks = [...q.blocs].sort(() => Math.random() - 0.5);
    setAvailableBlocks(shuffledBlocks);
    
    setSelectedBlocks([]); // supprime les blocs de l'espace de réponse
    setTextInput(""); // vide la zone de texte à chaque nouvelle question
    setDbResult(null);
    setIsCorrect(null);
    setHasSubmitted(false);
  };

  useEffect(() => {
    loadRandomQuestion();
  }, []);

  const handleSelectBlock = (block, index) => {
    setSelectedBlocks([...selectedBlocks, block]);
    const newAvailable = [...availableBlocks];
    newAvailable.splice(index, 1);
    setAvailableBlocks(newAvailable);
  };

  const handleRemoveBlock = (block, index) => {
    setAvailableBlocks([...availableBlocks, block]);
    const newSelected = [...selectedBlocks];
    newSelected.splice(index, 1);
    setSelectedBlocks(newSelected);
  };

  const handleSubmit = async () => {

    // si niveau extreme on prends le textinput sinon c'est les blocs
    const rawUserQuery = currentQuestion.niveau === "extrême" ? textInput : selectedBlocks.join('') 

    const userQuery = rawUserQuery.replace(/\s/g, '').toLowerCase();
    const solution = currentQuestion.solutionAttendue.replace(/\s/g, '').toLowerCase();

    const isAnswerCorrect = userQuery === solution // comparaison avec la solution
    
    setIsCorrect(isAnswerCorrect);
    setHasSubmitted(true);

    if (isAnswerCorrect) {
      try {
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: currentQuestion.solutionAttendue })
        });
        const data = await response.json();
        setDbResult(data);
      } catch (error) {
        console.error("Erreur API:", error);
      }
    }
  };
  
  // déclenche l'ouverture de l'explorateur de fichiers
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // gère l'envoi du fichier une fois sélectionné
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm(" ⚠️ Voulez-vous vraiment écraser la base actuelle avec le fichier ${file.name} ?")) {
      e.target.value = null; // Reset de l'input
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) alert("✅ " + data.message);
      else alert("❌ Erreur : " + data.error);
    } catch(err) {
      alert("Erreur réseau lors de l'import");
    }
    e.target.value = null; // Reset
  };

  // fonction de réinitialisation de la base
  const handleReset = async () => {
    if (!confirm("⚠️ Attention, cela va effacer toutes tes modifications (insertions, suppressions) et remettre les données de départ. Continuer ?")) return;

    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        alert("✅ " + data.message);
        setDbResult(null); // efface le résultat précédent de l'écran
      } else {
        alert("❌ Erreur : " + data.error);
      }
    } catch(err) {
      alert("Erreur réseau lors de la réinitialisation");
    }
  };

  // téléchargement direct depuis le navigateur
  const handleExport = (format) => {
    // redirige vers la route GET qui force le téléchargement
    window.location.href = `/api/export?format=${format}`;
  };

  // récupérer la bonne icone en fonction du niveau
  const getDifficultyIcon = (niveau) => {
    switch(niveau) {
      case 'facile': return '/facile.webp';
      case 'moyen': return '/moyen.webp';
      case 'difficile': return '/difficile.webp';
      case 'extrême': return '/extreme.webp';
      default: return '/facile.webp';
    }
  };

  if (!currentQuestion) return <div className="p-10 text-center text-slate-500">Chargement de Mongolingo...</div>;

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-8 py-4 flex flex-wrap justify-between items-center border-b border-slate-200 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">Mongolingo</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">
            <Image 
              src={getDifficultyIcon(currentQuestion.niveau)} 
              alt={`Niveau ${currentQuestion.niveau}`} 
              width={24} 
              height={24} 
              className="drop-shadow-sm"
            />
            <span>Niveau {currentQuestion.niveau}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">

          {/* input fichier caché */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".json,.bson" 
            className="hidden" 
          />
          
          {/* bouton d'import */}
          <button 
            onClick={triggerFileInput}
            className="px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 flex items-center gap-2"
          >
            Importer
          </button>

          {/* bouton d'export' */}
          <div className="flex items-center border border-blue-300 rounded-lg overflow-hidden shadow-sm">
            <span className="px-3 py-2 text-sm font-semibold bg-blue-50 text-blue-800 border-r border-blue-300">
              Exporter :
            </span>
            <button 
              onClick={() => handleExport('json')}
              className="px-3 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors border-r border-blue-700"
            >
              JSON
            </button>
            <button 
              onClick={() => handleExport('bson')}
              className="px-3 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              BSON
            </button>
          </div>

          {/* bouton de reset */}
          <button 
            onClick={handleReset}
            className="px-4 py-2 text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors border border-red-300 flex items-center gap-2"
          >
            Réinitialiser
          </button>
        </div>
      </nav>

      {/* CONTENEUR PRINCIPAL */}
      <div className="max-w-3xl mx-auto mt-10 px-8 pb-12 space-y-8">
        
        {/* Encart Astuce avec bouton Pop-up qui explique les schémas à l'utilisateur */}
        <div className="bg-blue-50 text-blue-800 p-5 rounded-xl text-sm border border-blue-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <strong>💡 Astuce :</strong> Notre bibliothèque contient 3 collections : <code>livres</code>, <code>abonnes</code> et <code>emprunts</code>. 
            Les emprunts relient un abonné et un livre via leurs <code>_id</code>.
          </div>
          <button 
            onClick={() => setIsSchemaModalOpen(true)}
            className="whitespace-nowrap px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            👁️ Voir les schémas
          </button>
        </div>

        {/* question */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6 text-slate-800">{currentQuestion.question}</h2>

          {/* zone de réponse (Blocs ou Saisie manuelle) */}
          {currentQuestion.niveau === "extrême" ? (
            <div className="mb-8">
              <div className="bg-orange-50 text-orange-800 p-3 rounded-lg text-sm mb-4 border border-orange-200">
                🔥 <strong>Mode Extrême activé !</strong> Tape la requête complète. N'oublie pas les guilletmets pour les string, les accents, trait d'union (<code>-</code>) pour certains noms propre...
              </div>
              <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={hasSubmitted}
                placeholder="Exemple: db.livres.insertOne({ titre: ... })"
                className="w-full min-h-[100px] p-4 font-mono text-sm bg-slate-900 text-green-400 rounded-xl border-2 border-slate-700 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
              />
            </div>
          ) : (
            <>
              {/* zone de drop pour les blocs classiques */}
              <div className="min-h-[70px] p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-wrap gap-2 mb-8 items-center transition-colors hover:bg-slate-100">
                {selectedBlocks.length === 0 && <span className="text-slate-400 italic">Clique sur les blocs ci-dessous pour construire ta requête...</span>}
                {selectedBlocks.map((block, i) => (
                  <button 
                    key={i} 
                    onClick={() => !hasSubmitted && handleRemoveBlock(block, i)}
                    className={`px-4 py-2 rounded-lg font-mono text-sm shadow-sm transition-transform ${hasSubmitted ? 'bg-slate-200 text-slate-500 cursor-default' : 'bg-white text-slate-800 hover:-translate-y-1 hover:shadow border border-slate-200'}`}
                  >
                    {block}
                  </button>
                ))}
              </div>

              {/* blocs disponibles */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {availableBlocks.map((block, i) => (
                  <button 
                    key={i} 
                    onClick={() => !hasSubmitted && handleSelectBlock(block, i)}
                    className={`px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-mono text-sm shadow-sm transition-transform ${hasSubmitted ? 'opacity-40 cursor-default' : 'hover:-translate-y-1 hover:shadow hover:bg-indigo-100'}`}
                  >
                    {block}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* bouton d'action (gère le disabled du mode extrême) */}
          {!hasSubmitted ? (
            <button 
              onClick={handleSubmit}
              disabled={(currentQuestion.niveau === "extrême" && textInput.trim() === "") || (currentQuestion.niveau !== "extrême" && selectedBlocks.length === 0)}
              className="w-full py-4 rounded-xl font-bold text-lg text-white bg-green-500 hover:bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Vérifier ma requête
            </button>
          ) : (
            <button 
              onClick={loadRandomQuestion}
              className="w-full py-4 rounded-xl font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm"
            >
              Question suivante
            </button>
          )}
        </div>

        {/* zone de Résultat */}
        {hasSubmitted && (
          <div className={`p-6 rounded-2xl shadow-sm border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`text-2xl font-bold mb-3 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '✅ Bravo !' : '❌ Oups, ce n\'est pas tout à fait ça !'}
            </h3>
            
            {/* si ce n'est pas correct on affiche la solution attendue */}
            {!isCorrect && (
              <div className="mb-4 text-red-800 bg-red-100/50 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-1">La solution attendue était :</p>
                <code className="font-mono">{currentQuestion.solutionAttendue}</code>
              </div>
            )}

            {/* affichage d'une courte explication de la solution */}
            <div className="bg-white p-4 rounded-xl mt-4 text-slate-700 border border-slate-100/50 shadow-sm">
              <p><strong className="text-indigo-600">Explication : </strong>{currentQuestion.explication}</p>
            </div>
            
            {/* exécution en base si la requête est correct */}
            {isCorrect && dbResult && (
              <div className="mt-6">
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span>Résultat MongoDB</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full">Live</span>
                </h4>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto shadow-inner">
                  <pre className="text-green-400 font-mono text-sm leading-relaxed">
                    {JSON.stringify(dbResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* POP-UP DES SCHÉMAS */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-slate-800">Schémas des Collections MongoDB</h2>
              <button 
                onClick={() => setIsSchemaModalOpen(false)}
                className="text-slate-400 hover:text-red-500 font-bold text-xl p-2 transition-colors"
                title="Fermer"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <p className="text-slate-600 text-sm">
                Voici la structure imposée par nos règles de validation (JSON Schema). Notez que MongoDB est flexible (NoSQL) : vous pouvez ajouter des champs supplémentaires (comme `tags`, `note`, `stock`) à volonté, mais les champs listés ci-dessous sont <strong>obligatoires</strong>.
              </p>

              {/* Collection Livres */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-lg text-indigo-700 mb-2 font-mono">📦 db.livres</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-slate-700 font-mono">
                  <li><span className="font-bold text-slate-900">titre</span> : string</li>
                  <li><span className="font-bold text-slate-900">auteur</span> : string</li>
                  <li><span className="font-bold text-slate-900">annee_publication</span> : int</li>
                </ul>
              </div>

              {/* Collection Abonnés */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-lg text-indigo-700 mb-2 font-mono">📦 db.abonnes</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-slate-700 font-mono">
                  <li><span className="font-bold text-slate-900">nom</span> : string</li>
                  <li><span className="font-bold text-slate-900">email</span> : string</li>
                  <li><span className="font-bold text-slate-900">date_inscription</span> : date</li>
                </ul>
              </div>

              {/* Collection Emprunts */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-lg text-indigo-700 mb-2 font-mono">📦 db.emprunts</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-slate-700 font-mono">
                  <li><span className="font-bold text-slate-900">id_abonne</span> : ObjectId</li>
                  <li><span className="font-bold text-slate-900">id_livre</span> : ObjectId</li>
                  <li><span className="font-bold text-slate-900">date_emprunt</span> : date</li>
                  <li><span className="font-bold text-slate-900">statut</span> : string (uniquement "en cours", "rendu", ou "en retard")</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-right">
              <button 
                onClick={() => setIsSchemaModalOpen(false)}
                className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors"
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      )}


    </main>
  );
}