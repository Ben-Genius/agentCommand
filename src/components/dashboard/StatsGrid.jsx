import React from 'react';
import { Users, CheckCircle, FileText, Clock, TrendingUp, TrendingDown, Minus, ArrowRight, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function StatsGrid({ stats }) {
  // Mock trends for visual flair
  const trends = {
    total: { value: '+12%', direction: 'up', label: 'vs last month' },
    submitted: { value: '+5%', direction: 'up', label: 'vs last month' },
    missing: { value: '-2%', direction: 'down', label: 'vs last month' },
    urgent: { value: '0%', direction: 'neutral', label: 'next 30 days' },
  };

  const renderTrend = (trend) => {
    if (trend.direction === 'up') return <span className="text-emerald-600 flex items-center text-xs font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full"><TrendingUp size={10} className="mr-1" /> {trend.value}</span>;
    if (trend.direction === 'down') return <span className="text-red-600 flex items-center text-xs font-medium bg-red-50 px-1.5 py-0.5 rounded-full"><TrendingDown size={10} className="mr-1" /> {trend.value}</span>;
    return <span className="text-muted-foreground flex items-center text-xs font-medium bg-secondary px-1.5 py-0.5 rounded-full"><Minus size={10} className="mr-1" /> {trend.value}</span>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Students - Large Card */}
      <Card className="dashboard-card md:col-span-2 relative overflow-hidden group">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{stats.total}</span>
            {renderTrend(trends.total)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Active students in the pipeline.</p>
          <div className="mt-4 flex gap-2">
             <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[70%]" />
             </div>
             <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[40%]" />
             </div>
             <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[20%]" />
             </div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
             <span>Planning</span>
             <span>Applied</span>
             <span>Accepted</span>
          </div>
        </CardContent>
      </Card>

      {/* Applications Sent */}
      <Card className="dashboard-card group hover:border-emerald-200 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
            <div className="p-1.5 bg-emerald-50 rounded-md group-hover:bg-emerald-100 transition-colors">
               <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">{stats.submitted}</span>
            {renderTrend(trends.submitted)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Successfully submitted.</p>
          <Progress value={65} className="h-1 mt-3 bg-emerald-100" indicatorClassName="bg-emerald-500" />
        </CardContent>
      </Card>

      {/* Action Required */}
      <Card className="dashboard-card group hover:border-amber-200 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Actions</CardTitle>
            <div className="p-1.5 bg-amber-50 rounded-md group-hover:bg-amber-100 transition-colors">
               <FileText className="h-4 w-4 text-amber-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">{stats.missingDocs}</span>
            {renderTrend(trends.missing)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Missing documents.</p>
          <Progress value={30} className="h-1 mt-3 bg-amber-100" indicatorClassName="bg-amber-500" />
        </CardContent>
      </Card>

      {/* Urgent Deadlines - Full Width on Mobile, 1 col on Desktop */}
      <Card className="dashboard-card md:col-span-2 lg:col-span-1 bg-gradient-to-br from-card to-red-50/30 border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium text-muted-foreground">Urgent</CardTitle>
            <Clock className="h-4 w-4 text-red-600 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
             <span className="text-2xl font-bold tracking-tight">{stats.upcomingDeadlines}</span>
             <span className="text-xs text-red-600 font-medium">Due soon</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Deadlines within 30 days.</p>
          <Button variant="ghost" size="sm" className="w-full mt-2 h-7 text-xs justify-between hover:bg-red-50 hover:text-red-700">
             View Details <ArrowRight size={12} />
          </Button>
        </CardContent>
      </Card>
      
      {/* Quick Stat - Pipeline Health */}
      <Card className="dashboard-card lg:col-span-3 flex flex-col sm:flex-row items-center p-4 gap-4 bg-secondary/20 border-dashed">
         <div className="flex items-center gap-3 min-w-[200px]">
            <div className="p-2 bg-primary/10 rounded-full">
               <Activity size={18} className="text-primary" />
            </div>
            <div>
               <p className="text-sm font-medium">Pipeline Health</p>
               <p className="text-xs text-muted-foreground">Overall system status</p>
            </div>
         </div>
         <div className="flex-1 w-full grid grid-cols-3 gap-4 text-center divide-x">
            <div>
               <p className="text-xs text-muted-foreground">Conversion</p>
               <p className="font-semibold text-sm">24%</p>
            </div>
            <div>
               <p className="text-xs text-muted-foreground">Avg Time</p>
               <p className="font-semibold text-sm">12 days</p>
            </div>
            <div>
               <p className="text-xs text-muted-foreground">Success</p>
               <p className="font-semibold text-sm">89%</p>
            </div>
         </div>
      </Card>
    </div>
  );
}
