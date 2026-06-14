import React, { useState, useEffect } from 'react';

// Mapeamento de filtros CSS considerando que a imagem original é ROXA (~270deg hue)
const PORTAL_FILTERS: Record<string, string> = {
  '#808080': 'saturate(0) brightness(1.5)', // Cinza (Rank E)
  '#2ecc71': 'hue-rotate(-150deg) brightness(1.2)', // Verde (Rank D)
  '#3498db': 'hue-rotate(-60deg) brightness(1.2)', // Azul (Rank C)
  '#9b59b6': 'hue-rotate(0deg)', // Roxo (Rank B)
  '#e67e22': 'hue-rotate(120deg) brightness(1.2)', // Laranja (Rank A)
  '#e74c3c': 'hue-rotate(90deg) brightness(1.2)', // Vermelho (Rank S)
};

interface PortalSpriteProps {
  color: string;
  className?: string;
}

export const PortalSprite: React.FC<PortalSpriteProps> = ({ color, className = '' }) => {
  const [frame, setFrame] = useState(1);
  const totalFrames = 7;

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev >= totalFrames ? 1 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const filterCss = PORTAL_FILTERS[color] || 'hue-rotate(0deg)';

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Imagem base com filtro CSS aplicado para colorir e respeitar o alpha */}
        <img 
          src={`/assets/dungeons/Frames/portal1_frame_${frame}.png`} 
          alt="Portal"
          className="w-full h-full object-contain relative z-10"
          style={{ 
            imageRendering: 'pixelated',
            filter: `drop-shadow(0 0 8px rgba(255,255,255,0.2)) ${filterCss}` 
          }}
        />
      </div>
    </div>
  );
};
