import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import StudentProfilePage from '@/components/dashboard/StudentProfilePage';

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch student
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      
      if (studentError) throw studentError;
      setStudent(studentData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load student data');
      navigate('/dashboard/students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!student) return <div className="p-8 text-center">Student not found</div>;

  return (
    <StudentProfilePage 
      student={student} 
      onBack={() => navigate('/dashboard/students')} 
      onUpdate={(updatedStudent) => setStudent(updatedStudent)}
    />
  );
}
