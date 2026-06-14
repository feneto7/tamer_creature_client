import React from 'react';
import { createPortal } from 'react-dom';
import { Rarity } from './CreatureCard';

interface CreatureDetailsModalProps {
  creature: any;
  onClose: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  [Rarity.COMMON]: '#B0B0B0',
  [Rarity.RARE]: '#2ECC71',
  [Rarity.ULTRA_RARE]: '#00f3ff',
  [Rarity.EPIC]: '#9B59B6',
  [Rarity.LEGENDARY]: '#F39C12',
  [Rarity.DIVINE]: '#FFD700',
};

const TIER_COLORS: Record<string, string> = {
  'F': '#4a4a4a',
  'E': '#6b6b6b',
  'D': '#8b8b8b',
  'C': '#cccccc',
  'B': '#3498db',
  'A': '#9b59b6',
  'S': '#e67e22',
  'SS': '#f1c40f',
  'SSS': '#e74c3c',
};

// Um dicionário simples local para as habilidades.
const ABILITY_DICTIONARY: Record<string, { name: string, level: number }> = {
  'vitality_boost': { name: 'Impulso de Vitalidade', level: 1 },
  'combat_instinct': { name: 'Instinto de Combate', level: 1 },
  'iron_skin': { name: 'Pele de Ferro', level: 2 },
  'shadow_cloak': { name: 'Manto das Sombras', level: 3 },
  'mystic_aura': { name: 'Aura Mística', level: 4 },
  'plasma_core': { name: 'Núcleo de Plasma', level: 5 },
};



const ABILITY_LEVEL_COLORS: Record<number, string> = {
  1: 'text-[#B0B0B0]', // Cinza
  2: 'text-[#2ECC71]', // Verde
  3: 'text-[#00f3ff]', // Ciano
  4: 'text-[#9B59B6]', // Roxo
  5: 'text-[#FFD700]', // Dourado
};

