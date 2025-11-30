import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Bot, Send, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_COLORS = {
  "Not Started": "bg-gray-100 text-gray-600",
  "Drafting": "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80",
  "Reviewing": "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
  "Submitted": "bg-green-100 text-green-700 hover:bg-green-100/80",
  "Accepted": "bg-teal-100 text-teal-700 hover:bg-teal-100/80",
  "Visa Pending": "bg-purple-100 text-purple-700 hover:bg-purple-100/80",
  "Complete": "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80",
};

const DOCS_COLORS = {
  "Missing": "border-red-200 text-red-700 bg-red-50",
  "Partial": "border-orange-200 text-orange-700 bg-orange-50",
  "Collected": "border-blue-200 text-blue-700 bg-blue-50",
  "Verified": "border-green-200 text-green-700 bg-green-50",
};

const getProgress = (status) => {
  if (status === "Not Started") return 5;
  if (status === "Drafting") return 25;
  if (status === "Reviewing") return 50;
  if (status === "Submitted") return 75;
  if (status === "Accepted") return 90;
  if (status === "Visa Pending") return 95;
  if (status === "Complete") return 100;
  return 0;
};

export default function StudentTable({ 
  students, 
  searchTerm, 
  setSearchTerm, 
  onEdit, 
  onDelete, 
  onNotify, 
  onGenerateReport,
  onAdd,
  onViewProfile
}) {
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={onAdd} className="w-full sm:w-auto gap-2">
          <Plus size={16} /> Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Universities</TableHead>
                <TableHead>Docs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div 
                      onClick={() => onViewProfile && onViewProfile(student)} 
                      className="block hover:bg-slate-50 -m-2 p-2 rounded transition-colors group cursor-pointer"
                    >
                      <div className="font-medium text-emerald-700 group-hover:text-emerald-900">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                      <div className="text-xs text-muted-foreground mt-1">{student.portal}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Badge variant="secondary" className={STATUS_COLORS[student.status]}>
                        {student.status}
                      </Badge>
                      <Progress value={getProgress(student.status)} className="h-1.5 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{student.major}</div>
                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">{student.universities}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={DOCS_COLORS[student.docs]}>
                      {student.docs}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onGenerateReport(student)} title="Generate AI Report">
                        <Bot size={16} className="text-purple-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onNotify(student)} title="Send Notification">
                        <Send size={16} className="text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(student)}>
                        <Edit size={16} className="text-slate-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(student.id)}>
                        <Trash2 size={16} className="text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
