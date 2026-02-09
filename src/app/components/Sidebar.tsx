import { BarChart2, History, LayoutDashboard, Newspaper, PieChart, User, LogOut } from "lucide-react";
import { Scenario } from "@/lib/historicalScenarios";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeScenario?: Scenario | null;
  username?: string | null;
  onLogout?: () => void;
}

export function Sidebar({ activeTab, onTabChange, activeScenario, username, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'market', icon: BarChart2, label: 'Market' },
    { id: 'portfolio', icon: PieChart, label: 'Portfolio' },
    { id: 'news', icon: Newspaper, label: 'News' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-950 border-r border-gray-800 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 text-blue-500 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            Q
          </div>
          <span className="text-xl font-bold text-white tracking-wider">QUANTUM</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                ? 'bg-blue-600/10 text-blue-500 font-medium border border-blue-600/20'
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Historical Scenarios Button */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <button
            onClick={() => onTabChange('scenarios')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeScenario
              ? 'bg-purple-600/20 text-purple-400 font-medium border border-purple-600/30'
              : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
          >
            <History className="w-5 h-5" />
            <div className="flex-1 text-left">
              <span>{activeScenario ? activeScenario.name : 'Scenarios'}</span>
              {activeScenario && (
                <span className="block text-xs text-purple-300/60">Simulation Active</span>
              )}
            </div>
            {activeScenario && (
              <span className="text-lg">{activeScenario.icon}</span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-gray-900">
        {/* User Profile Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{username || 'User'}</p>
            <p className="text-xs text-gray-500">Trader</p>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-3 transition-colors w-full px-4 py-2 rounded-xl ${activeTab === 'profile'
              ? 'bg-purple-600/10 text-purple-400 font-medium border border-purple-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-3 transition-colors w-full px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-900/10"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}