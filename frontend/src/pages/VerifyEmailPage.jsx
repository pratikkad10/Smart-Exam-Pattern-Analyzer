import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const toast = useToast();

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [isResending, setIsResending] = useState(false);
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('The link is invalid or has expired.');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const verifyToken = async () => {
            try {
                await authService.verifyEmail(token);
                setStatus('success');
            } catch (error) {
                setStatus('error');
                setErrorMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };

        verifyToken();
    }, [token]);

    const handleResend = async () => {
        if (!email) {
            toast.error('Email Required', 'Please enter your email to resend the verification link.');
            return;
        }
        setIsResending(true);
        try {
            await authService.resendVerificationEmail(email);
            toast.success('Email Sent', 'Verification email resent! Please check your inbox.');
        } catch (error) {
            toast.error('Resend Failed', error.response?.data?.message || 'Failed to resend verification email.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">

                {status === 'loading' && (
                    <div className="space-y-4">
                        <Loader2 className="w-12 h-12 text-zinc-400 animate-spin mx-auto" />
                        <h2 className="text-xl font-semibold">Verifying your email</h2>
                        <p className="text-sm text-zinc-400">Please wait while we confirm your email address...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-semibold">Email Verified!</h2>
                        <p className="text-sm text-zinc-400">Your account is now fully active.</p>
                        <Link to="/dashboard" className="block w-full bg-zinc-50 text-zinc-950 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200 mt-6">
                            Go to Dashboard
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold">Verification Failed</h2>
                        <p className="text-sm text-zinc-400">{errorMessage}</p>

                        <div className="mt-6 space-y-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 text-zinc-100"
                            />
                            <button
                                onClick={handleResend}
                                disabled={isResending || !email}
                                className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-zinc-100 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors border border-zinc-700 disabled:opacity-50"
                            >
                                {isResending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Mail className="w-4 h-4" /> Resend Link</>}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}