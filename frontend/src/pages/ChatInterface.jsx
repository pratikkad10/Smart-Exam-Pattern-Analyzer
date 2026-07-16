import React, { useState } from 'react';
import { Send, Bot, FileText } from 'lucide-react';

export default function ChatInterface() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ai',
            content: "I've processed the Operating Systems 2024 paper. I found 14 major questions, mostly focusing on Virtual Memory and Process Synchronization. What would you like to review?",
        },
        {
            id: 2,
            role: 'user',
            content: "Explain the question about the Banker's Algorithm.",
        },
        {
            id: 3,
            role: 'ai',
            content: "Question 4a (10 marks) asks you to evaluate a system state using the Banker's Algorithm to determine if it is safe, and if so, to provide the safe sequence. The algorithm prevents deadlock by simulating the allocation of predetermined maximum possible amounts of all resources.",
            source: "Page 3, Q4a"
        }
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message (dummy logic for UI demonstration)
        setMessages([...messages, { id: Date.now(), role: 'user', content: inputValue }]);
        setInputValue('');
    };

    return (
        <div className="absolute inset-0 flex flex-col bg-zinc-950/50">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user'
                            ? 'bg-zinc-50 text-zinc-950 border-zinc-200 font-bold text-sm'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                            }`}>
                            {msg.role === 'user' ? 'PK' : <Bot className="w-4 h-4" />}
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex flex-col pt-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-zinc-800 text-zinc-50 py-2 px-4 rounded-2xl rounded-tr-sm shadow-sm'
                                : 'text-zinc-300 space-y-3'
                                }`}>
                                <p>{msg.content}</p>

                                {/* Citation Badge (AI Only) */}
                                {msg.source && (
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 mt-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                                        <FileText className="w-3 h-3" />
                                        {msg.source}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Input Bar (Fixed Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800">
                <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about the syllabus, specific questions, or request a quiz..."
                        className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg py-3 pl-4 pr-12 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-500 transition-all shadow-sm"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="absolute right-2 p-2 bg-zinc-50 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 rounded-md transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}