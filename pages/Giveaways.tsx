
import React, { useState, useEffect } from 'react';
import { getDB } from '../storage';
import { Giveaway } from '../types';

const Giveaways: React.FC<{ db: ReturnType<typeof getDB>, updateDB: any, adminMode: boolean }> = ({ db, updateDB, adminMode }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [prize, setPrize] = useState('');
  const [winnersCount, setWinnersCount] = useState(1);
  const [minutes, setMinutes] = useState(5);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const g: Giveaway = {
      id: Date.now().toString(),
      prize,
      winnersCount,
      endTime: Date.now() + (minutes * 60000),
      participants: [],
      winners: [],
      createdBy: 'user',
      active: true
    };
    updateDB((prev: any) => ({ ...prev, giveaways: [g, ...prev.giveaways] }));
    setShowAdd(false);
    setPrize('');
  };

  const join = (id: string) => {
    updateDB((prev: any) => ({
      ...prev,
      giveaways: prev.giveaways.map((g: Giveaway) => {
        if (g.id === id && !g.participants.includes('You')) {
          return { ...g, participants: [...g.participants, 'أنت'] };
        }
        return g;
      })
    }));
  };

  // Auto-finish logic simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const needsFinishing = db.giveaways.some(g => g.active && g.endTime <= now);
      
      if (needsFinishing) {
        updateDB((prev: any) => ({
          ...prev,
          giveaways: prev.giveaways.map((g: Giveaway) => {
            if (g.active && g.endTime <= now) {
              const shuffled = [...g.participants].sort(() => 0.5 - Math.random());
              const winners = shuffled.slice(0, g.winnersCount);
              return { ...g, active: false, winners: winners.length ? winners : ['لا يوجد مشاركون'] };
            }
            return g;
          })
        }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [db.giveaways, updateDB]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black">🎁 قيف اواي مستري</h1>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 px-6 py-2 rounded-full font-bold">إنشاء قيف اواي</button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-slate-900 p-6 rounded-3xl border border-white/10 mb-12 max-w-md mx-auto space-y-4">
          <input required placeholder="الجائزة" className="w-full bg-black/30 p-3 rounded-xl border border-white/10" value={prize} onChange={e => setPrize(e.target.value)} />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">عدد الفائزين</label>
              <input type="number" min="1" className="w-full bg-black/30 p-3 rounded-xl border border-white/10" value={winnersCount} onChange={e => setWinnersCount(parseInt(e.target.value))} />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">المدة (دقائق)</label>
              <input type="number" min="1" className="w-full bg-black/30 p-3 rounded-xl border border-white/10" value={minutes} onChange={e => setMinutes(parseInt(e.target.value))} />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-bold">بدء القيف اواي</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {db.giveaways.map(g => (
          <div key={g.id} className={`p-8 rounded-3xl border transition-all ${g.active ? 'bg-slate-900 border-blue-500/50' : 'bg-black/20 border-white/5 grayscale'}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {g.active ? 'جاري' : 'منتهي'}
                </span>
                <h3 className="text-2xl font-black mt-2">{g.prize}</h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">الفائزين</div>
                <div className="text-xl font-bold text-blue-500">{g.winnersCount}</div>
              </div>
            </div>

            {g.active ? (
              <>
                <div className="flex justify-between text-sm mb-4 text-gray-400">
                  <span>المشاركون: {g.participants.length}</span>
                  <span>ينتهي خلال: {Math.max(0, Math.ceil((g.endTime - Date.now()) / 60000))}د</span>
                </div>
                <button 
                  onClick={() => join(g.id)}
                  disabled={g.participants.includes('أنت')}
                  className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-blue-400 transition-colors disabled:opacity-50"
                >
                  {g.participants.includes('أنت') ? 'تم الاشتراك' : '🎉 دخووول!'}
                </button>
              </>
            ) : (
              <div className="bg-white/5 p-4 rounded-xl text-center">
                <div className="text-xs text-gray-500 mb-2">الفائزون المحظوظون:</div>
                <div className="text-lg font-black text-yellow-500">{g.winners.join('، ')}</div>
              </div>
            )}

            {adminMode && (
              <button 
                onClick={() => updateDB((prev: any) => ({ ...prev, giveaways: prev.giveaways.filter((x: any) => x.id !== g.id) }))}
                className="mt-4 text-xs text-red-500/50 hover:text-red-500"
              >
                🗑️ حذف من قبل الأدمن
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Giveaways;
