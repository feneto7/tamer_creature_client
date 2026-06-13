import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MoveDictionary: Record<string, string> = {
  'basic_attack': 'Ataque Básico',
  'quick_strike': 'Golpe Rápido',
  'demon_blast': 'Rajada Demoníaca',
  'plasma_breath': 'Sopro de Plasma'
};

export const BattleScreen = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();

  const [battleData, setBattleData] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>(['Batalha iniciada!']);
  const [loading, setLoading] = useState(true);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/dungeon/battle/${battleId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBattleData(data);
        } else {
          alert('Erro ao carregar batalha.');
          navigate('/dungeon');
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [battleId, navigate]);

  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, isLogOpen]);

  const handleTurn = async (moveId: string) => {
    if (isProcessingTurn) return;
    setIsProcessingTurn(true);

    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch('http://localhost:3000/dungeon/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, battleId, moveId }),
      });
      const data = await response.json();
      
      if (data.success) {
        setLogs(prev => [...prev, ...data.logs, '-----------------']);
        setBattleData((prev: any) => ({
          ...prev,
          battle: {
            ...prev.battle,
            playerCurrentHp: data.playerCurrentHp,
            enemyCurrentHp: data.enemyCurrentHp,
            status: data.status
          }
        }));

        if (data.status === 'DEFEAT') {
          setTimeout(() => navigate('/main'), 3000);
        }
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingTurn(false);
    }
  };

  const handleCapture = async () => {
    if (isProcessingTurn) return;
    setIsProcessingTurn(true);
    
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch('http://localhost:3000/dungeon/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, battleId }),
      });
      const data = await response.json();
      
      setLogs(prev => [...prev, data.message]);
      
      if (data.success) {
        setBattleData((prev: any) => ({
          ...prev,
          battle: { ...prev.battle, status: 'CAPTURED', lockedAction: 'CAPTURE' }
        }));
        setTimeout(() => navigate('/main'), 3000);
      } else {
        setBattleData((prev: any) => ({
          ...prev,
          battle: { ...prev.battle, status: data.status, captureAttempts: data.remainingAttempts, lockedAction: 'CAPTURE' }
        }));
        if (data.status === 'ESCAPED') {
          setTimeout(() => navigate('/main'), 3000);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingTurn(false);
    }
  };

  const handleExtract = async () => {
    if (isProcessingTurn) return;
    setIsProcessingTurn(true);
    
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch('http://localhost:3000/dungeon/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, battleId }),
      });
      const data = await response.json();
      
      setLogs(prev => [...prev, data.message]);
      
      if (data.success) {
        setBattleData((prev: any) => ({
          ...prev,
          battle: { ...prev.battle, status: 'EXTRACTED', lockedAction: 'EXTRACT', extractedItemId: data.item?.itemId, extractedItemName: data.itemName }
        }));
        setTimeout(() => navigate('/main'), 4000);
      } else {
        setBattleData((prev: any) => ({
          ...prev,
          battle: { ...prev.battle, status: data.status, captureAttempts: data.remainingAttempts, lockedAction: 'EXTRACT' }
        }));
        if (data.status === 'EXTRACT_FAILED') {
          setTimeout(() => navigate('/main'), 3000);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingTurn(false);
    }
  };

  if (loading || !battleData) {
    return <div className="h-[100dvh] bg-black flex items-center justify-center text-white font-pixel">Carregando Batalha...</div>;
  }

  const { battle, player, enemy } = battleData;
  let playerSkills: string[] = [];
  try {
    playerSkills = JSON.parse(player.skillsJson || '["basic_attack"]');
  } catch (e) {}

  const skillsToRender = [...playerSkills];
  while (skillsToRender.length < 4) {
    skillsToRender.push('');
  }

  const pPercent = Math.max(0, (battle.playerCurrentHp / battle.playerMaxHp) * 100);
  const ePercent = Math.max(0, (battle.enemyCurrentHp / battle.enemyMaxHp) * 100);

  return (
    <div className="h-[100dvh] bg-gray-900 flex flex-col landscape:flex-row font-pixel overflow-hidden relative">
      
      {/* Sliding Log Panel (Overlay) */}
      <div 
        className={`absolute top-0 right-0 h-full w-3/4 max-w-sm bg-gray-900/95 border-l-4 border-gray-700 z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isLogOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-3 bg-gray-800 border-b-4 border-gray-900 flex justify-between items-center">
          <h3 className="text-white text-[10px] font-bold uppercase">Log de Batalha</h3>
          <button onClick={() => setIsLogOpen(false)} className="text-white px-2 py-1 bg-red-600 pixel-border text-[8px] active:scale-95">FECHAR</button>
        </div>
        <div ref={logsContainerRef} className="flex-1 overflow-y-auto p-3 text-white text-[9px] leading-relaxed font-bold">
          {logs.map((log, i) => (
            <div key={i} className={`mb-2 ${log.includes('Crítico') ? 'text-yellow-400' : ''}`}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay to close logs by clicking outside */}
      {isLogOpen && (
        <div className="absolute inset-0 z-40" onClick={() => setIsLogOpen(false)}></div>
      )}

      {/* Battle Scene - Perspective */}
      <div 
        className="flex-1 relative bg-gray-700 overflow-hidden border-b-4 border-gray-900 landscape:border-b-0 landscape:border-r-4"
        style={{
          backgroundImage: battle.dungeonId ? `url('/assets/dungeons/${battle.dungeonId}.png')` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'pixelated'
        }}
      >
        
        {/* FUGIR Button */}
        <button 
          onClick={() => navigate('/main')} 
          className="absolute top-2 left-2 px-2 py-1 bg-red-800 hover:bg-red-700 text-[8px] text-white pixel-border z-30"
        >
          FUGIR
        </button>

        {/* LOGS Button */}
        <button 
          onClick={() => setIsLogOpen(true)} 
          className="absolute top-24 right-2 landscape:top-2 landscape:right-auto landscape:left-20 px-3 py-2 bg-blue-800 hover:bg-blue-700 text-[8px] text-white pixel-border z-30 flex items-center shadow-md animate-pulse-slow"
        >
          VER LOGS
        </button>

        {/* Enemy HUD (Top Right) */}
        <div className="absolute top-6 right-2 w-40 bg-white/90 p-1.5 pixel-border shadow-lg z-20">
          <div className="flex justify-between items-end mb-1">
            <h2 className="text-[9px] font-bold uppercase text-gray-900 truncate">{enemy.name}</h2>
            <span className="text-yellow-600 font-bold text-[8px]">Lv.{battle.enemyLevel}</span>
          </div>
          <div className="w-full h-2.5 bg-gray-800 border-2 border-gray-900 relative">
            <div 
              className="h-full transition-all duration-300"
              style={{ width: `${ePercent}%`, backgroundColor: ePercent > 50 ? '#2ecc71' : ePercent > 20 ? '#f1c40f' : '#e74c3c' }}
            />
          </div>
          <p className="text-[7px] text-right mt-0.5 text-gray-600 font-bold">{ePercent.toFixed(1)}%</p>
        </div>

        {/* Enemy Sprite (Mid Right) */}
        <div className="absolute top-16 right-6 w-32 h-32 flex items-end justify-center z-10 animate-pulse-slow">
           <img 
              src={`/assets/creatures/front/${enemy.speciesId}.png`} 
              alt={enemy.name}
              className={`max-h-full max-w-full object-contain drop-shadow-md ${battle.enemyCurrentHp <= 0 ? 'opacity-50 grayscale' : ''}`}
              style={{ imageRendering: 'pixelated', transform: 'scale(1.2)' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
           />
        </div>

        {/* Player Sprite (Bottom Left) */}
        <div className="absolute bottom-4 left-6 w-40 h-40 flex items-end justify-center z-30">
           <img 
              src={`/assets/creatures/back/${player.speciesId}.png`} 
              alt={player.name}
              className={`max-h-full max-w-full object-contain drop-shadow-lg ${battle.playerCurrentHp <= 0 ? 'opacity-50 grayscale' : ''}`}
              style={{ imageRendering: 'pixelated', transform: 'scale(1.5)', transformOrigin: 'bottom' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
           />
        </div>

      </div>

      {/* Bottom Command Panel */}
      <div className="h-64 landscape:h-full landscape:w-80 bg-gray-800 flex flex-col p-3 pb-4 shadow-[inset_0_4px_0_0_rgba(0,0,0,0.5)] landscape:shadow-[inset_4px_0_0_0_rgba(0,0,0,0.5)]">
        
        {/* Player HUD Inside Action Panel */}
        <div className="w-full bg-white/95 p-2 pixel-border shadow-lg mb-3 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-1">
            <h2 className="text-[11px] font-bold uppercase text-gray-900 truncate">{player.name}</h2>
            <span className="text-yellow-600 font-bold text-[10px]">Lv.{player.level}</span>
          </div>
          <div className="w-full h-3 bg-gray-800 border-2 border-gray-900 relative">
            <div 
              className="h-full transition-all duration-300"
              style={{ width: `${pPercent}%`, backgroundColor: pPercent > 50 ? '#2ecc71' : pPercent > 20 ? '#f1c40f' : '#e74c3c' }}
            />
          </div>
          <p className="text-[9px] text-right mt-1 text-gray-600 font-bold">{Math.floor(battle.playerCurrentHp)} / {battle.playerMaxHp}</p>
        </div>

        {/* Commands Menu Grid */}
        <div className="flex-1">
          {battle.status === 'ONGOING' ? (
            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
              {skillsToRender.map((skillId, idx) => (
                skillId ? (
                  <button
                    key={idx}
                    onClick={() => handleTurn(skillId)}
                    disabled={isProcessingTurn}
                    className="bg-gray-200 text-black border-[3px] border-gray-400 font-bold text-[10px] uppercase shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center text-center"
                  >
                    {MoveDictionary[skillId] || skillId}
                  </button>
                ) : (
                  <div key={idx} className="bg-gray-600 border-[3px] border-gray-700 opacity-30 shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.2)] flex items-center justify-center text-gray-500 font-bold text-[8px] uppercase">
                    Vazio
                  </div>
                )
              ))}
            </div>
          ) : battle.status === 'VICTORY' ? (
            <div className="h-full grid grid-cols-2 gap-2">
              {(!battle.lockedAction || battle.lockedAction === 'CAPTURE') ? (
                <button 
                  onClick={handleCapture}
                  disabled={isProcessingTurn || battle.captureAttempts <= 0}
                  className="w-full h-full bg-purple-600 text-white font-bold text-[12px] uppercase border-[3px] border-purple-800 active:bg-purple-800 shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1 transition-all disabled:bg-gray-700 disabled:border-gray-900 flex flex-col items-center justify-center leading-tight"
                >
                  <span>ERGA-SE</span>
                  <span className="text-[9px]">({battle.captureAttempts} CHANCES)</span>
                </button>
              ) : (
                <div className="w-full h-full bg-gray-800 border-[3px] border-gray-900 opacity-50 flex items-center justify-center"><span className="text-gray-600 text-[10px] font-bold">BLOQUEADO</span></div>
              )}
              
              {(!battle.lockedAction || battle.lockedAction === 'EXTRACT') ? (
                <button 
                  onClick={handleExtract}
                  disabled={isProcessingTurn || battle.captureAttempts <= 0}
                  className="w-full h-full bg-orange-600 text-white font-bold text-[12px] uppercase border-[3px] border-orange-800 active:bg-orange-800 shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1 transition-all disabled:bg-gray-700 disabled:border-gray-900 flex flex-col items-center justify-center leading-tight"
                >
                  <span>EXTRAIR ITEM</span>
                  <span className="text-[9px]">({battle.captureAttempts} CHANCES)</span>
                </button>
              ) : (
                <div className="w-full h-full bg-gray-800 border-[3px] border-gray-900 opacity-50 flex items-center justify-center"><span className="text-gray-600 text-[10px] font-bold">BLOQUEADO</span></div>
              )}
            </div>
          ) : battle.status === 'DEFEAT' ? (
             <div className="h-full flex items-center justify-center bg-gray-900 border-[3px] border-gray-700">
              <span className="text-red-500 font-bold uppercase text-[12px] animate-pulse">Você foi derrotado!</span>
            </div>
          ) : battle.status === 'CAPTURED' ? (
            <div className="h-full flex items-center justify-center bg-gray-900 border-[3px] border-gray-700">
              <span className="text-green-500 font-bold uppercase text-[12px] animate-bounce">Criatura Capturada!</span>
            </div>
          ) : battle.status === 'EXTRACTED' ? (
            <div className="h-full flex flex-col items-center justify-center bg-gray-900 border-[3px] border-gray-700 p-2 gap-2">
              <span className="text-orange-400 font-bold uppercase text-[12px] animate-bounce text-center leading-tight">Item Extraído com Sucesso!</span>
              {battle.extractedItemId && (
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-gray-800 border-[3px] border-gray-600 flex items-center justify-center animate-fade-in shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.5)]">
                    <img src={`/assets/items/${battle.extractedItemId}.png`} alt="Item Extraído" className="w-8 h-8 object-contain drop-shadow" style={{ imageRendering: 'pixelated' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span className="text-gray-300 font-bold text-[10px] uppercase text-center bg-gray-800 px-2 py-0.5 border-[2px] border-gray-700">{battle.extractedItemName || 'Item'}</span>
                </div>
              )}
            </div>
          ) : battle.status === 'EXTRACT_FAILED' ? (
            <div className="h-full flex items-center justify-center bg-gray-900 border-[3px] border-gray-700">
              <span className="text-gray-500 font-bold uppercase text-[10px] text-center px-2 leading-relaxed">A carcaça se desintegrou...</span>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-900 border-[3px] border-gray-700">
              <span className="text-gray-500 font-bold uppercase text-[12px] text-center px-2 leading-relaxed">A alma recusou ser domada!</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
