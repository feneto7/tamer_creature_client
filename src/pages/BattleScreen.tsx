import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BattleItemsModal } from '../components/modals/BattleItemsModal';
import { AuraEffect, getAuraFilter } from '../components/ui/AuraEffect';

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
  const [logs, setLogs] = useState<string[]>(['Sinal de batalha interceptado!']);
  const [loading, setLoading] = useState(true);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [playerAwakened, setPlayerAwakened] = useState(false);
  const [enemyAwakened, setEnemyAwakened] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/dungeon/battle/${battleId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBattleData(data);
          const pPercent = (data.battle.playerCurrentHp / data.battle.playerMaxHp) * 100;
          const ePercent = (data.battle.enemyCurrentHp / data.battle.enemyMaxHp) * 100;
          if (pPercent <= 30 && data.battle.playerCurrentHp > 0) setPlayerAwakened(true);
          if (ePercent <= 30 && data.battle.enemyCurrentHp > 0) setEnemyAwakened(true);
        } else {
          alert('Sinal perdido. Retornando.');
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
        setBattleData((prev: any) => {
          const newBattleData = {
            ...prev,
            battle: {
              ...prev.battle,
              playerCurrentHp: data.playerCurrentHp,
              enemyCurrentHp: data.enemyCurrentHp,
              status: data.status
            },
            dungeonStatus: data.dungeonStatus !== undefined ? data.dungeonStatus : prev.dungeonStatus
          };
          const pPercent = (data.playerCurrentHp / prev.battle.playerMaxHp) * 100;
          const ePercent = (data.enemyCurrentHp / prev.battle.enemyMaxHp) * 100;
          if (pPercent <= 30 && data.playerCurrentHp > 0) setPlayerAwakened(true);
          if (ePercent <= 30 && data.enemyCurrentHp > 0) setEnemyAwakened(true);
          return newBattleData;
        });

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

  const openItems = () => {
    setShowItems(true);
    setLoadingItems(true);
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:3000/game/inventory/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInventory(data.inventory.filter((inv: any) => inv.details?.type === 'CONSUMABLE'));
        }
      })
      .catch(console.error)
      .finally(() => setLoadingItems(false));
  };

  const handleUseItem = async (inventoryItemId: string) => {
    if (isProcessingTurn) return;
    setIsProcessingTurn(true);
    setShowItems(false);

    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch('http://localhost:3000/dungeon/use-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, battleId, inventoryItemId }),
      });
      const data = await response.json();
      
      if (data.success) {
        setLogs(prev => [...prev, ...data.logs, '-----------------']);
        setBattleData((prev: any) => {
          const newBattleData = {
            ...prev,
            battle: {
              ...prev.battle,
              playerCurrentHp: data.playerCurrentHp,
              enemyCurrentHp: data.enemyCurrentHp,
              status: data.status
            }
          };
          const pPercent = (data.playerCurrentHp / prev.battle.playerMaxHp) * 100;
          const ePercent = (data.enemyCurrentHp / prev.battle.enemyMaxHp) * 100;
          if (pPercent <= 30 && data.playerCurrentHp > 0) setPlayerAwakened(true);
          if (ePercent <= 30 && data.enemyCurrentHp > 0) setEnemyAwakened(true);
          return newBattleData;
        });

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
        // Remove setTimeout para permitir ao jogador clicar em "Avançar" se a masmorra estiver aberta
      } else {
        setBattleData((prev: any) => ({
          ...prev,
          battle: { ...prev.battle, status: data.status, captureAttempts: data.remainingAttempts, lockedAction: 'CAPTURE' }
        }));
        // Remove setTimeout
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
        // Remove setTimeout
      } else {
        setBattleData((prev: any) => ({
          ...prev,
          battle: { ...prev.battle, status: data.status, captureAttempts: data.remainingAttempts, lockedAction: 'EXTRACT' }
        }));
        // Remove setTimeout
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingTurn(false);
    }
  };

  const handleAdvanceDungeon = async () => {
    if (isProcessingTurn) return;
    setIsProcessingTurn(true);
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch('http://localhost:3000/dungeon/enter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, playerCreatureId: battleData.battle.playerCreatureId, dungeonId: battleData.battle.userDungeonId }),
      });
      const data = await response.json();
      if (data.success) {
        // Redireciona para a nova batalha, forçando reload da tela
        navigate(`/battle/${data.battleId}`, { replace: true });
        navigate(0); // Força refresh da página para limpar o estado e puxar a nova luta
      } else {
        alert(data.error);
        navigate('/main');
      }
    } catch (err) {
      console.error(err);
      navigate('/main');
    }
  };

  if (loading || !battleData) {
    return <div className="h-[100dvh] bg-black flex items-center justify-center text-[#00f3ff] animate-pulse font-pixel drop-shadow-[0_0_10px_#00f3ff]">Conectando à Masmorra...</div>;
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
    <div className="h-[100dvh] bg-black flex flex-col landscape:flex-row font-pixel overflow-hidden relative">
      
      {/* Sliding Log Panel (Overlay) */}
      <div 
        className={`absolute top-0 right-0 h-full w-3/4 max-w-sm z-50 transform transition-transform duration-300 flex flex-col backdrop-blur-md ${isLogOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          background: 'linear-gradient(to right, rgba(10,25,34,0.9), rgba(4,11,15,0.95))',
          borderLeft: '1px solid rgba(0,243,255,0.4)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,243,255,0.1)'
        }}
      >
        <div className="p-3 border-b flex justify-between items-center" style={{ borderColor: 'rgba(0,243,255,0.3)', backgroundColor: 'rgba(0,243,255,0.05)' }}>
          <h3 className="text-[#00f3ff] text-[10px] font-bold uppercase drop-shadow-[0_0_5px_#00f3ff]">Log Tático</h3>
          <button 
            onClick={() => setIsLogOpen(false)} 
            className="text-red-400 px-2 py-1 text-[8px] active:scale-95 uppercase font-bold"
            style={{ textShadow: '0 0 5px rgba(239,68,68,0.8)' }}
          >
            FECHAR
          </button>
        </div>
        <div ref={logsContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 text-[9px] leading-relaxed font-bold space-y-2">
          {logs.map((log, i) => (
            <div key={i} style={{ color: log.includes('Crítico') ? '#FFD820' : '#A0C0D0', textShadow: log.includes('Crítico') ? '0 0 5px #FFD820' : 'none' }}>
              <span className="text-[#00f3ff] opacity-50 mr-1">&gt;</span> {log}
            </div>
          ))}
        </div>
        {/* Chat Input (PVP Only) */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(0,243,255,0.3)', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input 
              type="text" 
              placeholder={battle.isPvp ? "Enviar mensagem..." : "Chat indisponível (PVE)"}
              disabled={!battle.isPvp}
              className="flex-1 bg-black/50 border rounded px-2 py-2 text-[8px] text-[#00f3ff] outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#00f3ff]/40"
              style={{ borderColor: 'rgba(0,243,255,0.3)', boxShadow: 'inset 0 0 10px rgba(0,243,255,0.05)' }}
            />
            <button 
              type="submit"
              disabled={!battle.isPvp}
              className="px-3 rounded bg-[#00f3ff]/10 text-[#00f3ff] font-bold text-[8px] uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00f3ff]/30 transition-colors"
              style={{ border: '1px solid rgba(0,243,255,0.4)', textShadow: '0 0 5px rgba(0,243,255,0.5)' }}
            >
              ENVIAR
            </button>
          </form>
        </div>
      </div>

      {/* Overlay to close logs by clicking outside */}
      {isLogOpen && (
        <div className="absolute inset-0 z-40 bg-black/20" onClick={() => setIsLogOpen(false)}></div>
      )}

      {/* Battle Scene - Perspective */}
      <div 
        className="flex-1 relative overflow-hidden"
        style={{
          backgroundColor: '#050a0f',
          backgroundImage: battle.dungeonId ? `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url('/assets/dungeons/${battle.dungeonId}.png')` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.9)'
        }}
      >
        {/* Grade cibernética de fundo */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,243,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        {/* FUGIR Button */}
        <button 
          onClick={() => navigate('/main')} 
          className="absolute top-3 left-3 px-3 py-1.5 uppercase font-bold text-[8px] z-30 transition-all rounded"
          style={{
            backgroundColor: 'rgba(239,68,68,0.2)',
            border: '1px solid rgba(239,68,68,0.5)',
            color: '#ef4444',
            boxShadow: '0 0 10px rgba(239,68,68,0.3)',
            textShadow: '0 0 5px rgba(239,68,68,0.8)'
          }}
        >
          ABORTO
        </button>

        {/* LOGS Button */}
        <button 
          onClick={() => setIsLogOpen(true)} 
          className="absolute top-12 left-3 landscape:top-3 landscape:left-24 px-3 py-1.5 uppercase font-bold text-[8px] z-30 flex items-center rounded"
          style={{
            backgroundColor: 'rgba(0,243,255,0.1)',
            border: '1px solid rgba(0,243,255,0.3)',
            color: '#00f3ff',
            boxShadow: '0 0 10px rgba(0,243,255,0.2)',
            textShadow: '0 0 5px rgba(0,243,255,0.8)'
          }}
        >
          SISTEMA
        </button>

        {/* Enemy HUD (Top Right) */}
        <div 
          className="absolute top-6 right-3 w-48 p-2 z-20 rounded-bl-lg backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderTop: 'none',
            borderRight: 'none',
            boxShadow: '-5px 5px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(239,68,68,0.1)'
          }}
        >
          <div className="flex justify-between items-end mb-1.5">
            <h2 className="text-[10px] font-bold uppercase text-red-400 truncate drop-shadow-[0_0_3px_#ef4444]">{enemy.name}</h2>
            <span className="text-[#FFD820] font-bold text-[8px]" style={{ textShadow: '0 0 4px #FFD820' }}>Lv.{battle.enemyLevel}</span>
          </div>
          <div className="w-full h-1.5 bg-black/80 relative overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
            <div 
              className="h-full transition-all duration-500 ease-out shadow-[0_0_5px_currentColor]"
              style={{ width: `${ePercent}%`, backgroundColor: ePercent > 50 ? '#2ecc71' : ePercent > 20 ? '#f1c40f' : '#e74c3c' }}
            />
          </div>
          <div className="flex justify-between items-center mt-1 h-3">
            {enemyAwakened ? (
              <img src="/assets/ui/HUDs/waking.png" alt="Desperto" className="h-full object-contain animate-pulse drop-shadow-[0_0_3px_rgba(239,68,68,0.8)]" style={{ imageRendering: 'pixelated' }} />
            ) : <span />}
            <p className="text-[7px] text-gray-400 font-bold">{ePercent.toFixed(1)}%</p>
          </div>
        </div>

        {/* Enemy Sprite (Mid Right) */}
        <div className="absolute top-20 right-6 w-32 h-32 flex items-end justify-center z-10">
           {enemyAwakened && battle.enemyCurrentHp > 0 && <AuraEffect type={enemy.awakeningType} />}
           <img 
              src={`/assets/creatures/front/${enemy.speciesId}.png`} 
              alt={enemy.name}
              className={`max-h-full max-w-full object-contain relative z-10 ${battle.enemyCurrentHp <= 0 ? 'opacity-30 grayscale blur-[1px]' : ''}`}
              style={{ imageRendering: 'pixelated', transform: 'scale(1.2)', filter: getAuraFilter(enemy.awakeningType, enemyAwakened && battle.enemyCurrentHp > 0) }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
           />
        </div>

        {/* Player Sprite (Bottom Left) */}
        <div className="absolute bottom-6 left-8 w-40 h-40 flex items-end justify-center z-30">
           {playerAwakened && battle.playerCurrentHp > 0 && <AuraEffect type={player.awakeningType} />}
           
           <img 
              src={`/assets/creatures/back/${player.speciesId}.png`} 
              alt={player.name}
              className={`max-h-full max-w-full object-contain relative z-10 ${battle.playerCurrentHp <= 0 ? 'opacity-50 grayscale' : ''}`}
              style={{ imageRendering: 'pixelated', transform: 'scale(1.5)', transformOrigin: 'bottom', filter: getAuraFilter(player.awakeningType, playerAwakened && battle.playerCurrentHp > 0) }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
           />
        </div>

      </div>

      {/* Bottom Command Panel */}
      <div 
        className="h-64 landscape:h-full landscape:w-60 md:landscape:w-72 lg:landscape:w-[22rem] flex flex-col p-2 md:p-3 z-40 transition-all duration-300 holo-panel !border-0 !border-t !border-[#00f3ff]/40 shadow-[0_-10px_30px_rgba(0,0,0,0.8),inset_0_20px_20px_-20px_rgba(0,243,255,0.2)]"
      >
        
        {/* Player HUD Inside Action Panel */}
        <div className="flex gap-1.5 md:gap-2 mb-2 md:mb-3 h-[46px] md:h-[52px]">
          <div 
            className="flex-1 px-2 py-1 flex flex-col justify-center rounded-sm bg-black/50 border border-[#00f3ff]/20 shadow-[inset_0_0_10px_rgba(0,243,255,0.05)]"
          >
            <div className="flex justify-between items-end mb-1">
              <h2 className="text-[10px] md:text-[11px] holo-text truncate">{player.name}</h2>
              <span className="text-[#FFD820] font-bold text-[8px] md:text-[9px] drop-shadow-[0_0_4px_#FFD820]">Lv.{player.level}</span>
            </div>
            <div className="w-full h-1.5 bg-black/80 relative overflow-hidden border border-[#00f3ff]/30">
              <div 
                className="h-full transition-all duration-300 shadow-[0_0_5px_currentColor]"
                style={{ width: `${pPercent}%`, backgroundColor: pPercent > 50 ? '#2ecc71' : pPercent > 20 ? '#f1c40f' : '#e74c3c' }}
              />
            </div>
            <div className="flex justify-between items-center mt-1 h-3">
              {playerAwakened ? (
                <img src="/assets/ui/HUDs/waking.png" alt="Desperto" className="h-full object-contain animate-pulse drop-shadow-[0_0_3px_rgba(0,243,255,0.8)]" style={{ imageRendering: 'pixelated' }} />
              ) : <span />}
              <p className="holo-text text-[7px] md:text-[8px] opacity-70">{Math.floor(battle.playerCurrentHp)} / {battle.playerMaxHp}</p>
            </div>
          </div>

          <button 
            onClick={openItems}
            disabled={isProcessingTurn || battle.status !== 'ONGOING'}
            className="w-14 md:w-16 flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            style={{
              backgroundColor: 'rgba(46,204,113,0.15)',
              border: '1px solid rgba(46,204,113,0.5)',
              color: '#2ECC71',
              boxShadow: '0 0 10px rgba(46,204,113,0.2), inset 0 0 10px rgba(46,204,113,0.1)'
            }}
          >
            <span className="text-lg md:text-xl mb-0.5 drop-shadow-[0_0_5px_#2ECC71]">🎒</span>
            <span className="font-bold text-[7px] md:text-[8px] uppercase" style={{ textShadow: '0 0 5px #2ECC71' }}>ITENS</span>
          </button>
        </div>

        {/* Commands Menu Grid */}
        <div className="flex-1">
          {battle.status === 'ONGOING' ? (
            <div className="grid grid-cols-2 grid-rows-2 gap-1.5 md:gap-2 h-full">
              {skillsToRender.map((skillId, idx) => (
                skillId ? (
                  <button
                    key={idx}
                    onClick={() => handleTurn(skillId)}
                    disabled={isProcessingTurn}
                    className="flex flex-col items-center justify-center text-center rounded relative overflow-hidden group holo-btn"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-[#00f3ff] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                    <span className="relative z-10 px-1 text-[9px] md:text-[10px]">{MoveDictionary[skillId] || skillId}</span>
                  </button>
                ) : (
                  <div 
                    key={idx} 
                    className="flex items-center justify-center text-[8px] uppercase rounded"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      border: '1px dashed rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.2)'
                    }}
                  >
                    Slot Vazio
                  </div>
                )
              ))}
            </div>
          ) : battle.status === 'VICTORY' ? (
            <div className="flex gap-2 h-full items-center justify-center relative">
              <div className="flex w-full gap-2 px-2">
                {(!battle.lockedAction || battle.lockedAction === 'CAPTURE') ? (
                <button 
                  onClick={handleCapture}
                  disabled={isProcessingTurn || battle.captureAttempts <= 0}
                  className="flex-1 h-20 md:h-24 flex flex-col items-center justify-center leading-tight rounded holo-btn-purple"
                >
                  <span className="text-[12px]">ERGA-SE</span>
                  <span className="text-[9px] mt-1 opacity-80">({battle.captureAttempts} CHANCES)</span>
                </button>
              ) : (
                <div className="flex-1 h-20 md:h-24 flex items-center justify-center rounded" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(255,255,255,0.2)' }}>
                  <span className="text-gray-500 text-[9px] font-bold">BLOQUEADO</span>
                </div>
              )}
              
              {(!battle.lockedAction || battle.lockedAction === 'EXTRACT') ? (
                <button 
                  onClick={handleExtract}
                  disabled={isProcessingTurn || battle.captureAttempts <= 0}
                  className="flex-1 h-20 md:h-24 flex flex-col items-center justify-center leading-tight rounded holo-btn-orange"
                >
                  <span className="text-[12px]">EXTRAIR ITEM</span>
                  <span className="text-[9px] mt-1 opacity-80">({battle.captureAttempts} CHANCES)</span>
                </button>
              ) : (
                <div className="flex-1 h-16 md:h-20 flex items-center justify-center rounded" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(255,255,255,0.2)' }}>
                  <span className="text-gray-500 text-[9px] font-bold">BLOQUEADO</span>
                </div>
              )}
              </div>
            </div>
          ) : battle.status === 'DEFEAT' ? (
             <div className="h-full flex items-center justify-center rounded" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span className="text-red-500 font-bold uppercase text-[12px] animate-pulse" style={{ textShadow: '0 0 10px rgba(239,68,68,0.8)' }}>Você foi derrotado!</span>
            </div>
          ) : battle.status === 'CAPTURED' ? (
            <div className="h-full flex flex-col items-center justify-center rounded p-2" style={{ backgroundColor: 'rgba(155,89,182,0.1)', border: '1px solid rgba(155,89,182,0.3)' }}>
              <span className="text-[#9B59B6] font-bold uppercase text-[12px] animate-bounce mb-2" style={{ textShadow: '0 0 10px #9B59B6' }}>Sombra Subjugada!</span>
              {battleData.dungeonStatus === 'OPEN' ? (
                 <div className="flex gap-2 w-full mt-auto">
                   <button onClick={handleAdvanceDungeon} className="flex-1 px-1 py-2 border border-[#00f3ff] text-[#00f3ff] text-[10px] font-bold rounded holo-btn">AVANÇAR</button>
                   <button onClick={() => navigate('/main')} className="flex-1 px-1 py-2 border border-[#e74c3c] text-[#e74c3c] text-[10px] font-bold rounded holo-btn">SAIR</button>
                 </div>
              ) : (
                 <button onClick={() => navigate('/main')} className="w-full px-4 py-2 border border-[#2ecc71] text-[#2ecc71] text-[10px] font-bold rounded holo-btn mt-auto">MASMORRA CONCLUÍDA</button>
              )}
            </div>
          ) : battle.status === 'EXTRACTED' ? (
            <div className="h-full flex flex-col items-center justify-center rounded p-2" style={{ backgroundColor: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)' }}>
              <span className="text-[#F39C12] font-bold uppercase text-[12px] animate-bounce text-center leading-tight mb-1" style={{ textShadow: '0 0 10px #F39C12' }}>Matéria Extraída!</span>
              {battle.extractedItemId && (
                <div className="flex items-center gap-2 mb-2">
                  <img src={`/assets/items/${battle.extractedItemId}.png`} alt="Item" className="w-6 h-6 object-contain" />
                  <span className="text-[#F39C12] font-bold text-[9px] uppercase">{battle.extractedItemName || 'Item'}</span>
                </div>
              )}
              {battleData.dungeonStatus === 'OPEN' ? (
                 <div className="flex gap-2 w-full mt-auto">
                   <button onClick={handleAdvanceDungeon} className="flex-1 px-1 py-2 border border-[#00f3ff] text-[#00f3ff] text-[10px] font-bold rounded holo-btn">AVANÇAR</button>
                   <button onClick={() => navigate('/main')} className="flex-1 px-1 py-2 border border-[#e74c3c] text-[#e74c3c] text-[10px] font-bold rounded holo-btn">SAIR</button>
                 </div>
              ) : (
                 <button onClick={() => navigate('/main')} className="w-full px-4 py-2 border border-[#2ecc71] text-[#2ecc71] text-[10px] font-bold rounded holo-btn mt-auto">MASMORRA CONCLUÍDA</button>
              )}
            </div>
          ) : battle.status === 'EXTRACT_FAILED' ? (
            <div className="h-full flex flex-col items-center justify-center rounded p-2" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-gray-500 font-bold uppercase text-[10px] text-center px-2 leading-relaxed mb-2">A matéria se desintegrou...</span>
              {battleData.dungeonStatus === 'OPEN' ? (
                 <div className="flex gap-2 w-full mt-auto">
                   <button onClick={handleAdvanceDungeon} className="flex-1 px-1 py-2 border border-[#00f3ff] text-[#00f3ff] text-[10px] font-bold rounded holo-btn">AVANÇAR</button>
                   <button onClick={() => navigate('/main')} className="flex-1 px-1 py-2 border border-[#e74c3c] text-[#e74c3c] text-[10px] font-bold rounded holo-btn">SAIR</button>
                 </div>
              ) : (
                 <button onClick={() => navigate('/main')} className="w-full px-4 py-2 border border-[#2ecc71] text-[#2ecc71] text-[10px] font-bold rounded holo-btn mt-auto">MASMORRA CONCLUÍDA</button>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center rounded p-2" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-gray-500 font-bold uppercase text-[12px] text-center px-2 leading-relaxed mb-2">A sombra escapou!</span>
              {battleData.dungeonStatus === 'OPEN' ? (
                 <div className="flex gap-2 w-full mt-auto">
                   <button onClick={handleAdvanceDungeon} className="flex-1 px-1 py-2 border border-[#00f3ff] text-[#00f3ff] text-[10px] font-bold rounded holo-btn">AVANÇAR</button>
                   <button onClick={() => navigate('/main')} className="flex-1 px-1 py-2 border border-[#e74c3c] text-[#e74c3c] text-[10px] font-bold rounded holo-btn">SAIR</button>
                 </div>
              ) : (
                 <button onClick={() => navigate('/main')} className="w-full px-4 py-2 border border-[#2ecc71] text-[#2ecc71] text-[10px] font-bold rounded holo-btn mt-auto">MASMORRA CONCLUÍDA</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items Modal */}
      {showItems && (
        <BattleItemsModal 
          inventory={inventory}
          loadingItems={loadingItems}
          onClose={() => setShowItems(false)}
          onUseItem={handleUseItem}
        />
      )}

    </div>
  );
};
