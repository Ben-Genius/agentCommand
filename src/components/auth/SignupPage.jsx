import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, GraduationCap, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError("You must agree to the Terms & Conditions");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-600">
            We've sent a verification link to <span className="font-medium text-gray-900">{email}</span>.
            Please verify your email to access your dashboard.
          </p>
          <div className="pt-4">
            <Link to="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 to-emerald-900/90"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-400">
            <GraduationCap size={32} />
            <span className="text-2xl font-bold tracking-tight text-white">AgentCommand</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl font-bold leading-tight">Start managing student applications with confidence.</h1>
          <p className="text-emerald-200 text-lg">Join thousands of agents and counselors who trust AgentCommand to streamline their workflow and boost acceptance rates.</p>
          
          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium bg-emerald-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-emerald-700">
              <ShieldCheck size={16} className="text-emerald-400" /> Secure Data
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-emerald-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-emerald-700">
              <CheckCircle2 size={16} className="text-emerald-400" /> Free Trial
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-emerald-400">
          © 2025 AgentCommand Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gray-50 lg:bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden bg-emerald-600 text-white p-3 rounded-xl inline-flex mb-4">
              <GraduationCap size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="mt-2 text-gray-600">Enter your details to get started.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <XCircle size={16} /> {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-11"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="h-11"
                  disabled={loading}
                />
                {/* Password Strength Meter */}
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level}
                          className={`flex-1 rounded-full transition-colors duration-300 ${
                            passwordStrength >= level 
                              ? (passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-emerald-500') 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-right text-gray-500">
                      {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={agreed} 
                  onCheckedChange={setAgreed}
                  disabled={loading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                >
                  I agree to the <Link to="#" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link to="#" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>
            </div>

            <Button className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 transition-all" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
