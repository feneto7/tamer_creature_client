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

// Cores de borda e fundo por raridade (hex oficial do GDD)
const RARITY_STYLES: Record<Rarity, { border: string; bg: string; glow: string; label: string }> = {
  [Rarity.COMMON]:     { border: '#B0B0B0', bg: '#D4D4D4', glow: 'none',                                          label: 'Comum' },
  [Rarity.RARE]:       { border: '#2ECC71', bg: '#27AE60', glow: '0 0 8px rgba(46,204,113,0.5)',                   label: 'Rara' },
  [Rarity.ULTRA_RARE]: { border: '#3498DB', bg: '#2980B9', glow: '0 0 12px rgba(52,152,219,0.6)',                  label: 'Ultra Rara' },
  [Rarity.EPIC]:       { border: '#9B59B6', bg: '#8E44AD', glow: '0 0 14px rgba(155,89,182,0.6)',                  label: 'Épica' },
  [Rarity.LEGENDARY]:  { border: '#F39C12', bg: '#E67E22', glow: '0 0 18px rgba(243,156,18,0.7)',                  label: 'Lendária' },
  [Rarity.DIVINE]:     { border: '#FFD700', bg: '#FFC107', glow: '0 0 24px rgba(255,215,0,0.8), 0 0 48px rgba(255,215,0,0.3)', label: 'Divina' },
};

// Badge do Potencial Genético
const TIER_STYLES: Record<string, { bg: string; text: string; border: string; animate: boolean }> = {
  'F':   { bg: '#4a4a4a', text: '#999',    border: '#333',    animate: false },
  'E':   { bg: '#5a5a5a', text: '#bbb',    border: '#444',    animate: false },
  'D':   { bg: '#6b6b6b', text: '#ddd',    border: '#555',    animate: false },
  'C':   { bg: '#f0f0f0', text: '#333',    border: '#aaa',    animate: false },
  'B':   { bg: '#bfdbfe', text: '#1e40af', border: '#60a5fa', animate: false },
  'A':   { bg: '#d8b4fe', text: '#581c87', border: '#a855f7', animate: false },
  'S':   { bg: '#7c3aed', text: '#fff',    border: '#a78bfa', animate: false },
  'SS':  { bg: '#f59e0b', text: '#fff',    border: '#fbbf24', animate: true },
  'SSS': { bg: '#ef4444', text: '#fff',    border: '#fbbf24', animate: true },
};

export const CreatureCard: React.FC<CreatureCardProps> = ({ name, level, rarity, speciesId, geneticTier = 'C', imageUrl, onClick }) => {
  const style = RARITY_STYLES[rarity];
  const tier = TIER_STYLES[geneticTier] || TIER_STYLES['C'];
  const isDivine = rarity === Rarity.DIVINE;
  const isLegendary = rarity === Rarity.LEGENDARY;

  const resolvedImage = imageUrl || (speciesId ? `/assets/creatures/front/${speciesId}.png` : undefined);

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer transition-transform duration-200 hover:-translate-y-1 active:scale-95"
      style={{ width: '100px', height: '140px' }}
    >
      {/* Card frame externo */}
      <div
        className="w-full h-full rounded-lg overflow-hidden flex flex-col"
        style={{
          border: `3px solid ${style.border}`,
          boxShadow: style.glow,
          background: `linear-gradient(145deg, ${style.bg}, ${style.border})`,
        }}
      >
        {/* Badge do Potencial Genético */}
        <div
          className={`absolute -top-2 -right-2 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${tier.animate ? 'animate-pulse' : ''}`}
          style={{
            backgroundColor: tier.bg,
            color: tier.text,
            border: `2px solid ${tier.border}`,
            fontFamily: 'var(--font-pixel)',
            letterSpacing: '1px',
          }}
        >
          {geneticTier}
        </div>

        {/* Área da imagem */}
        <div
          className="flex-1 relative mx-1 mt-1 rounded-sm overflow-hidden"
          style={{
            backgroundColor: 'rgba(255,255,255,0.85)',
            border: `1px solid ${style.border}`,
          }}
        >
          {resolvedImage ? (
            <img
              src={resolvedImage}
              alt={name}
              className="absolute inset-0 w-full h-full object-contain scale-[1.8] transform origin-center"
              style={{ imageRendering: 'pixelated' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <span
              className="absolute inset-0 flex items-center justify-center text-[7px] uppercase text-center leading-tight px-1"
              style={{ color: '#999', fontFamily: 'var(--font-pixel)' }}
            >
              Sem Imagem
            </span>
          )}
        </div>

        {/* Footer com nome */}
        <div
          className="flex justify-center items-center px-1 py-1"
          style={{ minHeight: '36px' }}
        >
          <span
            className="text-[7px] uppercase font-bold text-center leading-tight break-words"
            style={{ color: '#fff', textShadow: '1px 1px 0 rgba(0,0,0,0.5)', width: '100%', wordBreak: 'break-word' }}
          >
            {name}
          </span>
        </div>
      </div>

      {/* Efeito de brilho para Divina */}
      {isDivine && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, transparent 50%, rgba(255,215,0,0.15) 100%)',
            border: '2px solid rgba(255,215,0,0.4)',
          }}
        />
      )}

      {/* Efeito de brilho para Lendária */}
      {isLegendary && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(243,156,18,0.1) 0%, transparent 60%)',
          }}
        />
      )}
    </div>
  );
};
