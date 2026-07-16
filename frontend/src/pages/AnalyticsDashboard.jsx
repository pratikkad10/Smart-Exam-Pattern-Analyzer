import React from 'react';
import { Brain, Target, BarChart2, ChevronRight } from 'lucide-react';

export default function AnalyticsDashboard() {
    const predictedTopics = [
        { id: 1, name: "Process Synchronization & Semaphores", count: 4, total: 4, marks: 35, probability: 92, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { id: 2, name: "Page Replacement Algorithms", count: 3, total: 4, marks: 20, probability: 75, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        { id: 3, name: "Deadlock Avoidance (Banker's)", count: 2, total: 4, marks: 15, probability: 45, color: "text-zinc-400", bg: "bg-zinc-800", border: "border-zinc-700" },
    ];

    return (
        <div className="h-full overflow-y-auto p-6 md:p-10 w-full max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Paper Intelligence</h1>
                <p className="text-sm text-zinc-400 mt-1">AI analysis across 4 uploaded examination papers.</p>
            </div>

            {/* KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-zinc-500" />
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Questions Extracted</p>
                    </div>
                    <p className="text-3xl font-bold text-zinc-50">142</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-zinc-500" />
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">High-Yield Topics</p>
                    </div>
                    <p className="text-3xl font-bold text-zinc-50">8</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart2 className="w-4 h-4 text-zinc-500" />
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Avg. Difficulty</p>
                    </div>
                    <p className="text-3xl font-bold text-zinc-50">Medium</p>
                </div>
            </div>

            {/* Predicted Topics List */}
            <div>
                <h3 className="text-sm font-semibold text-zinc-200 mb-4">Predicted Exam Focus (Frequency Based)</h3>
                <div className="space-y-3">

                    {predictedTopics.map((topic) => (
                        <div key={topic.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors gap-4">

                            <div className="flex items-center gap-4">
                                {/* Probability Badge */}
                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold text-sm shrink-0 ${topic.bg} ${topic.border} ${topic.color}`}>
                                    {topic.probability}%
                                </div>

                                {/* Topic Info */}
                                <div>
                                    <h4 className="text-sm font-medium text-zinc-100">{topic.name}</h4>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        Appeared in {topic.count}/{topic.total} past papers ({topic.marks} total marks)
                                    </p>
                                </div>
                            </div>

                            {/* Action */}
                            <button className="text-xs px-4 py-2 border border-zinc-700 rounded-md hover:bg-zinc-800 hover:text-zinc-100 text-zinc-300 transition-colors flex items-center justify-center gap-1 shrink-0 w-full sm:w-auto">
                                Generate Quiz <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}