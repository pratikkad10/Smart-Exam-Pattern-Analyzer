import React from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage({ mode = 'login' }) {
    const navigate = useNavigate();
    const isLogin = mode === 'login';

    return (
        <div className="min-h-screen w-full flex bg-zinc-950 font-sans text-zinc-50 selection:bg-zinc-800">

            {/* Left Panel - Branding & Visuals (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-zinc-900 border-r border-zinc-800 relative overflow-hidden items-center justify-center p-12">
                {/* Background glow effect */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-zinc-50 text-zinc-950 flex items-center justify-center font-bold">
                            AI
                        </div>
                        <span className="text-2xl font-bold tracking-tight">StudyAssistant</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight leading-tight mb-6 text-zinc-100">
                        Stop studying harder. <br />
                        <span className="text-zinc-500">Start studying smarter.</span>
                    </h1>
                    <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
                        Join thousands of students who are turning their static PDF past papers into interactive, AI-driven study sessions.
                    </p>

                    <div className="flex items-center gap-4 text-sm text-zinc-500 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                        <BrainCircuit className="w-8 h-8 text-zinc-400" />
                        <p>Our RAG-powered engine analyzes syllabus patterns to predict your actual exam questions.</p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Auth Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Logo (Visible only on small screens) */}
                <div className="absolute top-8 left-8 flex lg:hidden items-center gap-2">
                    <div className="w-8 h-8 rounded bg-zinc-50 text-zinc-950 flex items-center justify-center font-bold text-sm">AI</div>
                    <span className="text-lg font-semibold tracking-tight">StudyAssistant</span>
                </div>

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-sm text-zinc-400 mt-2">
                            {isLogin
                                ? 'Enter your credentials to access your workspace.'
                                : 'Enter your details below to create your account.'}
                        </p>
                    </div>

                    {/* Form Rendering */}
                    {isLogin ? <LoginForm /> : <SignupForm />}

                    {/* View Toggle */}
                    <div className="mt-8 text-center text-sm text-zinc-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => navigate(isLogin ? '/signup' : '/login')}
                            className="text-zinc-100 hover:text-zinc-50 font-medium transition-colors hover:underline underline-offset-4 cursor-pointer"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}