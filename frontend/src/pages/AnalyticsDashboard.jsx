import React, { useState, useEffect } from 'react';
import { Brain, Target, BarChart2, BookOpen } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';

export default function AnalyticsDashboard() {
    const { conversationId } = useParams();
    const [questionBank, setQuestionBank] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestionBank = async () => {
            try {
                const response = await analyticsService.getQuestionBank([], conversationId);
                setQuestionBank(response.questionBank || []);
            } catch (error) {
                console.error("Failed to fetch question bank:", error);
            } finally {
                setLoading(false);
            }
        };

        if (conversationId) {
            fetchQuestionBank();
        } else {
            setLoading(false);
        }
    }, [conversationId]);

    const totalExtracted = questionBank.reduce((acc, curr) => acc + curr.frequency, 0);

    if (!conversationId) {
        return (
            <div className="h-full flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-4">
                    <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
                    <h2 className="text-xl font-semibold text-zinc-300">Select a Conversation</h2>
                    <p className="text-sm text-zinc-500">
                        The Question Bank is generated dynamically based on the exam papers you upload into a specific chat session. Please select a chat or start a new one to view its question bank.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full p-6 md:p-10 w-full max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Session Question Bank</h1>
                <p className="text-sm text-zinc-400 mt-1">AI analysis across the exam papers in this conversation.</p>
            </div>

            {/* KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-zinc-500" />
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Occurrences</p>
                    </div>
                    <p className="text-3xl font-bold text-zinc-50">{loading ? '-' : totalExtracted}</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-zinc-500" />
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Unique Questions</p>
                    </div>
                    <p className="text-3xl font-bold text-zinc-50">{loading ? '-' : questionBank.length}</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart2 className="w-4 h-4 text-zinc-500" />
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Most Frequent Marks</p>
                    </div>
                    <p className="text-3xl font-bold text-zinc-50">{loading ? '-' : (questionBank[0]?.marks || 'N/A')}</p>
                </div>
            </div>

            {/* Question Bank List */}
            <div>
                <h3 className="text-sm font-semibold text-zinc-200 mb-4">Most Repeated Questions (Question Bank)</h3>
                <div className="space-y-3">
                    {loading ? (
                        <p className="text-zinc-500 text-sm">Analyzing papers...</p>
                    ) : questionBank.length === 0 ? (
                        <p className="text-zinc-500 text-sm">No questions found. Try uploading some exam papers.</p>
                    ) : (
                        questionBank.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors gap-4">
                                <div className="flex items-start gap-4">
                                    {/* Frequency Badge */}
                                    <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-500/10 flex flex-col items-center justify-center shrink-0">
                                        <span className="font-bold text-sm text-emerald-500">{item.frequency}x</span>
                                    </div>

                                    {/* Question Info */}
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-100">{item.question}</h4>
                                        <div className="flex gap-3 text-xs text-zinc-400 mt-2">
                                            {item.marks && <span className="bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-300">{item.marks} Marks</span>}
                                            {item.unit && <span className="bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-300">Unit: {item.unit}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}