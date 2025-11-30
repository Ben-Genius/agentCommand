import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Globe } from 'lucide-react';
import { extractUniversityInfo } from '@/utils/aiGenerator';
import { toast } from 'sonner';

export default function AddUniversityModal({ open, onOpenChange, onSave }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('url'); // 'url' or 'form'
  const [formData, setFormData] = useState({});

  const handleExtract = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const data = await extractUniversityInfo(url);
      setFormData(data);
      setStep('form');
      toast.success("Data extracted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Extraction failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const university = {
      name: data.get('name'),
      location: data.get('location'),
      deadline: data.get('deadline'),
      app_fee: data.get('app_fee'),
      tuition: data.get('tuition'),
      room_board: data.get('room_board'),
      insights: data.get('insights'),
      scholarships: formData.scholarships || [], // Keep complex object from AI
      website_url: url
    };
    onSave(university);
    onOpenChange(false);
    setStep('url');
    setUrl('');
    setFormData({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New University</DialogTitle>
          <DialogDescription>
            Add a university manually or extract data from its official website.
          </DialogDescription>
        </DialogHeader>

        {step === 'url' ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Official Website URL</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://www.utoronto.ca/..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the official admissions page URL for best results.
              </p>
            </div>
            <Button onClick={handleExtract} disabled={loading || !url} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting Data...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-yellow-400" /> Extract with AI
                </>
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => setStep('form')} className="w-full">
              Enter Manually
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>University Name</Label>
                <Input name="name" defaultValue={formData.name} required />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input name="location" defaultValue={formData.location} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input name="deadline" defaultValue={formData.deadline} />
              </div>
              <div className="space-y-2">
                <Label>App Fee</Label>
                <Input name="app_fee" defaultValue={formData.app_fee} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tuition (Est.)</Label>
                <Input name="tuition" defaultValue={formData.tuition} />
              </div>
              <div className="space-y-2">
                <Label>Room & Board</Label>
                <Input name="room_board" defaultValue={formData.room_board} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Strategy & Insights</Label>
              <Textarea 
                name="insights" 
                defaultValue={formData.insights} 
                className="min-h-[100px]"
              />
            </div>

            {formData.scholarships && formData.scholarships.length > 0 && (
              <div className="bg-blue-50 p-3 rounded text-sm">
                <span className="font-semibold text-blue-800">Extracted Scholarships:</span>
                <ul className="list-disc list-inside text-blue-700 mt-1">
                  {formData.scholarships.map((s, i) => (
                    <li key={i}>{s.name} - {s.value}</li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setStep('url')}>Back</Button>
              <Button type="submit">Save University</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
