import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  Bell, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Command,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Students', path: '/dashboard/students' },
    { icon: GraduationCap, label: 'Universities', path: '/dashboard/universities' },
    { icon: Sparkles, label: 'Brainstorm', path: '/dashboard/brainstorm' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard' && !location.search) return location.pathname === '/dashboard';
    return location.pathname + location.search === path;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col border-r bg-card transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-[70px]' : 'w-[240px]'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center px-4 border-b">
          <div className={`flex items-center gap-2 font-semibold text-lg overflow-hidden whitespace-nowrap ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="h-8 w-8 flex items-center justify-center flex-shrink-0">
              <img src="/src/assets/logo.png" alt="AgentCommand Logo" className="h-8 w-8 object-contain" />
            </div>
            {!isSidebarCollapsed && <span className="truncate">AgentCommand</span>}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={`w-full justify-start ${isSidebarCollapsed ? 'px-2 justify-center' : 'px-3'} mb-1`}
                onClick={() => navigate(item.path)}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <item.icon size={20} className={isSidebarCollapsed ? '' : 'mr-3'} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-center"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
          
          <div className={`mt-2 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/login');
              }}
            >
              <LogOut size={18} className="mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 border-b bg-card flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <div className="h-14 flex items-center px-4 border-b font-bold text-lg gap-2">
                  <img src="/src/assets/logo.png" alt="AgentCommand Logo" className="h-6 w-6 object-contain" />
                  AgentCommand
                </div>
                <nav className="p-4 space-y-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon size={20} className="mr-3" />
                      {item.label}
                    </Button>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate('/login');
                    }}
                  >
                    <LogOut size={20} className="mr-3" />
                    Sign Out
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Search Bar */}
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students, applications..." 
                className="pl-9 h-9 bg-secondary/50 border-transparent focus:bg-background focus:border-input transition-all"
              />
              <div className="absolute right-2.5 top-2.5 hidden md:flex items-center gap-1">
                <Badge variant="outline" className="h-5 px-1 text-[10px] text-muted-foreground">⌘K</Badge>
              </div>
            </div>
          </div>



          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive cursor-pointer"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/login');
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-secondary/10">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
