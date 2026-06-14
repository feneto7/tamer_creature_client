import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HoloLayout } from '../components/layout/HoloLayout';

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
          navigate('/main');
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
    <HoloLayout title="INICIAIS">
      <div className="flex flex-col gap-5 px-2 pb-10">
        
        {/* Holographic Info Box */}
        <div className="flex flex-col items-center justify-center p-4 rounded-lg text-center relative overflow-hidden holo-panel">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,243,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-pulse pointer-events-none" />
          <h2 className="holo-text text-sm mb-1">Escolha seu Parceiro</h2>
          <p className="text-[#00f3ff]/70 text-[9px] uppercase font-bold leading-relaxed max-w-[90%] z-10 relative">
            Sua jornada começa aqui. Este monstro iniciará no Nível 1 com atributos gerados de forma única.
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-[10px] font-bold text-center uppercase p-2 border border-red-500/50 bg-red-900/30 rounded shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-8 h-8 border-2 border-[#00f3ff]/30 border-t-[#00f3ff] rounded-full animate-spin" />
            <p className="holo-text text-[10px] animate-pulse">Sincronizando Banco de Dados...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {starters.map(s => (
              <div 
                key={s.id} 
                className="group relative flex items-stretch rounded-lg overflow-hidden cursor-pointer transition-all active:scale-[0.98] holo-panel"
                onClick={() => handleSelect(s.id)}
                style={{ minHeight: '110px' }}
              >
                {/* Imagem do Monstro */}
                <div 
                  className="w-28 relative flex items-center justify-center p-2"
                  style={{ background: 'radial-gradient(circle at center, rgba(0,243,255,0.15) 0%, transparent 70%)', borderRight: '1px solid rgba(0,243,255,0.2)' }}
                >
                  <img 
                    src={`/assets/creatures/front/${s.id}.png`} 
                    alt={s.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,243,255,0.5)] transform group-hover:scale-110 transition-transform duration-300"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <span className="absolute top-1 left-1 holo-text text-[8px]">Lv.1</span>
                </div>

                {/* Informações */}
                <div className="flex-1 p-3 flex flex-col justify-center relative">
                  <h3 className="holo-text text-xs mb-1 truncate pr-2">
                    {s.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[8px] font-bold text-gray-400 border border-gray-600 bg-black/40 px-1.5 py-0.5 rounded-sm uppercase">Atributos Aleatórios</span>
                    <span className="text-[8px] font-bold text-gray-400 border border-gray-600 bg-black/40 px-1.5 py-0.5 rounded-sm uppercase">Potencial Sorteado</span>
                  </div>

                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 group-hover:opacity-100 transition-opacity">
                    <span className="text-[#00f3ff] text-xl animate-pulse">»</span>
                  </div>
                </div>

                {/* Efeito Hover Glow */}
                <div className="absolute inset-0 bg-[#00f3ff]/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </div>
    </HoloLayout>
  );
};
