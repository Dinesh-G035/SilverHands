import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';
import { useApp } from '../context';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'explore', label: 'Explore', icon: Search, path: '/services' },
  { id: 'add', label: 'Add', icon: PlusCircle, path: '/add' },
  { id: 'messages', label: 'Messages', icon: MessageCircle, path: '/messages' },
  { id: 'profile', label: 'Profile', icon: User, path: '/dashboard' },
];

export default function BottomNav() {
  const { currentTab, setCurrentTab } = useApp();
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setCurrentTab(tab.id);
    navigate(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 md:hidden" id="bottom-nav">
      <div className="flex items-center justify-around h-[72px] px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const isCenter = tab.id === 'add';
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => handleTabClick(tab)} className={`flex flex-col items-center justify-center gap-1 min-w-[56px] transition-all duration-200 ${isCenter ? 'relative -mt-5' : ''}`} id={`nav-${tab.id}`}>
              {isCenter ? (
                <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-primary-300/50 transition-transform active:scale-90">
                  <Icon className="w-7 h-7 text-white" />
                </div>
              ) : (
                <>
                  <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>{tab.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
