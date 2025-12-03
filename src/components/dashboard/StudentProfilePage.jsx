import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Plus, Brain, MoreVertical, Trash2, Edit, FileText, 
  ExternalLink, Calendar, MapPin, DollarSign, GraduationCap, 
  School, Loader2, Globe, Lock, BookOpen, GitBranch, Star, 
  Eye, GitPullRequest, PlayCircle, CheckCircle2, AlertCircle, 
  Clock, Send, Mail, Phone, User, Briefcase, Paperclip, 
  MessageSquare, History,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { universities, standardDocuments } from '@/data/universities';

export default function StudentProfilePage({ student, onBack, onUpdate }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState(student);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Upload Dialog State
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadName, setUploadName] = useState('');
  const fileInputRef = useRef(null);
  
  // Dialog States
  const [isAddUniOpen, setIsAddUniOpen] = useState(false);
  const [isCustomUniOpen, setIsCustomUniOpen] = useState(false);
  const [isEditAppOpen, setIsEditAppOpen] = useState(false);
  const [isEditStatsOpen, setIsEditStatsOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Sheet State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [viewApp, setViewApp] = useState(null);
  const [viewUni, setViewUni] = useState(null);
  const [isEditingApp, setIsEditingApp] = useState(false);
  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    fetchApplications();
    fetchLatestStudentData();
    fetchDocuments();
  }, [currentStudent.id]);

  const fetchDocuments = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('student_id', currentStudent.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchLatestStudentData = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', currentStudent.id)
        .single();
      
      if (error) throw error;
      if (data) {
        setCurrentStudent(data);
        if (onUpdate) onUpdate(data);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const fetchApplications = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('student_id', currentStudent.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (app) => {
    setViewApp(app);
    const uni = universities.find(u => u.id === app.university_id);
    console.log(viewApp);
    setViewUni(uni || null);
    setIsSheetOpen(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadFile(file);
    setUploadName(file.name);
    setIsUploadDialogOpen(true);
    e.target.value = '';
  };

  const handleUploadConfirm = async () => {
    if (!uploadFile || !uploadName) return;

    setUploading(true);
    try {
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${currentStudent.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('documents')
        .insert([
          {
            student_id: currentStudent.id,
            name: uploadName,
            file_path: filePath,
            file_type: uploadFile.type,
            size: uploadFile.size
          }
        ]);

      if (dbError) throw dbError;

      toast.success('File uploaded successfully');
      fetchDocuments();
      setIsUploadDialogOpen(false);
      setUploadFile(null);
      setUploadName('');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (doc) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('student-documents')
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      toast.success('Document deleted');
      setDocuments(docs => docs.filter(d => d.id !== doc.id));
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('student-documents')
        .createSignedUrl(doc.file_path, 60);

      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleAddApplication = async (uniOrName) => {
    try {
      const isCustom = typeof uniOrName === 'string';
      const university_id = isCustom ? 'custom' : uniOrName.id;
      const university_name = isCustom ? uniOrName : uniOrName.name;
      
      let deadline = null;
      if (!isCustom && uniOrName.deadline) {
         try {
             const d = new Date(uniOrName.deadline);
             if (!isNaN(d.getTime())) {
                 deadline = d.toISOString().split('T')[0];
             }
         } catch (e) {
             console.log("Could not parse deadline:", uniOrName.deadline);
         }
      }

      const { error } = await supabase.from('applications').insert([{
        student_id: currentStudent.id,
        university_id,
        university_name,
        status: 'Planning',
        deadline,
        checklist: standardDocuments.map(doc => ({ ...doc, status: 'Pending', date: null }))
      }]);
      
      if (error) throw error;
      toast.success(`Added ${university_name}`);
      fetchApplications();
      setIsAddUniOpen(false);
      setIsCustomUniOpen(false);
    } catch (error) {
      toast.error('Failed to add application');
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    if (name) handleAddApplication(name);
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) throw error;
      toast.success('Status updated');
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      if (viewApp && viewApp.id === appId) {
        setViewApp({ ...viewApp, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleDocStatus = async (appId, docId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Submitted' : currentStatus === 'Submitted' ? 'Received' : 'Pending';
    
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const currentChecklist = (app.checklist && app.checklist.length > 0) ? app.checklist : standardDocuments.map(d => ({...d, status: 'Pending'}));

    const updatedChecklist = currentChecklist.map(doc => 
      doc.id === docId ? { ...doc, status: newStatus, date: new Date().toISOString() } : doc
    );

    try {
      const { error } = await supabase
        .from('applications')
        .update({ checklist: updatedChecklist })
        .eq('id', appId);

      if (error) throw error;
      
      const updatedApp = { ...app, checklist: updatedChecklist };
      setApplications(apps => apps.map(a => a.id === appId ? updatedApp : a));
      if (viewApp && viewApp.id === appId) {
        setViewApp(updatedApp);
      }
      toast.success(`Document marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update document status');
    }
  };

  const handleDeleteApplication = async (appId) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', appId);

      if (error) throw error;
      toast.success('Application deleted');
      setApplications(apps => apps.filter(a => a.id !== appId));
      if (viewApp && viewApp.id === appId) setIsSheetOpen(false);
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

  const handleEditSaveDialog = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      university_name: formData.get('university_name'),
      deadline: formData.get('deadline') || null,
      notes: formData.get('notes'),
    };

    try {
      const { error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', selectedApp.id);

      if (error) throw error;
      toast.success('Application updated');
      fetchApplications(); 
      setIsEditAppOpen(false);
      if (viewApp && viewApp.id === selectedApp.id) {
        setViewApp({ ...viewApp, ...updates });
      }
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  const handleEditSaveSheet = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      university_name: formData.get('university_name'),
      deadline: formData.get('deadline'),
      notes: formData.get('notes'),
      status: formData.get('status'),
      program: formData.get('program'),
      supplementary_essay: formData.get('supplementary_essay'),
      bio_info: formData.get('bio_info'),
      custom_fields: customFields,
    };

    try {
      const { error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', viewApp.id);

      if (error) throw error;
      
      const updatedApp = { ...viewApp, ...updates };
      setViewApp(updatedApp);
      setApplications(apps => apps.map(a => a.id === viewApp.id ? updatedApp : a));
      setIsEditingApp(false);
      toast.success('Application updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update application');
    }
  };

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const handleCustomFieldChange = (index, field, value) => {
    const newFields = [...customFields];
    newFields[index][field] = value;
    setCustomFields(newFields);
  };

  const handleDeleteCustomField = (index) => {
    const newFields = customFields.filter((_, i) => i !== index);
    setCustomFields(newFields);
  };

  const handleStatsSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      sat_score: formData.get('sat_score'),
      ielts_score: formData.get('ielts_score'),
      gpa: formData.get('gpa'),
      phone: formData.get('phone'),
      major: formData.get('major'),
      portal: formData.get('portal'),
      interests: formData.get('interests'),
      background: formData.get('background'),
      date_of_birth: formData.get('date_of_birth'),
      address: formData.get('address'),
      school_name: formData.get('school_name'),
      school_address: formData.get('school_address'),
      course_offered: formData.get('course_offered'),
      education_start_date: formData.get('education_start_date'),
      education_end_date: formData.get('education_end_date'),
    };

    try {
      const { error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', currentStudent.id);

      if (error) throw error;
      toast.success('Profile updated');
      const updatedStudent = { ...currentStudent, ...updates };
      setCurrentStudent(updatedStudent);
      if (onUpdate) onUpdate(updatedStudent);
      setIsEditStatsOpen(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAiBrainstorm = async () => {
    toast.info("Asking AI for suggestions...");
    try {
      const { invokeAiAgent } = await import('@/utils/aiGenerator');
      const result = await invokeAiAgent('suggest_universities', { student: currentStudent });
      toast.success("AI Suggestions received! (Check console)");
      console.log("AI Result:", result);
    } catch (error) {
      console.error(error);
      toast.error("AI Brainstorm failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Applied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Applying': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Waitlisted': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Enrolled': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Visa Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {currentStudent.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{currentStudent.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={12} /> {currentStudent.email}
                <span>•</span>
                <Badge variant="outline" className="text-xs font-normal">ID: {String(currentStudent.id).substring(0, 8)}</Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditStatsOpen(true)}>
            <Edit size={14} className="mr-2" /> Edit Profile
          </Button>
          <Button onClick={() => setIsAddUniOpen(true)}>
            <Plus size={14} className="mr-2" /> New Application
          </Button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Profile & Stats (3 cols) */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-muted-foreground" />
                <span className="truncate">{currentStudent.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-muted-foreground" />
                <span>{currentStudent.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-muted-foreground" />
                <span>{currentStudent.address || 'No address'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-muted-foreground" />
                <span>{currentStudent.date_of_birth ? new Date(currentStudent.date_of_birth).toLocaleDateString() : 'No DOB'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Academic Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">GPA</p>
                  <p className="font-semibold">{currentStudent.gpa || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">SAT</p>
                  <p className="font-semibold">{currentStudent.sat_score || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">IELTS</p>
                  <p className="font-semibold">{currentStudent.ielts_score || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Major</p>
                  <p className="font-semibold truncate" title={currentStudent.major}>{currentStudent.major || '-'}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <School size={14} />
                  <span className="truncate">{currentStudent.school_name || 'No School'}</span>
                </div>
                {currentStudent.course_offered && (
                  <p className="text-xs text-muted-foreground pl-6">{currentStudent.course_offered}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card bg-secondary/20 border-dashed">
             <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <Brain size={24} className="text-purple-500" />
                <h3 className="font-medium text-sm">AI Insights</h3>
                <p className="text-xs text-muted-foreground">Get personalized university recommendations based on this profile.</p>
                <Button variant="outline" size="sm" className="w-full" onClick={handleAiBrainstorm}>Generate</Button>
             </CardContent>
          </Card>
        </div>

        {/* Center Column: Activity & Notes (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6 min-h-0">
          <Card className="dashboard-card flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare size={16} /> Notes & Activity
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus size={14} />
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Mock Activity Feed */}
                <div className="flex gap-3">
                  <div className="mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SY</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">System</span>
                      <span className="text-xs text-muted-foreground">Today at 9:41 AM</span>
                    </div>
                    <p className="text-sm text-foreground">Created student profile.</p>
                  </div>
                </div>

                {currentStudent.background && (
                   <div className="flex gap-3">
                    <div className="mt-1">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={14} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Bio</span>
                        <span className="text-xs text-muted-foreground">Background Info</span>
                      </div>
                      <div className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
                        {currentStudent.background}
                      </div>
                    </div>
                  </div>
                )}

                {currentStudent.interests && (
                   <div className="flex gap-3">
                    <div className="mt-1">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Star size={14} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Interests</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {currentStudent.interests}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-secondary/10">
              <div className="flex gap-2">
                <Input placeholder="Add a note..." className="bg-background" />
                <Button size="icon"><Send size={14} /></Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Applications & Documents (4 cols) */}
        <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2">
          {/* Applications List */}
          <Card className="dashboard-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Briefcase size={16} /> Applications
                <Badge variant="secondary" className="ml-1 rounded-full px-1.5 py-0.5 text-[10px]">{applications.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {applications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">No applications yet.</div>
                ) : (
                  applications.map((app) => (
                    <div 
                      key={app.id} 
                      className="p-3 hover:bg-secondary/50 transition-colors cursor-pointer group"
                      onClick={() => handleViewApplication(app)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">{app.university_name}</span>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${getStatusColor(app.status)}`}>
                          {app.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{app.deadline ? new Date(app.deadline).toLocaleDateString() : 'No Deadline'}</span>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>{app.checklist ? app.checklist.filter(d => d.status === 'Received' || d.status === 'Submitted').length : 0}/{app.checklist ? app.checklist.length : 0}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card className="dashboard-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Paperclip size={16} /> Documents
                <Badge variant="secondary" className="ml-1 rounded-full px-1.5 py-0.5 text-[10px]">{documents.length}</Badge>
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => fileInputRef.current?.click()}>
                <Plus size={14} />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {documents.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">No documents uploaded.</div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="p-3 flex items-center justify-between group hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <FileText size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate cursor-pointer hover:underline" onClick={() => handleDownloadDocument(doc)}>{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{(doc.size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => handleDeleteDocument(doc)}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs & Sheets (Keep existing logic, just ensure they render) */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Enter a name for your document.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={uploadName} onChange={(e) => setUploadName(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadConfirm} disabled={!uploadName || uploading}>
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddUniOpen} onOpenChange={setIsAddUniOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add University Application</DialogTitle>
            <DialogDescription>Select a university from our database or add a custom one.</DialogDescription>
          </DialogHeader>
          {!isCustomUniOpen ? (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                {universities.map(uni => (
                  <Button key={uni.id} variant="outline" className="justify-start" onClick={() => handleAddApplication(uni)}>
                    <School className="mr-2 h-4 w-4" />
                    {uni.name}
                  </Button>
                ))}
                <Button variant="ghost" onClick={() => setIsCustomUniOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Custom University
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsCustomUniOpen(false)}>Back</Button>
                <Button type="submit">Add Application</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditStatsOpen} onOpenChange={setIsEditStatsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStatsSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SAT Score</Label>
                <Input name="sat_score" defaultValue={currentStudent.sat_score} />
              </div>
              <div className="space-y-2">
                <Label>IELTS Score</Label>
                <Input name="ielts_score" defaultValue={currentStudent.ielts_score} />
              </div>
              <div className="space-y-2">
                <Label>GPA</Label>
                <Input name="gpa" defaultValue={currentStudent.gpa} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" defaultValue={currentStudent.phone} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Address</Label>
                <Input name="address" defaultValue={currentStudent.address} />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input name="date_of_birth" type="date" defaultValue={currentStudent.date_of_birth} />
              </div>
              <div className="space-y-2">
                <Label>Major</Label>
                <Input name="major" defaultValue={currentStudent.major} />
              </div>
              <div className="space-y-2">
                <Label>Portal Login</Label>
                <Input name="portal" defaultValue={currentStudent.portal} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>School Name</Label>
                <Input name="school_name" defaultValue={currentStudent.school_name} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>School Address</Label>
                <Input name="school_address" defaultValue={currentStudent.school_address} />
              </div>
              <div className="space-y-2">
                <Label>Course Offered</Label>
                <Input name="course_offered" defaultValue={currentStudent.course_offered} />
              </div>
              <div className="grid grid-cols-2 gap-2 col-span-2">
                 <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input name="education_start_date" type="date" defaultValue={currentStudent.education_start_date} />
                 </div>
                 <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input name="education_end_date" type="date" defaultValue={currentStudent.education_end_date} />
                 </div>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Interests</Label>
                <Textarea name="interests" defaultValue={currentStudent.interests} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Background</Label>
                <Textarea name="background" defaultValue={currentStudent.background} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {viewApp && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-xl">{viewApp.university_name}</SheetTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setIsEditingApp(!isEditingApp)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteApplication(viewApp.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <SheetDescription>
                  Application Status: <Badge variant="outline" className={getStatusColor(viewApp.status)}>{viewApp.status}</Badge>
                </SheetDescription>
              </SheetHeader>

              {isEditingApp ? (
                <form onSubmit={handleEditSaveSheet} className="space-y-4">
                  <div className="space-y-2">
                    <Label>University Name</Label>
                    <Input name="university_name" defaultValue={viewApp.university_name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select name="status" defaultValue={viewApp.status} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      {['Planning', 'Applying', 'Applied', 'Accepted', 'Waitlisted', 'Rejected', 'Enrolled', 'Visa Pending'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Program / Major</Label>
                    <Input name="program" defaultValue={viewApp.program} placeholder="e.g. Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Input name="deadline" type="date" defaultValue={viewApp.deadline ? viewApp.deadline.split('T')[0] : ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>Supplementary Essay</Label>
                    <Textarea name="supplementary_essay" defaultValue={viewApp.supplementary_essay} placeholder="Paste essay draft or notes here..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio / Additional Info</Label>
                    <Textarea name="bio_info" defaultValue={viewApp.bio_info} placeholder="Any specific details for this application..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea name="notes" defaultValue={viewApp.notes} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Custom Fields</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={handleAddCustomField}>
                        <Plus size={14} className="mr-1" /> Add Field
                      </Button>
                    </div>
                    {customFields.map((field, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Input 
                          placeholder="Field Name" 
                          value={field.key} 
                          onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
                        />
                        <Input 
                          placeholder="Value" 
                          value={field.value} 
                          onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteCustomField(index)}>
                          <Trash2 size={14} className="text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsEditingApp(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              ) : (
                  <div className="space-y-6">
                    {/* View Mode Content */}
                    {viewUni && (
                      <Card className="bg-primary/5 border-primary/20 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold flex items-center gap-2 text-primary">
                            <School size={18} /> University Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location</span>
                              <div className="font-medium">{viewUni.location}</div>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Ranking</span>
                              <div className="font-medium">#{viewUni.ranking}</div>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tuition</span>
                              <div className="font-medium">{viewUni.tuition}</div>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Acceptance</span>
                              <div className="font-medium">{viewUni.acceptanceRate}</div>
                            </div>
                          </div>

                          {viewUni.scholarships && viewUni.scholarships.length > 0 && (
                            <div className="pt-2 border-t border-dashed">
                              <div className="text-xs font-semibold flex items-center gap-1 text-blue-600 mb-2">
                                <GraduationCap size={12} /> Scholarships
                              </div>
                              <div className="space-y-2">
                                {viewUni.scholarships.map((s, i) => (
                                  <div key={i} className="text-xs bg-blue-50/50 p-2 rounded border border-blue-100">
                                    <div className="font-medium text-blue-900">{s.name}</div>
                                    <div className="text-blue-700">{s.value}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {viewUni.insights && (
                            <div className="pt-2 border-t border-dashed">
                              <div className="text-xs font-semibold flex items-center gap-1 text-amber-600 mb-2">
                                <Lightbulb size={12} /> Insights
                              </div>
                              <div className="text-xs text-amber-900/90 bg-amber-50/50 p-2 rounded border border-amber-100">
                                {viewUni.insights}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2 text-lg">
                        <CheckCircle2 size={20} className="text-primary" /> Application Checklist
                      </h3>
                      <div className="space-y-2">
                        {(viewApp.checklist && viewApp.checklist.length > 0 ? viewApp.checklist : standardDocuments).map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors bg-card shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                doc.status === 'Received' ? 'bg-green-100 text-green-700' :
                                doc.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {doc.status === 'Received' ? <CheckCircle2 size={16} /> : 
                                 doc.status === 'Submitted' ? <Send size={16} /> : 
                                 <Clock size={16} />}
                              </div>
                              <div>
                                <div className="text-sm font-semibold ">{doc.name || doc.label}</div>
                                {doc.date && <div className="text-xs ">{new Date(doc.date).toLocaleDateString()}</div>}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">
                                  {doc.status}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleToggleDocStatus(viewApp.id, doc.id, 'Pending')}>
                                  Mark Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleDocStatus(viewApp.id, doc.id, 'Submitted')}>
                                  Mark Submitted
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleDocStatus(viewApp.id, doc.id, 'Received')}>
                                  Mark Received
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
