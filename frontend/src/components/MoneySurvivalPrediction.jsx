import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, AlertTriangle, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';
import { addDays, format } from 'date-fns';
import PropTypes from 'prop-types';

export default function MoneySurvivalPrediction({ transactions = [], balance = 0 }) {
  const prediction = React.useMemo(() => {
    // 1. Get total expenses from the last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Filter expenses in last 7 days
    const recentExpenses = transactions.filter(tx => {
      if (tx.type !== 'expense') return false;
      const txDate = new Date(tx.date);
      return txDate >= sevenDaysAgo && txDate <= today;
    });

    const last7DaysExpense = recentExpenses.reduce((sum, tx) => sum + tx.amount, 0);

    // 2. Calculate daily average spending
    const dailyAvg = last7DaysExpense / 7;

    // Calculate survival days
    let survivalDays = 0;
    let riskLevel = '';
    let riskColor = '';
    let riskIcon = null;

    if (dailyAvg > 0) {
      survivalDays = Math.round(balance / dailyAvg);
    }

    // 4. Add Risk Level
    if (survivalDays > 60 || dailyAvg === 0) {
      riskLevel = "Low Risk ✅";
      riskColor = "text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-900/30";
      riskIcon = <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />;
      if (dailyAvg === 0 && balance > 0) {
          survivalDays = "∞"; // Infinite survival if no expenses and positive balance
      }
    } else if (survivalDays >= 30 && survivalDays <= 60) {
      riskLevel = "Medium Risk ⚠️";
      riskColor = "text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30";
      riskIcon = <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />;
    } else {
      riskLevel = "High Risk 🚨";
      riskColor = "text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-900/30";
      riskIcon = <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />;
    }

    // 5. Add Smart Tip
    let foodExpense = 0;
    let entertainmentExpense = 0;

    recentExpenses.forEach(tx => {
      const cat = tx.category?.toLowerCase() || '';
      if (cat.includes('food') || cat.includes('dining') || cat.includes('restaurant')) {
        foodExpense += tx.amount;
      }
      if (cat.includes('entertainment') || cat.includes('movie') || cat.includes('fun')) {
        entertainmentExpense += tx.amount;
      }
    });

    let smartTip = "You're doing well";
    if (last7DaysExpense > 0) {
      if ((foodExpense / last7DaysExpense) > 0.30) {
        smartTip = "Reduce food spending";
      } else if ((entertainmentExpense / last7DaysExpense) > 0.20) {
        smartTip = "Cut entertainment expenses";
      }
    }

    return {
      dailyAvg,
      survivalDays,
      riskLevel,
      riskColor,
      riskIcon,
      smartTip
    };
  }, [transactions, balance]);

  if (!prediction) return null;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const runOutDate = prediction.survivalDays !== "∞" 
    ? addDays(new Date(), prediction.survivalDays)
    : null;

  return (
    <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-indigo-200 dark:border-indigo-900/50 relative overflow-hidden group hover:shadow-lg transition-all h-full bg-gradient-to-br from-white to-indigo-50 dark:from-slate-900 dark:to-indigo-950/20">
      <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold border-b border-transparent bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
          Financial Status
        </h3>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Your money will last</p>
          <div className="flex items-baseline gap-2">
            {prediction.dailyAvg === 0 ? (
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">No spending data</span>
            ) : (
              <>
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white drop-shadow-sm">
                  {prediction.survivalDays}
                </span>
                <span className="text-lg font-medium text-slate-500 dark:text-slate-400">days</span>
              </>
            )}
          </div>
          {prediction.dailyAvg > 0 && runOutDate && (
             <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
               Est. run-out: {format(runOutDate, 'MMM dd, yyyy')}
             </p>
          )}
        </div>

        <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-3 backdrop-blur-sm">
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Risk Level</span>
            <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-sm font-semibold shadow-sm ${prediction.riskColor}`}>
              {prediction.riskIcon}
              <span className="drop-shadow-sm">{prediction.riskLevel}</span>
            </div>
          </div>

          <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50"></div>

          <div className="flex gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5 block">Smart Tip</span>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">
                {prediction.smartTip}
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

MoneySurvivalPrediction.propTypes = {
  transactions: PropTypes.array,
  balance: PropTypes.number
};
