import { useEffect, useState } from 'react';
import { HoloLayout } from '../components/layout/HoloLayout';
import { ItemDetailModal } from '../components/modals/ItemDetailModal';
import { CreatureSelectModal } from '../components/modals/CreatureSelectModal';
import { HoloPanel } from '../components/ui/HoloPanel';

export const InventoryScreen = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const [showCreatureSelect, setShowCreatureSelect] = useState(false);
  const [creatures, setCreatures] = useState<any[]>([]);
  const [loadingCreatures, setLoadingCreatures] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:3000/game/inventory/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setItems(data.inventory);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const openEquipModal = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    setLoadingCreatures(true);
    setShowCreatureSelect(true);
    
    fetch(`http://localhost:3000/game/my-creatures/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCreatures(data.creatures);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingCreatures(false));
  };

  const handleEquip = (creatureId: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId || !selectedItem) return;

    fetch('http://localhost:3000/game/inventory/equip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        inventoryItemId: selectedItem.id,
        creatureId
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        setShowCreatureSelect(false);
        setSelectedItem(null);
        fetchInventory(); // Atualiza a lista para refletir equipados
      } else {
        alert(data.error);
      }
    })
    .catch(console.error);
  };

  const handleUnequip = () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !selectedItem || !selectedItem.equippedTo) return;

    fetch('http://localhost:3000/game/inventory/unequip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        creatureId: selectedItem.equippedTo
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        setSelectedItem(null);
        fetchInventory();
      } else {
        alert(data.error);
      }
    })
    .catch(console.error);
  };

  const totalSlots = 70;
  const slots = Array.from({ length: totalSlots }).map((_, i) => items[i] || null);

  return (
    <HoloLayout title="INVENTÁRIO">
      <div className="space-y-4">
        
        <HoloPanel title={`Sua Mochila (${items.length} / ${totalSlots})`} className="min-h-[60vh] flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <p className="holo-text animate-pulse text-center text-[10px]">Abrindo mochila...</p>
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-2 p-2">
              {slots.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    if (item) {
                      setSelectedItem(item);
                      setShowCreatureSelect(false);
                    }
                  }}
                  className={`aspect-square flex items-center justify-center relative rounded-md transition-all bg-black/40 ${
                    item 
                      ? 'cursor-pointer border border-[#00f3ff]/30 hover:bg-[#00f3ff]/10 hover:scale-105 shadow-[inset_0_0_10px_rgba(0,243,255,0.1)]' 
                      : 'border border-white/5 opacity-30 shadow-[inset_0_0_5px_rgba(255,255,255,0.05)]'
                  } ${selectedItem?.id === item?.id ? 'ring-1 ring-[#00f3ff] ring-offset-1 ring-offset-[#040b0f] z-10 shadow-[0_0_15px_#00f3ff]' : ''}`}
                >
                  {item && (
                    <>
                      <img 
                        src={`/assets/items/${item.details.id}.png`} 
                        alt={item.details.name}
                        className="w-3/4 h-3/4 object-contain drop-shadow-[0_0_5px_rgba(0,243,255,0.4)]"
                        style={{ imageRendering: 'pixelated' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      {item.equippedTo && (
                        <div className="absolute -top-1 -right-1 bg-[#2ECC71] w-2 h-2 rounded-full border border-black shadow-[0_0_5px_#2ECC71]" title="Equipado" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </HoloPanel>

      </div>

      {!showCreatureSelect && (
        <ItemDetailModal 
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(null)}
          onEquip={openEquipModal}
          onUnequip={handleUnequip}
        />
      )}

      {showCreatureSelect && (
        <CreatureSelectModal 
          creatures={creatures}
          loading={loadingCreatures}
          onClose={() => setShowCreatureSelect(false)}
          onSelect={handleEquip}
        />
      )}

    </HoloLayout>
  );
};
