import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign, BookOpen, Lightbulb, Plus, ExternalLink } from 'lucide-react';
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
import { universities as initialUniversities } from '@/data/universities';
import AddUniversityModal from './AddUniversityModal';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function UniversityList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [universities, setUniversities] = useState(initialUniversities);
  const [showAddModal, setShowAddModal] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">University Research</h2>
          <p className="text-muted-foreground">Explore top Canadian universities for Ghanaian applicants.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search universities..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus size={16} /> Add New
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">University</TableHead>
              <TableHead className="w-[180px]">Deadlines & Fees</TableHead>
              <TableHead className="w-[200px]">Costs (Est.)</TableHead>
              <TableHead className="min-w-[400px]">Scholarships & Insights</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUniversities.map((uni) => (
              <TableRow key={uni.id} className="group hover:bg-slate-50/50">
                <TableCell className="align-top py-6 pr-6">
                  <div className="font-semibold text-lg text-emerald-900 leading-tight">{uni.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                    <MapPin size={14} className="shrink-0" /> {uni.location}
                  </div>
                  {uni.website_url && (
                    <a href={uni.website_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1.5 mt-3 font-medium">
                      <ExternalLink size={12} /> Official Website
                    </a>
                  )}
                </TableCell>
                <TableCell className="align-top py-6 pr-6 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      <Calendar size={16} className="text-slate-400" />
                      Deadline
                    </div>
                    <div className="text-sm text-slate-600 pl-6">{uni.deadline}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      <DollarSign size={16} className="text-slate-400" />
                      App Fee
                    </div>
                    <div className="text-sm text-slate-600 pl-6">{uni.app_fee || uni.appFee}</div>
                  </div>
                </TableCell>
                <TableCell className="align-top py-6 pr-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Tuition</span>
                    <div className="text-sm font-medium text-slate-900">{uni.tuition}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Room & Board</span>
                    <div className="text-sm font-medium text-slate-900">{uni.room_board || uni.roomBoard}</div>
                  </div>
                </TableCell>
                <TableCell className="align-top py-6 space-y-6">
                  {uni.scholarships && uni.scholarships.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                        <BookOpen size={16} /> Scholarships
                      </div>
                      <div className="grid gap-3">
                        {uni.scholarships.map((s, i) => (
                          <div key={i} className="text-sm bg-blue-50/80 p-3 rounded-md border border-blue-100 hover:bg-blue-50 transition-colors">
                            <div className="font-semibold text-blue-900">{s.name}</div>
                            <div className="text-blue-700 font-medium mt-1 mb-1.5">{s.value}</div>
                            <div className="text-blue-600/90 text-xs leading-relaxed">{s.notes}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {uni.insights && (
                    <div className="text-sm text-amber-900 bg-amber-50/80 p-4 rounded-md border border-amber-100 whitespace-pre-wrap leading-relaxed shadow-sm">
                      <div className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
                        <Lightbulb size={16} /> Strategy & Insights
                      </div>
                      {uni.insights}
                    </div>
                  )}
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
    </div>
  );
}
