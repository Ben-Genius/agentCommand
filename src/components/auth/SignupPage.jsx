import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Globe2, Users } from 'lucide-react';

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
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-in zoom-in-50 duration-300">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-600">
            We've sent a verification link to <span className="font-medium text-gray-900">{email}</span>.
            Please verify your email to access your dashboard.
          </p>
          <div className="pt-4">
            <Link to="/login">
              <Button variant="outline" className="w-full h-11">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-950 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-950/95 to-black"></div>
        
        <Link to="/" className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/src/assets/logo.png" alt="AgentCommand Logo" className="h-12 w-auto object-contain" />
            <span className="text-2xl font-bold tracking-tight text-white">AgentCommand</span>
          </div>
        </Link>

        <div className="relative z-10 space-y-8 max-w-lg">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Start managing student <br/>
            applications with <span className="text-emerald-400">confidence</span>.
          </h1>
          <p className="text-emerald-100/80 text-lg leading-relaxed">
            Join thousands of agents and counselors who trust AgentCommand to streamline their workflow and boost acceptance rates.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 text-sm font-medium bg-emerald-900/40 px-4 py-3 rounded-xl backdrop-blur-sm border border-emerald-500/20">
              <ShieldCheck size={20} className="text-emerald-400" /> 
              <span>Secure Data</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium bg-emerald-900/40 px-4 py-3 rounded-xl backdrop-blur-sm border border-emerald-500/20">
              <Globe2 size={20} className="text-emerald-400" /> 
              <span>Global Reach</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium bg-emerald-900/40 px-4 py-3 rounded-xl backdrop-blur-sm border border-emerald-500/20">
              <Users size={20} className="text-emerald-400" /> 
              <span>Team Collab</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium bg-emerald-900/40 px-4 py-3 rounded-xl backdrop-blur-sm border border-emerald-500/20">
              <CheckCircle2 size={20} className="text-emerald-400" /> 
              <span>Free Trial</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-emerald-400/60">
          © 2025 AgentCommand Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gray-50/50">
        <div className="max-w-[440px] w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:bg-transparent lg:shadow-none lg:border-none lg:p-0">
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden flex justify-center mb-6">
              <img src="/src/assets/logo.png" alt="AgentCommand Logo" className="h-12 w-auto object-contain" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create an account</h2>
            <p className="text-gray-500">Enter your details to get started with your 14-day free trial.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-red-100">
                <XCircle size={16} /> {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  disabled={loading}
                />
                {/* Password Strength Meter */}
                {password && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1.5 h-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level}
                          className={`flex-1 rounded-full transition-all duration-500 ${
                            passwordStrength >= level 
                              ? (passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-emerald-500') 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-right text-gray-500 font-medium">
                      {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={agreed} 
                  onCheckedChange={setAgreed}
                  disabled={loading}
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-relaxed text-gray-600"
                >
                  I agree to the <Link to="#" className="text-emerald-600 hover:underline font-medium">Terms of Service</Link> and <Link to="#" className="text-emerald-600 hover:underline font-medium">Privacy Policy</Link>
                </label>
              </div>
            </div>

            <Button 
              className="w-full h-12 text-base font-medium bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30" 
              type="submit" 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline transition-all">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
