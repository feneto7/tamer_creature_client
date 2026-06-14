import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatedCoin } from '../ui/AnimatedCoin';

interface HoloLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const HoloLayout: React.FC<HoloLayoutProps> = ({ children, title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:3000/auth/me/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCoins(data.user.coins);
          }
        })
        .catch(console.error);
    }
  }, [location.pathname]); // Atualiza quando mudar de rota

  // Não mostrar menu de hambúrguer na tela de Login e Escolha de Inicial
  const isAuthOrStarter = location.pathname === '/' || location.pathname === '/starter';
  const username = localStorage.getItem('username') || '';

  return (
    <div className="h-[100dvh] w-full bg-[#020a0f] flex flex-col relative overflow-hidden">
        {/* Fundo com leve padrão/ruído para a temática Holo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00f3ff_0%,_transparent_100%)] opacity-[0.02] pointer-events-none" />
        
        {/* Header */}
        <header className="bg-[#040b0f] text-[#00f3ff] p-4 border-b border-[#00f3ff]/30 flex items-center justify-between z-50 relative shadow-[0_4px_15px_rgba(0,243,255,0.1)]">
          {!isAuthOrStarter ? (
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 hover:text-white transition-colors drop-shadow-[0_0_5px_#00f3ff]">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          ) : (
            <div className="w-8"></div> // Spacer
          )}
          <h1 className="text-xl tracking-[0.2em] flex-1 text-center truncate px-2 holo-text">{title}</h1>
          
          {/* Espaço ou Exibição de Moedas */}
          {!isAuthOrStarter && coins !== null ? (
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-[10px] uppercase tracking-wide hidden sm:block">{username}</span>
              <div className="flex items-center gap-2 bg-[#09151A] px-3 py-1 border border-[#00f3ff]/40 shadow-[0_0_10px_rgba(0,243,255,0.2)] rounded-md">
                <AnimatedCoin className="w-5 h-5" />
                <span className="font-bold text-[#FFD820] text-sm tracking-widest drop-shadow-[0_0_5px_#FFD820]">{coins}</span>
              </div>
            </div>
          ) : (
            <div className="w-8"></div>
          )}
        </header>

        {/* Sidebar Menu (Overlay) */}
        {menuOpen && !isAuthOrStarter && (
          <div className="absolute inset-0 z-40 bg-black/80 flex pt-[64px] backdrop-blur-sm">
            <nav className="w-3/4 md:w-64 h-full flex flex-col gap-2 md:gap-4 p-3 md:p-4 overflow-y-auto custom-scrollbar holo-panel !border-0 !border-r !border-[#00f3ff]/20">
              <button onClick={() => { navigate('/main'); setMenuOpen(false); }} className="text-left p-2 md:p-3 rounded-md holo-btn">Início</button>
              <button onClick={() => { navigate('/main'); setMenuOpen(false); }} className="text-left p-2 md:p-3 rounded-md holo-btn">Treinamento</button>
              <button onClick={() => { navigate('/inventory'); setMenuOpen(false); }} className="text-left p-2 md:p-3 rounded-md holo-btn">Inventário</button>
              <button onClick={() => { navigate('/dungeon'); setMenuOpen(false); }} className="text-left p-2 md:p-3 rounded-md holo-btn">Masmorras</button>
              
              <div className="mt-auto pt-3 border-t border-[#00f3ff]/20">
                <button 
                  onClick={() => { localStorage.removeItem('userId'); navigate('/'); setMenuOpen(false); }} 
                  className="w-full text-left p-2 md:p-3 rounded-md holo-btn-danger"
                >
                  Desconectar
                </button>
              </div>
            </nav>
            <div className="flex-1" onClick={() => setMenuOpen(false)}></div>
          </div>
        )}
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-transparent z-10 relative">
          {children}
        </main>
    </div>
  );
};
