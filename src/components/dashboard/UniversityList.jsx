import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign, BookOpen, Lightbulb, Plus, ExternalLink, School, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { universities as initialUniversities } from '@/data/universities';
import AddUniversityModal from './AddUniversityModal';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function UniversityList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [universities, setUniversities] = useState(initialUniversities);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUni, setSelectedUni] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch custom universities from Supabase
  useEffect(() => {
    const fetchCustomUniversities = async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from('universities').select('*');
      if (data) {
        setUniversities([...initialUniversities, ...data]);
      }
    };
    fetchCustomUniversities();
  }, []);

  const handleSaveUniversity = async (newUni) => {
    // Optimistic update
    const uniWithId = { ...newUni, id: Date.now() }; // Temp ID
    setUniversities([...universities, uniWithId]);
    
    if (supabase) {
      const { error } = await supabase.from('universities').insert([newUni]);
      if (error) {
        toast.error("Failed to save to database");
        console.error(error);
      } else {
        toast.success("University added successfully");
      }
    }
  };

  const filteredUniversities = universities.filter(uni => 
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (uni) => {
    setSelectedUni(uni);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">University Database</h2>
          <p className="text-muted-foreground">Explore top Canadian universities for your students.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search universities..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus size={16} /> Add New
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead className="w-[300px]">University</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Tuition (Est.)</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUniversities.map((uni) => (
              <TableRow 
                key={uni.id} 
                className="cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => handleRowClick(uni)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <School size={16} />
                    </div>
                    {uni.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={14} /> {uni.location}
                  </div>
                </TableCell>
                <TableCell>{uni.tuition}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {uni.deadline}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink size={14} className="text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddUniversityModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onSave={handleSaveUniversity}
      />

      {/* University Details Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto">
          {selectedUni && (
            <>
              <SheetHeader className="mb-6 pb-4 border-b">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <School size={24} />
                    </div>
                    <div>
                      <SheetTitle className="text-xl">{selectedUni.name}</SheetTitle>
                      <SheetDescription className="flex items-center gap-2 mt-1">
                        <MapPin size={12} /> {selectedUni.location}
                      </SheetDescription>
                    </div>
                  </div>
                  {selectedUni.website_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedUni.website_url} target="_blank" rel="noreferrer" className="gap-2">
                        Visit Website <ExternalLink size={14} />
                      </a>
                    </Button>
                  )}
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/30 space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tuition</span>
                    <div className="font-semibold">{selectedUni.tuition}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30 space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Ranking</span>
                    <div className="font-semibold">#{selectedUni.ranking}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30 space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Acceptance</span>
                    <div className="font-semibold">{selectedUni.acceptanceRate}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30 space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">App Fee</span>
                    <div className="font-semibold">{selectedUni.app_fee || selectedUni.appFee}</div>
                  </div>
                </div>

                {/* Scholarships */}
                {selectedUni.scholarships && selectedUni.scholarships.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                      <GraduationCap size={20} className="text-blue-600" /> Scholarships
                    </h3>
                    <div className="grid gap-3">
                      {selectedUni.scholarships.map((s, i) => (
                        <div key={i} className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 transition-colors hover:bg-blue-50">
                          <div className="font-semibold text-blue-900">{s.name}</div>
                          <div className="text-blue-700 font-medium mt-1 mb-2">{s.value}</div>
                          <div className="text-sm text-blue-600/90 leading-relaxed">{s.notes}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                {selectedUni.insights && (
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                      <Lightbulb size={20} className="text-amber-600" /> Agent Insights
                    </h3>
                    <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 text-sm text-amber-900/90 leading-relaxed">
                      {selectedUni.insights}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
