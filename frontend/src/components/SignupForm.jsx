import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function SignupForm() {
    const navigate = useNavigate();
    const { register } = useAuth();

    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Call the API service we created
            await register({ firstName, lastName, email, password });

            // If successful, navigate to the dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error("Signup failed:", err);
            // Display error message from backend or fallback to generic message
            setError(err.response?.data?.message || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignup} className="space-y-4">

            {/* Error Message Display */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-md flex items-start gap-2 mb-4 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Name Fields (First & Last Name side by side) */}
            <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">First Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Last Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Doe"
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            minLength={6}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 pl-10 pr-10 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 pt-2">
                <input
                    type="checkbox"
                    required
                    className="mt-1 shrink-0 w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-zinc-50 focus:ring-zinc-500 focus:ring-offset-zinc-950 cursor-pointer"
                />
                <label className="text-xs text-zinc-400 leading-tight">
                    By clicking Create account, you agree to our <a href="#" className="text-zinc-300 hover:text-zinc-50 underline underline-offset-2">Terms of Service</a> and <a href="#" className="text-zinc-300 hover:text-zinc-50 underline underline-offset-2">Privacy Policy</a>.
                </label>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading || !firstName || !lastName || !email || !password}
                className="w-full flex items-center justify-center gap-2 bg-zinc-50 text-zinc-950 py-2.5 rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors mt-4 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create account'}
            </button>
        </form>
    );
}