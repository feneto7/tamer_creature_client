import React from 'react';
import { createPortal } from 'react-dom';

interface BattleItemsModalProps {
  inventory: any[];
  loadingItems: boolean;
  onClose: () => void;
  onUseItem: (inventoryItemId: string) => void;
}

export const BattleItemsModal: React.FC<BattleItemsModalProps> = ({
  inventory,
  loadingItems,
  onClose,
  onUseItem
}) => {
  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm font-pixel animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-sm max-h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-[0_0_20px_rgba(46,204,113,0.2)]"
        style={{
          background: 'linear-gradient(to bottom, #0a1914, #040f0a)',
          border: '1px solid rgba(46,204,113,0.4)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Highlight Superior */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-[#2ecc71] shadow-[0_0_10px_#2ecc71,0_0_20px_#2ecc71]" />
        
        {/* Header */}
        <div className="bg-[#2ecc71]/5 text-[#2ecc71] p-3 border-b border-[#2ecc71]/30 flex justify-between items-center relative z-10 shrink-0">
          <h2 className="holo-modal-title drop-shadow-[0_0_8px_rgba(46,204,113,0.8)]">
            Acesso à Mochila
          </h2>
          <button 
            onClick={onClose} 
            className="text-red-400 hover:text-red-300 hover:scale-110 transition-transform font-bold text-xs"
            style={{ textShadow: '0 0 5px rgba(239,68,68,0.8)' }}
          >
            X
          </button>
        </div>
        
        <div className="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-3 relative z-10">
          {loadingItems ? (
            <p className="text-center animate-pulse holo-modal-text text-[#2ecc71] py-10 drop-shadow-[0_0_5px_#2ecc71]">Abrindo compartimentos...</p>
          ) : inventory.length === 0 ? (
            <p className="text-gray-400 holo-modal-text text-center py-10">Nenhum item biológico/médico detectado.</p>
          ) : (
            inventory.map(inv => (
              <div 
                key={inv.id} 
                onClick={() => onUseItem(inv.id)}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:scale-[1.02] group"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(46,204,113,0.3)',
                  boxShadow: 'inset 0 0 10px rgba(46,204,113,0.05)',
                }}
              >
                <div 
                  className="w-10 h-10 flex items-center justify-center rounded shrink-0"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(46,204,113,0.5)',
                    boxShadow: '0 0 10px rgba(46,204,113,0.2)'
                  }}
                >
                  <img 
                    src={`/assets/items/${inv.details.id}.png`} 
                    alt={inv.details.name}
                    className="w-8 h-8 object-contain"
                    style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 0 5px rgba(46,204,113,0.5))' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="holo-modal-subtitle truncate drop-shadow-md text-left" style={{ color: '#2ecc71', textShadow: '0 0 3px #2ecc71' }}>{inv.details.name}</p>
                  <p className="holo-modal-text italic truncate mt-0.5" style={{ color: '#A0C0D0' }}>{inv.details.description}</p>
                </div>

                <div 
                  className="holo-modal-label px-2 py-1 rounded shrink-0 group-hover:bg-[#2ecc71]/20 transition-colors"
                  style={{
                    backgroundColor: 'rgba(46,204,113,0.1)',
                    border: '1px solid rgba(46,204,113,0.4)',
                    color: '#2ecc71',
                  }}
                >
                  Usar
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
