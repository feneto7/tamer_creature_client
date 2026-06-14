import React from 'react';

type AuraType = 'VAMPIRE' | 'FRENZY' | 'LAST_STAND' | 'CRITICAL_SURGE' | 'AURORA_RESONANCE' | 'DIVINE' | 'SHADOW' | string;

interface AuraEffectProps {
  type?: AuraType;
  isActive?: boolean;
}

// ==========================================
// 1. FILTROS E SOMBRAS (Drop Shadow no Monstro)
// ==========================================
export const getAuraFilter = (type?: string, isActive = true) => {
  if (!isActive || !type) return 'none';
  switch (type) {
    case 'VAMPIRE': return 'drop-shadow(0 0 15px rgba(220,38,38,0.8))';
    case 'FRENZY': return 'drop-shadow(0 0 15px rgba(239,68,68,0.9))';
    case 'LAST_STAND': return 'drop-shadow(0 0 15px rgba(34,197,94,0.7))';
    case 'CRITICAL_SURGE': return 'drop-shadow(0 0 15px rgba(0,243,255,0.9))';
    case 'AURORA_RESONANCE': return 'drop-shadow(0 0 10px rgba(236,72,153,0.9)) drop-shadow(0 0 20px rgba(0,243,255,0.7))';
    case 'DIVINE': return 'drop-shadow(0 0 15px rgba(253,224,71,0.9)) drop-shadow(0 0 30px rgba(255,255,255,0.8))';
    case 'SHADOW': return 'drop-shadow(0 0 15px rgba(126,34,206,0.9)) drop-shadow(0 0 5px rgba(0,0,0,0.8))';
    default: return 'drop-shadow(0 0 15px rgba(255,255,255,0.5))';
  }
};

// ==========================================
// 2. ESTILOS BASE (Glow de chão, Fogo central e Pulso)
// ==========================================
const getAuraStyles = (type: AuraType) => {
  switch (type) {
    case 'VAMPIRE':
      return {
        base: 'bg-gradient-to-r from-red-800 via-red-600 to-rose-900 opacity-60 shadow-[0_0_50px_rgba(220,38,38,0.9)]',
        core: 'bg-gradient-to-t from-red-600 via-rose-800 to-transparent opacity-60 blur-xl',
        animation: 'animate-ping opacity-75' // Batimento Cardíaco Sanguíneo (Expansão)
      };
    case 'FRENZY':
      return {
        base: 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-60 shadow-[0_0_60px_rgba(239,68,68,1)]',
        core: 'bg-gradient-to-t from-red-600 via-orange-500 to-transparent opacity-70 blur-xl',
        animation: 'animate-ping opacity-75' // Expansão aguda igual ao Critical Surge
      };
    case 'LAST_STAND':
      return {
        base: 'bg-gradient-to-r from-emerald-500 via-lime-400 to-green-600 opacity-40 shadow-[0_0_40px_rgba(34,197,94,0.7)]',
        core: 'bg-gradient-to-t from-lime-400 via-green-500 to-transparent opacity-60 blur-xl',
        animation: 'animate-ping opacity-75' // Usa a expansão aguda para envolver o sprite
      };
    case 'CRITICAL_SURGE':
      return {
        base: 'bg-[#00f3ff]/30 shadow-[0_0_50px_rgba(0,243,255,0.9)]',
        core: 'bg-blue-400/50 blur-md',
        animation: 'animate-ping opacity-75' // Impacto rápido e agudo
      };
    case 'AURORA_RESONANCE':
      return {
        base: 'bg-gradient-to-r from-[#ec4899] via-[#00f3ff] to-[#ffd700] opacity-50 shadow-[0_0_50px_rgba(236,72,153,0.6)]',
        core: 'bg-gradient-to-t from-[#00f3ff] via-[#ec4899] to-white opacity-60 blur-md',
        animation: 'animate-ping opacity-75' // Mesmo impacto do Critical Surge
      };
    case 'DIVINE':
      return {
        base: 'bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-400 opacity-60 shadow-[0_0_60px_rgba(253,224,71,0.9)]',
        core: 'bg-gradient-to-t from-yellow-300 via-white to-transparent opacity-80 blur-xl',
        animation: 'animate-ping opacity-75' // Expansão Divina Suave
      };
    case 'SHADOW':
      return {
        base: 'bg-gradient-to-r from-purple-900 via-fuchsia-800 to-black opacity-80 shadow-[0_0_60px_rgba(126,34,206,1)]',
        core: 'bg-gradient-to-t from-purple-900 via-violet-800 to-transparent opacity-90 blur-xl',
        animation: 'animate-ping opacity-75' // Expansão Agressiva de Chakra
      };
    default:
      return {
        base: 'bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.5)]',
        core: 'bg-white/20 blur-lg',
        animation: 'animate-pulse'
      };
  }
};

