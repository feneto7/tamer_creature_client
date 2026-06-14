import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CreatureCard, Rarity } from './CreatureCard';

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

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm font-pixel animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-[0_0_20px_rgba(0,243,255,0.2)]"
        style={{
          background: 'linear-gradient(to bottom, #0a1922, #040b0f)',
          border: '1px solid rgba(0, 243, 255, 0.4)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Highlight Superior */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-[#00f3ff] shadow-[0_0_10px_#00f3ff,0_0_20px_#00f3ff]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00f3ff]/5 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="bg-[#00f3ff]/5 text-[#00f3ff] p-3 border-b border-[#00f3ff]/30 flex justify-between items-center relative z-10 shrink-0">
          <h2 className="holo-modal-title truncate flex-1 drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">
            Entrar em {dungeonName}
          </h2>
          <button 
            onClick={onClose} 
            className="text-red-400 hover:text-red-300 hover:scale-110 transition-transform font-bold text-xs px-2"
            style={{ textShadow: '0 0 5px rgba(239,68,68,0.8)' }}
          >
            X
          </button>
        </div>

        {/* Info */}
        <div className="bg-[#00f3ff]/10 text-[#00f3ff] p-2 holo-modal-subtitle border-b border-[#00f3ff]/20 relative z-10 shrink-0" style={{ textShadow: '0 0 5px rgba(0,243,255,0.5)' }}>
          Selecione quem irá lutar.
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative z-10">
          {loading ? (
            <p className="text-center animate-pulse holo-modal-text text-[#00f3ff] drop-shadow-[0_0_5px_#00f3ff] py-10">Conectando ao esquadrão...</p>
          ) : creatures.length === 0 ? (
            <p className="text-center text-red-500 holo-modal-text py-10 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">Nenhuma criatura disponível.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 py-2">
              {sortedCreatures.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`transition-all cursor-pointer rounded-lg ${selectedId === c.id ? 'scale-105 shadow-[0_0_20px_#00f3ff]' : 'opacity-80 hover:opacity-100 hover:scale-105'}`}
                  style={{
                    boxShadow: selectedId === c.id ? '0 0 20px #00f3ff, inset 0 0 10px rgba(0,243,255,0.5)' : 'none',
                    border: selectedId === c.id ? '2px solid #00f3ff' : '2px solid transparent'
                  }}
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
        <div className="p-3 border-t border-[#00f3ff]/30 flex gap-3 relative z-10 shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded holo-btn opacity-60 text-xs"
          >
            Cancelar
          </button>
          <button 
            onClick={() => selectedId && onSelect(selectedId)}
            disabled={!selectedId}
            className="flex-1 py-3 rounded holo-btn-danger text-xs disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          >
            Entrar na Masmorra
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
