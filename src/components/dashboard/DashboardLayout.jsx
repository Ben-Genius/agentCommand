import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, Users, Settings, LogOut, Menu, BookOpen, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavButton = ({ path, icon: Icon, label }) => (
    <Button
      variant={isActive(path) ? 'secondary' : 'ghost'}
      className="w-full justify-start gap-3"
      onClick={() => { navigate(path); setIsMobileOpen(false); }}
    >
      <Icon size={20} />
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r fixed h-full z-20">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-6 border-b">
            <div className="bg-emerald-600 text-white p-2 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Agent<span className="text-emerald-600">Command</span>
            </h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <NavButton path="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavButton path="/dashboard/students" icon={Users} label="All Students" />
            <NavButton path="/dashboard/universities" icon={BookOpen} label="Universities" />
            <NavButton path="/dashboard/brainstorm" icon={Brain} label="Brainstorm" />
            <NavButton path="/dashboard/settings" icon={Settings} label="Settings" />
          </nav>

          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut size={20} />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-20 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
           <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
            <GraduationCap size={20} />
          </div>
          <span className="font-bold text-lg">AgentCommand</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">

            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 px-6 py-6 border-b">
                <div className="bg-emerald-600 text-white p-2 rounded-lg">
                  <GraduationCap size={24} />
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Agent<span className="text-emerald-600">Command</span>
                </h1>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                <NavButton path="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavButton path="/dashboard/students" icon={Users} label="All Students" />
                <NavButton path="/dashboard/universities" icon={BookOpen} label="Universities" />
                <NavButton path="/dashboard/brainstorm" icon={Brain} label="Brainstorm" />
                <NavButton path="/dashboard/settings" icon={Settings} label="Settings" />
              </nav>

              <div className="p-4 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut size={20} />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
