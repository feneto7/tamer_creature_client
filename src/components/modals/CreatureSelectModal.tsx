import React from 'react';
import { createPortal } from 'react-dom';

const RARITY_COLORS: Record<string, string> = {
  COMMON: '#B0B0B0',
  RARE: '#2ECC71',
  ULTRA_RARE: '#00f3ff',
  EPIC: '#9B59B6',
  LEGENDARY: '#F39C12',
  DIVINE: '#FFD700',
  MYTHIC: '#FFD700'
};

interface CreatureSelectModalProps {
  creatures: any[];
  loading: boolean;
  onClose: () => void;
  onSelect: (creatureId: string) => void;
}

export const CreatureSelectModal: React.FC<CreatureSelectModalProps> = ({
  creatures,
  loading,
  onClose,
  onSelect
}) => {
  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-pixel animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-sm max-h-[90vh] sm:max-h-[80vh] rounded-xl overflow-hidden flex flex-col shadow-[0_0_20px_rgba(0,243,255,0.2)]"
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
        <div className="bg-[#00f3ff]/5 text-[#00f3ff] p-3 border-b border-[#00f3ff]/30 flex justify-between items-center relative z-10 shrink-0">
          <h2 className="text-[10px] font-bold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">Escolha a Criatura</h2>
          <button 
            onClick={onClose} 
            className="text-red-400 hover:text-red-300 hover:scale-110 transition-transform font-bold text-xs"
            style={{ textShadow: '0 0 5px rgba(239,68,68,0.8)' }}
          >
            X
          </button>
        </div>
        
        {/* Corpo scrollável */}
        <div className="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-3 relative z-10">
          {loading ? (
            <p className="text-[#00f3ff] animate-pulse text-[10px] text-center py-10 drop-shadow-[0_0_5px_#00f3ff]">Acessando dados...</p>
          ) : creatures.length === 0 ? (
            <p className="text-gray-400 text-[10px] text-center py-10">Nenhuma criatura disponível no momento.</p>
          ) : (
            creatures.map(c => {
              const rarityColor = RARITY_COLORS[c.rarity] || RARITY_COLORS.COMMON;
              return (
                <div 
                  key={c.id} 
                  onClick={() => onSelect(c.id)}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    border: `1px solid ${rarityColor}44`,
                    boxShadow: `inset 0 0 10px ${rarityColor}11`,
                  }}
                >
                  {/* Foto da criatura */}
                  <div 
                    className="w-12 h-12 flex items-center justify-center rounded shrink-0"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      border: `1px solid ${rarityColor}`,
                      boxShadow: `0 0 10px ${rarityColor}33`
                    }}
                  >
                    <img 
                      src={`/assets/creatures/front/${c.speciesId}.png`} 
                      alt={c.name}
                      className="max-w-full max-h-full object-contain"
                      style={{ imageRendering: 'pixelated', filter: `drop-shadow(0 0 5px ${rarityColor}88)` }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>

                  {/* Detalhes */}
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase drop-shadow-md" style={{ color: rarityColor, textShadow: `0 0 3px ${rarityColor}` }}>{c.name}</p>
                    <div className="flex gap-2 items-center mt-1">
                      <p className="text-[#FFD820] text-[8px] font-bold" style={{ textShadow: '0 0 4px #FFD820' }}>Lv. {c.level}</p>
                      <span 
                        className="text-[7px] px-1.5 py-0.5 rounded font-bold uppercase"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: '#00f3ff',
                          border: '1px solid rgba(0,243,255,0.4)'
                        }}
                      >
                        Tier {c.geneticTier}
                      </span>
                    </div>
                  </div>

                  {/* Botão de Ação Visual */}
                  <div 
                    className="text-[8px] uppercase font-bold px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'rgba(0,243,255,0.1)',
                      border: '1px solid rgba(0,243,255,0.3)',
                      color: '#00f3ff',
                    }}
                  >
                    Equipar
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
