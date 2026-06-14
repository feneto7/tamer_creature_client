import React from 'react';

export const Rarity = {
  COMMON: 'COMMON',
  RARE: 'RARE',
  ULTRA_RARE: 'ULTRA_RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
  DIVINE: 'DIVINE',
} as const;

export type Rarity = typeof Rarity[keyof typeof Rarity];

interface CreatureCardProps {
  name: string;
  level: number;
  rarity: Rarity;
  speciesId?: string;
  geneticTier?: string;
  imageUrl?: string;
  onClick?: () => void;
}

// Cores base para bordas e brilhos por raridade
const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]:     '#B0B0B0', // Cinza
  [Rarity.RARE]:       '#2ECC71', // Verde neon
  [Rarity.ULTRA_RARE]: '#00f3ff', // Ciano neon (estética principal)
  [Rarity.EPIC]:       '#9B59B6', // Roxo neon
  [Rarity.LEGENDARY]:  '#F39C12', // Laranja neon
  [Rarity.DIVINE]:     '#FFD700', // Dourado brilhante
};

// Cores para as tags de Tier Genético
const TIER_COLORS: Record<string, string> = {
  'F':   '#4a4a4a',
  'E':   '#6b6b6b',
  'D':   '#8b8b8b',
  'C':   '#cccccc',
  'B':   '#3498db',
  'A':   '#9b59b6',
  'S':   '#e67e22',
  'SS':  '#f1c40f',
  'SSS': '#e74c3c',
};

export const CreatureCard: React.FC<CreatureCardProps> = ({ name, level, rarity, speciesId, geneticTier = 'C', imageUrl, onClick }) => {
  const rarityColor = RARITY_COLORS[rarity] || '#00f3ff';
  const tierColor = TIER_COLORS[geneticTier] || '#cccccc';
  const isDivine = rarity === Rarity.DIVINE;
  const isLegendary = rarity === Rarity.LEGENDARY;

  const resolvedImage = imageUrl || (speciesId ? `/assets/creatures/front/${speciesId}.png` : undefined);

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer transition-transform duration-200 hover:-translate-y-1 active:scale-95 group"
      style={{ width: '100px', height: '140px' }}
    >
      {/* Card frame externo estilo HoloPanel */}
      <div
        className="w-full h-full rounded-xl overflow-hidden flex flex-col relative"
        style={{
          background: 'linear-gradient(to bottom, #0a1922, #040b0f)',
          border: `1px solid ${rarityColor}66`, // Borda semi-transparente
          boxShadow: `0 0 10px ${rarityColor}33, inset 0 0 15px ${rarityColor}22`,
        }}
      >
        {/* Highlight superior (glass edge) */}
        <div 
          className="absolute top-0 left-1/4 right-1/4 h-[1px]" 
          style={{ 
            backgroundColor: rarityColor, 
            boxShadow: `0 0 8px ${rarityColor}, 0 0 15px ${rarityColor}` 
          }} 
        />

        {/* Textura de fundo do card */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ background: `radial-gradient(circle at center, ${rarityColor} 0%, transparent 70%)` }}
        />

        {/* Badge do Potencial Genético (Letra no topo direito) */}
        <div
          className="absolute top-1 right-1 z-20 text-[10px] font-bold"
          style={{
            color: tierColor,
            textShadow: `0 0 3px ${tierColor}`,
            fontFamily: 'var(--font-pixel)',
          }}
        >
          {geneticTier}
        </div>

        {/* Nível da Criatura no canto esquerdo */}
        <div 
          className="absolute top-1 left-1 z-10 text-[10px] font-bold"
          style={{ color: rarityColor, textShadow: `0 0 3px ${rarityColor}` }}
        >
          Lv.{level}
        </div>

        {/* Área da imagem com fundo de "container" */}
        <div
          className="flex-1 relative mx-1 mt-3 mb-1 rounded-sm flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at center, ${rarityColor}33 0%, transparent 70%)`,
            borderBottom: `1px solid ${rarityColor}33`,
          }}
        >
          {resolvedImage ? (
            <img
              src={resolvedImage}
              alt={name}
              className="absolute inset-0 m-auto w-[90%] h-[90%] object-contain transform origin-center transition-transform duration-300 group-hover:scale-110"
              style={{ imageRendering: 'pixelated', filter: `drop-shadow(0 0 6px ${rarityColor}88)` }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <span
              className="absolute inset-0 flex items-center justify-center text-[10px] uppercase text-center leading-tight px-1"
              style={{ color: '#999', fontFamily: 'var(--font-pixel)' }}
            >
              Sem Imagem
            </span>
          )}
        </div>

        {/* Footer com nome e barra de fundo glowing */}
        <div
          className="flex justify-center items-center px-1 py-1 relative z-10"
          style={{ 
            minHeight: '36px',
            background: `linear-gradient(to top, ${rarityColor}22, transparent)`
          }}
        >
          <span
            className="text-[11px] uppercase font-bold text-center leading-[1.1] drop-shadow-md"
            style={{ 
              color: '#ffffff', 
              textShadow: `0 0 4px ${rarityColor}`, 
              width: '100%', 
              wordBreak: 'break-word'
            }}
          >
            {name}
          </span>
        </div>
      </div>

      {/* Efeito de brilho externo para Divina */}
      {isDivine && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none animate-pulse"
          style={{
            boxShadow: `0 0 20px ${rarityColor}66`,
            border: `1px solid ${rarityColor}`,
          }}
        />
      )}

      {/* Efeito de brilho externo para Lendária */}
      {isLegendary && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `0 0 10px ${rarityColor}44`,
          }}
        />
      )}
    </div>
  );
};
