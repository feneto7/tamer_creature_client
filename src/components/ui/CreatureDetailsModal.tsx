import React from 'react';
import { Rarity } from './CreatureCard';

interface CreatureDetailsModalProps {
  creature: any;
  onClose: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  [Rarity.COMMON]: 'bg-gray-400 text-white border-gray-500',
  [Rarity.RARE]: 'bg-green-500 text-white border-green-600',
  [Rarity.ULTRA_RARE]: 'bg-blue-500 text-white border-blue-600',
  [Rarity.EPIC]: 'bg-purple-500 text-white border-purple-600',
  [Rarity.LEGENDARY]: 'bg-orange-500 text-white border-orange-600',
  [Rarity.DIVINE]: 'bg-yellow-400 text-gray-900 border-yellow-500',
};

const TIER_COLORS: Record<string, string> = {
  'F': 'bg-gray-700 text-gray-300',
  'E': 'bg-gray-600 text-gray-200',
  'D': 'bg-gray-500 text-white',
  'C': 'bg-white text-gray-800 border-gray-400',
  'B': 'bg-blue-200 text-blue-900 border-blue-400',
  'A': 'bg-purple-300 text-purple-900 border-purple-500',
  'S': 'bg-purple-600 text-white',
  'SS': 'bg-orange-500 text-white',
  'SSS': 'bg-red-500 text-white',
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

const AWAKENING_DICTIONARY: Record<string, string> = {
  'bat_demon': 'Sanguessuga',
  'fire_salamander': 'Fúria Descontrolada',
  'water_serpent': 'Sanguessuga',
  'earth_golem': 'Último Suspiro',
  'wind_falcon': 'Surto Crítico',
  'spectral_wolf': 'Surto Crítico',
  'plasma_dragon': 'Fúria Descontrolada',
};

const ABILITY_LEVEL_COLORS: Record<number, string> = {
  1: 'text-gray-600',
  2: 'text-green-600',
  3: 'text-blue-600',
  4: 'text-purple-600',
  5: 'text-yellow-600',
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-200 w-full max-w-sm pixel-border flex flex-col relative animate-fade-in shadow-2xl shadow-black/50">
        
        {/* Header */}
        <div className="bg-gray-800 text-white p-2 border-b-4 border-gray-900 flex justify-between items-center">
          <span className="font-bold text-[10px] uppercase">{creature.name}</span>
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-300 font-bold px-2 py-0.5 bg-gray-900 border-2 border-gray-700 active:bg-gray-700 text-xs"
          >
            X
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Top Info (Rarity, Tier, Level) */}
          <div className="flex gap-2 text-[9px] uppercase font-bold justify-center">
            <span className={`px-2 py-1 border-2 ${RARITY_COLORS[creature.rarity] || 'bg-gray-500'}`}>
              {creature.rarity}
            </span>
            <span className={`px-2 py-1 border-2 ${TIER_COLORS[creature.geneticTier || 'C']}`}>
              Tier: {creature.geneticTier || 'C'}
            </span>
            <span className="px-2 py-1 bg-gray-800 text-yellow-400 border-2 border-gray-900">
              Lv. {creature.level}
            </span>
          </div>

          {/* Awakening */}
          <div className="bg-red-950/30 text-red-400 border-2 border-red-900 p-1 text-center font-bold text-[9px] uppercase shadow-inner shadow-black/50">
            🌟 Despertar: {AWAKENING_DICTIONARY[creature.speciesId] || 'Desconhecido'}
          </div>

          {/* Abilities */}
          <div className="bg-white border-2 border-gray-400 p-2 text-center">
            <h3 className="text-[8px] text-gray-500 uppercase font-bold mb-1 border-b-2 border-gray-200 pb-1">Habilidades Passivas</h3>
            {abilities.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-1">
                {abilities.map((ab) => {
                  const data = ABILITY_DICTIONARY[ab];
                  const name = data ? data.name : ab;
                  const lvlColor = data ? ABILITY_LEVEL_COLORS[data.level] : 'text-gray-800';
                  return (
                    <span key={ab} className={`text-[10px] font-bold ${lvlColor} uppercase`}>
                      {name} {data ? `[LV.${data.level}]` : ''}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="text-[9px] text-gray-400">Nenhuma habilidade</span>
            )}
          </div>

          {/* Stats Grid (4 columns) */}
          <div className="bg-gray-900 p-2 border-2 border-gray-700">
            <h3 className="text-[8px] text-gray-400 uppercase font-bold mb-2 text-center">Atributos Base</h3>
            <div className="grid grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center bg-gray-800 border-2 border-gray-600 p-1">
                  <span className="text-[7px] text-gray-400 font-bold uppercase">{stat.label}</span>
                  <span className="text-[10px] text-white font-bold">{Math.floor(stat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
