import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          onAuthSuccess({
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          });
          onClose();
        }
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (data.user) {
          setSuccessMsg('Account created successfully! You can now access your dashboard.');
          setTimeout(() => {
            onAuthSuccess({
              id: data.user?.id || `user-${Date.now()}`,
              email: data.user?.email || email,
              full_name: fullName || email.split('@')[0],
            });
            onClose();
          }, 1200);
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setSuccessMsg('Password reset instructions have been sent to your email.');
      }
    } catch (err: any) {
      console.error('[Auth Error]:', err);
      // If Supabase encounters network or email confirm error, provide informative feedback
      setErrorMsg(err.message || 'Authentication failed. Please check credentials or use Quick Demo Mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = () => {
    onAuthSuccess({
      id: 'demo-student-user',
      email: 'student@lectura.ai',
      full_name: 'Alex Rivera (Demo Student)',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-stone-900 text-white mb-2 shadow-xs">
            <Shield className="w-5 h-5 text-indigo-300" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            {mode === 'login' && 'Sign in to LECTURA AI'}
            {mode === 'signup' && 'Create your student account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-stone-500">
            {mode === 'login' && 'Access your personalized lecture study kits and notes'}
            {mode === 'signup' && 'Store and synchronize study materials securely via Supabase'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-indigo-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#12141D] text-white text-xs font-semibold hover:bg-stone-800 active:scale-[0.99] transition-all disabled:opacity-60 shadow-xs"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Mode Toggles */}
        <div className="mt-5 text-center text-xs text-stone-500">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(null); }}
                className="font-semibold text-stone-900 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className="font-semibold text-stone-900 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo Divider */}
        <div className="mt-5 pt-4 border-t border-stone-200 text-center">
          <button
            type="button"
            onClick={handleGuestDemo}
            className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Continue as Instant Demo Student</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-stone-400 mt-1 block">
            Instant evaluation bypass without email verification
          </span>
        </div>
      </div>
    </div>
  );
};
