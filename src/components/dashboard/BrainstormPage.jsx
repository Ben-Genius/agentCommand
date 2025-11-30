import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Lightbulb, Target, ArrowRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function BrainstormPage() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('students').select('*');
    setStudents(data || []);
  };

  const handleBrainstorm = async (mode) => {
    if (!selectedStudentId) {
      toast.error("Please select a student first");
      return;
    }

    setLoading(true);
    setResult(null);
    const student = students.find(s => s.id === selectedStudentId);

    try {
      // Dynamic import to avoid circular dependencies if any
      const { invokeAiAgent } = await import('@/utils/aiGenerator');
      
      let action = 'suggest_universities'; // Default
      if (mode === 'essays') action = 'brainstorm_essays';
      if (mode === 'strategy') action = 'review_strategy';

      const response = await invokeAiAgent(action, { student, userNotes });
      
      // Clean up markdown code blocks if present
      const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // Try to parse if it's JSON (universities), otherwise keep as text (essays/strategy)
      try {
        if (mode === 'universities') {
             setResult(JSON.parse(cleanResponse));
        } else {
             setResult(response); // Keep markdown for text-heavy responses
        }
      } catch (e) {
        setResult(response);
      }
      
      toast.success("Brainstorming complete!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to brainstorm");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
          <Brain size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Brainstorming</h1>
          <p className="text-muted-foreground">Generate ideas, strategies, and university matches.</p>
        </div>
      </div>

      <Card className="border-indigo-100 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Select Student</label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedStudentId && (
              <div className="text-sm text-muted-foreground pb-3">
                 Profile loaded: {students.find(s => s.id === selectedStudentId)?.major || 'General'}
              </div>
            )}

            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium text-slate-700">Your Ideas / Context (Optional)</label>
              <Textarea 
                placeholder="E.g., I want to write about my leadership in the chess club, or I'm worried about my math grades..." 
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="universities" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-slate-100 p-1">
          <TabsTrigger value="universities" className="h-full gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Target size={18} /> University Match
          </TabsTrigger>
          <TabsTrigger value="essays" className="h-full gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Sparkles size={18} /> Essay Ideation
          </TabsTrigger>
          <TabsTrigger value="strategy" className="h-full gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Lightbulb size={18} /> Strategy Review
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="universities">
            <Card>
              <CardHeader>
                <CardTitle>Find Best-Fit Universities</CardTitle>
                <CardDescription>AI analyzes grades, scores, and interests to suggest Canadian schools.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2"
                  onClick={() => handleBrainstorm('universities')}
                  disabled={loading}
                >
                  {loading ? <Sparkles className="animate-spin" /> : <Brain />} 
                  {loading ? "Analyzing Profile..." : "Generate Matches"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="essays">
            <Card>
              <CardHeader>
                <CardTitle>Essay Topic Generator</CardTitle>
                <CardDescription>Get unique essay angles based on the student's background.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  className="w-full bg-purple-600 hover:bg-purple-700 gap-2"
                  onClick={() => handleBrainstorm('essays')}
                  disabled={loading}
                >
                  {loading ? <Sparkles className="animate-spin" /> : <Sparkles />}
                  {loading ? "Brainstorming..." : "Generate Ideas"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy">
            <Card>
              <CardHeader>
                <CardTitle>Application Strategy Review</CardTitle>
                <CardDescription>Identify profile gaps and strategic opportunities.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                  onClick={() => handleBrainstorm('strategy')}
                  disabled={loading}
                >
                  {loading ? <Sparkles className="animate-spin" /> : <Lightbulb />}
                  {loading ? "Reviewing..." : "Analyze Strategy"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Results Display */}
      {result && (
        <Card className="border-2 border-indigo-50 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg text-indigo-900">AI Analysis Result</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(typeof result === 'string' ? result : JSON.stringify(result, null, 2))}>
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {Array.isArray(result) ? (
              <div className="grid gap-4">
                {result.map((uni, i) => (
                  <div key={i} className="p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{uni.name}</h3>
                        <p className="text-sm text-slate-500 mb-2">{uni.location}</p>
                        <p className="text-sm text-slate-700">{uni.matchReason}</p>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                        Match
                      </div>
                    </div>
                    {uni.programs && (
                      <div className="mt-3 text-xs text-slate-500 border-t pt-2">
                        <strong>Programs:</strong> {uni.programs}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{result}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
