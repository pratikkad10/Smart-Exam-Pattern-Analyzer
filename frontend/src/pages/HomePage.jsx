import React from 'react';
import { ArrowRight, FileText, BrainCircuit, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800 flex flex-col">
            {/* Navbar */}
            <nav className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 lg:px-12">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-zinc-50 text-zinc-950 flex items-center justify-center font-bold">AI</div>
                    <span className="text-lg font-semibold tracking-tight">StudyAssistant</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors">
                        Log in
                    </Link>
                    <Link to="/signup" className="text-sm font-medium bg-zinc-50 text-zinc-950 px-4 py-2 rounded hover:bg-zinc-200 transition-colors">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
                <div className="max-w-3xl space-y-8">
                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                        Turn your past exam papers into <span className="text-zinc-400">interactive study sessions.</span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Upload your PDFs. Our AI extracts questions, predicts high-yield topics, and generates personalized quizzes to help you ace your next exam.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Link to="/signup" className="flex items-center gap-2 text-sm font-medium bg-zinc-50 text-zinc-950 px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors">
                            Start Studying Free <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-24">
                    {[
                        { icon: FileText, title: "Smart Extraction", desc: "Instantly pull questions and answers from dense PDF files." },
                        { icon: BrainCircuit, title: "Topic Prediction", desc: "Identify recurring patterns and focus on high-probability topics." },
                        { icon: MessageSquare, title: "RAG Chat Tutors", desc: "Chat directly with your syllabus to clarify complex concepts." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-left backdrop-blur-md">
                            <feature.icon className="w-6 h-6 text-zinc-300 mb-4" />
                            <h3 className="text-lg font-semibold text-zinc-100 mb-2">{feature.title}</h3>
                            <p className="text-sm text-zinc-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}