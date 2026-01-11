
import React, { useState, useEffect } from 'react';
import { getDB, saveDB, onDBSync } from '../storage';

const Games: React.FC<{ db: any, updateDB: any }> = ({ db, updateDB }) => {
  const [tab, setTab] = useState<'roulette' | 'xo'>('roulette');

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tight">🎮 صالة الألعاب</h1>
        <p className="text-slate-400">العب مع أعضاء الكلـان الآخرين أونلاين</p>
      </div>
      
      <div className="flex justify-center gap-4">
        <button onClick={() => setTab('roulette')} className={`px-8 py-3 rounded-2xl font-bold transition-all ${tab === 'roulette' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30' : 'glass text-slate-400'}`}>🎡 روليت الحظ</button>
        <button onClick={() => setTab('xo')} className={`px-8 py-3 rounded-2xl font-bold transition-all ${tab === 'xo' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30' : 'glass text-slate-400'}`}>⚔️ تحدي X-O</button>
      </div>

      <div className="glass p-8 md:p-12 rounded-[40px] shadow-2xl">
        {tab === 'roulette' ? <RouletteGame /> : <XOGame db={db} updateDB={updateDB} />}
      </div>
    </div>
  );
};

const RouletteGame = () => {
  const [names, setNames] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const spin = () => {
    const list = names.split('\n').filter(n => n.trim());
    if (list.length < 2) return alert('ادخل اسمين على الأقل');
    setSpinning(true);
    setWinner(null);
    setTimeout(() => {
      const lucky = list[Math.floor(Math.random() * list.length)];
      setWinner(lucky);
      setSpinning(false);
    }, 2500);
  };

  return (
    <div className="text-center max-w-md mx-auto space-y-8">
      <div className="space-y-2">
        <h3 className="text-3xl font-black">🎡 عجلة الحظ</h3>
        <p className="text-slate-500 text-sm">ادخل الأسماء ودع القدر يختار</p>
      </div>
      <textarea 
        placeholder="أضف الأسماء هنا... (كل اسم في سطر)"
        className="w-full bg-black/40 p-6 rounded-3xl border border-white/10 h-48 focus:border-indigo-500 outline-none transition-all"
        value={names}
        onChange={e => setNames(e.target.value)}
      />
      <button 
        disabled={spinning}
        onClick={spin}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-5 rounded-2xl font-black text-xl shadow-xl disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        {spinning ? 'جارِ الدوران...' : 'تدوير العجلة 🚀'}
      </button>

      {winner && (
        <div className="mt-10 p-8 bg-yellow-500/10 border border-yellow-500/30 rounded-3xl animate-in zoom-in duration-500">
          <div className="text-yellow-500 text-sm font-bold mb-2 uppercase tracking-widest">لقد فاز:</div>
          <div className="text-5xl font-black text-white text-glow">{winner}</div>
        </div>
      )}
    </div>
  );
};

const XOGame = ({ db, updateDB }: { db: any, updateDB: any }) => {
  const [roomCode, setRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState<any>(null);

  // البحث عن الغرفة ومزامنتها
  useEffect(() => {
    if (roomCode) {
      const room = db.gameRooms.find((r: any) => r.code === roomCode);
      setCurrentRoom(room);
    }
  }, [db.gameRooms, roomCode]);

  const createRoom = () => {
    const code = Math.random().toString(36).substring(7).toUpperCase();
    const newRoom = {
      id: Date.now().toString(),
      code,
      game: 'xo',
      board: Array(9).fill(null),
      turn: 'X',
      winner: null
    };
    updateDB((prev: any) => ({ ...prev, gameRooms: [...prev.gameRooms, newRoom] }));
    setRoomCode(code);
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const code = (e.currentTarget.querySelector('input') as HTMLInputElement).value.toUpperCase();
    const room = db.gameRooms.find((r: any) => r.code === code);
    if (room) setRoomCode(code);
    else alert('الغرفة غير موجودة!');
  };

  const playMove = (index: number) => {
    if (!currentRoom || currentRoom.board[index] || currentRoom.winner) return;
    
    const newBoard = [...currentRoom.board];
    newBoard[index] = currentRoom.turn;
    
    const winner = calculateWinner(newBoard);
    
    updateDB((prev: any) => ({
      ...prev,
      gameRooms: prev.gameRooms.map((r: any) => 
        r.code === roomCode ? { 
          ...r, 
          board: newBoard, 
          turn: r.turn === 'X' ? 'O' : 'X',
          winner 
        } : r
      )
    }));
  };

  const calculateWinner = (sq: any) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let l of lines) {
      const [a,b,c] = l;
      if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) return sq[a];
    }
    return null;
  };

  if (!currentRoom) {
    return (
      <div className="text-center max-w-sm mx-auto space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">لعب أونلاين</h3>
          <p className="text-slate-500">أنشئ غرفة أو انضم لغرفة موجودة</p>
        </div>
        <button onClick={createRoom} className="w-full bg-indigo-600 py-4 rounded-2xl font-bold text-lg shadow-lg">إنشاء غرفة جديدة</button>
        <div className="flex items-center gap-2 text-slate-600"><hr className="flex-1 border-white/5"/>أو<hr className="flex-1 border-white/5"/></div>
        <form onSubmit={joinRoom} className="flex gap-2">
          <input placeholder="كود الغرفة" className="flex-1 bg-black/30 p-4 rounded-2xl border border-white/10 outline-none" />
          <button className="bg-white text-black px-6 rounded-2xl font-bold">دخول</button>
        </form>
      </div>
    );
  }

  const isDraw = !currentRoom.winner && currentRoom.board.every((s: any) => s);

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex justify-between w-full max-w-sm">
        <div className="text-indigo-400 font-bold tracking-widest">كود الغرفة: {currentRoom.code}</div>
        <button onClick={() => setRoomCode('')} className="text-xs text-slate-500 hover:text-white">خروج</button>
      </div>
      
      <div className="text-2xl font-black">
        {currentRoom.winner ? (
          <span className="text-yellow-400 animate-bounce">🏆 الفائز هو: {currentRoom.winner}</span>
        ) : isDraw ? (
          <span className="text-slate-400">🤝 تعادل!</span>
        ) : (
          <span className="text-white">الدور لـ: <span className={currentRoom.turn === 'X' ? 'text-indigo-400' : 'text-pink-400'}>{currentRoom.turn}</span></span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {currentRoom.board.map((s: any, i: number) => (
          <button 
            key={i} 
            onClick={() => playMove(i)}
            className="w-24 h-24 md:w-28 md:h-28 bg-black/40 border border-white/5 rounded-3xl text-4xl font-black flex items-center justify-center hover:bg-white/5 transition-all"
          >
            <span className={s === 'X' ? 'text-indigo-500' : 'text-pink-500'}>{s}</span>
          </button>
        ))}
      </div>

      <button 
        onClick={() => updateDB((prev: any) => ({
          ...prev,
          gameRooms: prev.gameRooms.map((r: any) => r.code === roomCode ? { ...r, board: Array(9).fill(null), winner: null, turn: 'X' } : r)
        }))}
        className="text-indigo-400 hover:bg-indigo-500/10 px-6 py-2 rounded-full font-bold transition-all"
      >
        إعادة اللعب
      </button>
    </div>
  );
};

export default Games;
