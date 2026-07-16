import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';

export default function QuizCard() {
    // Dummy data representing AI-extracted questions
    const quizData = [
        {
            id: 1,
            topic: "Operating Systems",
            question: "Which of the following algorithms is specifically used for Deadlock Avoidance?",
            options: [
                "First-Come, First-Served (FCFS)",
                "Banker's Algorithm",
                "Round Robin Scheduling",
                "Shortest Job Next (SJN)"
            ],
            correctIndex: 1,
            explanation: "The Banker's Algorithm simulates resource allocation for all processes to check for a safe state, preventing deadlocks before they occur."
        },
        // Add more questions here for a full quiz flow
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState < number | null > (null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const question = quizData[currentQuestion];

    const handleSelect = (index) => {
        if (isSubmitted) return; // Prevent changing answer after submission
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            setIsSubmitted(true);
        }
    };

    const handleNext = () => {
        // Reset state for the next question (in a real app, you'd increment currentQuestion)
        setSelectedOption(null);
        setIsSubmitted(false);
    };

    // Helper function to determine the CSS classes for each option based on its state
    const getOptionStyles = (index) => {
        const isSelected = selectedOption === index;
        const isCorrect = index === question.correctIndex;

        if (!isSubmitted) {
            return isSelected
                ? "bg-zinc-800 border-zinc-400 text-zinc-50"
                : "bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100";
        }

        if (isCorrect) {
            return "bg-emerald-500/10 border-emerald-500/50 text-emerald-400";
        }

        if (isSelected && !isCorrect) {
            return "bg-red-500/10 border-red-500/50 text-red-400";
        }

        // Unselected and incorrect options fade slightly after submission
        return "bg-zinc-900/30 border-zinc-800/50 text-zinc-500 opacity-50";
    };

    return (
        <div className="h-full w-full flex items-center justify-center p-4 md:p-6 bg-zinc-950/50">

            <div className="w-full max-w-2xl bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">

                {/* Progress Bar (Visual flair) */}
                <div className="absolute top-0 left-0 h-1 bg-zinc-800 w-full">
                    <div className="h-full bg-zinc-400 transition-all duration-500 w-1/3"></div>
                </div>

                {/* Header: Meta Info */}
                <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-700">
                        <HelpCircle className="w-3.5 h-3.5" />
                        {question.topic}
                    </span>
                    <span className="text-sm font-medium text-zinc-500">
                        Question {currentQuestion + 1} of 10
                    </span>
                </div>

                {/* The Question */}
                <h2 className="text-xl md:text-2xl font-semibold text-zinc-50 mb-8 leading-snug">
                    {question.question}
                </h2>

                {/* Options List */}
                <div className="space-y-3 mb-8">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(index)}
                            disabled={isSubmitted}
                            className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${getOptionStyles(index)}`}
                        >
                            <span className="text-sm md:text-base font-medium">{option}</span>

                            {/* Show Icons only after submission */}
                            {isSubmitted && index === question.correctIndex && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            )}
                            {isSubmitted && selectedOption === index && index !== question.correctIndex && (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Feedback & Actions Area */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800/50 min-h-[80px]">

                    <div className="flex-1 w-full">
                        {isSubmitted && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <p className={`text-sm font-medium mb-1 ${selectedOption === question.correctIndex ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {selectedOption === question.correctIndex ? 'Correct!' : 'Incorrect.'}
                                </p>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    {question.explanation}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="shrink-0 w-full sm:w-auto">
                        {!isSubmitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedOption === null}
                                className="w-full sm:w-auto bg-zinc-50 text-zinc-950 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors shadow-sm"
                            >
                                Check Answer
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-800 text-zinc-50 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors border border-zinc-700 hover:border-zinc-600 shadow-sm"
                            >
                                Next Question <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}