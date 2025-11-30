import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Brain, MoreVertical, Trash2, Edit, FileText, ExternalLink, Calendar, MapPin, DollarSign, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { universities, standardDocuments } from '@/data/universities';
import { ModeToggle } from '@/components/mode-toggle';

export default function StudentProfilePage({ student, onBack, onUpdate }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState(student);
  
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

  useEffect(() => {
    fetchApplications();
    fetchLatestStudentData();
  }, [currentStudent.id]);

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
    // Find university details if available
    const uni = universities.find(u => u.id === app.university_id);
    setViewUni(uni || null);
    setIsSheetOpen(true);
  };

  // --- CRUD Operations ---

  const handleAddApplication = async (uniOrName) => {
    try {
      const isCustom = typeof uniOrName === 'string';
      const university_id = isCustom ? 'custom' : uniOrName.id;
      const university_name = isCustom ? uniOrName : uniOrName.name;
      
      let deadline = null;
      if (!isCustom && uniOrName.deadline) {
         try {
             // Attempt to parse date if it's in a standard format, otherwise might need manual entry
             // universities.js has formats like "Jan 15, 2026" which works with new Date()
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

    // Use existing checklist or fallback to standard if empty (for old apps)
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

  const handleEditSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      university_name: formData.get('university_name'),
      deadline: formData.get('deadline') || null,
      notes: formData.get('notes'),
      status: formData.get('status'),
    };

    // If editing from the sheet
    const appId = isEditingApp ? viewApp.id : selectedApp.id;

    try {
      const { error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', appId);

      if (error) throw error;
      toast.success('Application updated');
      fetchApplications(); 
      
      if (isEditingApp) {
        setViewApp({ ...viewApp, ...updates });
        setIsEditingApp(false);
      } else {
        setIsEditAppOpen(false);
        if (viewApp && viewApp.id === appId) {
          setViewApp({ ...viewApp, ...updates });
        }
      }
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  const handleStatsSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      sat_score: formData.get('sat_score'),
      ielts_score: formData.get('ielts_score'),
      gpa: formData.get('gpa'),
      phone: formData.get('phone'),
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

  // --- AI & Helpers ---

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
      case 'Accepted': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'Applied': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'Waitlisted': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      case 'Enrolled': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
      default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{currentStudent.name}</h1>
          <p className="text-muted-foreground">Application Management Profile</p>
        </div>
        <div className="ml-auto flex gap-2">
          <ModeToggle />
          <Button variant="outline" className="gap-2" onClick={handleAiBrainstorm}>
            <Brain size={16} /> AI Brainstorm
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:border-primary/50 transition-colors bg-card text-card-foreground"
          onClick={() => setIsEditStatsOpen(true)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SAT Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStudent.sat_score || 'N/A'}</div>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:border-primary/50 transition-colors bg-card text-card-foreground"
          onClick={() => setIsEditStatsOpen(true)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">IELTS Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStudent.ielts_score || 'N/A'}</div>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:border-primary/50 transition-colors bg-card text-card-foreground"
          onClick={() => setIsEditStatsOpen(true)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">GPA / Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStudent.gpa || 'N/A'}</div>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:border-primary/50 transition-colors bg-card text-card-foreground"
          onClick={() => setIsEditStatsOpen(true)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm truncate" title={currentStudent.email}>{currentStudent.email}</div>
            <div className="text-sm text-muted-foreground">{currentStudent.phone || 'No phone'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">University Applications</h2>
          <Button onClick={() => setIsAddUniOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus size={16} /> Add University
          </Button>
        </div>

        <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[30%] text-muted-foreground">University</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Deadline</TableHead>
                <TableHead className="text-muted-foreground">Documents</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No applications tracked yet. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow 
                    key={app.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewApplication(app)}
                  >
                    <TableCell className="font-medium text-foreground">
                      {app.university_name}
                      {app.notes && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{app.notes}</div>}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Badge className={`cursor-pointer hover:opacity-80 px-2.5 py-0.5 ${getStatusColor(app.status)}`}>
                            {app.status}
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {['Planning', 'Applied', 'Accepted', 'Waitlisted', 'Rejected', 'Enrolled', 'Visa Pending'].map(s => (
                             <DropdownMenuItem key={s} onClick={() => handleUpdateStatus(app.id, s)}>{s}</DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      {app.deadline ? (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          {new Date(app.deadline).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {app.checklist ? app.checklist.filter(d => d.status === 'Received' || d.status === 'Submitted').length : 0}
                            <span className="text-muted-foreground/50"> / </span>
                            {app.checklist ? app.checklist.length : 0}
                          </span>
                        </div>
                        {app.checklist && app.checklist.length > 0 && (
                          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500" 
                              style={{ width: `${(app.checklist.filter(d => d.status === 'Received' || d.status === 'Submitted').length / app.checklist.length) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewApplication(app)}>
                            <ExternalLink className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedApp(app); setIsEditAppOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteApplication(app.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add University Dialog */}
      <Dialog open={isAddUniOpen} onOpenChange={setIsAddUniOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add University</DialogTitle>
            <DialogDescription>Select from our database or add a custom one.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-1">
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3 px-4 border-dashed"
              onClick={() => setIsCustomUniOpen(true)}
            >
              <div className="text-left">
                <div className="font-semibold flex items-center gap-2"><Plus size={14}/> Add Custom</div>
                <div className="text-xs text-muted-foreground">Manually enter name</div>
              </div>
            </Button>
            {universities.map(uni => (
              <Button 
                key={uni.id} 
                variant="outline" 
                className="justify-start h-auto py-3 px-4"
                onClick={() => handleAddApplication(uni)}
              >
                <div className="text-left">
                  <div className="font-semibold">{uni.name}</div>
                  <div className="text-xs text-muted-foreground">{uni.location}</div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom University Dialog */}
      <Dialog open={isCustomUniOpen} onOpenChange={setIsCustomUniOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Custom University</DialogTitle>
            <DialogDescription>Enter the name of the university.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">University Name</Label>
              <Input id="name" name="name" placeholder="e.g. Harvard University" required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCustomUniOpen(false)}>Cancel</Button>
              <Button type="submit">Add Application</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Application Dialog */}
      <Dialog open={isEditAppOpen} onOpenChange={setIsEditAppOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <form onSubmit={handleEditSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="university_name">University Name</Label>
                <Input id="university_name" name="university_name" defaultValue={selectedApp.university_name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input id="deadline" name="deadline" type="date" defaultValue={selectedApp.deadline} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Any notes..." defaultValue={selectedApp.notes} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditAppOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Stats Dialog */}
      <Dialog open={isEditStatsOpen} onOpenChange={setIsEditStatsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile Stats</DialogTitle>
            <DialogDescription>Update student academic and contact info.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStatsSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sat_score">SAT Score</Label>
                <Input id="sat_score" name="sat_score" defaultValue={currentStudent.sat_score} placeholder="e.g. 1450" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ielts_score">IELTS Score</Label>
                <Input id="ielts_score" name="ielts_score" defaultValue={currentStudent.ielts_score} placeholder="e.g. 7.5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpa">GPA / Grades</Label>
              <Input id="gpa" name="gpa" defaultValue={currentStudent.gpa} placeholder="e.g. 3.8 or 95%" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" defaultValue={currentStudent.phone} placeholder="+1..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditStatsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Application Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          {viewApp && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-start justify-between">
                  {isEditingApp ? (
                     <div className="w-full">
                       <SheetTitle>Edit Application</SheetTitle>
                       <form id="sheet-edit-form" onSubmit={handleEditSave} className="space-y-4 mt-4">
                         <div className="space-y-2">
                           <Label htmlFor="sheet_uni_name">University Name</Label>
                           <Input id="sheet_uni_name" name="university_name" defaultValue={viewApp.university_name} required />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <Label htmlFor="sheet_deadline">Deadline</Label>
                             <Input id="sheet_deadline" name="deadline" type="date" defaultValue={viewApp.deadline} />
                           </div>
                           <div className="space-y-2">
                             <Label htmlFor="sheet_status">Status</Label>
                             <select 
                               id="sheet_status" 
                               name="status" 
                               defaultValue={viewApp.status}
                               className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                             >
                               {['Planning', 'Applied', 'Accepted', 'Waitlisted', 'Rejected', 'Enrolled', 'Visa Pending'].map(s => (
                                 <option key={s} value={s}>{s}</option>
                               ))}
                             </select>
                           </div>
                         </div>
                         <div className="space-y-2">
                           <Label htmlFor="sheet_notes">Notes</Label>
                           <Textarea id="sheet_notes" name="notes" defaultValue={viewApp.notes} />
                         </div>
                         <div className="flex gap-2 justify-end pt-2">
                           <Button type="button" variant="outline" onClick={() => setIsEditingApp(false)}>Cancel</Button>
                           <Button type="submit">Save Changes</Button>
                         </div>
                       </form>
                     </div>
                  ) : (
                    <>
                      <div>
                        <SheetTitle className="text-2xl">{viewApp.university_name}</SheetTitle>
                        <SheetDescription className="mt-1">
                          Application Details & Insights
                        </SheetDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`text-sm px-3 py-1 ${getStatusColor(viewApp.status)}`}>
                          {viewApp.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setIsEditingApp(true)}>
                          <Edit size={12} /> Edit
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetHeader>

              {!isEditingApp && (
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="details">Application</TabsTrigger>
                  <TabsTrigger value="university" disabled={!viewUni}>University Info</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  {/* Key Dates & Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Deadline</Label>
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar size={16} className="text-muted-foreground" />
                        {viewApp.deadline ? new Date(viewApp.deadline).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Created</Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(viewApp.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">My Notes</Label>
                    <div className="bg-muted/50 p-3 rounded-md text-sm text-foreground min-h-[80px] border">
                      {viewApp.notes || "No notes added yet."}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Documents</Label>
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                        // Re-using the prompt logic for now, could be improved
                        const name = prompt("Document Name:");
                        if (name) {
                           // Logic to add doc needs to be accessible here or passed down
                           // For simplicity, we'll just show a toast that this is available in the main view
                           toast.info("Please add documents from the main list view for now.");
                        }
                      }}>
                        <Plus size={12} className="mr-1" /> Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {/* Use checklist if available, otherwise show empty state or fallback */}
                      {(!viewApp.checklist || viewApp.checklist.length === 0) ? (
                         <div className="text-sm text-muted-foreground italic p-2 border border-dashed rounded">
                           No standard documents initialized. 
                           <Button variant="link" className="h-auto p-0 ml-2" onClick={() => {
                             // Initialize for old apps
                             const initChecklist = standardDocuments.map(d => ({...d, status: 'Pending'}));
                             supabase.from('applications').update({ checklist: initChecklist }).eq('id', viewApp.id).then(({ error }) => {
                               if (!error) {
                                 const updated = { ...viewApp, checklist: initChecklist };
                                 setViewApp(updated);
                                 setApplications(apps => apps.map(a => a.id === viewApp.id ? updated : a));
                               }
                             });
                           }}>Initialize Standard List</Button>
                         </div>
                      ) : (
                        viewApp.checklist.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded ${doc.status === 'Received' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted'}`}>
                                <FileText size={16} className={doc.status === 'Received' ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'} />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{doc.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {doc.required ? <span className="text-amber-600 dark:text-amber-500 font-medium mr-1">Required</span> : "Optional"}
                                  {doc.note && <span className="opacity-75">• {doc.note}</span>}
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={`h-7 text-xs min-w-[80px] ${
                                doc.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                                doc.status === 'Received' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                              }`}
                              onClick={() => handleToggleDocStatus(viewApp.id, doc.id, doc.status || 'Pending')}
                            >
                              {doc.status || 'Pending'}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="university" className="space-y-6">
                  {viewUni && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Location</Label>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={16} className="text-muted-foreground" />
                            {viewUni.location}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Tuition</Label>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign size={16} className="text-muted-foreground" />
                            {viewUni.tuition}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Application Fee</Label>
                        <div className="text-sm">{viewUni.appFee}</div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Scholarships</Label>
                        <div className="space-y-2">
                          {viewUni.scholarships?.map((sch, i) => (
                            <div key={i} className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-md dark:bg-emerald-900/10 dark:border-emerald-800">
                              <div className="font-semibold text-emerald-900 dark:text-emerald-400 text-sm">{sch.name}</div>
                              <div className="text-xs font-medium text-emerald-700 dark:text-emerald-500 mt-0.5">{sch.value}</div>
                              <div className="text-xs text-emerald-600/80 dark:text-emerald-600 mt-1">{sch.notes}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Insights</Label>
                        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-line">
                          {viewUni.insights}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
              )}

              <SheetFooter className="mt-8">
                 <Button variant="outline" className="w-full" onClick={() => setIsSheetOpen(false)}>Close</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