// ==========================================
// 3. ANIMAÇÕES CSS GLOBAIS DO COMPONENTE
// ==========================================
const AuraKeyframes = () => (
  <style>{`
    @keyframes custom-float {
      0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
      50% { transform: translateY(-20px) scale(0.8); opacity: 0; }
    }
    @keyframes custom-rise {
      0% { transform: translateY(15px) scale(0); opacity: 0; }
      30% { transform: translateY(0px) scale(1); opacity: 0.9; }
      100% { transform: translateY(-60px) scale(0.3); opacity: 0; }
    }
    @keyframes tumble-1 {
      0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); border-color: #00f3ff; box-shadow: 0 0 15px #00f3ff, inset 0 0 10px #00f3ff; }
      33% { border-color: #ec4899; box-shadow: 0 0 15px #ec4899, inset 0 0 10px #ec4899; }
      66% { border-color: #ffd700; box-shadow: 0 0 15px #ffd700, inset 0 0 10px #ffd700; }
      100% { transform: rotateX(60deg) rotateY(360deg) rotateZ(360deg); border-color: #00f3ff; box-shadow: 0 0 15px #00f3ff, inset 0 0 10px #00f3ff; }
    }
    @keyframes tumble-2 {
      0% { transform: rotateX(70deg) rotateY(45deg) rotateZ(360deg); }
      50% { transform: rotateX(30deg) rotateY(180deg) rotateZ(180deg); }
      100% { transform: rotateX(70deg) rotateY(405deg) rotateZ(0deg); }
    }
    @keyframes tumble-3 {
      0% { transform: rotateX(80deg) rotateY(-30deg) rotateZ(0deg); }
      50% { transform: rotateX(40deg) rotateY(150deg) rotateZ(-180deg); }
      100% { transform: rotateX(80deg) rotateY(330deg) rotateZ(-360deg); }
    }
    @keyframes sonar-ripple {
      0% { transform: scale(0.8); opacity: 0.8; border-width: 4px; }
      100% { transform: scale(2.5); opacity: 0; border-width: 1px; }
    }
    @keyframes frenzy-shake {
      0%, 100% { transform: scale(1) translateX(0) translateY(0); opacity: 0.8; }
      25% { transform: scale(1.05) translateX(-2px) translateY(2px); opacity: 1; }
      50% { transform: scale(0.95) translateX(2px) translateY(-2px); opacity: 0.7; }
      75% { transform: scale(1.02) translateX(-1px) translateY(-1px); opacity: 0.9; }
    }
    @keyframes rise-fast {
      0% { transform: translateY(10px) scaleY(0.5); opacity: 0; }
      20% { transform: translateY(0px) scaleY(1.5); opacity: 1; }
      100% { transform: translateY(-100px) scaleY(0.2); opacity: 0; }
    }
    @keyframes blood-drip {
      0% { transform: translateY(-60px) scale(0.5); opacity: 0; }
      40% { transform: translateY(-20px) scale(1.2); opacity: 0.9; }
      100% { transform: translateY(20px) scale(0.3); opacity: 0; }
    }

    .anim-float { animation: custom-float 3s ease-in-out infinite; }
    .anim-rise { animation: custom-rise 2s ease-in infinite; }
    .anim-tumble-1 { animation: tumble-1 4s linear infinite; }
    .anim-tumble-2 { animation: tumble-2 6s ease-in-out infinite; }
    .anim-tumble-3 { animation: tumble-3 8s ease-in-out infinite; }
    .anim-sonar { animation: sonar-ripple 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
    .anim-frenzy { animation: frenzy-shake 0.3s infinite; }
    .anim-rise-fast { animation: rise-fast 0.6s ease-in infinite; }
    .anim-blood { animation: blood-drip 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    .anim-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  `}</style>
);

// ==========================================
// 4. SUBCOMPONENTES VISUAIS
// ==========================================

