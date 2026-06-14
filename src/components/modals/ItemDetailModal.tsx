import React from 'react';
import { createPortal } from 'react-dom';

const RARITY_COLORS: Record<string, string> = {
  COMMON: '#B0B0B0',
  RARE: '#2ECC71',
  EPIC: '#9B59B6',
  LEGENDARY: '#F39C12',
  MYTHIC: '#FFD700'
};

const RarityLabels: Record<string, string> = {
  COMMON: 'Comum',
  RARE: 'Raro',
  EPIC: 'Épico',
  LEGENDARY: 'Lendário',
  MYTHIC: 'Mítico'
};

interface ItemDetailModalProps {
  selectedItem: any;
  onClose: () => void;
  onEquip: () => void;
  onUnequip: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ 
  selectedItem, 
  onClose, 
  onEquip, 
  onUnequip 
}) => {
  if (!selectedItem) return null;

  const rarityColor = RARITY_COLORS[selectedItem.details.rarity] || RARITY_COLORS.COMMON;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-pixel animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-sm max-h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-[0_0_20px_rgba(0,243,255,0.2)]"
        style={{
          background: 'linear-gradient(to bottom, #0a1922, #040b0f)',
          border: `1px solid ${rarityColor}66`,
          boxShadow: `0 0 15px ${rarityColor}33, inset 0 0 20px ${rarityColor}22`
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Highlight Superior */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px]" style={{ backgroundColor: rarityColor, boxShadow: `0 0 10px ${rarityColor}, 0 0 20px ${rarityColor}` }} />
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: `radial-gradient(circle at center, ${rarityColor} 0%, transparent 70%)` }} />

        {/* Header fixo no topo */}
        <div 
          className="p-3 border-b flex justify-between items-center relative z-10 shrink-0"
          style={{ backgroundColor: `${rarityColor}11`, borderBottomColor: `${rarityColor}44` }}
        >
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest drop-shadow-md" style={{ color: rarityColor, textShadow: `0 0 5px ${rarityColor}` }}>{selectedItem.details.name}</h2>
            <div className="flex gap-2 mt-1">
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded" style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: rarityColor, border: `1px solid ${rarityColor}66` }}>
                {RarityLabels[selectedItem.details.rarity] || selectedItem.details.rarity}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded" style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: '#00f3ff', border: '1px solid rgba(0,243,255,0.4)', textShadow: '0 0 3px #00f3ff' }}>
                [{selectedItem.details.type}]
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-red-400 hover:text-red-300 hover:scale-110 transition-transform font-bold text-sm"
            style={{ textShadow: '0 0 5px rgba(239,68,68,0.8)' }}
          >
            X
          </button>
        </div>

        {/* Corpo scrollável */}
        <div className="p-4 space-y-4 relative z-10 overflow-y-auto custom-scrollbar flex-1">
          
          <div className="flex gap-4 mb-2">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: `1px solid ${rarityColor}44`,
                boxShadow: `inset 0 0 10px ${rarityColor}22`
              }}
            >
               <img 
                  src={`/assets/items/${selectedItem.details.id}.png`} 
                  alt={selectedItem.details.name}
                  className="w-12 h-12 object-contain"
                  style={{ imageRendering: 'pixelated', filter: `drop-shadow(0 0 5px ${rarityColor}88)` }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
            </div>
            <div className="flex-1 flex items-center">
              <p className="text-[11px] leading-relaxed italic" style={{ color: '#00f3ff', textShadow: '0 0 2px rgba(0,243,255,0.5)' }}>
                "{selectedItem.details.description}"
              </p>
            </div>
          </div>

          {selectedItem.details.type === 'EQUIPMENT' && selectedItem.details.effect && (
            <div 
              className="p-3 rounded"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,243,255,0.2)' }}
            >
              <p className="text-[11px] font-bold uppercase mb-2 pb-1 text-center" style={{ color: '#00f3ff', borderBottom: '1px solid rgba(0,243,255,0.2)' }}>Bônus de Equipamento</p>
              <ul className="space-y-1.5 text-[10px]">
                {Object.entries(selectedItem.details.effect).map(([key, value]) => {
                  const name = key.replace('Mult', '');
                  const val = value as number;
                  const percentage = Math.round((val - 1) * 100);
                  if (percentage === 0) return null;
                  return (
                    <li key={key} className="flex justify-between font-bold" style={{ color: percentage > 0 ? '#2ECC71' : '#E74C3C', textShadow: `0 0 4px ${percentage > 0 ? '#2ECC71' : '#E74C3C'}` }}>
                      <span className="uppercase">{name}</span>
                      <span>{percentage > 0 ? '+' : ''}{percentage}%</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {selectedItem.details.type === 'CONSUMABLE' && selectedItem.details.consumableEffect && (
            <div 
              className="p-3 rounded"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(46,204,113,0.3)' }}
            >
              <p className="text-[11px] font-bold uppercase mb-2 pb-1 text-center" style={{ color: '#2ECC71', borderBottom: '1px solid rgba(46,204,113,0.3)' }}>Efeito de Consumo</p>
              <ul className="space-y-1.5 text-[10px]">
                {selectedItem.details.consumableEffect.healPercentage && (
                  <li className="flex justify-between font-bold" style={{ color: '#2ECC71', textShadow: '0 0 4px #2ECC71' }}>
                    <span>CURA HP</span>
                    <span>{selectedItem.details.consumableEffect.healPercentage * 100}%</span>
                  </li>
                )}
                {selectedItem.details.consumableEffect.cureStatus && (
                  <li className="flex justify-between font-bold" style={{ color: '#00f3ff', textShadow: '0 0 4px #00f3ff' }}>
                    <span>CURA STATUS</span>
                    <span>{selectedItem.details.consumableEffect.cureStatus.join(', ')}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {selectedItem.details.type === 'EQUIPMENT' ? (
            selectedItem.equippedTo ? (
              <div className="flex flex-col gap-3 mt-2">
                <div 
                  className="p-2 text-center rounded"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,243,255,0.3)' }}
                >
                  <p className="text-[10px] uppercase mb-0.5" style={{ color: '#00f3ff', opacity: 0.7 }}>Equipado em</p>
                  <p className="text-xs font-bold uppercase truncate" style={{ color: '#00f3ff', textShadow: '0 0 5px #00f3ff' }}>{selectedItem.equippedCreatureName || 'Criatura'}</p>
                </div>
                <button 
                  onClick={onUnequip}
                  className="w-full py-3 rounded holo-btn-danger text-xs"
                >
                  DESEQUIPAR
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <button 
                  onClick={onEquip}
                  className="w-full py-3 rounded holo-btn text-xs"
                >
                  EQUIPAR ITEM
                </button>
              </div>
            )
          ) : (
            <div className="mt-2">
              <button 
                disabled
                className="w-full py-3 rounded holo-btn text-xs"
              >
                USÁVEL APENAS EM BATALHA
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
