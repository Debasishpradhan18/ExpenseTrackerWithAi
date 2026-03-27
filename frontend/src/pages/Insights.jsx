import { useState, useEffect } from 'react';
import api from '../services/api';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get('/insights');
        setInsights(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="relative flex w-16 h-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-16 w-16 bg-primary/20 items-center justify-center">
            <Lightbulb className="w-8 h-8 text-primary animate-pulse" />
          </span>
        </div>
        <p className="text-slate-500 font-medium">Generating AI Insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          AI Financial Insights
          <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">Beta</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Smart suggestions based on your spending patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary to-purple-800 p-8 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Monthly Summary</h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                Based on our analysis, your spending is <strong className="text-white">{insights?.spendChange > 0 ? "higher" : insights?.spendChange < 0 ? "lower" : "stable"}</strong> compared to last month.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-foreground/70 mb-1">Estimated Savings Opportunity</p>
                <p className="text-2xl font-bold">₹{insights?.savingsOpportunity?.toFixed(2) || '45.00'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white px-2">Key Highlights</h3>
          
          {(insights?.highlights || []).map((highlight, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex gap-4 transition-transform hover:-translate-y-1">
              <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                highlight.type === 'warning' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                highlight.type === 'positive' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {highlight.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                 highlight.type === 'positive' ? <CheckCircle2 className="w-5 h-5" /> : 
                 <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{highlight.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{highlight.description}</p>
              </div>
            </div>
          ))}
          
          {(!insights?.highlights || insights.highlights.length === 0) && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-slate-500">Not enough data to generate insights yet. Keep adding transactions!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