const BaseSparks = ({ colorClass }: { colorClass: string }) => (
  <div className="absolute inset-0 w-full h-full pointer-events-none">
    <div className={`absolute bottom-0 left-2 w-2 h-2 rounded-full ${colorClass} anim-rise mix-blend-screen`} style={{ animationDelay: '0s', animationDuration: '2s' }} />
    <div className={`absolute bottom-2 right-4 w-3 h-3 rounded-full ${colorClass} anim-rise mix-blend-screen`} style={{ animationDelay: '0.4s', animationDuration: '2.5s' }} />
    <div className={`absolute bottom-4 left-6 w-1.5 h-1.5 rounded-full ${colorClass} anim-rise mix-blend-screen`} style={{ animationDelay: '0.8s', animationDuration: '1.8s' }} />
    <div className={`absolute bottom-0 right-8 w-2 h-2 rounded-full ${colorClass} anim-rise mix-blend-screen`} style={{ animationDelay: '1.2s', animationDuration: '2.2s' }} />
    <div className={`absolute bottom-3 left-10 w-2.5 h-2.5 rounded-full ${colorClass} anim-rise mix-blend-screen`} style={{ animationDelay: '1.6s', animationDuration: '2s' }} />
    <div className={`absolute bottom-5 right-2 w-1.5 h-1.5 rounded-full ${colorClass} anim-rise mix-blend-screen`} style={{ animationDelay: '0.5s', animationDuration: '2.8s' }} />
    <div className={`absolute -bottom-2 left-1/2 w-2 h-2 rounded-full ${colorClass} anim-rise mix-blend-screen`} style={{ animationDelay: '1.9s', animationDuration: '2.1s' }} />
  </div>
);

