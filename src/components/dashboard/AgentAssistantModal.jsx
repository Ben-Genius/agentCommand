import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Bot, Link, FileText } from 'lucide-react';
import { summarizeText, summarizeUrl } from '@/utils/aiGenerator';
import { toast } from 'sonner';

export default function AgentAssistantModal({ open, onOpenChange }) {
  const [mode, setMode] = useState('text'); // 'text' or 'url'
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleProcess = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('');
    try {
      let res;
      if (mode === 'text') {
        res = await summarizeText(input);
      } else {
        res = await summarizeUrl(input);
      }
      setResult(res);
    } catch (error) {
      console.error(error);
      toast.error("AI Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Agent Command AI
          </DialogTitle>
          <DialogDescription>
            Use AI to summarize text or analyze web pages.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button 
            variant={mode === 'text' ? 'default' : 'outline'} 
            onClick={() => { setMode('text'); setInput(''); setResult(''); }}
            className="flex-1"
          >
            <FileText className="mr-2 h-4 w-4" /> Summarize Text
          </Button>
          <Button 
            variant={mode === 'url' ? 'default' : 'outline'} 
            onClick={() => { setMode('url'); setInput(''); setResult(''); }}
            className="flex-1"
          >
            <Link className="mr-2 h-4 w-4" /> Analyze URL
          </Button>
        </div>

        <div className="space-y-4">
          {mode === 'text' ? (
            <Textarea 
              placeholder="Paste long text here to summarize..." 
              className="min-h-[200px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          ) : (
            <Input 
              placeholder="Enter URL to analyze (e.g., https://example.com)..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          )}

          <Button onClick={handleProcess} disabled={loading || !input.trim()} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Process with AI'}
          </Button>

          {result && (
            <div className="mt-6 bg-slate-50 p-4 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">AI Result:</h3>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
                {result}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
