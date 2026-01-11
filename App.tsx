
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { getDB, saveDB, isAdmin, onDBSync } from './storage';
import { Member } from './types';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Members from './pages/Members';
import ContentSection from './pages/ContentSection';
import AdminDashboard from './pages/AdminDashboard';
import SecretFriend from './pages/SecretFriend';
import Games from './pages/Games';
import Giveaways from './pages/Giveaways';
import BirthdayPage from './pages/BirthdayPage';

const App: React.FC = () => {
  const [db, setDb] = useState(getDB());
  const [adminMode, setAdminMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);

  useEffect(() => {
    const refresh = () => setDb(getDB());
    window.addEventListener('storage', refresh);
    onDBSync(refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  const updateDB = (updater: (prev: ReturnType<typeof getDB>) => ReturnType<typeof getDB>) => {
    const next = updater(getDB());
    setDb(next);
    saveDB(next);
  };

  const today = new Date().toISOString().split('T')[0].slice(5);
  const birthdayMember = db.members.find(m => m.birthDate?.slice(5) === today);

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#020617] text-slate-100 pb-20 md:pb-10">
        <Navbar adminMode={adminMode} currentUser={currentUser} />
        
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {birthdayMember && (
            <Link to={`/birthday/${birthdayMember.id}`} className="block mb-8 group">
              <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-[2px] rounded-2xl animate-pulse">
                <div className="bg-slate-900 rounded-[14px] p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">🎂</span>
                    <div>
                      <h3 className="text-xl font-black text-white">اليوم هو عيد ميلاد {birthdayMember.name}!</h3>
                      <p className="text-slate-400 text-sm">اضغط هنا للاحتفال وترك رسالة تهنئة</p>
                    </div>
                  </div>
                  <span className="bg-white text-black px-4 py-2 rounded-xl font-bold group-hover:scale-110 transition-transform">دخول الحفلة</span>
                </div>
              </div>
            </Link>
          )}
          
          <Routes>
            <Route path="/" element={<Home db={db} />} />
            <Route path="/members" element={<Members db={db} updateDB={updateDB} adminMode={adminMode} setCurrentUser={setCurrentUser} />} />
            <Route path="/content/:type" element={<ContentSection db={db} updateDB={updateDB} adminMode={adminMode} />} />
            <Route path="/admin" element={<AdminDashboard db={db} updateDB={updateDB} onLogin={(p) => { if(isAdmin(p)) { setAdminMode(true); return true; } return false; }} adminMode={adminMode} />} />
            <Route path="/secret-friend" element={<SecretFriend db={db} updateDB={updateDB} />} />
            <Route path="/games" element={<Games db={db} updateDB={updateDB} />} />
            <Route path="/giveaways" element={<Giveaways db={db} updateDB={updateDB} adminMode={adminMode} />} />
            <Route path="/birthday/:id" element={<BirthdayPage db={db} />} />
          </Routes>
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden glass border-t border-white/5 p-3 flex justify-around items-center z-[100]">
          <Link to="/" className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-white">
            <span className="text-xl">🔥</span>الرئيسية
          </Link>
          <Link to="/members" className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-white">
            <span className="text-xl">👥</span>الأعضاء
          </Link>
          <Link to="/games" className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-white">
            <span className="text-xl">🎮</span>الألعاب
          </Link>
          <Link to="/giveaways" className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-white">
            <span className="text-xl">🎁</span>الجوائز
          </Link>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
