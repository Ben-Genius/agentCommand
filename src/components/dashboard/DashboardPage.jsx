import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Shield, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sendNotification } from '@/utils/notifications';
import { generateStudentReport } from '@/utils/aiGenerator';
import { toast } from 'sonner';

// Components
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsGrid from '@/components/dashboard/StatsGrid';
import StudentTable from '@/components/dashboard/StudentTable';
import StudentDialog from '@/components/dashboard/StudentDialog';
import NotificationModal from '@/components/dashboard/NotificationModal';
import AIReportModal from '@/components/dashboard/AIReportModal';
import AgentAssistantModal from '@/components/dashboard/AgentAssistantModal';
import UniversityList from '@/components/dashboard/UniversityList';
import StudentProfilePage from '@/components/dashboard/StudentProfilePage';
import BrainstormPage from '@/components/dashboard/BrainstormPage';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

import { ModeToggle } from '@/components/mode-toggle';

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
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
      const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
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
    // We'll use a custom toast for confirmation or keep confirm() for now as it's a blocking action
    // For better UX, we could use a Dialog, but confirm() is acceptable for "quick" delete if not requested otherwise.
    // The user asked to replace "alert", confirm is slightly different but let's stick to replacing alerts.
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
        // Add default checklist for Ghana students
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

  // --- Stats ---
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

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Connecting to Supabase...</p>
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
          <div className="bg-gray-50 p-4 rounded-lg text-left text-sm font-mono text-gray-700 overflow-x-auto">
            VITE_SUPABASE_URL=...<br/>
            VITE_SUPABASE_ANON_KEY=...
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout view={view} setView={setView}>
      {/* Conflict Guard */}
      {showConflictGuard && (
        <div className="mb-8 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg shadow-sm flex items-start justify-between">
          <div className="flex gap-3">
            <Shield className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-sm font-bold text-amber-800">Agent Protocol Active</h3>
              <p className="text-sm text-amber-700 mt-1">
                Remember: Always use <strong>Incognito Mode</strong> when logging into student portals.
              </p>
            </div>
          </div>
          <button onClick={() => setShowConflictGuard(false)} className="text-amber-500 hover:text-amber-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* View Content */}
      <div className="flex justify-end mb-4 gap-2">
        <ModeToggle />
        <Button onClick={() => setShowAgentModal(true)} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
          <Bot size={18} /> Agent Tools
        </Button>
      </div>

      {view === 'dashboard' && <StatsGrid stats={stats} />}
      
      {view === 'universities' && <UniversityList />}
      
      {view === 'brainstorm' && <BrainstormPage />}

      {view === 'profile' && selectedStudent ? (
        <StudentProfilePage 
          student={selectedStudent} 
          onBack={() => { setView('list'); setSelectedStudent(null); }} 
          onUpdate={(updatedStudent) => {
            setSelectedStudent(updatedStudent);
            setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
          }}
        />
      ) : view === 'list' || view === 'dashboard' ? ( // Show table on dashboard or list view
        <StudentTable 
          students={students}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onEdit={(s) => { setEditingStudent(s); setShowStudentModal(true); }}
          onDelete={handleDelete}
          onNotify={(s) => { setSelectedStudent(s); setShowNotifModal(true); }}
          onGenerateReport={handleGenerateReport}
          onAdd={() => { setEditingStudent(null); setShowStudentModal(true); }}
          onViewProfile={(s) => { setSelectedStudent(s); setView('profile'); }}
        />
      ) : null}

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
    </DashboardLayout>
  );
}
