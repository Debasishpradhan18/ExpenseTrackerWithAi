import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, Target, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get('/insights');
        setInsights(res.data);
      } catch (err) {
        console.error("Failed to fetch insights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 shadow-sm">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Smart Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">Automated analysis of your financial health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Savings Opportunity</h3>
          </div>
          <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">₹{insights?.savingsOpportunity?.toFixed(2) || '0.00'}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Potential monthly savings if you optimize your top expenses.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
          <div className={`absolute -right-4 -top-4 w-32 h-32 rounded-full blur-3xl transition-all ${insights?.spendChange > 0 ? 'bg-red-500/10 group-hover:bg-red-500/20' : 'bg-green-500/10 group-hover:bg-green-500/20'}`}></div>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${insights?.spendChange > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'}`}>
              {insights?.spendChange > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Month-over-Month Spending</h3>
          </div>
          <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {insights?.spendChange > 0 ? '+' : ''}₹{insights?.spendChange?.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Compared to your spending last month.</p>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 mt-4">Key Highlights</h2>
        <div className="space-y-4">
          {insights?.highlights && insights.highlights.length > 0 ? (
            insights.highlights.map((highlight, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border flex gap-4 items-start ${
                highlight.type === 'positive' 
                  ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30'
                  : highlight.type === 'warning'
                    ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30'
                    : 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30'
              }`}>
                <div className={`mt-0.5 p-2 rounded-full flex-shrink-0 ${
                  highlight.type === 'positive' ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' :
                  highlight.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                }`}>
                  {highlight.type === 'positive' ? <Target className="w-5 h-5" /> : 
                   highlight.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : 
                   <Lightbulb className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className={`font-semibold text-lg mb-1 ${
                    highlight.type === 'positive' ? 'text-green-800 dark:text-green-300' :
                    highlight.type === 'warning' ? 'text-amber-800 dark:text-amber-300' :
                    'text-blue-800 dark:text-blue-300'
                  }`}>
                    {highlight.title}
                  </h4>
                  <p className={`text-sm ${
                    highlight.type === 'positive' ? 'text-green-700/80 dark:text-green-400/80' :
                    highlight.type === 'warning' ? 'text-amber-700/80 dark:text-amber-400/80' :
                    'text-blue-700/80 dark:text-blue-400/80'
                  }`}>
                    {highlight.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500">Add more transactions to generate personalized highlights.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
