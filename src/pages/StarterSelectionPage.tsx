import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelLayout } from '../components/layout/PixelLayout';
import { CreatureCard, Rarity } from '../components/ui/CreatureCard';

export const StarterSelectionPage = () => {
  const [starters, setStarters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/game/starters')
      .then(res => res.json())
      .then(data => {
        if (data.starters) setStarters(data.starters);
      })
      .catch(err => setError("Erro ao carregar iniciais"))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (speciesId: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return navigate('/');

    if (!window.confirm('Tem certeza que quer este monstro como seu inicial?')) return;

    try {
      const res = await fetch('http://localhost:3000/game/choose-starter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, speciesId })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'Você já escolheu seu inicial.') {
          navigate('/main'); // Já tem, apenas vai pro jogo
          return;
        }
        throw new Error(data.error || 'Erro na escolha');
      }

      navigate('/main');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PixelLayout title="Escolha seu Inicial">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-center font-bold text-gray-700 bg-yellow-200 p-2 pixel-border">
          Escolha com sabedoria! Ele começará no Nível 1 com atributos únicos gerados aleatoriamente baseados na espécie.
        </p>

        {error && <p className="text-red-500 text-xs font-bold text-center p-2 bg-red-100">{error}</p>}

        {loading ? (
          <p className="text-center animate-pulse">Carregando criaturas...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-8">
            {starters.map(s => (
              <div key={s.id} className="relative group">
                <CreatureCard 
                  name={s.name}
                  level={1}
                  speciesId={s.id}
                  rarity={Rarity.COMMON}
                  onClick={() => handleSelect(s.id)}
                />
                <button 
                  onClick={() => handleSelect(s.id)}
                  className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-xs font-bold uppercase p-2 text-center"
                >
                  Escolher {s.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PixelLayout>
  );
};
