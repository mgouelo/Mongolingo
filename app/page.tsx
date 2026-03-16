'use client';

import { useState, useEffect } from 'react';
import { questions } from '@/lib/questions';

export default function MongolingoApp() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  
  const [dbResult, setDbResult] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // chargement d'une question aléatoire au démarrage et au clic sur suivant
  const loadRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const q = questions[randomIndex];
    setCurrentQuestion(q);
    
    // disposition des blocks de façon aléatoire dans la banque
    const shuffledBlocks = [...q.blocs].sort(() => Math.random() - 0.5);
    setAvailableBlocks(shuffledBlocks);
    
    setSelectedBlocks([]);
    setDbResult(null);
    setIsCorrect(null);
    setHasSubmitted(false);
  };

  useEffect(() => {
    loadRandomQuestion();
  }, []);

  // gestion du clic sur un block pas encore sélectionné --> on l'ajoute à la requête
  const handleSelectBlock = (block, index) => {
    setSelectedBlocks([...selectedBlocks, block]);
    const newAvailable = [...availableBlocks];
    newAvailable.splice(index, 1);
    setAvailableBlocks(newAvailable);
  };

  // gestion du clic sur un block déja séelctioné --> on le remet dans la banque des disponible
  const handleRemoveBlock = (block, index) => {
    setAvailableBlocks([...availableBlocks, block]);
    const newSelected = [...selectedBlocks];
    newSelected.splice(index, 1);
    setSelectedBlocks(newSelected);
  };

  // valide la réponse et interroge l'api
  const handleSubmit = async () => {
    const userQuery = selectedBlocks.join('');

    // retire les espaces superflus pour la comparaison
    const isAnswerCorrect = userQuery.replace(/\s/g, '') === currentQuestion.solutionAttendue.replace(/\s/g, '');
    
    setIsCorrect(isAnswerCorrect);
    setHasSubmitted(true);

    if (isAnswerCorrect) {
      try {
        // Exécution réelle sur la base de données !
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: currentQuestion.solutionAttendue })
        });
        
        const data = await response.json();
        setDbResult(data);
      } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
      }
    }
  };

  if (!currentQuestion) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* En-tête */}
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-green-600 mb-2">Mongolingo</h1>
          <p className="text-slate-500">Apprends MongoDB en t'amusant !</p>
          <div className="mt-4 inline-block px-3 py-1 bg-slate-200 rounded-full text-sm font-semibold uppercase tracking-wider">
            Niveau : {currentQuestion.niveau}
          </div>
        </header>

        {/* Question */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>

          {/* Zone de construction de la requête */}
          <div className="min-h-[60px] p-4 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-wrap gap-2 mb-6 items-center">
            {selectedBlocks.length === 0 && <span className="text-slate-400 italic">Clique sur les blocs ci-dessous pour construire ta requête...</span>}
            {selectedBlocks.map((block, i) => (
              <button 
                key={i} 
                onClick={() => !hasSubmitted && handleRemoveBlock(block, i)}
                className={`px-4 py-2 rounded-lg font-mono text-sm shadow-sm transition-transform ${hasSubmitted ? 'bg-slate-300 cursor-default' : 'bg-white hover:-translate-y-1 hover:shadow-md cursor-pointer border border-slate-200'}`}
              >
                {block}
              </button>
            ))}
          </div>

          {/* Blocs disponibles */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {availableBlocks.map((block, i) => (
              <button 
                key={i} 
                onClick={() => !hasSubmitted && handleSelectBlock(block, i)}
                className={`px-4 py-2 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-mono text-sm shadow-sm transition-transform ${hasSubmitted ? 'opacity-50 cursor-default' : 'hover:-translate-y-1 hover:shadow-md cursor-pointer'}`}
              >
                {block}
              </button>
            ))}
          </div>

          {/* Bouton de validation */}
          {!hasSubmitted ? (
            <button 
              onClick={handleSubmit}
              disabled={selectedBlocks.length === 0}
              className="w-full py-4 rounded-xl font-bold text-lg text-white bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Vérifier la requête
            </button>
          ) : (
            <button 
              onClick={loadRandomQuestion}
              className="w-full py-4 rounded-xl font-bold text-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Question Suivante
            </button>
          )}
        </div>

        {/* Zone de Résultat & Explication */}
        {hasSubmitted && (
          <div className={`p-6 rounded-2xl shadow-sm border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? 'Excellent ! 🎉' : 'Oups, ce n\'est pas tout à fait ça ! 😕'}
            </h3>
            
            {!isCorrect && (
              <div className="mb-4 text-red-800">
                <p><strong>La solution attendue était :</strong></p>
                <code className="bg-red-100 px-2 py-1 rounded block mt-1">{currentQuestion.solutionAttendue}</code>
              </div>
            )}

            <div className="bg-white bg-opacity-60 p-4 rounded-xl mt-4 text-slate-800">
              <p><strong>Explication : </strong>{currentQuestion.explication}</p>
            </div>

            {/* Affichage du résultat de la BDD */}
            {isCorrect && dbResult && (
              <div className="mt-6">
                <h4 className="font-bold text-slate-700 mb-2">Résultat renvoyé par MongoDB :</h4>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-green-400 font-mono text-sm">
                    {JSON.stringify(dbResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}