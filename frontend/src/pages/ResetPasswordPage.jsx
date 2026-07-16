import React, { useState } from 'react';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Gets token from URL

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await authService.resetPassword(token, password);
            setIsSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
                Invalid or missing reset token. Please request a new link.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">Create New Password</h1>
                    <p className="text-sm text-zinc-400 mt-2">Your new password must be different from previous used passwords.</p>
                </div>

                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 text-zinc-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 text-zinc-100"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !password || !confirmPassword}
                            className="w-full flex items-center justify-center gap-2 bg-zinc-50 text-zinc-950 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors mt-4"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                        <h2 className="text-lg font-medium text-zinc-100">Password Reset Complete</h2>
                        <p className="text-sm text-zinc-400">You can now use your new password to log in.</p>
                        <Link to="/auth" className="block w-full bg-zinc-50 text-zinc-950 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200 mt-4">
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}