
import React, { useState, useEffect } from 'react';
import Snowfall from './components/Snowfall';
import ScratchTile from './components/ScratchTile';
import { AMOUNTS, TOTAL_GIFT } from './constants';

const App: React.FC = () => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleReveal = (amount: number) => {
    setRevealedCount(prev => prev + 1);
    setTotalCollected(prev => prev + amount);
  };

  useEffect(() => {
    if (revealedCount === AMOUNTS.length) {
      setTimeout(() => setIsFinished(true), 1000);
    }
  }, [revealedCount]);

  return (
    <div className="min-h-screen relative text-white px-4 py-8 pb-32">
      <Snowfall />

      {/* Header */}
      <header className="relative z-10 text-center mb-8 animate-fade-in">
        <h1 className="christmas-font text-5xl md:text-6xl text-[#d4af37] drop-shadow-lg mb-2">
          Joyeux Noël Victor !
        </h1>
        <p className="text-lg text-white/90 italic">
          Gratte les 15 cases pour découvrir ton cadeau...
        </p>
      </header>

      {/* Grid of Tiles */}
      <main className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {AMOUNTS.map((amount, idx) => (
          <div key={idx} className="transform transition-transform active:scale-95">
            <ScratchTile 
              amount={amount} 
              index={idx} 
              onReveal={() => handleReveal(amount)} 
            />
          </div>
        ))}
      </main>

      {/* Fixed Stats Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-[#c41e3a] p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] border-t-4 border-[#d4af37]">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold text-white/80">Progression</span>
            <span className="text-2xl font-bold">{revealedCount} / 15 cases</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase font-bold text-white/80">Total Récolté</span>
            <span className="text-3xl font-bold text-[#d4af37] tabular-nums">
              {totalCollected.toFixed(2)} €
            </span>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm border-8 border-[#d4af37] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-gold-500 to-green-500"></div>
            <h2 className="christmas-font text-4xl text-[#c41e3a] mb-4">Bravo Victor !</h2>
            <p className="text-[#165b33] text-xl font-bold mb-6">
              Tu as récolté au total :
            </p>
            <div className="text-6xl font-black text-[#d4af37] mb-8 animate-bounce">
              80 €
            </div>
            <p className="text-gray-600 mb-8 italic">
              "Un petit cadeau pour un super frère. Profites-en bien ce soir !"
            </p>
            <button 
              onClick={() => setIsFinished(false)}
              className="bg-[#165b33] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#0a2e1a] transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Background Decorations */}
      <div className="fixed -bottom-10 -left-10 w-40 h-40 bg-[#165b33] rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="fixed top-20 -right-10 w-60 h-60 bg-[#c41e3a] rounded-full blur-3xl opacity-20 pointer-events-none"></div>
    </div>
  );
};

export default App;
