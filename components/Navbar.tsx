
import React from 'react';
import { Link } from 'react-router-dom';
import { Member } from '../types';

interface Props {
  adminMode: boolean;
  currentUser: Member | null;
}

const Navbar: React.FC<Props> = ({ adminMode, currentUser }) => {
  return (
    <nav className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-black tracking-tighter text-blue-500 hover:text-blue-400 transition-colors">
          MYSTERY <span className="text-white text-sm font-normal">CLAN</span>
        </Link>
        
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-400">الرئيسية</Link>
          <Link to="/members" className="hover:text-blue-400">الأعضاء</Link>
          <Link to="/games" className="hover:text-blue-400">الألعاب</Link>
          <Link to="/giveaways" className="hover:text-blue-400">قيف اواي</Link>
          <Link to="/content/news" className="hover:text-blue-400">الأخبار</Link>
          <Link to="/secret-friend" className="hover:text-blue-400">الصديق السري</Link>
          {adminMode && <Link to="/admin" className="text-yellow-400 font-bold">لوحة الأدمن</Link>}
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{currentUser.name}</span>
              <img src={currentUser.image || 'https://picsum.photos/40'} className="w-8 h-8 rounded-full border border-blue-500" alt="" />
            </div>
          )}
          {!adminMode && <Link to="/admin" className="text-gray-500 hover:text-white">🔐</Link>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
