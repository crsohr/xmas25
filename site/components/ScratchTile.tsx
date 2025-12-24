
import React, { useEffect, useRef, useState } from 'react';

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

    // Draw scratch layer
    const drawScratchLayer = () => {
      // Gold/Red gradient for the top
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#c41e3a'); // Christmas Red
      gradient.addColorStop(0.5, '#b01a34');
      gradient.addColorStop(1, '#8b0000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add a number
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 32px Quicksand';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), canvas.width / 2, canvas.height / 2);
      
      // Decorative pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
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
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkReveal(ctx);
  };

  const checkReveal = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Check percentage of pixels removed
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    if (percentage > 40 && !isRevealed) {
      setIsRevealed(true);
      onReveal();
      // Smoothly fade out the rest of the canvas
      canvas.style.transition = 'opacity 0.5s ease-out';
      canvas.style.opacity = '0';
      setTimeout(() => {
        if (canvas) canvas.style.display = 'none';
      }, 500);
    }
  };

  return (
    <div className="relative aspect-square w-full bg-white rounded-xl overflow-hidden shadow-2xl border-4 border-[#d4af37] flex items-center justify-center">
      {/* Underlying Amount Display */}
      <div className="flex flex-col items-center justify-center text-[#165b33]">
        <span className="text-3xl font-bold">{amount}€</span>
        <span className="text-xs font-semibold uppercase tracking-wider">Cadeau !</span>
      </div>

      {/* Canvas Scratch Layer */}
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

export default ScratchTile;
