
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// --- Constants ---
const TOTAL_GIFT = 80;
const NUMBER_OF_TILES = 15;

// Distribution calculation for 80€ over 15 tiles
const INITIAL_AMOUNTS = [
  15, 10, 7, 7, 5, 5, 5, 4, 4, 4, 4, 2.5, 2.5, 2.5, 2.5
];

// --- Components ---

const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const snowflakes: { x: number; y: number; radius: number; speed: number; opacity: number }[] = [];

    const createSnowflakes = () => {
      const count = 100;
      for (let i = 0; i < count; i++) {
        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 0.8 + 0.2,
          opacity: Math.random() * 0.5 + 0.3
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      
      snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.globalAlpha = flake.opacity;
        ctx.fill();

        flake.y += flake.speed;
        flake.x += Math.sin(flake.y / 30) * 0.5;

        if (flake.y > height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    createSnowflakes();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

interface ScratchTileProps {
  amount: number;
  index: number;
  onReveal: () => void;
}

const ScratchTile: React.FC<ScratchTileProps> = ({ amount, index, onReveal }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawScratchLayer = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#c41e3a'); // Christmas Red
      gradient.addColorStop(0.5, '#b01a34');
      gradient.addColorStop(1, '#8b0000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 36px Quicksand';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), canvas.width / 2, canvas.height / 2);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      for (let i = -canvas.width; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + canvas.width, canvas.height);
        ctx.stroke();
      }
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawScratchLayer();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [index]);

  const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    checkReveal(ctx);
  };

  const checkReveal = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    if (percentage > 45 && !isRevealed) {
      setIsRevealed(true);
      onReveal();
      canvas.style.transition = 'opacity 0.6s ease-out';
      canvas.style.opacity = '0';
      setTimeout(() => {
        if (canvas) canvas.style.display = 'none';
      }, 600);
    }
  };

  return (
    <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden shadow-xl border-4 border-[#d4af37] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-[#165b33]">
        <span className="text-4xl font-black">{amount.toFixed(2).replace('.00', '')}€</span>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Joyeux Noël</span>
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair touch-none"
        onMouseDown={() => setIsScratching(true)}
        onMouseUp={() => setIsScratching(false)}
        onMouseMove={(e) => isScratching && handleScratch(e)}
        onTouchStart={() => setIsScratching(true)}
        onTouchEnd={() => setIsScratching(false)}
        onTouchMove={(e) => isScratching && handleScratch(e)}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [shuffledAmounts, setShuffledAmounts] = useState<number[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setShuffledAmounts([...INITIAL_AMOUNTS].sort(() => Math.random() - 0.5));
  }, []);

  const handleReveal = (amount: number) => {
    setRevealedCount(prev => prev + 1);
    setTotalCollected(prev => prev + amount);
  };

  useEffect(() => {
    if (revealedCount === NUMBER_OF_TILES && revealedCount > 0) {
      setTimeout(() => setIsFinished(true), 1200);
    }
  }, [revealedCount]);

  return (
    <div className="min-h-screen bg-[#0a2e1a] text-white px-4 py-8 pb-36 font-sans">
      <Snowfall />

      <header className="relative z-10 text-center mb-10">
        <h1 className="christmas-font text-5xl md:text-7xl text-[#d4af37] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-3">
          Joyeux Noël Victor !
        </h1>
        <p className="text-sm md:text-base text-white/80 italic font-medium">
          Gratte les 15 cases magiques pour découvrir ton cadeau...
        </p>
      </header>

      <main className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {shuffledAmounts.map((amount, idx) => (
          <div key={idx} className="hover:scale-[1.02] transition-transform duration-200">
            <ScratchTile 
              amount={amount} 
              index={idx} 
              onReveal={() => handleReveal(amount)} 
            />
          </div>
        ))}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-[#c41e3a] p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] border-t-4 border-[#d4af37]">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-white/70 tracking-tighter">Cases Grattées</span>
            <span className="text-2xl font-black">{revealedCount} / 15</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-black text-white/70 tracking-tighter">Cadeau Actuel</span>
            <span className="text-4xl font-black text-[#d4af37] tabular-nums drop-shadow-sm">
              {totalCollected.toFixed(2)} €
            </span>
          </div>
        </div>
      </footer>

      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md transition-opacity duration-500">
          <div className="bg-white rounded-[2.5rem] p-10 text-center max-w-sm border-8 border-[#d4af37] relative shadow-[0_0_50px_rgba(212,175,55,0.4)] animate-in zoom-in duration-300">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600"></div>
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="christmas-font text-5xl text-[#c41e3a] mb-2 leading-tight">Merveilleux !</h2>
            <p className="text-[#165b33] text-lg font-bold mb-6">
              Victor, ton cadeau total est de :
            </p>
            <div className="text-7xl font-black text-[#d4af37] mb-8 animate-bounce drop-shadow-lg">
              80 €
            </div>
            <p className="text-gray-500 mb-10 text-sm italic leading-relaxed">
              "Joyeux Noël frérot ! Profite bien de ce petit présent pour tes projets."
            </p>
            <button 
              onClick={() => setIsFinished(false)}
              className="bg-[#c41e3a] hover:bg-[#8b0000] text-white w-full py-4 rounded-2xl font-black shadow-lg transform active:scale-95 transition-all"
            >
              MERCI !
            </button>
          </div>
        </div>
      )}

      {/* Decorations */}
      <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-[#165b33] rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
      <div className="fixed top-1/4 -right-20 w-80 h-80 bg-[#c41e3a] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
    </div>
  );
};

// --- Initial Render ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
