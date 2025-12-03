import React from 'react';
import { User, Mail, Phone, MessageSquare, GraduationCap, Calendar, FileText, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

export default function StudentDialog({ open, onOpenChange, student, onSave }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {student ? <User className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            {student ? `Edit ${student.name}` : 'Add New Student'}
          </DialogTitle>
          <DialogDescription>
            {student ? 'Update the student details below.' : 'Enter the details for the new student profile.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Personal Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User size={14} /> Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={student?.name} placeholder="e.g. Jane Doe" required className="bg-secondary/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2"><Mail size={12} /> Email</Label>
                <Input id="email" name="email" type="email" defaultValue={student?.email} placeholder="jane@example.com" required className="bg-secondary/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2"><Phone size={12} /> Phone</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={student?.phone} placeholder="+1 (555) 000-0000" className="bg-secondary/20" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="telegram_chat_id" className="flex items-center gap-2"><MessageSquare size={12} /> Telegram Chat ID</Label>
                <Input id="telegram_chat_id" name="telegram_chat_id" defaultValue={student?.telegram_chat_id} placeholder="e.g. 123456789" className="bg-secondary/20" />
                <p className="text-[10px] text-muted-foreground">Required for Telegram notifications.</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Academic Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap size={14} /> Academic Profile
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sat_score">SAT Score</Label>
                <Input id="sat_score" name="sat_score" defaultValue={student?.sat_score} placeholder="e.g. 1450" className="bg-secondary/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ielts_score">IELTS Score</Label>
                <Input id="ielts_score" name="ielts_score" defaultValue={student?.ielts_score} placeholder="e.g. 7.5" className="bg-secondary/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Target Major</Label>
                <Input id="major" name="major" defaultValue={student?.major} placeholder="e.g. Computer Science" className="bg-secondary/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline" className="flex items-center gap-2"><Calendar size={12} /> Target Deadline</Label>
                <Input id="deadline" name="deadline" type="date" defaultValue={student?.deadline} className="bg-secondary/20" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 size={14} /> Status & Pipeline
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Application Status</Label>
                <Select name="status" defaultValue={student?.status || "Drafting"}>
                  <SelectTrigger className="bg-secondary/20">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Drafting">Drafting</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Visa Pending">Visa Pending</SelectItem>
                    <SelectItem value="Enrolled">Enrolled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Documents</Label>
                <Select name="docs" defaultValue={student?.docs || "Missing"}>
                  <SelectTrigger className="bg-secondary/20">
                    <SelectValue placeholder="Docs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Missing">Missing</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Collected">Collected</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>PAL Status</Label>
                <Select name="pal" defaultValue={student?.pal || "N/A"}>
                  <SelectTrigger className="bg-secondary/20">
                    <SelectValue placeholder="PAL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N/A">N/A</SelectItem>
                    <SelectItem value="Requested">Requested</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