const AuroraExtras = () => (
  <div className="absolute inset-0 translate-y-8 w-full h-full flex items-center justify-center pointer-events-none mix-blend-screen z-10">
    {/* Aro Cósmico Principal (Giro e Troca de Cor) */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 rounded-[100%] border-2 anim-tumble-1" />
    </div>

    {/* Aro Azul (Wobble Giroscópico) */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-36 h-36 rounded-[100%] border-2 border-[#00f3ff]/60 anim-tumble-2 shadow-[0_0_15px_rgba(0,243,255,0.8),inset_0_0_10px_rgba(0,243,255,0.5)]" />
    </div>

    {/* Aro Rosa (Wobble Giroscópico Lento e Invertido) */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-44 h-44 rounded-[100%] border border-[#ec4899]/50 anim-tumble-3 shadow-[0_0_20px_rgba(236,72,153,0.6)]" />
    </div>

    {/* Enxame massivo de partículas EXTRAS brilhantes subindo da base da Aurora */}
    <div className="absolute inset-0 -translate-y-8 w-full h-full pointer-events-none">
      <div className="absolute bottom-2 left-0 w-2.5 h-2.5 bg-white rounded-full anim-rise mix-blend-screen shadow-[0_0_10px_#fff]" style={{ animationDelay: '0.1s', animationDuration: '1.5s' }} />
      <div className="absolute bottom-6 right-2 w-2 h-2 bg-[#00f3ff] rounded-full anim-rise mix-blend-screen shadow-[0_0_10px_#00f3ff]" style={{ animationDelay: '0.9s', animationDuration: '1.8s' }} />
      <div className="absolute bottom-0 left-8 w-3 h-3 bg-[#ffd700] rounded-full anim-rise mix-blend-screen shadow-[0_0_15px_#ffd700]" style={{ animationDelay: '1.3s', animationDuration: '2.4s' }} />
      <div className="absolute bottom-4 right-10 w-2 h-2 bg-[#ec4899] rounded-full anim-rise mix-blend-screen shadow-[0_0_10px_#ec4899]" style={{ animationDelay: '0.6s', animationDuration: '1.9s' }} />
      <div className="absolute bottom-8 left-4 w-1.5 h-1.5 bg-white rounded-full anim-rise mix-blend-screen shadow-[0_0_5px_#fff]" style={{ animationDelay: '1.7s', animationDuration: '1.6s' }} />
      <div className="absolute bottom-1 right-6 w-2.5 h-2.5 bg-[#00f3ff] rounded-full anim-rise mix-blend-screen shadow-[0_0_12px_#00f3ff]" style={{ animationDelay: '2.1s', animationDuration: '2.2s' }} />
      <div className="absolute bottom-5 left-12 w-2 h-2 bg-[#ffd700] rounded-full anim-rise mix-blend-screen shadow-[0_0_8px_#ffd700]" style={{ animationDelay: '0.3s', animationDuration: '2.6s' }} />
      <div className="absolute -bottom-2 right-12 w-3 h-3 bg-[#ec4899] rounded-full anim-rise mix-blend-screen shadow-[0_0_15px_#ec4899]" style={{ animationDelay: '1.1s', animationDuration: '2.1s' }} />
      <div className="absolute bottom-3 left-1/2 w-2 h-2 bg-white rounded-full anim-rise mix-blend-screen shadow-[0_0_10px_#fff]" style={{ animationDelay: '1.5s', animationDuration: '1.7s' }} />
      <div className="absolute bottom-7 right-1/2 w-1.5 h-1.5 bg-[#00f3ff] rounded-full anim-rise mix-blend-screen shadow-[0_0_8px_#00f3ff]" style={{ animationDelay: '0.8s', animationDuration: '2.3s' }} />
    </div>
  </div>
);

const LastStandExtras = () => (
  <div className="absolute inset-0 translate-y-6 w-full h-full flex items-center justify-center pointer-events-none mix-blend-screen z-10">
    {/* Bolhas Escudo de Força (Sonar Vertical Envolvendo o Sprite) */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 rounded-full border-2 border-emerald-400 bg-emerald-500/10 anim-sonar shadow-[0_0_20px_rgba(52,211,153,0.8),inset_0_0_15px_rgba(52,211,153,0.5)]" style={{ animationDelay: '0s' }} />
      <div className="absolute w-32 h-32 rounded-full border-2 border-lime-400 bg-lime-500/10 anim-sonar shadow-[0_0_20px_rgba(163,230,53,0.8),inset_0_0_15px_rgba(163,230,53,0.5)]" style={{ animationDelay: '1s' }} />
      <div className="absolute w-32 h-32 rounded-full border-2 border-green-300 bg-green-500/10 anim-sonar shadow-[0_0_20px_rgba(134,239,172,0.8),inset_0_0_15px_rgba(134,239,172,0.5)]" style={{ animationDelay: '2s' }} />
    </div>
    
    {/* Pilar Protetor */}
    <div className="absolute bottom-4 w-20 h-40 bg-gradient-to-t from-emerald-500/20 via-lime-300/10 to-transparent blur-md anim-pulse-slow rounded-[100%]" />
  </div>
);

const FrenzyExtras = () => (
  <div className="absolute inset-0 translate-y-6 w-full h-full flex items-center justify-center pointer-events-none mix-blend-screen z-10">
    {/* Super Pilar de Fúria e Calor */}
    <div className="absolute bottom-4 w-28 h-48 bg-gradient-to-t from-red-600/50 via-orange-500/30 to-transparent blur-xl anim-frenzy rounded-[100%]" />
    
    {/* Lâminas/Fagulhas de Fogo Cortantes (Rápidas) subindo */}
    <div className="absolute inset-0 -translate-y-8 w-full h-full pointer-events-none">
       <div className="absolute bottom-2 left-6 w-3 h-16 bg-red-500 rounded-full anim-rise-fast mix-blend-screen blur-[2px]" style={{ animationDelay: '0s' }} />
       <div className="absolute bottom-6 right-8 w-2 h-20 bg-orange-400 rounded-full anim-rise-fast mix-blend-screen blur-[2px]" style={{ animationDelay: '0.2s' }} />
       <div className="absolute bottom-0 left-12 w-4 h-14 bg-red-600 rounded-full anim-rise-fast mix-blend-screen blur-[3px]" style={{ animationDelay: '0.4s' }} />
       <div className="absolute bottom-4 right-12 w-3 h-16 bg-yellow-500 rounded-full anim-rise-fast mix-blend-screen blur-[2px]" style={{ animationDelay: '0.1s' }} />
       <div className="absolute bottom-1 left-20 w-2 h-12 bg-white rounded-full anim-rise-fast mix-blend-screen blur-[1px]" style={{ animationDelay: '0.5s' }} />
       <div className="absolute bottom-5 right-20 w-3 h-14 bg-orange-500 rounded-full anim-rise-fast mix-blend-screen blur-[2px]" style={{ animationDelay: '0.3s' }} />
    </div>
  </div>
);

const VampireExtras = () => (
  <div className="absolute inset-0 translate-y-6 w-full h-full flex items-center justify-center pointer-events-none mix-blend-screen z-10">
    {/* Névoa de Sangue / Escuridão (Pilar Escuro) */}
    <div className="absolute bottom-4 w-24 h-40 bg-gradient-to-t from-red-900/60 via-red-700/30 to-transparent blur-2xl anim-pulse-slow rounded-[100%]" />
    
    {/* Orbes de Sangue Sendo Absorvidos (Caem na direção do Sprite) */}
    <div className="absolute inset-0 -translate-y-8 w-full h-full pointer-events-none">
       <div className="absolute bottom-6 left-8 w-4 h-4 bg-red-600 rounded-full anim-blood blur-[1px] shadow-[0_0_15px_#dc2626]" style={{ animationDelay: '0s' }} />
       <div className="absolute bottom-10 right-6 w-3 h-3 bg-red-500 rounded-full anim-blood blur-[1px] shadow-[0_0_10px_#ef4444]" style={{ animationDelay: '1.2s', animationDuration: '3.2s' }} />
       <div className="absolute bottom-4 left-16 w-5 h-5 bg-rose-700 rounded-full anim-blood blur-[2px] shadow-[0_0_20px_#be123c]" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
       <div className="absolute bottom-8 right-16 w-3 h-3 bg-red-700 rounded-full anim-blood blur-[1px] shadow-[0_0_15px_#991b1b]" style={{ animationDelay: '2.1s', animationDuration: '3.8s' }} />
       <div className="absolute bottom-12 left-1/2 w-4 h-4 bg-red-800 rounded-full anim-blood blur-[2px] shadow-[0_0_15px_#7f1d1d]" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
       <div className="absolute bottom-2 right-12 w-2.5 h-2.5 bg-red-500 rounded-full anim-blood blur-[1px] shadow-[0_0_10px_#ef4444]" style={{ animationDelay: '0.8s', animationDuration: '2.8s' }} />
    </div>
  </div>
);

const DivineExtras = () => (
  <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none mix-blend-screen z-10">
    {/* Pilar de Luz Divina Absoluta */}
    <div className="absolute bottom-4 w-32 h-56 bg-gradient-to-t from-yellow-300/40 via-yellow-100/20 to-transparent blur-2xl anim-pulse-slow rounded-[100%]" />
    
    {/* Halo Angélico Flutuando acima da cabeça */}
    <div className="absolute bottom-20 flex items-center justify-center w-full">
      <div className="w-20 h-6 rounded-[100%] border-4 border-yellow-300 anim-float shadow-[0_0_20px_rgba(253,224,71,0.8),inset_0_0_15px_rgba(253,224,71,0.8)]" />
    </div>

    {/* Fagulhas Douradas Serenas */}
    <div className="absolute inset-0 -translate-y-4 w-full h-full pointer-events-none">
       <div className="absolute bottom-10 left-8 w-2.5 h-2.5 bg-yellow-200 rounded-full anim-rise mix-blend-screen blur-[1px] shadow-[0_0_10px_#fef08a]" style={{ animationDelay: '0s', animationDuration: '3.5s' }} />
       <div className="absolute bottom-20 right-6 w-3 h-3 bg-yellow-400 rounded-full anim-rise mix-blend-screen blur-[1px] shadow-[0_0_15px_#facc15]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
       <div className="absolute bottom-5 left-16 w-2 h-2 bg-white rounded-full anim-rise mix-blend-screen blur-[1px] shadow-[0_0_10px_#fff]" style={{ animationDelay: '2s', animationDuration: '3s' }} />
       <div className="absolute bottom-14 right-16 w-2 h-2 bg-yellow-300 rounded-full anim-rise mix-blend-screen blur-[1px] shadow-[0_0_10px_#fde047]" style={{ animationDelay: '0.5s', animationDuration: '3.8s' }} />
       <div className="absolute bottom-8 left-1/2 w-3 h-3 bg-yellow-400 rounded-full anim-rise mix-blend-screen blur-[2px] shadow-[0_0_15px_#facc15]" style={{ animationDelay: '1.5s', animationDuration: '4.2s' }} />
    </div>
  </div>
);

const ShadowExtras = () => (
  <div className="absolute inset-0 translate-y-4 w-full h-full flex items-center justify-center pointer-events-none z-10">
    {/* Pilar de Chakra Sombrio */}
    <div className="absolute bottom-4 w-28 h-48 bg-gradient-to-t from-purple-900 via-fuchsia-800 to-transparent blur-xl anim-frenzy rounded-[100%] opacity-90 mix-blend-hard-light" />
    
    {/* Tentáculos de Chakra Sombrio Rodopiantes (Lâminas Negras/Roxas) */}
    <div className="absolute inset-0 flex items-center justify-center mix-blend-hard-light">
      <div className="absolute w-40 h-20 border-b-4 border-purple-800 rounded-[100%] anim-tumble-1 blur-[1px] shadow-[0_0_15px_#6b21a8]" style={{ animationDuration: '1.2s' }} />
      <div className="absolute w-48 h-16 border-t-4 border-fuchsia-800 rounded-[100%] anim-tumble-2 blur-[2px] shadow-[0_0_10px_#86198f]" style={{ animationDuration: '1.8s' }} />
      <div className="absolute w-36 h-24 border-l-4 border-violet-900 rounded-[100%] anim-tumble-3 blur-[1px] shadow-[0_0_20px_#4c1d95]" style={{ animationDuration: '1.5s' }} />
      <div className="absolute w-44 h-28 border-r-4 border-black rounded-[100%] anim-tumble-1 blur-[2px]" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
    </div>

    {/* Fragmentos Sombrios Subindo (Marca da Maldição) */}
    <div className="absolute inset-0 -translate-y-8 w-full h-full pointer-events-none">
       {/* Square particles (Fragmentos) instead of rounded for a dark curse feel */}
       <div className="absolute bottom-6 left-6 w-2 h-2 bg-black anim-rise-fast blur-[0.5px]" style={{ animationDelay: '0s' }} />
       <div className="absolute bottom-10 right-8 w-3 h-3 bg-purple-900 anim-rise-fast blur-[1px] shadow-[0_0_10px_#6b21a8]" style={{ animationDelay: '0.2s' }} />
       <div className="absolute bottom-2 left-12 w-2.5 h-2.5 bg-black anim-rise-fast blur-[0.5px]" style={{ animationDelay: '0.4s' }} />
       <div className="absolute bottom-8 right-12 w-2 h-2 bg-fuchsia-700 anim-rise-fast blur-[1px] shadow-[0_0_10px_#a21caf]" style={{ animationDelay: '0.1s' }} />
       <div className="absolute bottom-12 left-1/2 w-3 h-3 bg-black anim-rise-fast blur-[0.5px]" style={{ animationDelay: '0.5s' }} />
       <div className="absolute bottom-4 right-6 w-2 h-2 bg-purple-800 anim-rise-fast blur-[1px] shadow-[0_0_10px_#7e22ce]" style={{ animationDelay: '0.3s' }} />
    </div>
  </div>
);

// ==========================================
// 5. COMPONENTE PRINCIPAL
// ==========================================
export const AuraEffect: React.FC<AuraEffectProps> = ({ type, isActive = true }) => {
  if (!isActive || !type || type === 'NONE') return null;

  const styles = getAuraStyles(type);

  return (
    <>
      <AuraKeyframes />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none flex items-center justify-center z-0">
        
        {/* Glow de base (Chão) */}
        <div className={`absolute bottom-0 w-24 h-8 rounded-[100%] ${styles.base} ${styles.animation}`} />
        
        {/* Pila de Fogo (Core Central) */}
        <div className={`absolute bottom-4 w-16 h-32 rounded-[100%] ${styles.core} ${styles.animation} mix-blend-screen`} />

        {/* Partículas base para todas as auras */}
        <BaseSparks colorClass={styles.base} />

        {/* Efeitos Adicionais Condicionais */}
        {type === 'AURORA_RESONANCE' && <AuroraExtras />}
        {type === 'LAST_STAND' && <LastStandExtras />}
        {type === 'FRENZY' && <FrenzyExtras />}
        {type === 'VAMPIRE' && <VampireExtras />}
        {type === 'DIVINE' && <DivineExtras />}
        {type === 'SHADOW' && <ShadowExtras />}
        
      </div>
    </>
  );
};