export const CreatureDetailsModal: React.FC<CreatureDetailsModalProps> = ({ creature, onClose }) => {
  if (!creature) return null;

  let abilities: string[] = [];
  try {
    abilities = JSON.parse(creature.abilitiesJson || '[]');
  } catch (e) {}

  const stats = [
    { label: 'HP', value: creature.hp },
    { label: 'FOR', value: creature.strength },
    { label: 'MAG', value: creature.spell },
    { label: 'RES', value: creature.resistance },
    { label: 'ESP', value: creature.spirit },
    { label: 'AGI', value: creature.agility },
    { label: 'EVA', value: creature.evasion },
    { label: 'PRE', value: creature.precision },
    { label: 'CRI', value: creature.critical },
  ];

  const rarityColor = RARITY_COLORS[creature.rarity] || '#00f3ff';
  const tierColor = TIER_COLORS[creature.geneticTier || 'C'] || '#cccccc';

  const modalContent = (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4 animate-fade-in font-pixel" onClick={onClose}>
      <div 
        className="relative w-full max-w-sm max-h-[95vh] sm:max-h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-[0_0_20px_rgba(0,243,255,0.2)]"
        style={{
          background: 'linear-gradient(to bottom, #0a1922, #040b0f)',
          border: '1px solid rgba(0, 243, 255, 0.4)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Highlight Superior */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-[#00f3ff] shadow-[0_0_10px_#00f3ff,0_0_20px_#00f3ff]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00f3ff]/5 to-transparent pointer-events-none" />

        {/* Header fixo no topo */}
        <div className="bg-[#00f3ff]/5 text-[#00f3ff] p-2 sm:p-3 border-b border-[#00f3ff]/30 flex justify-between items-center relative z-10 shrink-0">
          <span className="holo-modal-title drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">{creature.name}</span>
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-300 hover:scale-110 transition-transform font-bold text-xs px-2"
            style={{ textShadow: '0 0 5px rgba(239,68,68,0.8)' }}
          >
            X
          </button>
        </div>

        {/* Corpo scrollável do modal */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 relative z-10 overflow-y-auto custom-scrollbar flex-1">
          {/* Top Info (Rarity, Tier, Level) */}
          <div className="flex gap-2 holo-modal-label justify-center">
            <span 
              className="px-2 py-1 rounded"
              style={{
                border: `1px solid ${rarityColor}`,
                color: rarityColor,
                backgroundColor: 'rgba(0,0,0,0.4)',
                boxShadow: `0 0 5px ${rarityColor}66, inset 0 0 5px ${rarityColor}44`,
                textShadow: `0 0 3px ${rarityColor}`
              }}
            >
              {creature.rarity}
            </span>
            <span 
              className="px-2 py-1 rounded"
              style={{
                border: `1px solid ${tierColor}`,
                color: tierColor,
                backgroundColor: 'rgba(0,0,0,0.4)',
                boxShadow: `0 0 5px ${tierColor}66, inset 0 0 5px ${tierColor}44`,
                textShadow: `0 0 3px ${tierColor}`
              }}
            >
              Tier: {creature.geneticTier || 'C'}
            </span>
            <span 
              className="px-2 py-1 rounded"
              style={{
                border: '1px solid #FFD820',
                color: '#FFD820',
                backgroundColor: 'rgba(0,0,0,0.4)',
                boxShadow: '0 0 5px rgba(255,216,32,0.4), inset 0 0 5px rgba(255,216,32,0.2)',
                textShadow: '0 0 3px #FFD820'
              }}
            >
              Lv. {creature.level}
            </span>
          </div>

          {/* Awakening */}
          <div 
            className="p-1.5 sm:p-2 text-center holo-modal-label rounded"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.2), inset 0 0 10px rgba(239, 68, 68, 0.1)',
              textShadow: '0 0 5px rgba(239, 68, 68, 0.8)'
            }}
          >
            🌟 Despertar: {creature.awakeningName || 'Desconhecido'}
          </div>

          {/* Abilities */}
          <div 
            className="p-2 sm:p-3 text-center rounded shrink-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 243, 255, 0.2)',
            }}
          >
            <h3 className="holo-modal-subtitle mb-1.5 sm:mb-2 pb-1" style={{ color: '#00f3ff', borderBottom: '1px solid rgba(0,243,255,0.2)' }}>Habilidades Passivas</h3>
            {abilities.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {abilities.map((ab) => {
                  const data = ABILITY_DICTIONARY[ab];
                  const name = data ? data.name : ab;
                  const lvlColorClass = data ? ABILITY_LEVEL_COLORS[data.level] : 'text-gray-500';
                  return (
                    <span key={ab} className={`holo-modal-label ${lvlColorClass}`} style={{ textShadow: '0 0 3px currentColor' }}>
                      {name} {data ? `[LV.${data.level}]` : ''}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="holo-modal-text text-gray-500">Nenhuma habilidade</span>
            )}
          </div>

          {/* Stats Grid */}
          <div 
            className="p-2 sm:p-3 rounded shrink-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 243, 255, 0.2)',
            }}
          >
            <h3 className="holo-modal-subtitle mb-2 sm:mb-3 text-center" style={{ color: '#00f3ff', borderBottom: '1px solid rgba(0,243,255,0.2)', paddingBottom: '4px' }}>Atributos Base</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {stats.map((stat) => (
                <div 
                  key={stat.label} 
                  className="flex flex-col items-center p-1 rounded"
                  style={{
                    backgroundColor: 'rgba(9, 21, 26, 0.8)',
                    border: '1px solid rgba(0, 243, 255, 0.2)',
                    boxShadow: 'inset 0 0 5px rgba(0,243,255,0.05)'
                  }}
                >
                  <span className="holo-modal-label mb-0.5 sm:mb-1" style={{ color: '#00f3ff' }}>{stat.label}</span>
                  <span className="text-xs sm:text-sm font-bold text-white" style={{ textShadow: '0 0 4px rgba(255,255,255,0.5)' }}>{Math.floor(stat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
