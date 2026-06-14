import React from 'react';
import { HoloLayout } from '../components/layout/HoloLayout';
import { AuraEffect, getAuraFilter } from '../components/ui/AuraEffect';

const auras = [
  'VAMPIRE',
  'FRENZY',
  'LAST_STAND',
  'CRITICAL_SURGE',
  'AURORA_RESONANCE',
  'DIVINE',
  'SHADOW',
  'NONE'
];

export const AuraTestPage = () => {
  return (
    <HoloLayout title="TESTE DE AURAS">
      <div className="grid grid-cols-2 gap-4 pb-10 relative z-10">
        {auras.map((aura) => (
          <div key={aura} className="holo-panel p-4 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden bg-black/60">
            <span className="text-[10px] text-[#00f3ff] mb-4 z-20 absolute top-2 tracking-widest bg-black/50 px-2 py-0.5 rounded border border-[#00f3ff]/30">{aura}</span>
            
            <div className="relative mt-6 flex justify-center items-center">
              <AuraEffect type={aura} isActive={aura !== 'NONE'} />
              <img 
                src="/assets/creatures/front/spectral_wolf.png" 
                alt="Spectral Wolf"
                className="w-16 h-16 object-contain relative z-10"
                style={{ 
                  imageRendering: 'pixelated',
                  filter: getAuraFilter(aura, aura !== 'NONE')
                }}
                onError={(e) => {
                  // Fallback visual caso falte a imagem
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjNDQiLz48L3N2Zz4=';
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </HoloLayout>
  );
};
