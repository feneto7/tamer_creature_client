import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HoloLayout } from '../components/layout/HoloLayout';
import { SelectCreatureModal } from '../components/ui/SelectCreatureModal';
import { HoloPanel } from '../components/ui/HoloPanel';
import { PortalSprite } from '../components/ui/PortalSprite';

export const DungeonLobby = () => {
  const [dungeons, setDungeons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDungeon, setSelectedDungeon] = useState<any | null>(null);
  const [tooltipDungeonId, setTooltipDungeonId] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    fetch(`http://localhost:3000/dungeons?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setDungeons(data.dungeons);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEnterDungeon = async (creatureId: string) => {
    if (!selectedDungeon || isEntering) return;
    setIsEntering(true);
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch('http://localhost:3000/dungeon/enter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, playerCreatureId: creatureId, dungeonId: selectedDungeon.id }),
      });
      const data = await response.json();
      
      if (data.success) {
        navigate(`/battle/${data.battleId}`);
      } else {
        alert(data.error);
        setIsEntering(false);
      }
    } catch (err) {
      console.error(err);
      setIsEntering(false);
    }
  };

  return (
    <HoloLayout title="MASMORRAS">
      <div className="space-y-4">
        
        <HoloPanel title="Exploração">
          {loading ? (
            <p className="text-center text-[10px] text-[#00f3ff] animate-pulse drop-shadow-[0_0_5px_#00f3ff] py-10">Carregando mapa de dados...</p>
          ) : (
            <div className="flex flex-col gap-4 p-2">
              {dungeons.map((d) => (
                <div 
                  key={d.id} 
                  onClick={() => setSelectedDungeon(d)}
                  className="p-4 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 flex flex-col gap-2 relative rounded-lg group holo-panel"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderColor: `${d.portalColor || '#00f3ff'}40`,
                    boxShadow: `inset 0 0 15px ${d.portalColor || '#00f3ff'}10, 0 0 10px rgba(0,0,0,0.5)`
                  }}
                >
                  {/* Borda superior brilhante no hover */}
                  <div className="absolute top-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" style={{ backgroundColor: d.portalColor || '#00f3ff', boxShadow: `0 0 10px ${d.portalColor || '#00f3ff'}` }} />

                  <div className="relative z-10 flex items-center gap-4">
                    {/* Portal Animado */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                      <PortalSprite color={d.portalColor || 'blue'} className="w-full h-full" />
                    </div>

                    {/* Informações da Masmorra */}
                    <div className="flex-1 flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="holo-modal-title" style={{ color: d.portalColor || '#00f3ff', textShadow: `0 0 5px ${d.portalColor || '#00f3ff'}88` }}>{d.name}</h3>
                          {d.defeatedCount >= d.minToBoss && (
                            <span className="text-[10px] animate-pulse" title="Boss está rastreando você!">💀</span>
                          )}
                        </div>
                        <span className="holo-modal-label" style={{ color: '#FFD820', textShadow: '0 0 3px #FFD820' }}>Lv Recomendado: {d.recommendedLevel}</span>
                      </div>
                      <span className="px-3 py-1.5 rounded holo-btn-danger text-[10px] sm:text-xs whitespace-nowrap shrink-0">
                        Explorar
                      </span>
                    </div>
                  </div>
                  
                  <p className="holo-modal-text relative z-10 mt-2" style={{ color: '#A0C0D0' }}>
                    {d.description}
                  </p>

                  {/* Tooltip de Habitantes */}
                  <div className="relative z-10 mt-1 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTooltipDungeonId(tooltipDungeonId === d.id ? null : d.id);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-full border border-[#00f3ff]/50 text-[#00f3ff] text-xs font-bold bg-[#00f3ff]/10 hover:bg-[#00f3ff]/30 transition-colors shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                      title="Ver Habitantes"
                    >
                      i
                    </button>
                    
                    {tooltipDungeonId === d.id && (
                      <div 
                        className="absolute bottom-10 right-0 p-3 rounded-xl z-30 flex flex-col gap-2 holo-panel shadow-[0_10px_30px_rgba(0,0,0,0.9)] border border-[#00f3ff]/50 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-[10px] uppercase font-bold text-center border-b pb-1" style={{ color: d.portalColor || '#00f3ff', borderColor: `${d.portalColor || '#00f3ff'}50` }}>Habitantes</p>
                        <div className="flex gap-2">
                          {d.encounters.map((speciesId: string) => (
                            <div 
                              key={speciesId}
                              className="w-12 h-12 flex items-center justify-center rounded bg-black/60 border border-[#00f3ff]/30"
                            >
                              <img 
                                src={`/assets/creatures/front/${speciesId}.png`} 
                                alt={speciesId}
                                className="w-10 h-10 object-contain"
                                style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 0 4px rgba(0,243,255,0.5))' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </HoloPanel>

        <button
          onClick={() => navigate('/main')}
          className="w-full py-3 rounded holo-btn text-xs"
        >
          Retornar à Base
        </button>

      </div>

      {selectedDungeon && (
        <SelectCreatureModal 
          dungeonName={selectedDungeon.name}
          onClose={() => setSelectedDungeon(null)}
          onSelect={handleEnterDungeon}
        />
      )}
    </HoloLayout>
  );
};
