import React from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AIReportModal({ open, onOpenChange, report, loading }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="text-purple-600" />
            {loading ? 'Generating Report...' : 'AI Application Report'}
          </DialogTitle>
          <DialogDescription>
            {loading ? 'Please wait while the AI analyzes the student data.' : 'Here is the AI-generated report for this student.'}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Analyzing application data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 whitespace-pre-line text-sm text-slate-700">
              {report}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => { toast.success('Report shared with parents!'); onOpenChange(false); }}>
                Share with Parents
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
