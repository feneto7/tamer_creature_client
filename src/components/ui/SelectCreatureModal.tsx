import React, { useEffect, useState } from 'react';
import { CreatureCard, Rarity } from './CreatureCard';
import { X } from 'lucide-react';

const RARITY_WEIGHT: Record<string, number> = {
  DIVINE: 6,
  LEGENDARY: 5,
  EPIC: 4,
  ULTRA_RARE: 3,
  RARE: 2,
  COMMON: 1,
};

const TIER_WEIGHT: Record<string, number> = {
  SSS: 9,
  SS: 8,
  S: 7,
  A: 6,
  B: 5,
  C: 4,
  D: 3,
  E: 2,
  F: 1,
};

interface SelectCreatureModalProps {
  onClose: () => void;
  onSelect: (creatureId: string) => void;
  dungeonName: string;
}

export const SelectCreatureModal: React.FC<SelectCreatureModalProps> = ({ onClose, onSelect, dungeonName }) => {
  const [creatures, setCreatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:3000/game/my-creatures/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.creatures) setCreatures(data.creatures);
      })
      .finally(() => setLoading(false));
  }, []);

  const sortedCreatures = [...creatures].sort((a, b) => {
    const rarityA = RARITY_WEIGHT[a.rarity] || 0;
    const rarityB = RARITY_WEIGHT[b.rarity] || 0;
    if (rarityA !== rarityB) return rarityB - rarityA;

    const tierA = TIER_WEIGHT[a.geneticTier] || 0;
    const tierB = TIER_WEIGHT[b.geneticTier] || 0;
    return tierB - tierA;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-pixel">
      <div className="bg-white pixel-border w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-fade-in">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 border-b-4 border-gray-900 flex justify-between items-center">
          <h2 className="text-[10px] uppercase font-bold tracking-widest truncate flex-1">
            Entrar em {dungeonName}
          </h2>
          <button onClick={onClose} className="p-1 hover:text-red-400">
            <X size={20} />
          </button>
        </div>

        {/* Info */}
        <div className="bg-gray-800 text-white p-3 text-center text-[10px] uppercase border-b-2 border-gray-900">
          Selecione quem irá lutar.
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {loading ? (
            <p className="text-center animate-pulse text-[10px] text-gray-500">Carregando esquadrão...</p>
          ) : creatures.length === 0 ? (
            <p className="text-center text-red-500 text-[10px]">Nenhuma criatura disponível.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 py-2">
              {sortedCreatures.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`transition-all ${selectedId === c.id ? 'ring-4 ring-yellow-400 scale-105' : 'opacity-80 hover:opacity-100'}`}
                >
                  <CreatureCard
                    name={c.name}
                    level={c.level}
                    rarity={c.rarity as Rarity}
                    speciesId={c.speciesId}
                    geneticTier={c.geneticTier}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-gray-200 border-t-4 border-gray-900 flex gap-2">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-gray-600 text-white font-bold uppercase text-[10px] pixel-border active:scale-95 transition-transform"
          >
            Cancelar
          </button>
          <button 
            onClick={() => selectedId && onSelect(selectedId)}
            disabled={!selectedId}
            className={`flex-1 py-3 text-white font-bold uppercase text-[10px] pixel-border transition-transform active:scale-95 ${
              selectedId ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Entrar
          </button>
        </div>

      </div>
    </div>
  );
};
