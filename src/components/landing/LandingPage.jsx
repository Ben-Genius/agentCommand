import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Geam Light / Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-400/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute top-[20%] right-0 w-[800px] h-[600px] bg-teal-300/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen animate-pulse" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 text-white p-2 rounded-lg shadow-lg shadow-emerald-200">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Agent<span className="text-emerald-600">Command</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 transition-all hover:scale-105">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 animate-gradient-x">
                Admissions
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              The ultimate tool for agents and counselors to track student applications, manage documents, and ensure success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="h-14 px-8 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-300/40 transition-all hover:scale-105">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300">
                  View Demo
                </Button>
              </Link>
            </div>
            
            <div className="pt-8 flex items-center gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-emerald-500 h-5 w-5" /> Free Setup
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-emerald-500 h-5 w-5" /> Secure Data
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-emerald-500 h-5 w-5" /> 24/7 Support
              </div>
            </div>
          </div>

          <div className="relative perspective-1000">
            <div 
              className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full blur-3xl opacity-40 animate-pulse"
              style={{ transform: `translateY(${scrollY * -0.1}px)` }}
            ></div>
            <img 
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80" 
              alt="Dashboard Preview" 
              className="relative rounded-2xl shadow-2xl border border-slate-200/60 backdrop-blur-sm transition-transform duration-100 ease-out"
              style={{ 
                transform: `rotateY(-5deg) rotateX(5deg) translateY(${scrollY * -0.15}px)`,
                boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)'
              }}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Tracking</h3>
            <p className="text-slate-600">Monitor application status in real-time with our intuitive dashboard.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-100 hover:shadow-xl hover:shadow-green-100/50 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 shadow-sm">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Storage</h3>
            <p className="text-slate-600">Keep sensitive student documents safe with enterprise-grade encryption.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-100 hover:shadow-xl hover:shadow-teal-100/50 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6 shadow-sm">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Reports</h3>
            <p className="text-slate-600">Generate comprehensive student reports instantly with our AI engine.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
