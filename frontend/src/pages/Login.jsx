import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { loginWithGoogle, registerWithEmail, loginWithEmail, isDemoMode } from '../services/firebase';
import { Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let result;
      if (isRegistering) {
        result = await registerWithEmail(email, password);
      } else {
        result = await loginWithEmail(email, password);
      }
      if (isDemoMode) demoLogin(result.user);
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await loginWithGoogle();
      if (isDemoMode) demoLogin(result.user);
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase:', '').trim());
    }
  };

  return (
    <div className="min-h-screen flex text-slate-800 bg-[#f8fafc] dark:bg-[#020817]">
      {/* Left side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-purple-800 opacity-90 mix-blend-multiply"></div>
        <div className="absolute inset-x-0 bottom-0 top-1/2 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-white/10 blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full font-medium text-sm">
            <img src={logo} alt="Logo" className="w-5 h-5 rounded object-contain bg-white p-0.5" />
            SmartExpense Tracker
          </div>
          <h1 className="text-5xl font-bold leading-tight">Take Control of Your Finances Today</h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Track expenses, analyze trends with AI, and achieve your financial goals effortlessly.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h3 className="font-semibold text-lg mb-2">AI Insights</h3>
              <p className="text-white/70 text-sm">Personalized suggestions to optimize your spending.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h3 className="font-semibold text-lg mb-2">Beautiful Charts</h3>
              <p className="text-white/70 text-sm">Visualize your money flow with interactive graphs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center w-full px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="mb-10 lg:hidden text-center flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-slate-100 dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700">
              <img src={logo} alt="SmartExpense Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">SmartExpense</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white hidden lg:block">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {isRegistering 
                  ? 'Sign up to start tracking your expenses' 
                  : 'Please sign in to access your dashboard'}
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 text-sm text-red-700 bg-red-50 dark:bg-red-950/50 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-5 flex flex-col">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-slate-900 dark:text-white sm:text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-slate-900 dark:text-white sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
              >
                {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#f8fafc] dark:bg-[#020817] text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              {isRegistering ? "Already have an account?" : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {isRegistering ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
