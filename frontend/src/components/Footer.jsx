import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">SmartExpense</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Helping you track, analyze, and optimize your spending with intelligent insights.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3 md:w-1/2">
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/Debasishpradhan18" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by Debasish
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
