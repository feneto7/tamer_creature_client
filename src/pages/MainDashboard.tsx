import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelLayout } from '../components/layout/PixelLayout';
import { CreatureCard, Rarity } from '../components/ui/CreatureCard';
import { CreatureDetailsModal } from '../components/ui/CreatureDetailsModal';

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

export const MainDashboard = () => {
  const [creatures, setCreatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreature, setSelectedCreature] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }

    fetch(`http://localhost:3000/game/my-creatures/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.creatures) setCreatures(data.creatures);
      })
      .catch(err => console.error("Erro ao carregar criaturas:", err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const username = localStorage.getItem('username') || 'Tamer';

  const sortedCreatures = [...creatures].sort((a, b) => {
    const rarityA = RARITY_WEIGHT[a.rarity] || 0;
    const rarityB = RARITY_WEIGHT[b.rarity] || 0;
    if (rarityA !== rarityB) return rarityB - rarityA;

    const tierA = TIER_WEIGHT[a.geneticTier] || 0;
    const tierB = TIER_WEIGHT[b.geneticTier] || 0;
    return tierB - tierA;
  });

  return (
    <PixelLayout title="INÍCIO">
      <div className="space-y-6">
        <div className="bg-white/90 p-4 pixel-border">
          <h2 className="text-sm font-bold uppercase mb-4 border-b-2 border-gray-300 pb-2">Seu Esquadrão</h2>
          
          {loading ? (
            <p className="text-gray-500 animate-pulse text-center text-xs">Carregando dados da API...</p>
          ) : creatures.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 py-2">
              {sortedCreatures.map((c) => (
                <CreatureCard 
                  key={c.id}
                  name={c.name} 
                  level={c.level} 
                  rarity={c.rarity as Rarity}
                  speciesId={c.speciesId}
                  geneticTier={c.geneticTier}
                  onClick={() => setSelectedCreature(c)}
                />
              ))}
            </div>
          ) : (
            <p className="text-red-500 text-center text-xs">Nenhuma criatura encontrada.</p>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedCreature && (
        <CreatureDetailsModal 
          creature={selectedCreature} 
          onClose={() => setSelectedCreature(null)} 
        />
      )}
    </PixelLayout>
  );
};
