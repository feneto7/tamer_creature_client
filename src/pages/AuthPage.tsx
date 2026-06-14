import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HoloLayout } from '../components/layout/HoloLayout';

export const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    
    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Erro de conexão');
      
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      
      // Verifica se o jogador já escolheu o inicial
      if (data.hasStarter) {
        navigate('/main');
      } else {
        navigate('/starter');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HoloLayout title="Entrar">
      <div className="flex flex-col justify-center min-h-[80vh] px-4 max-w-sm mx-auto z-10 relative">
        <div className="flex flex-col gap-6 p-6 rounded-lg holo-panel">
          <div className="text-center">
            <h2 className="text-xl holo-text mb-2">Bem-vindo</h2>
            <p className="text-[10px] uppercase font-bold text-[#00f3ff] opacity-60">O mundo dos monstros aguarda!</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[9px] uppercase font-bold text-[#00f3ff] mb-1.5 drop-shadow-[0_0_2px_#00f3ff] opacity-80">Usuário</label>
              <input 
                className="w-full bg-black/60 border border-[#00f3ff]/30 rounded p-3 outline-none focus:border-[#00f3ff] transition-all text-white font-bold placeholder:text-gray-600 text-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]"
                placeholder="Insira seu usuário"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-[#00f3ff] mb-1.5 drop-shadow-[0_0_2px_#00f3ff] opacity-80">Senha</label>
              <input 
                type="password"
                className="w-full bg-black/60 border border-[#00f3ff]/30 rounded p-3 outline-none focus:border-[#00f3ff] transition-all text-white font-bold placeholder:text-gray-600 text-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]"
                placeholder="••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-[9px] font-bold text-center uppercase p-2 rounded bg-red-900/30 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-2 p-3 rounded holo-btn"
            >
              {loading ? 'AGUARDE...' : (isRegistering ? 'CRIAR CONTA' : 'INICIAR SESSÃO')}
            </button>
          </form>

          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[9px] uppercase font-bold text-gray-400 mt-2 hover:text-[#00f3ff] transition-colors"
          >
            {isRegistering ? 'JÁ TENHO UMA CONTA' : 'CRIAR UMA NOVA CONTA'}
          </button>
        </div>
      </div>
    </HoloLayout>
  );
};
