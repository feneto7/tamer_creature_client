
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StarterSelectionPage } from './pages/StarterSelectionPage';
import { MainDashboard } from './pages/MainDashboard';
import { AuthPage } from './pages/AuthPage';
import { DungeonLobby } from './pages/DungeonLobby';
import { BattleScreen } from './pages/BattleScreen';
import { InventoryScreen } from './pages/InventoryScreen';
import { AuraTestPage } from './pages/AuraTestPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        {/* Container que imita a tela de um celular */}
        <div className="w-full max-w-md h-[100dvh] md:h-[90vh] bg-white md:rounded-3xl md:shadow-2xl overflow-hidden relative border-8 border-gray-800 landscape:max-w-none landscape:border-none landscape:md:h-[100dvh] landscape:md:rounded-none">
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/starter" element={<StarterSelectionPage />} />
            <Route path="/main" element={<MainDashboard />} />
            <Route path="/dungeon" element={<DungeonLobby />} />
            <Route path="/battle/:battleId" element={<BattleScreen />} />
            <Route path="/inventory" element={<InventoryScreen />} />
            <Route path="/aura-test" element={<AuraTestPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
