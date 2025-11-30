import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ApplicationDialog({ open, onOpenChange, application, onSave }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{application ? 'Edit Application' : 'Add New Application'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="school_name">School Name</Label>
              <Input id="school_name" name="school_name" defaultValue={application?.school_name} required placeholder="e.g. University of Toronto" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Input id="program" name="program" defaultValue={application?.program} placeholder="e.g. Computer Science" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={application?.status || "Drafting"}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Drafting">Drafting</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Waitlisted">Waitlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" name="deadline" type="date" defaultValue={application?.deadline} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app_fee">App Fee</Label>
              <Input id="app_fee" name="app_fee" defaultValue={application?.app_fee} placeholder="$100" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-emerald-700">Financials</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tuition">Tuition</Label>
                <Input id="tuition" name="tuition" defaultValue={application?.tuition} placeholder="Annual Tuition" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="housing">Housing</Label>
                <Input id="housing" name="housing" defaultValue={application?.housing} placeholder="Housing Cost" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meal_plan">Meal Plan</Label>
                <Input id="meal_plan" name="meal_plan" defaultValue={application?.meal_plan} placeholder="Meal Plan Cost" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_expenses">Other Expenses</Label>
                <Input id="other_expenses" name="other_expenses" defaultValue={application?.other_expenses} placeholder="Books, Insurance, etc." />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scholarship_info">Scholarship Info</Label>
            <Textarea id="scholarship_info" name="scholarship_info" defaultValue={application?.scholarship_info} placeholder="Available scholarships and requirements..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea id="requirements" name="requirements" defaultValue={application?.requirements} placeholder="GPA, IELTS/TOEFL, Essays, etc." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={application?.notes} placeholder="Additional notes..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
