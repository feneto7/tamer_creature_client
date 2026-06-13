import React, { useEffect, useState } from 'react';
import { PixelLayout } from '../components/layout/PixelLayout';
import { X } from 'lucide-react';

// Baseado nas raridades definidas no backend: COMMON, RARE, EPIC, LEGENDARY, MYTHIC
const RarityColors: Record<string, string> = {
  COMMON: 'bg-gray-400 border-gray-600 text-gray-800',
  RARE: 'bg-green-500 border-green-700 text-green-100',
  EPIC: 'bg-purple-500 border-purple-700 text-purple-100',
  LEGENDARY: 'bg-orange-500 border-orange-700 text-orange-100',
  MYTHIC: 'bg-yellow-400 border-yellow-600 text-yellow-900 shadow-[0_0_15px_rgba(255,215,0,0.6)]'
};

const RarityLabels: Record<string, string> = {
  COMMON: 'Comum',
  RARE: 'Raro',
  EPIC: 'Épico',
  LEGENDARY: 'Lendário',
  MYTHIC: 'Mítico'
};

export const InventoryScreen = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    fetch(`http://localhost:3000/game/inventory/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setItems(data.inventory);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEquip = () => {
    alert("O sistema de Equipar Itens estará disponível na próxima atualização! Por enquanto guarde-os com segurança.");
  };

  // Preenchemos com slots vazios para dar a cara de RPG
  const totalSlots = 70; // 10x7 grid
  const slots = Array.from({ length: totalSlots }).map((_, i) => items[i] || null);

  return (
    <PixelLayout title="INVENTÁRIO">
      <div className="space-y-4">
        
        <div className="bg-gray-800 text-white p-3 pixel-border flex items-center justify-between shadow-md">
          <div>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-yellow-400">Sua Mochila</h2>
            <p className="text-[9px] text-gray-400 uppercase mt-0.5">Capacidade: {items.length} / {totalSlots}</p>
          </div>
        </div>

        <div className="bg-gray-700 pixel-border p-3 min-h-[50vh] shadow-inner">
          {loading ? (
            <p className="text-gray-400 animate-pulse text-center text-[10px]">Abrindo mochila...</p>
          ) : (
            <div className="grid grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-1">
              {slots.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => item && setSelectedItem(item)}
                  className={`aspect-square bg-gray-300 border-[3px] flex items-center justify-center relative ${
                    item 
                      ? 'border-gray-500 cursor-pointer hover:bg-gray-200 active:translate-y-1 transition-transform shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.2)]' 
                      : 'border-gray-600 opacity-30 shadow-[inset_0_3px_0_0_rgba(0,0,0,0.2)]'
                  } ${selectedItem?.id === item?.id ? 'ring-4 ring-yellow-400 z-10' : ''}`}
                >
                  {item && (
                    <img 
                      src={`/assets/items/${item.details.id}.png`} 
                      alt={item.details.name}
                      className="w-3/4 h-3/4 object-contain drop-shadow-md"
                      style={{ imageRendering: 'pixelated' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Item Tooltip / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-pixel animate-fade-in" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-white pixel-border w-full max-w-sm flex flex-col relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-3 border-b-4 flex justify-between items-center ${RarityColors[selectedItem.details.rarity] || RarityColors.COMMON}`}>
              <div>
                <h2 className="text-[12px] font-bold uppercase tracking-widest">{selectedItem.details.name}</h2>
                <p className="text-[8px] font-bold uppercase opacity-90">{RarityLabels[selectedItem.details.rarity] || selectedItem.details.rarity}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-1 hover:opacity-70 active:scale-95">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 bg-gray-100">
              
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-300 border-[3px] border-gray-500 flex items-center justify-center shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.2)]">
                   <img 
                      src={`/assets/items/${selectedItem.details.id}.png`} 
                      alt={selectedItem.details.name}
                      className="w-12 h-12 object-contain drop-shadow-md"
                      style={{ imageRendering: 'pixelated' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] text-gray-700 leading-relaxed italic">"{selectedItem.details.description}"</p>
                </div>
              </div>

              {/* Status/Efeitos */}
              <div className="bg-gray-800 text-white p-3 border-[3px] border-gray-900 mb-4 shadow-inner">
                <p className="text-[9px] font-bold uppercase text-yellow-400 mb-2 border-b-2 border-gray-700 pb-1">Efeitos Equipados</p>
                <ul className="space-y-1.5 text-[9px]">
                  {Object.entries(selectedItem.details.effect).map(([key, value]) => {
                    const name = key.replace('Mult', '');
                    const val = value as number;
                    const percentage = Math.round((val - 1) * 100);
                    if (percentage === 0) return null;
                    return (
                      <li key={key} className={`flex justify-between font-bold ${percentage > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <span className="uppercase">{name}</span>
                        <span>{percentage > 0 ? '+' : ''}{percentage}%</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Footer Actions */}
              <button 
                onClick={handleEquip}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-[10px] pixel-border active:scale-95 transition-all shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.3)] active:shadow-none"
              >
                EQUIPAR ITEM
              </button>

            </div>
          </div>
        </div>
      )}

    </PixelLayout>
  );
};
