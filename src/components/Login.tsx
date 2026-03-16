import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock, AlertCircle, Loader2, ShieldCheck, ArrowUpRight, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils';
import { SpaceBackground } from './SpaceBackground';

import { LoginAdConfig } from '../types';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  adConfig?: LoginAdConfig;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, adConfig }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setResetLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (resetError) throw resetError;
      setMessage('Check your email for the password reset link.');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to send reset link. Please try again later.');
    } finally {
      setResetLoading(false);
    }
  };

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'user', // Default role for new signups
              plan: 'trial' // Default plan
            }
          }
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          setMessage('Account created successfully! Please check your email to confirm your account.');
          setIsSignUp(false);
          // Optional: Automatically log them in if email confirmation is disabled
          // onLoginSuccess(data.user); 
        }
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;
        if (data.user) {
          onLoginSuccess(data.user);
        }
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${isSignUp ? 'sign up' : 'login'}. Please check your details.`);
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0`;
    }
    return null;
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      <SpaceBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/50 border border-white/20 overflow-hidden flex flex-col md:flex-row relative z-10",
          adConfig?.enabled ? "max-w-3xl" : "max-w-sm"
        )}
      >
        {adConfig?.enabled && (
          <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-slate-900">
            {adConfig.link ? (
              <a href={adConfig.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group">
                {adConfig.videoUrl ? (
                  <video 
                    src={adConfig.videoUrl} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : getYoutubeEmbedUrl(adConfig.youtubeUrl) ? (
                  <iframe
                    src={getYoutubeEmbedUrl(adConfig.youtubeUrl)!}
                    className="absolute inset-0 w-[300%] h-[300%] -left-[100%] -top-[100%] object-cover opacity-60 pointer-events-none"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <img 
                    src={adConfig.imageUrl} 
                    alt="Promotion" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-colors duration-300" />
              </a>
            ) : (
              <>
                {adConfig.videoUrl ? (
                  <video 
                    src={adConfig.videoUrl} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                ) : getYoutubeEmbedUrl(adConfig.youtubeUrl) ? (
                  <iframe
                    src={getYoutubeEmbedUrl(adConfig.youtubeUrl)!}
                    className="absolute inset-0 w-[300%] h-[300%] -left-[100%] -top-[100%] object-cover opacity-60 pointer-events-none"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <img 
                    src={adConfig.imageUrl} 
                    alt="Promotion" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                )}
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-12 space-y-4 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Special Offer
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight">{adConfig.title}</h2>
              <p className="text-slate-300 text-lg leading-relaxed">{adConfig.description}</p>
            </div>
          </div>
        )}

        <div className={cn("p-6 md:p-8 flex flex-col justify-center", adConfig?.enabled ? "md:w-1/2" : "w-full")}>
          <div className="flex flex-col items-center mb-5">
            <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
              <ArrowUpRight className="w-7 h-7 text-emerald-600" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">Johar Billing</h1>
            <p className="text-slate-500 text-[10px] mt-1">{isSignUp ? 'Create your account' : 'Secure access to your dashboard'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-3">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                    setMessage(null);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 disabled:text-emerald-400 transition-colors"
                  >
                    {resetLoading ? 'Sending...' : 'Forgot Password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {message && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-100"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm border border-rose-100"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Only authorized personnel can access this system.
              <br />
              Contact the administrator for access.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
