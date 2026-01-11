
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDB } from '../storage';

const BirthdayPage: React.FC<{ db: ReturnType<typeof getDB> }> = ({ db }) => {
  const { id } = useParams<{ id: string }>();
  const member = db.members.find(m => m.id === id);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  if (!member) return <div className="text-center py-20">العضو غير موجود</div>;

  return (
    <div className="max-w-4xl mx-auto text-center space-y-12 py-10">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-pink-500 blur-[100px] opacity-20"></div>
        <img src={member.image} className="w-64 h-64 rounded-full object-cover border-8 border-pink-500/20 relative z-10" alt="" />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-pink-600 px-8 py-2 rounded-full font-black text-2xl z-20 shadow-xl">HBD! 🎂</div>
      </div>

      <div>
        <h1 className="text-5xl md:text-7xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          عيد ميلاد سعيد يا {member.name}!
        </h1>
        <p className="text-2xl text-gray-400">اليوم نحتفل بأحد أعمدة كلان مستري المميزين</p>
      </div>

      <div className="bg-slate-900/50 p-8 rounded-3xl border border-pink-500/20 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-6">اترك كلمة للذكرى 👇</h3>
        <div className="flex gap-4 mb-8">
          <input 
            placeholder="اكتب تهنئتك هنا..." 
            className="flex-1 bg-black/30 p-4 rounded-2xl border border-white/10"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button 
            onClick={() => { if(comment) { setComments([comment, ...comments]); setComment(''); } }}
            className="bg-pink-600 px-8 py-4 rounded-2xl font-bold"
          >
            نشر
          </button>
        </div>

        <div className="space-y-4 text-right">
          {comments.map((c, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 animate-slide-in">
              {c}
            </div>
          ))}
          {comments.length === 0 && <p className="text-center text-gray-600">كن أول المهنئين!</p>}
        </div>
      </div>

      <Link to="/" className="inline-block text-gray-500 hover:text-white transition-colors">← العودة للرئيسية</Link>
    </div>
  );
};

export default BirthdayPage;
