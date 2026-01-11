
import React, { useState } from 'react';
import { DB, toBase64 } from '../storage';
import { Member, Gender } from '../types';

interface Props {
  db: DB;
  updateDB: (updater: (prev: any) => any) => void;
  adminMode: boolean;
  setCurrentUser: (m: Member) => void;
}

const Members: React.FC<Props> = ({ db, updateDB, adminMode, setCurrentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', username: '', bio: '', birthDate: '', gender: Gender.MALE, image: ''
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: Member = {
      ...formData,
      id: Date.now().toString(),
      image: formData.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + formData.username
    };
    updateDB(prev => ({ ...prev, members: [...prev.members, newMember] }));
    setShowForm(false);
    setFormData({ name: '', username: '', bio: '', birthDate: '', gender: Gender.MALE, image: '' });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const b64 = await toBase64(e.target.files[0]);
      setFormData(prev => ({ ...prev, image: b64 }));
    }
  };

  const deleteMember = (id: string) => {
    if (confirm('هل تريد فعلاً حذف هذا العضو؟')) {
      updateDB(prev => ({ ...prev, members: prev.members.filter((m: any) => m.id !== id) }));
    }
  };

  const visibleMembers = db.members;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-5xl font-black mb-2 tracking-tight">نخبة الكلـان</h1>
          <p className="text-slate-400">قائمة الأعضاء الذين يصنعون التاريخ</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-600/20 flex items-center gap-2 group transition-all"
        >
          <span className="text-2xl group-hover:rotate-90 transition-transform">+</span> 
          إضافة عضو جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleMembers.map(member => (
          <div key={member.id} className="glass rounded-[32px] overflow-hidden group hover:border-indigo-500/50 transition-all duration-500">
            <div className="h-24 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 relative">
              {member.isBest && <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase z-10">Legend</div>}
            </div>
            <div className="px-8 pb-8 -mt-12 relative text-center">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <img 
                  src={member.image} 
                  className="w-24 h-24 rounded-[28px] object-cover border-4 border-[#020617] relative z-10 bg-slate-800"
                  alt={member.name} 
                />
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black group-hover:text-indigo-400 transition-colors">{member.name}</h3>
                <p className="text-indigo-500/70 font-bold text-sm tracking-wide">@{member.username}</p>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                  🎂 {member.birthDate}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${member.gender === Gender.FEMALE ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  {member.gender === Gender.FEMALE ? 'أنثى' : 'ذكر'}
                </span>
              </div>
              <p className="mt-6 text-slate-400 text-sm leading-relaxed line-clamp-3 italic">
                "{member.bio || 'هذا العضو يفضل الصمت والعمل في الخفاء...'}"
              </p>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                <button 
                  onClick={() => setCurrentUser(member)}
                  className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  تقمص الشخصية
                </button>
                {adminMode && (
                  <button onClick={() => deleteMember(member.id)} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl transition-all">🗑️</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="glass p-8 rounded-[40px] w-full max-w-xl space-y-6 animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black mb-4">انضم إلى الأساطير</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="الاسم" className="bg-black/40 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="اليوزر @username" className="bg-black/40 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              <div className="space-y-1">
                <label className="text-xs text-slate-500 mr-2">تاريخ الميلاد</label>
                <input type="date" required className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500 mr-2">الجنس</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as Gender})}>
                  <option value={Gender.MALE}>ذكر</option>
                  <option value={Gender.FEMALE}>أنثى</option>
                </select>
              </div>
            </div>
            <textarea placeholder="نبذة عنك (هنا يكتب التاريخ...)" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 h-32 outline-none focus:border-indigo-500" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
            <div className="space-y-2">
              <label className="block text-sm text-slate-400">ارفع صورتك (يجب أن تكون لائقة)</label>
              <input type="file" accept="image/*" onChange={handleImage} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500" />
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black">حفظ البيانات</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/5 py-4 rounded-2xl font-bold">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Members;
