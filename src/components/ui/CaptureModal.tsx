import React from 'react';

interface CaptureModalProps {
  creatureName: string;
  attemptsLeft: number;
  isOpen: boolean;
  onAttempt: () => void;
  onClose: () => void;
}

export const CaptureModal: React.FC<CaptureModalProps> = ({ 
  creatureName, 
  attemptsLeft, 
  isOpen, 
  onAttempt, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border-4 border-purple-500 p-6 text-white text-center pixel-border w-full max-w-sm">
        <h2 className="text-2xl text-purple-400 mb-4 animate-pulse uppercase">Erga-se!</h2>
        
        <p className="mb-4 text-sm leading-relaxed">
          O <span className="text-red-400 font-bold">{creatureName}</span> foi derrotado. 
          Você sente a energia sombria fluindo... Deseja tentar trazê-lo para o seu exército?
        </p>

        <div className="mb-6">
          <span className="text-yellow-400">Tentativas Restantes: </span>
          <span className="text-2xl font-bold">{attemptsLeft} / 3</span>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onAttempt}
            disabled={attemptsLeft <= 0}
            className={`pixel-border p-3 font-bold uppercase transition-colors ${
              attemptsLeft > 0 
                ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Invocar Comando
          </button>
          
          <button 
            onClick={onClose}
            className="pixel-border bg-gray-700 hover:bg-gray-600 text-white p-3 font-bold uppercase transition-colors"
          >
            Sair da Masmorra
          </button>
        </div>
      </div>
    </div>
  );
};
