import React, { useState } from 'react';
import { LayoutDashboard, UploadCloud, FileText, Settings, BarChart3 } from 'lucide-react';
import UploadView from './components/UploadView';
import DashboardView from './components/DashboardView';

const App = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const navItems = [
    { id: 'upload', label: 'Upload Invoice', icon: UploadCloud },
    { id: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold flex items-center gap-2 text-primary">
            <FileText className="w-6 h-6" />
            <span>InvoiceAI</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">System Online</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'upload' ? <UploadView /> : <DashboardView />}
        </div>
      </main>
    </div>
  );
};

export default App;