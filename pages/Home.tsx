
import React from 'react';
import { Link } from 'react-router-dom';
import { DB } from '../storage';

const Home: React.FC<{ db: DB }> = ({ db }) => {
  const bestMember = db.members.find(m => m.id === db.bestMemberId);
  const latestNews = db.content.filter(c => c.type === 'news').slice(0, 3);
  const latestPhotos = db.content.filter(c => c.type === 'photo').slice(0, 6);

  // منطق التحقق من عيد الميلاد التلقائي
  const today = new Date().toISOString().split('T')[0].slice(5); // صيغة MM-DD
  const birthdayMembers = db.members.filter(m => m.birthDate?.slice(5) === today);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* قسم عيد الميلاد الأسطوري - يظهر تلقائياً */}
      {birthdayMembers.length > 0 && (
        <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-[2px] shadow-2xl shadow-pink-500/10">
          <div className="bg-[#020617]/90 rounded-[39px] p-8 md:p-16 text-center relative overflow-hidden">
            {/* عناصر زينة متحركة */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-10 left-10 animate-bounce text-5xl">✨</div>
              <div className="absolute bottom-10 right-10 animate-pulse text-5xl">⭐</div>
              <div className="absolute top-1/2 left-20 animate-spin text-4xl">🎁</div>
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="inline-block px-6 py-2 rounded-full bg-pink-500/20 text-pink-400 font-bold text-sm tracking-tighter uppercase border border-pink-500/30">
                Special Event • حدث خاص
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-glow">
                ميلاد أسطورة في مستري!
              </h2>
              
              {birthdayMembers.map(m => (
                <div key={m.id} className="space-y-6 animate-in zoom-in duration-700">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-pink-500 blur-3xl opacity-20"></div>
                    <img src={m.image} className="w-40 h-40 rounded-full mx-auto border-4 border-white/10 shadow-2xl relative z-10 object-cover" alt="" />
                  </div>
                  <h3 className="text-4xl font-black text-white">{m.name}</h3>
                  <div className="max-w-3xl mx-auto">
                    <p className="text-xl text-slate-300 leading-relaxed font-light italic">
                      "في هذا اليوم الاستثنائي، لا نحتفل بمجرد مرور سنة، بل نحتفل بوجودك الذي يضيء أركان Mystery. أنت لست مجرد عضو عابر في سيرفر Arena، بل أنت أحد الأعمدة التي تمنحنا الهيبة والقوة. كلمات التهنئة لا تكفيك، فأنت الروح التي تجعل الانتصارات أحلى والتحديات أسهل. نتمنى لك عاماً يملؤه الفرح والتميز، وأن تظل دائماً في القمة حيث تنتمي. كل عام وأنت فخر لمستري!"
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 pt-4">
                    <Link to={`/birthday/${m.id}`} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-pink-600/20">
                      انضم للاحتفال وبارك له 💌
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hero Section مع خلفية الهوية */}
      <section className="relative h-[550px] rounded-[40px] overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/40 z-10"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0"></div>
        
        <div className="relative z-20 space-y-6 px-4">
          <div className="inline-block px-4 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-bold mb-4 tracking-widest uppercase animate-pulse">
            Established 2 Years Ago • Arena Elite
          </div>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-glow italic leading-none">
            MYSTERY
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            الكلان الذي لا يغيب شمسه عن سماء Arena. نجمع بين الهيبة، القوة، والأخوة تحت سقف واحد.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Link to="/members" className="bg-indigo-600 hover:bg-indigo-500 px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-indigo-600/30">انضم للأساتذة</Link>
            <Link to="/games" className="glass hover:bg-white/10 px-12 py-5 rounded-2xl font-black text-xl transition-all">الألعاب أونلاين</Link>
          </div>
        </div>
      </section>

      {/* الأقسام التفاعلية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex justify-between items-end border-b border-white/5 pb-4">
            <h2 className="text-4xl font-black flex items-center gap-4">
              <span className="w-3 h-10 bg-indigo-600 rounded-full"></span>
              أخبار الكلـان
            </h2>
            <Link to="/content/news" className="text-indigo-400 hover:text-white transition-colors text-sm font-bold underline underline-offset-8">مشاهدة الأرشيف</Link>
          </div>
          <div className="grid gap-6">
            {latestNews.length > 0 ? latestNews.map(news => (
              <div key={news.id} className="glass p-6 rounded-[32px] flex flex-col md:flex-row gap-6 hover:border-indigo-500/40 transition-all group">
                {news.imageUrl && (
                  <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={news.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full">{news.authorName}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{new Date(news.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed">{news.text}</p>
                </div>
              </div>
            )) : (
              <div className="text-center p-16 glass rounded-[40px] text-slate-500 italic">لا توجد أخبار عاجلة في الوقت الحالي...</div>
            )}
          </div>

          <div className="flex justify-between items-end border-b border-white/5 pb-4 pt-10">
            <h2 className="text-4xl font-black flex items-center gap-4">
              <span className="w-3 h-10 bg-pink-600 rounded-full"></span>
              معرض الأساطير
            </h2>
            <Link to="/content/photo" className="text-pink-400 hover:text-white transition-colors text-sm font-bold underline underline-offset-8">معرض الصور الكامل</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {latestPhotos.map(p => (
              <div key={p.id} className="aspect-[4/5] rounded-3xl overflow-hidden glass group relative cursor-pointer">
                <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white text-sm font-bold line-clamp-2">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الجانب: أفضل عضو */}
        <div className="space-y-10">
          <div className="glass p-10 rounded-[50px] border-yellow-500/20 relative overflow-hidden group shadow-2xl">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-500/10 blur-[100px] pointer-events-none"></div>
            <h2 className="text-3xl font-black mb-10 text-center flex flex-col items-center gap-2">
              <span className="text-yellow-500">🏆</span>
              نجم الكلـان
            </h2>
            {bestMember ? (
              <div className="text-center space-y-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-yellow-500 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img src={bestMember.image} className="w-56 h-56 rounded-[40px] object-cover relative z-10 border-2 border-yellow-500/50 p-2 bg-[#020617] shadow-2xl" alt="" />
                </div>
                <div>
                  <h3 className="text-4xl font-black tracking-tight">{bestMember.name}</h3>
                  <p className="text-yellow-500/80 font-bold tracking-widest mt-1">@{bestMember.username}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl text-slate-400 italic leading-relaxed text-sm">
                  "{bestMember.bio || 'الكلمات تعجز عن وصف إبداع هذا العضو'}"
                </div>
                <div className="pt-4">
                   <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest">Selected by Admin</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 space-y-4">
                <div className="text-5xl opacity-20 grayscale">🎖️</div>
                <p className="text-slate-500 font-bold">لم يتم اختيار النجم لهذا الأسبوع بعد</p>
              </div>
            )}
          </div>
          
          <div className="glass p-8 rounded-[40px] text-center space-y-4">
             <h4 className="text-indigo-400 font-bold text-sm uppercase tracking-widest">إحصائيات القوة</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl">
                   <div className="text-2xl font-black text-white">{db.members.length}</div>
                   <div className="text-[10px] text-slate-500">عضو نشط</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                   <div className="text-2xl font-black text-white">{db.content.length}</div>
                   <div className="text-[10px] text-slate-500">محتوى منشور</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
