import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, School, DollarSign, Calendar, FileText, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ApplicationDialog from '@/components/dashboard/ApplicationDialog';
import { toast } from 'sonner';

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAppModal, setShowAppModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch student
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      
      if (studentError) throw studentError;
      setStudent(studentData);

      // Fetch applications
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('student_id', id)
        .order('created_at', { ascending: false });

      if (appError) throw appError;
      setApplications(appData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSaveApp = async (formData) => {
    const data = Object.fromEntries(formData);
    data.student_id = id;

    try {
      if (editingApp) {
        const { error } = await supabase.from('applications').update(data).match({ id: editingApp.id });
        if (error) throw error;
        toast.success('Application updated');
      } else {
        const { error } = await supabase.from('applications').insert([data]);
        if (error) throw error;
        toast.success('Application added');
      }
      fetchData();
      setShowAppModal(false);
      setEditingApp(null);
    } catch (error) {
      toast.error('Error saving application: ' + error.message);
    }
  };

  const handleDeleteApp = async (appId) => {
    if (!confirm("Delete this application?")) return;
    try {
      const { error } = await supabase.from('applications').delete().match({ id: appId });
      if (error) throw error;
      setApplications(applications.filter(a => a.id !== appId));
      toast.success('Application deleted');
    } catch (error) {
      toast.error('Error deleting application: ' + error.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!student) return <div className="p-8 text-center">Student not found</div>;

  return (
    <DashboardLayout view="details" setView={() => navigate('/dashboard')}>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4 gap-2 text-slate-600">
          <ArrowLeft size={16} /> Back to Dashboard
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{student.name}</h1>
            <p className="text-slate-500">{student.email}</p>
          </div>
          <Button onClick={() => { setEditingApp(null); setShowAppModal(true); }} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus size={16} /> Add Application
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Student Info Card */}
          <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-500">Target Major</div>
              <div>{student.major || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Overall Status</div>
              <Badge variant="secondary" className="mt-1">{student.status}</Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Documents</div>
              <Badge variant="outline" className="mt-1">{student.docs}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Checklist Card */}
        <Card>
          <CardHeader>
            <CardTitle>Application Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.checklist ? (
              student.checklist.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`checklist-${index}`}
                    checked={item.checked}
                    onChange={async (e) => {
                      const newChecklist = [...student.checklist];
                      newChecklist[index].checked = e.target.checked;
                      setStudent({ ...student, checklist: newChecklist });
                      
                      try {
                        const { error } = await supabase
                          .from('students')
                          .update({ checklist: newChecklist })
                          .eq('id', student.id);
                        
                        if (error) throw error;
                        toast.success('Checklist updated');
                      } catch (error) {
                        toast.error('Failed to update checklist');
                        const revertedChecklist = [...student.checklist];
                        revertedChecklist[index].checked = !e.target.checked;
                        setStudent({ ...student, checklist: revertedChecklist });
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <label
                    htmlFor={`checklist-${index}`}
                    className={`text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
                  >
                    {item.label || item.item}
                  </label>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No checklist available.</div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Applications List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <School className="text-emerald-600" /> Applications ({applications.length})
          </h2>
          
          {applications.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500">No applications tracked yet.</p>
              <Button variant="link" onClick={() => setShowAppModal(true)} className="text-emerald-600">
                Add the first one
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {applications.map(app => (
                <Card key={app.id} className="hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{app.school_name}</h3>
                        <p className="text-emerald-700 font-medium">{app.program}</p>
                      </div>
                      <Badge className={
                        app.status === 'Accepted' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                        'bg-blue-100 text-blue-700 hover:bg-blue-100'
                      }>
                        {app.status}
                      </Badge>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        Deadline: {app.deadline || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-slate-400" />
                        Tuition: {app.tuition || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-400" />
                        Requirements: {app.requirements ? 'View Details' : 'None listed'}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingApp(app); setShowAppModal(true); }}>
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteApp(app.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 size={14} className="mr-1" /> Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <ApplicationDialog 
        open={showAppModal} 
        onOpenChange={setShowAppModal}
        application={editingApp}
        onSave={handleSaveApp}
      />
    </DashboardLayout>
  );
}
