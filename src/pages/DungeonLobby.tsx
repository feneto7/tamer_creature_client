import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelLayout } from '../components/layout/PixelLayout';
import { SelectCreatureModal } from '../components/ui/SelectCreatureModal';

export const DungeonLobby = () => {
  const [dungeons, setDungeons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDungeon, setSelectedDungeon] = useState<any | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/dungeons')
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
    <PixelLayout title="MASMORRAS">
      <div className="space-y-4">
        <div className="bg-gray-800 text-white p-3 pixel-border text-center">
          <p className="text-xs uppercase leading-relaxed">
            Selecione uma masmorra para explorar.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-xs animate-pulse">Carregando mapa...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {dungeons.map((d) => (
              <div 
                key={d.id} 
                onClick={() => setSelectedDungeon(d)}
                className="bg-white p-3 pixel-border cursor-pointer transition-transform hover:-translate-y-1 active:scale-95 flex flex-col gap-2 relative overflow-hidden"
              >
                {/* Imagem de Fundo (se existir) borrada levemente para texto aparecer melhor */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
                  style={{ backgroundImage: `url('/assets/dungeons/${d.id}.png')`, imageRendering: 'pixelated' }}
                />
                
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold uppercase">{d.name}</h3>
                    <span className="text-[10px] text-gray-500 font-bold">{d.recommendedLevel}</span>
                  </div>
                  <span className="px-2 py-1 bg-red-600 text-white text-[8px] uppercase pixel-border">
                    Explorar
                  </span>
                </div>
                
                <p className="text-[9px] text-gray-700 relative z-10 leading-snug">
                  {d.description}
                </p>

                <div className="relative z-10 mt-2 border-t-2 border-dashed border-gray-300 pt-2">
                  <p className="text-[8px] uppercase text-gray-500 mb-1">Habitantes Locais:</p>
                  <div className="flex gap-2">
                    {d.encounters.map((speciesId: string) => (
                      <img 
                        key={speciesId}
                        src={`/assets/creatures/front/${speciesId}.png`} 
                        alt={speciesId}
                        className="w-8 h-8 object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/main')}
          className="w-full py-2 bg-gray-600 text-white font-bold uppercase pixel-border hover:bg-gray-500 mt-4"
        >
          Voltar para o Início
        </button>

      </div>

      {selectedDungeon && (
        <SelectCreatureModal 
          dungeonName={selectedDungeon.name}
          onClose={() => setSelectedDungeon(null)}
          onSelect={handleEnterDungeon}
        />
      )}
    </PixelLayout>
  );
};
