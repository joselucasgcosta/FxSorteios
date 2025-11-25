import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { RaffleScreen } from './components/RaffleScreen';
import { Participant, AppState } from './types';
import selo from "/assets/selo-farmix-3.png";

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);

  const handleDataLoaded = (data: Participant[]) => {
    setParticipants(data);
    setAppState(AppState.READY);
  };

  const handleReset = () => {
    setParticipants([]);
    setAppState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-orange selection:text-black flex flex-col">
      {/* Header */}
      <header className="border-b border-brand-gray bg-brand-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-orange p-2 rounded-lg text-black">
              <img src={selo} alt="Farmix" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Fx<span className="text-brand-orange">Sorteios</span>
              </h1>
              <p className="text-xs text-gray-500">Sistema de Sorteios da Farmix</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs text-gray-500 block">Status do Sistema</span>
            <div className="flex items-center justify-end gap-2">
              <span className={`w-2 h-2 rounded-full ${participants.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
              <span className="text-sm font-mono text-gray-300">
                {participants.length > 0 ? 'PRONTO' : 'AGUARDANDO DADOS'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">

          {appState === AppState.IDLE && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Sorteio <span className="text-brand-orange">Especial</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Carregue os cupons para iniciar o sorteio.
                </p>
              </div>
              <FileUpload onDataLoaded={handleDataLoaded} />
            </div>
          )}

          {appState === AppState.READY && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col justify-center">
              <RaffleScreen
                participants={participants}
                onReset={handleReset}
              />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-gray py-6 bg-brand-dark text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Farmix Distribuidora. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;