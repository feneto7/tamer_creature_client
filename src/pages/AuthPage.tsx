import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelLayout } from '../components/layout/PixelLayout';

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
    <PixelLayout title="Entrar">
      <div className="flex flex-col gap-6 p-2 pt-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Bem-vindo</h2>
          <p className="text-xs text-gray-600">O mundo dos monstros aguarda!</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Usuário</label>
            <input 
              className="w-full pixel-border bg-white p-3 outline-none focus:ring-2 focus:ring-primary font-sans"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Senha</label>
            <input 
              type="password"
              className="w-full pixel-border bg-white p-3 outline-none focus:ring-2 focus:ring-primary font-sans"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center bg-red-100 p-2">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white p-4 font-bold uppercase pixel-border hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Aguarde...' : (isRegistering ? 'Criar Conta' : 'Fazer Login')}
          </button>
        </form>

        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-xs text-gray-500 underline uppercase mt-4 hover:text-primary"
        >
          {isRegistering ? 'Já tenho uma conta' : 'Quero me registrar'}
        </button>
      </div>
    </PixelLayout>
  );
};
