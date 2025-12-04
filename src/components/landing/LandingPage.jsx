import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import logo from '@/assets/logo.png';

export default function LandingPage() {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative transition-colors duration-300">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-0 w-[800px] h-[600px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none animate-pulse" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src={logo} alt="AgentCommand Logo" className="h-8 sm:h-10 w-auto object-contain" />
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            Agent<span className="text-primary">Command</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log in</Button>
            <Button variant="ghost" size="icon" className="sm:hidden">
               <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105 text-xs sm:text-sm px-3 sm:px-4">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-600 animate-gradient-x">
                Admissions
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              The ultimate tool for agents and counselors to track student applications, manage documents, and ensure success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-8 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 text-lg">
                  View Demo
                </Button>
              </Link>
            </div>
            
            <div className="pt-8 flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary h-5 w-5" /> Free Setup
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary h-5 w-5" /> Secure Data
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary h-5 w-5" /> 24/7 Support
              </div>
            </div>
          </div>

          <div className="relative perspective-1000 mt-8 lg:mt-0">
            <div 
              className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-blue-400/30 rounded-full blur-3xl opacity-40 animate-pulse"
              style={{ transform: `translateY(${scrollY * -0.1}px)` }}
            ></div>
            <img 
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80" 
              alt="Dashboard Preview" 
              className="relative rounded-2xl shadow-2xl border border-border/50 backdrop-blur-sm transition-transform duration-100 ease-out dark:opacity-80 w-full"
              style={{ 
                transform: `rotateY(-5deg) rotateX(5deg) translateY(${scrollY * -0.15}px)`,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 lg:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 shadow-sm">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Fast Tracking</h3>
            <p className="text-muted-foreground">Monitor application status in real-time with our intuitive dashboard.</p>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 shadow-sm">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Storage</h3>
            <p className="text-muted-foreground">Keep sensitive student documents safe with enterprise-grade encryption.</p>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 shadow-sm">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Reports</h3>
            <p className="text-muted-foreground">Generate comprehensive student reports instantly with our AI engine.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
