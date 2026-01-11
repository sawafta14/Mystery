
import React, { useState } from 'react';
import { getDB, saveDB } from '../storage';

const AdminDashboard: React.FC<{ db: ReturnType<typeof getDB>, updateDB: any, onLogin: (p: string) => boolean, adminMode: boolean }> = ({ db, updateDB, onLogin, adminMode }) => {
  const [pass, setPass] = useState('');

  if (!adminMode) {
    return (
      <div className="max-w-md mx-auto pt-20">
        <div className="glass p-10 rounded-[40px] border-indigo-500/20 text-center space-y-8">
          <div className="text-7xl">🛡️</div>
          <h2 className="text-3xl font-black">إثبات الهوية</h2>
          <p className="text-slate-500">تحتاج لصلاحية "SVO" للوصول للتحكم الكامل</p>
          <input 
            type="password" 
            placeholder="كلمة السر" 
            className="w-full bg-black/40 p-5 rounded-2xl text-center border border-white/10 outline-none focus:border-indigo-500 transition-all"
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
          <button 
            onClick={() => { if(!onLogin(pass)) alert('الكلمة خاطئة!'); }}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/20"
          >
            تفعيل الوصول
          </button>
        </div>
      </div>
    );
  }

  const deleteAnything = (type: 'content' | 'messages' | 'giveaways' | 'rooms', id: string) => {
    if(confirm('هل أنت متأكد من الحذف النهائي؟')) {
      updateDB((prev: any) => ({
        ...prev,
        [type]: prev[type].filter((x: any) => x.id !== id)
      }));
    }
  };

  const setBest = (id: string) => {
    updateDB((prev: any) => ({ ...prev, bestMemberId: id }));
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h1 className="text-5xl font-black tracking-tighter">مركز الإدارة المطلق 👑</h1>
        <button onClick={() => window.location.reload()} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-8 py-3 rounded-2xl font-black border border-red-500/30 transition-all">تسجيل الخروج</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* إدارة الأعضاء */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass rounded-[40px] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black">إدارة الأعضاء ({db.members.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-black/20 text-slate-500 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="p-6">العضو</th>
                    <th className="p-6">النجم</th>
                    <th className="p-6">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {db.members.map(m => (
                    <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6 flex items-center gap-4">
                        <img src={m.image} className="w-12 h-12 rounded-2xl object-cover border border-white/10" alt="" />
                        <div>
                          <div className="font-black">{m.name}</div>
                          <div className="text-xs text-indigo-400">@{m.username}</div>
                        </div>
                      </td>
                      <td className="p-6">
                        <button 
                          onClick={() => setBest(m.id)}
                          className={`px-5 py-2 rounded-full text-[10px] font-black tracking-tighter transition-all ${db.bestMemberId === m.id ? 'bg-yellow-500 text-black' : 'bg-white/5 text-slate-500 hover:text-white border border-white/5'}`}
                        >
                          {db.bestMemberId === m.id ? 'CURRENT STAR' : 'SET AS STAR'}
                        </button>
                      </td>
                      <td className="p-6">
                        <button onClick={() => updateDB((prev: any) => ({ ...prev, members: prev.members.filter((x: any) => x.id !== m.id) }))} className="text-red-500 p-3 hover:bg-red-500/10 rounded-2xl transition-all">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* إدارة الرسائل السرية */}
          <section className="glass p-8 rounded-[40px] space-y-6">
            <h2 className="text-2xl font-black">الرسائل السرية ({db.messages.length})</h2>
            <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2">
              {db.messages.map(msg => (
                <div key={msg.id} className="flex justify-between items-start bg-white/5 p-5 rounded-3xl border border-white/5">
                  <div className="space-y-1">
                    <div className="text-xs text-pink-400 font-bold">إلى: {db.members.find(m => m.id === msg.toMemberId)?.name}</div>
                    <p className="text-slate-300 italic">"{msg.text}"</p>
                  </div>
                  <button onClick={() => deleteAnything('messages', msg.id)} className="text-red-500 opacity-50 hover:opacity-100">حذف</button>
                </div>
              ))}
              {db.messages.length === 0 && <p className="text-center text-slate-600 py-10">لا توجد رسائل حالياً</p>}
            </div>
          </section>
        </div>

        {/* أدوات سريعة */}
        <div className="space-y-8">
          <section className="glass p-8 rounded-[40px] space-y-6 border-red-500/20">
            <h2 className="text-2xl font-black text-red-500">أدوات التطهير</h2>
            <div className="space-y-4">
              <button onClick={() => { if(confirm('حذف كل الأخبار والصور؟')) updateDB((prev: any) => ({ ...prev, content: [] })) }} className="w-full glass py-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 transition-all border-red-500/20">حذف كل المحتوى</button>
              <button onClick={() => { if(confirm('حذف كل الغرف؟')) updateDB((prev: any) => ({ ...prev, gameRooms: [] })) }} className="w-full glass py-4 rounded-2xl font-bold hover:bg-white/5 transition-all">تصفير غرف الألعاب</button>
              <button onClick={() => { if(confirm('حذف كل الجوائز؟')) updateDB((prev: any) => ({ ...prev, giveaways: [] })) }} className="w-full glass py-4 rounded-2xl font-bold hover:bg-white/5 transition-all">مسح القيف اواي</button>
            </div>
          </section>

          <section className="glass p-8 rounded-[40px] bg-indigo-600/10 border-indigo-500/20">
            <h2 className="text-xl font-black text-indigo-400 mb-4">حالة النظام أونلاين</h2>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
               <span className="font-bold text-sm">Real-time Broadcast: ACTIVE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">المزامنة تعمل الآن عبر جميع الأجهزة المتصلة. أي إجراء ستتخذه هنا سيتم تنفيذه فوراً عند بقية المستخدمين دون تأخير.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
