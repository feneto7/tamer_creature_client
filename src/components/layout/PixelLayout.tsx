import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface PixelLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const PixelLayout: React.FC<PixelLayoutProps> = ({ children, title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState<number | null>(null);
  const [coinFrame, setCoinFrame] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  // Animação da Moeda
  useEffect(() => {
    const interval = setInterval(() => {
      setCoinFrame(prev => prev >= 10 ? 1 : prev + 1);
    }, 100); // 100ms por frame
    return () => clearInterval(interval);
  }, []);

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
    <div className="h-[100dvh] w-full bg-gray-100 flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="bg-primary text-white p-4 border-b-4 border-gray-900 flex items-center justify-between z-50 relative shadow-md">
          {!isAuthOrStarter ? (
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 hover:text-yellow-300 transition-colors">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          ) : (
            <div className="w-8"></div> // Spacer
          )}
          <h1 className="text-xl uppercase tracking-wider flex-1 text-center truncate px-2">{title}</h1>
          
          {/* Espaço ou Exibição de Moedas */}
          {!isAuthOrStarter && coins !== null ? (
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-[10px] uppercase tracking-wide hidden sm:block">{username}</span>
              <div className="flex items-center gap-2 bg-blue-700 px-3 py-1 border-[3px] border-blue-900 shadow-inner">
                <img src={`/assets/ui/spinning_coin/coin${coinFrame}.png`} alt="Moedas" className="w-5 h-5 object-contain drop-shadow" style={{ imageRendering: 'pixelated' }} />
                <span className="font-bold text-yellow-300 text-sm tracking-widest">{coins}</span>
              </div>
            </div>
          ) : (
            <div className="w-8"></div>
          )}
        </header>

        {/* Sidebar Menu (Overlay) */}
        {menuOpen && !isAuthOrStarter && (
          <div className="absolute inset-0 z-40 bg-black/60 flex pt-[64px]">
            <nav className="w-3/4 bg-gray-800 text-white p-4 border-r-4 border-gray-900 h-full flex flex-col gap-4 shadow-xl">
              <button onClick={() => { navigate('/main'); setMenuOpen(false); }} className="text-left uppercase hover:text-primary transition-colors pixel-border bg-gray-700 p-3">Início</button>
              <button onClick={() => { navigate('/main'); setMenuOpen(false); }} className="text-left uppercase hover:text-primary transition-colors pixel-border bg-gray-700 p-3">Treinamento</button>
              <button onClick={() => { navigate('/inventory'); setMenuOpen(false); }} className="text-left uppercase hover:text-primary transition-colors pixel-border bg-gray-700 p-3">Inventário</button>
              <button onClick={() => { navigate('/dungeon'); setMenuOpen(false); }} className="text-left uppercase hover:text-primary transition-colors pixel-border bg-gray-700 p-3">Masmorras</button>
              
              <div className="mt-auto pt-4 border-t-2 border-gray-700">
                <button 
                  onClick={() => { localStorage.removeItem('userId'); navigate('/'); setMenuOpen(false); }} 
                  className="w-full text-left uppercase text-red-400 hover:text-white hover:bg-red-500 transition-colors pixel-border bg-gray-700 p-3"
                >
                  Desconectar
                </button>
              </div>
            </nav>
            <div className="flex-1" onClick={() => setMenuOpen(false)}></div>
          </div>
        )}
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-200">
          {children}
        </main>
    </div>
  );
};
