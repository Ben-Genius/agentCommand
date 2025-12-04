import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Trash2, 
  FileText, 
  Bot, 
  Bell, 
  ChevronRight,
  ArrowUpDown,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';

import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function StudentTable({ 
  students, 
  searchTerm, 
  setSearchTerm, 
  onEdit, 
  onDelete, 
  onNotify, 
  onGenerateReport,
  onAdd 
}) {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState({});
  const [statusFilter, setStatusFilter] = useState([]);

  const toggleSelectAll = () => {
    if (Object.keys(selectedRows).length === filteredStudents.length) {
      setSelectedRows({});
    } else {
      const newSelected = {};
      filteredStudents.forEach(s => newSelected[s.id] = true);
      setSelectedRows(newSelected);
    }
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    setSelectedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRowClick = (studentId) => {
    navigate(`/dashboard/student/${studentId}`);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(student.status);
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Applied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Waitlisted': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Visa Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDocStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Collected': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Partial': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Missing': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleDownloadDocument = async (doc, e) => {
    e.stopPropagation();
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

  const handleExport = () => {
    // Define headers
    const headers = ['Name', 'Email', 'Status', 'Documents', 'Applications'];
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => {
        const apps = student.applications 
          ? student.applications.map(app => app.university_name).join('; ') 
          : '';
        const docs = student.documents
          ? student.documents.map(d => d.name).join('; ')
          : '';
          
        return [
          `"${student.name}"`,
          `"${student.email}"`,
          `"${student.status}"`,
          `"${docs}"`,
          `"${apps}"`
        ].join(',');
      })
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-input transition-all"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['Planning', 'Applied', 'Accepted', 'Rejected', 'Waitlisted', 'Visa Pending'].map(status => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={(checked) => {
                    setStatusFilter(prev => checked ? [...prev, status] : prev.filter(s => s !== status));
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {Object.keys(selectedRows).length > 0 && (
            <div className="flex items-center gap-2 mr-2 animate-in fade-in slide-in-from-right-4 duration-200">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {Object.keys(selectedRows).length} selected
              </span>
              <Button variant="destructive" size="sm" className="h-8">
                <Trash2 size={14} className="mr-2" /> Delete
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
            <Download size={14} className="mr-2" /> Export
          </Button>
          <Button size="sm" className="h-9" onClick={onAdd}>
            <Plus size={14} className="mr-2" /> Add Student
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table className="table-dense">
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px]">
                <Checkbox 
                  checked={Object.keys(selectedRows).length === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                  Student <ArrowUpDown size={12} />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-8 w-8 opacity-20" />
                    <p>No students found matching your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow 
                  key={student.id} 
                  className="group transition-colors hover:bg-secondary/20 cursor-pointer"
                  onClick={() => handleRowClick(student.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={!!selectedRows[student.id]}
                      onCheckedChange={(checked) => toggleSelectRow(student.id, { stopPropagation: () => {} })}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border shadow-sm">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {student.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{student.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-full font-normal px-2.5 ${getStatusColor(student.status)}`}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {student.documents && student.documents.length > 0 ? (
                        student.documents.slice(0, 2).map((doc, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="rounded-md font-normal px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors w-fit max-w-[150px] truncate"
                            onClick={(e) => handleDownloadDocument(doc, e)}
                          >
                            <FileText size={10} className="mr-1 inline" />
                            {doc.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No documents</span>
                      )}
                      {student.documents && student.documents.length > 2 && (
                        <span className="text-[10px] text-muted-foreground pl-1">+{student.documents.length - 2} more</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2 overflow-hidden pl-1">
                      {student.applications && student.applications.length > 0 ? (
                        student.applications.slice(0, 3).map((app, i) => (
                          <div key={i} className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-secondary text-[10px] font-medium ring-2 ring-background" title={app.university_name}>
                            {app.university_name.charAt(0)}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground pl-2">No apps</span>
                      )}
                      {student.applications && student.applications.length > 3 && (
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium ring-2 ring-background">
                          +{student.applications.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                       <div className="h-1.5 w-20 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              student.status === 'Accepted' ? 'bg-emerald-500' : 'bg-primary'
                            }`}
                            style={{ width: `${student.status === 'Accepted' ? 100 : Math.random() * 60 + 20}%` }} 
                          />
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleRowClick(student.id)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onNotify(student)}>
                        <Bell size={16} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleRowClick(student.id)}>View Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(student)}>Edit Details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => onDelete(student.id)}>
                            Delete Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
        <div>Showing {filteredStudents.length} of {students.length} students</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">Previous</Button>
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">Next</Button>
        </div>
      </div>
    </div>
  );
}
