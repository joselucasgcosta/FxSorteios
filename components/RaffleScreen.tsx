import React, { useState, useEffect, useRef } from 'react';
import { Participant, DrawHistory } from '../types';
import { Trophy, History, RefreshCcw, User, Tag, Ticket } from 'lucide-react';
import Confetti from 'react-confetti';

interface RaffleScreenProps {
  participants: Participant[];
  onReset: () => void;
}

export const RaffleScreen: React.FC<RaffleScreenProps> = ({ participants, onReset }) => {
  const [winner, setWinner] = useState<Participant | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayParticipant, setDisplayParticipant] = useState<Participant | null>(null);
  const [history, setHistory] = useState<DrawHistory[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const performDraw = () => {
    if (participants.length === 0) return;

    // Lista sem vencedores anteriores
    const alreadyWonCodes = new Set(history.map(h => h.winner.code));
    const available = participants.filter(p => !alreadyWonCodes.has(p.code));

    if (available.length === 0) {
      alert("Todos os participantes já foram sorteados neste ciclo.");
      return;
    }

    setIsAnimating(true);
    setWinner(null);
    setShowConfetti(false);

    // Weighted random com a lista filtrada
    const totalWeight = available.reduce((acc, p) => acc + p.weight, 0);
    let randomNum = Math.random() * totalWeight;
    let selectedParticipant = available[available.length - 1];

    for (const p of available) {
      if (randomNum < p.weight) {
        selectedParticipant = p;
        break;
      }
      randomNum -= p.weight;
    }

    // Animation Duration
    const duration = 3000; // 3 seconds
    const intervalTime = 50; // Change name every 50ms
    const startTime = Date.now();

    const intervalId = setInterval(() => {
      const timeLeft = duration - (Date.now() - startTime);

      // Randomly show names during animation for effect
      const randomIndex = Math.floor(Math.random() * participants.length);
      setDisplayParticipant(participants[randomIndex]);

      if (timeLeft <= 0) {
        clearInterval(intervalId);
        setWinner(selectedParticipant);
        setDisplayParticipant(selectedParticipant);
        setIsAnimating(false);
        setShowConfetti(true);
        setHistory(prev => [{ timestamp: new Date(), winner: selectedParticipant }, ...prev]);
      }
    }, intervalTime);
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} colors={['#f97316', '#000000', '#ffffff']} recycle={false} numberOfPieces={500} />}

      {/* Main Draw Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-brand-dark border border-brand-orange/30 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)]">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-50"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl"></div>

          {!isAnimating && !winner ? (
            <div className="text-center space-y-6 z-10">
              <div className="bg-brand-black p-4 rounded-full inline-block border border-brand-gray mb-4">
                <Trophy className="w-16 h-16 text-brand-orange opacity-80" />
              </div>
              <h2 className="text-3xl font-bold text-white">Pronto para Sortear</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                {participants.length} participantes carregados.
              </p>
              <button
                onClick={performDraw}
                className="group relative px-8 py-4 bg-brand-orange hover:bg-brand-orangeDim text-black font-bold text-xl rounded-full transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <Ticket className="w-6 h-6" />
                  SORTEAR AGORA
                </span>
              </button>
            </div>
          ) : (
            <div className="text-center z-10 w-full animate-in fade-in zoom-in duration-300">
              {isAnimating && (
                <div className="text-brand-orange text-lg font-mono mb-2 tracking-widest animate-pulse">
                  EMBARALHANDO...
                </div>
              )}

              {winner && (
                <div className="mb-4 inline-block px-4 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-sm font-bold border border-brand-orange/50 animate-bounce">
                  🎉 VENCEDOR! 🎉
                </div>
              )}

              <div className={`
                  bg-black/50 backdrop-blur-sm border-2 rounded-2xl p-8 w-full max-w-lg mx-auto transform transition-all
                  ${winner ? 'border-brand-orange shadow-[0_0_40px_rgba(249,115,22,0.3)] scale-105' : 'border-brand-gray scale-100'}
               `}>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm uppercase tracking-wider">
                    <Tag className="w-4 h-4" />
                    <span>Código: {displayParticipant?.code || '---'}</span>
                  </div>

                  <h2 className={`text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 break-words leading-tight ${winner ? 'scale-110 transition-transform duration-500' : ''}`}>
                    {displayParticipant?.name || '...'}
                  </h2>
                </div>
              </div>

              {winner && (
                <button
                  onClick={performDraw}
                  className="mt-8 text-gray-400 hover:text-white underline underline-offset-4 decoration-brand-orange decoration-2 transition-colors"
                >
                  Sortear Novamente
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar: Stats & History */}
      <div className="space-y-6">
        {/* Stats Card */}
        <div className="bg-brand-dark border border-brand-gray rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-orange" />
            Estatísticas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 p-3 rounded-lg border border-brand-gray/50">
              <span className="text-xs text-gray-500 block">Total Participantes</span>
              <span className="text-2xl font-bold text-white">{participants.length}</span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Carregar Novo Arquivo
          </button>
        </div>

        {/* History Card */}
        <div className="bg-brand-dark border border-brand-gray rounded-2xl p-6 flex-1 h-[300px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-brand-orange" />
            Histórico ({history.length})
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center text-gray-600 italic text-sm mt-10">
                Nenhum sorteio realizado ainda.
              </div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="bg-black/40 border border-brand-gray/30 p-3 rounded-lg flex items-center justify-between animate-in slide-in-from-left-2 fade-in duration-300">
                  <div className="overflow-hidden">
                    <p className="text-white font-medium truncate">{h.winner.name}</p>
                    <p className="text-xs text-gray-500">Cod: {h.winner.code}</p>
                  </div>
                  <span className="text-xs text-brand-orange font-mono bg-brand-orange/10 px-2 py-1 rounded">
                    {h.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};