
import React, { useState } from 'react';
import { getDB } from '../storage';
import { Message } from '../types';

const SecretFriend: React.FC<{ db: ReturnType<typeof getDB>, updateDB: any }> = ({ db, updateDB }) => {
  const [toId, setToId] = useState('');
  const [text, setText] = useState('');

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toId || !text) return;
    const msg: Message = {
      id: Date.now().toString(),
      toMemberId: toId,
      text,
      createdAt: Date.now()
    };
    updateDB((prev: any) => ({ ...prev, messages: [msg, ...prev.messages] }));
    setText('');
    alert('تم إرسال رسالتك السرية بنجاح! 💌');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-black mb-8 text-center">💌 الصديق السري</h1>
      
      <div className="bg-slate-900 p-8 rounded-3xl border border-white/10 mb-12 shadow-2xl">
        <p className="text-gray-400 text-center mb-8">أرسل رسالة مجهولة لأي عضو في الكلـان، ستظهر في ملفه الشخصي وللجميع هنا.</p>
        
        <form onSubmit={send} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-500 mb-2">اختر العضو</label>
            <select 
              required
              className="w-full bg-black/30 p-4 rounded-xl border border-white/10 text-white"
              value={toId}
              onChange={e => setToId(e.target.value)}
            >
              <option value="">-- اختر عضو --</option>
              {db.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-2">رسالتك</label>
            <textarea 
              required
              placeholder="اكتب هنا بصراحة..." 
              className="w-full bg-black/30 p-4 rounded-xl border border-white/10 min-h-[150px]"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-4 rounded-2xl font-bold text-xl">إرسال كصديق سري</button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">آخر الرسائل</h2>
        {db.messages.map(msg => {
          const target = db.members.find(m => m.id === msg.toMemberId);
          return (
            <div key={msg.id} className="bg-white/5 border border-white/5 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-pink-500 font-bold">إلى: {target?.name || 'عضو محذوف'}</span>
                <span className="text-[10px] text-gray-500">{new Date(msg.createdAt).toLocaleDateString('ar-SA')}</span>
              </div>
              <p className="text-gray-300 italic">"{msg.text}"</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecretFriend;
