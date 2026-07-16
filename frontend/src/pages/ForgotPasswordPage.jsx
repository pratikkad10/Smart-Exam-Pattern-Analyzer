import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await authService.forgotPassword(email);
            setIsSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">

                <div className="text-center mb-8">
                    <div className="w-10 h-10 rounded bg-zinc-50 text-zinc-950 flex items-center justify-center font-bold mx-auto mb-4">AI</div>
                    <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
                    <p className="text-sm text-zinc-400 mt-2">
                        {!isSent ? "Enter your email and we'll send you a reset link." : "Check your inbox."}
                    </p>
                </div>

                {!isSent ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-shadow text-zinc-100"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full flex items-center justify-center gap-2 bg-zinc-50 text-zinc-950 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors mt-2 disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex flex-col items-center text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                        <p className="text-sm text-emerald-400 font-medium mb-1">Email Sent Successfully</p>
                        <p className="text-xs text-zinc-400">We've sent a password reset link to {email}. It will expire in 15 minutes.</p>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link to="/auth" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}