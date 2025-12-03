import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Shield, X, Bot, Plus, BookOpen, GraduationCap, Sparkles, Activity, Clock, ChevronRight, ArrowUpRight, MoreHorizontal, Calendar, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sendNotification } from '@/utils/notifications';
import { generateStudentReport } from '@/utils/aiGenerator';
import { toast } from 'sonner';

// Components
import StatsGrid from '@/components/dashboard/StatsGrid';
import StudentTable from '@/components/dashboard/StudentTable';
import StudentDialog from '@/components/dashboard/StudentDialog';
import NotificationModal from '@/components/dashboard/NotificationModal';
import AIReportModal from '@/components/dashboard/AIReportModal';
import AgentAssistantModal from '@/components/dashboard/AgentAssistantModal';
import UniversityList from '@/components/dashboard/UniversityList';
import BrainstormPage from '@/components/dashboard/BrainstormPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage({ view: propView }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const view = propView || searchParams.get('view') || 'dashboard';
  
  const setView = (newView) => {
    setSearchParams({ view: newView });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showConflictGuard, setShowConflictGuard] = useState(true);

  // Modals State
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);

  // --- Data Fetching ---
  const fetchStudents = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*, applications(university_name, status)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error.message);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- Actions ---
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this student?")) return;
    try {
      const { error } = await supabase.from('students').delete().match({ id });
      if (error) throw error;
      setStudents(students.filter(s => s.id !== id));
      toast.success('Student removed successfully');
    } catch (error) {
      toast.error('Error deleting student: ' + error.message);
    }
  };

  const handleSaveStudent = async (formData) => {
    const data = Object.fromEntries(formData);
    try {
      if (editingStudent) {
        const { error } = await supabase.from('students').update(data).match({ id: editingStudent.id });
        if (error) throw error;
        toast.success('Student updated successfully');
      } else {
        data.checklist = [
          { id: 'wassce', label: "WASSCE/SSCE Results", checked: false },
          { id: 'transcripts', label: "High School Transcripts", checked: false },
          { id: 'passport', label: "Passport Data Page", checked: false },
          { id: 'personal_statement', label: "Personal Statement", checked: false },
          { id: 'recommendations', label: "Recommendation Letters", checked: false },
          { id: 'english', label: "English Proficiency (IELTS/TOEFL)", checked: false },
          { id: 'cv', label: "CV/Resume", checked: false },
          { id: 'financial', label: "Financial Documents", checked: false }
        ];
        const { error } = await supabase.from('students').insert([data]);
        if (error) throw error;
        toast.success('Student added successfully');
      }
      fetchStudents();
      setShowStudentModal(false);
      setEditingStudent(null);
    } catch (error) {
      toast.error('Error saving data: ' + error.message);
    }
  };

  const handleSendNotification = async (channelId) => {
    if (!selectedStudent) return;
    let recipient = selectedStudent.email;
    if (channelId === 'whatsapp' || channelId === 'sms') {
      recipient = selectedStudent.phone;
      if (!recipient) {
        toast.error(`Phone number required for ${channelId}`);
        return;
      }
    } else if (channelId === 'telegram') {
      recipient = selectedStudent.telegram_chat_id;
      if (!recipient) {
        toast.error(`Telegram Chat ID required. Edit student to add it.`);
        return;
      }
    }
    const result = await sendNotification(channelId, recipient, "Update on your application");
    if (result.success) {
      toast.success(result.message);
      setShowNotifModal(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleGenerateReport = async (student) => {
    setSelectedStudent(student);
    setShowAiModal(true);
    setGeneratingReport(true);
    setAiReport(null);
    try {
      const report = await generateStudentReport(student);
      setAiReport(report);
      toast.success('Report generated successfully');
    } catch (e) {
      toast.error("Failed to generate report");
    } finally {
      setGeneratingReport(false);
    }
  };

  // --- Stats & Derived Data ---
  const stats = useMemo(() => {
    return {
      total: students.length,
      submitted: students.filter(s => ["Submitted", "Accepted", "Visa Pending"].includes(s.status)).length,
      missingDocs: students.filter(s => ["Missing", "Partial"].includes(s.docs)).length,
      upcomingDeadlines: students.filter(s => {
        if (!s.deadline) return false;
        const date = new Date(s.deadline);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays > 0 && diffDays <= 30;
      }).length
    };
  }, [students]);

  const recentActivity = useMemo(() => {
    return students.slice(0, 6).map(student => ({
      id: student.id,
      type: 'student_added',
      studentName: student.name,
      date: student.created_at,
      details: `New student profile created`
    }));
  }, [students]);

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-red-100">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Required</h2>
          <p className="text-gray-600 mb-6">
            Please connect your Supabase project by adding your credentials to <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env.local</code>.
          </p>
        </div>
      </div>
    );
  }

  // --- Dynamic Header Configuration ---
  const headerConfig = {
    dashboard: {
      title: "Dashboard",
      description: "Overview of your student pipeline.",
      actions: (
        <>
          <Button onClick={() => setShowAgentModal(true)} variant="outline" className="gap-2 flex-1 md:flex-none">
            <Bot size={16} /> Agent Tools
          </Button>
          <Button onClick={() => { setEditingStudent(null); setShowStudentModal(true); }} className="gap-2 flex-1 md:flex-none">
            <Plus size={16} /> Add Student
          </Button>
        </>
      )
    },
    list: {
      title: "Students",
      description: "Manage and track all student applications.",
      actions: (
        <Button onClick={() => { setEditingStudent(null); setShowStudentModal(true); }} className="gap-2 flex-1 md:flex-none">
          <Plus size={16} /> Add Student
        </Button>
      )
    },
    universities: {
      title: "University Database",
      description: "Browse and research universities for your students.",
      actions: (
        <Button variant="outline" className="gap-2 flex-1 md:flex-none">
          <Filter size={16} /> Advanced Filter
        </Button>
      )
    },
    brainstorm: {
      title: "AI Brainstorm",
      description: "Generate personalized university recommendations.",
      actions: (
        <Button onClick={() => setShowAgentModal(true)} variant="outline" className="gap-2 flex-1 md:flex-none">
          <Bot size={16} /> Agent Assistant
        </Button>
      )
    },
    settings: {
      title: "Settings",
      description: "Manage your account and preferences.",
      actions: null
    }
  };

  const currentHeader = headerConfig[view] || headerConfig.dashboard;

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{currentHeader.title}</h1>
          <p className="text-muted-foreground">{currentHeader.description}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {currentHeader.actions}
        </div>
      </div>

      {view === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <StatsGrid stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed / Activity */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="dashboard-card h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                       <Activity size={16} /> Recent Activity
                    </CardTitle>
                    <CardDescription>Latest updates across all students</CardDescription>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="ghost" size="icon" className="h-8 w-8"><Filter size={14} /></Button>
                     <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="divide-y">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex gap-4 p-4 hover:bg-secondary/20 transition-colors group">
                          <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
                            <Activity size={14} className="text-primary" />
                          </div>
                          <div className="flex-1 pt-0.5">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  <span className="font-semibold hover:underline cursor-pointer">{activity.studentName}</span> was added to the system.
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                  <Clock size={10} />
                                  {new Date(activity.date).toLocaleDateString()} • {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <Activity size={24} className="mx-auto mb-2 opacity-20" />
                        <p>No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="dashboard-card">
                <CardHeader className="pb-3 border-b bg-secondary/10">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 p-4">
                  <Button variant="outline" className="w-full justify-start gap-2 h-10 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all" onClick={() => setView('brainstorm')}>
                    <Sparkles size={16} className="text-purple-500" /> AI Brainstorm
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 h-10 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all" onClick={() => setView('universities')}>
                    <GraduationCap size={16} className="text-blue-500" /> Browse Universities
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 h-10 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all" onClick={() => { setEditingStudent(null); setShowStudentModal(true); }}>
                    <Plus size={16} className="text-green-500" /> Add New Student
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card className="dashboard-card">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                  <Badge variant="secondary" className="text-[10px] font-normal">Next 30 Days</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {students.filter(s => s.deadline).slice(0, 4).map(student => (
                      <div key={student.id} className="flex items-center gap-3 p-3 hover:bg-secondary/20 transition-colors cursor-pointer group">
                        <div className="h-8 w-8 rounded-md bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0 border border-red-100">
                          <Calendar size={14} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(student.deadline).toLocaleDateString()}</p>
                        </div>
                        <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    {students.filter(s => s.deadline).length === 0 && (
                      <div className="text-center py-6 text-muted-foreground text-xs">
                        <Clock size={20} className="mx-auto mb-2 opacity-20" />
                        No upcoming deadlines
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      
      {view === 'universities' && <UniversityList />}
      
      {view === 'brainstorm' && <BrainstormPage />}

      {(view === 'list') && (
        <StudentTable 
          students={students}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onEdit={(s) => { setEditingStudent(s); setShowStudentModal(true); }}
          onDelete={handleDelete}
          onNotify={(s) => { setSelectedStudent(s); setShowNotifModal(true); }}
          onGenerateReport={handleGenerateReport}
          onAdd={() => { setEditingStudent(null); setShowStudentModal(true); }}
        />
      )}

      {/* Modals */}
      <StudentDialog 
        open={showStudentModal} 
        onOpenChange={setShowStudentModal}
        student={editingStudent}
        onSave={handleSaveStudent}
      />

      <NotificationModal 
        open={showNotifModal}
        onOpenChange={setShowNotifModal}
        student={selectedStudent}
        onSend={handleSendNotification}
      />

      <AIReportModal 
        open={showAiModal}
        onOpenChange={setShowAiModal}
        report={aiReport}
        loading={generatingReport}
      />

      <AgentAssistantModal 
        open={showAgentModal}
        onOpenChange={setShowAgentModal}
      />
    </>
  );
}
