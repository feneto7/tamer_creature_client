import React, { useState, useEffect } from 'react';

interface AnimatedCoinProps {
  className?: string;
}

export const AnimatedCoin: React.FC<AnimatedCoinProps> = ({ className = '' }) => {
  const [frame, setFrame] = useState(1);
  const totalFrames = 10;

  useEffect(() => {
    // Alterna o frame a cada 100ms (10fps)
    const interval = setInterval(() => {
      setFrame(prev => prev >= totalFrames ? 1 : prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <img 
      src={`/assets/ui/spinning_coin/coin${frame}.png`} 
      alt="Moeda" 
      className={`object-contain drop-shadow ${className}`} 
      style={{ imageRendering: 'pixelated' }} 
    />
  );
};
