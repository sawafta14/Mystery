
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DB, toBase64 } from '../storage';
import { ContentItem } from '../types';

const ContentSection: React.FC<{ db: DB, updateDB: any, adminMode: boolean }> = ({ db, updateDB, adminMode }) => {
  const { type } = useParams<{ type: string }>();
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState({ text: '', image: '', author: '' });

  const items = db.content.filter(c => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: ContentItem = {
      id: Date.now().toString(),
      type: type as any,
      authorId: 'user',
      authorName: newContent.author || 'عضو مجهول',
      text: newContent.text,
      imageUrl: newContent.image,
      createdAt: Date.now()
    };
    updateDB((prev: any) => ({ ...prev, content: [item, ...prev.content] }));
    setShowAdd(false);
    setNewContent({ text: '', image: '', author: '' });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const b64 = await toBase64(e.target.files[0]);
      setNewContent(prev => ({ ...prev, image: b64 }));
    }
  };

  const titles: Record<string, string> = {
    news: '📰 الأخبار العاجلة',
    photo: '📸 معرض الصور',
    meme: '😂 الذبات والميمز',
    scandal: '😈 أرشيف الفضايح',
    poetry: '✍️ خربشات وشعر',
    dhikr: '🕌 الأذكار والطاعات',
    stream: '📺 الستريمنغ والبثوث'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h1 className="text-5xl font-black tracking-tight">{titles[type!] || 'القسم'}</h1>
        <button onClick={() => setShowAdd(true)} className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all">نشر جديد في القسم</button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="glass p-8 rounded-[40px] space-y-6 animate-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs text-slate-500 mr-2">من الناشر؟</label>
                <select 
                  className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 outline-none focus:border-indigo-500"
                  value={newContent.author}
                  onChange={e => setNewContent({...newContent, author: e.target.value})}
                >
                  <option value="">اختر اسمك...</option>
                  {db.members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs text-slate-500 mr-2">إضافة ميديا</label>
                <label className="flex items-center justify-center w-full h-[58px] bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                  <span className="text-sm font-bold text-slate-400">📷 {newContent.image ? 'تم اختيار صورة' : 'ارفع صورة من جهازك'}</span>
                  <input type="file" hidden accept="image/*" onChange={handleImage} />
                </label>
             </div>
          </div>
          <textarea 
            required
            placeholder="اكتب المحتوى هنا..." 
            className="w-full bg-black/40 p-6 rounded-[30px] border border-white/10 min-h-[150px] outline-none focus:border-indigo-500"
            value={newContent.text}
            onChange={e => setNewContent({...newContent, text: e.target.value})}
          />
          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black">تأكيد النشر أونلاين</button>
            <button type="button" onClick={() => setShowAdd(false)} className="flex-1 glass py-4 rounded-2xl font-bold">إلغاء</button>
          </div>
        </form>
      )}

      <div className="space-y-8">
        {items.length === 0 ? (
          <div className="text-center py-32 glass rounded-[40px] border-dashed border-white/10 text-slate-600 text-xl italic">لا يوجد محتوى في هذا القسم حالياً، كن أنت الأول!</div>
        ) : (
          items.map(item => (
            <div key={item.id} className="glass rounded-[40px] overflow-hidden group border-white/5 hover:border-indigo-500/20 transition-all duration-500 shadow-xl shadow-black/40">
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-black text-xl shadow-lg">
                    {item.authorName[0]}
                  </div>
                  <div>
                    <div className="font-black text-lg">{item.authorName}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(item.createdAt).toLocaleString('ar-SA')}</div>
                  </div>
                </div>
                {adminMode && (
                  <button 
                    onClick={() => updateDB((prev: any) => ({ ...prev, content: prev.content.filter((c: any) => c.id !== item.id) }))}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-2xl text-xs font-bold transition-all"
                  >
                    🗑️ مسح الأدمن
                  </button>
                )}
              </div>
              <div className="px-8 pb-8 text-xl leading-relaxed font-light text-slate-200">{item.text}</div>
              {item.imageUrl && (
                <div className="relative group">
                   <img src={item.imageUrl} className="w-full object-cover max-h-[800px] border-t border-white/5" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentSection;
