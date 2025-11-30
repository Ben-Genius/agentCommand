import React from 'react';
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

export default function StudentDialog({ open, onOpenChange, student, onSave }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{student ? `Edit ${student.name}` : 'Add New Student'}</DialogTitle>
          <DialogDescription>
            {student ? 'Update the student details below.' : 'Enter the details for the new student.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input id="name" name="name" defaultValue={student?.name} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={student?.email}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1234567890"
                defaultValue={student?.phone}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telegram_chat_id" className="text-right">
                Telegram ID
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="telegram_chat_id"
                  name="telegram_chat_id"
                  placeholder="123456789"
                  defaultValue={student?.telegram_chat_id}
                />
                <p className="text-[10px] text-muted-foreground">
                  User must message the bot first to get this ID.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sat_score" className="text-right">
                SAT Score
              </Label>
              <Input
                id="sat_score"
                name="sat_score"
                placeholder="e.g. 1450"
                defaultValue={student?.sat_score}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ielts_score" className="text-right">
                IELTS Score
              </Label>
              <Input
                id="ielts_score"
                name="ielts_score"
                placeholder="e.g. 7.5"
                defaultValue={student?.ielts_score}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Academics</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input name="major" placeholder="Target Major" defaultValue={student?.major} />
              <Input name="universities" placeholder="Universities" defaultValue={student?.universities} />
              <Input name="deadline" type="date" defaultValue={student?.deadline} />
              <Select name="portal" defaultValue={student?.portal || "OUAC"}>
                <SelectTrigger>
                  <SelectValue placeholder="Portal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUAC">OUAC</SelectItem>
                  <SelectItem value="Direct">Direct</SelectItem>
                  <SelectItem value="EducationPlannerBC">EducationPlannerBC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="grid grid-cols-3 gap-4">
              <Select name="status" defaultValue={student?.status || "Drafting"}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Drafting">Drafting</SelectItem>
                  <SelectItem value="Reviewing">Reviewing</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Visa Pending">Visa Pending</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>

              <Select name="docs" defaultValue={student?.docs || "Missing"}>
                <SelectTrigger>
                  <SelectValue placeholder="Docs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Missing">Missing</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Collected">Collected</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                </SelectContent>
              </Select>

              <Select name="pal" defaultValue={student?.pal || "N/A"}>
                <SelectTrigger>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
