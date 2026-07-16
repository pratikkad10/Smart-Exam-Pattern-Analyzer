import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, FileText, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function ChatInterface() {
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
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
            content: "Question 4a (10 marks) asks you to evaluate a system state using the Banker's Algorithm to determine if it is safe, and if so, to provide the safe sequence.\n\nThe algorithm prevents deadlock by simulating the allocation of predetermined maximum possible amounts of all resources, and then makes an \"s-state\" check to test for possible deadlock conditions for all other pending activities, before deciding whether allocation should be allowed to continue.",
            source: "Page 3, Q4a"
        }
    ]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setMessages([...messages, { id: Date.now(), role: 'user', content: inputValue }]);
        setInputValue('');

        // Simulate AI typing response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'ai',
                content: "That's a great question. Let me check the document and generate an explanation for you based on the syllabus."
            }]);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 relative">

            {/* Chat History Area */}
            <div className="flex-1 overflow-y-auto scroll-smooth pb-32 pt-6 px-4 md:px-0">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                            {/* AI Message Layout */}
                            {msg.role === 'ai' && (
                                <div className="flex gap-4 max-w-[85%] sm:max-w-[75%]">
                                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="w-4 h-4 text-zinc-300" />
                                    </div>
                                    <div className="flex flex-col space-y-3 pt-1.5">
                                        <div className="text-[15px] leading-relaxed text-zinc-200 whitespace-pre-wrap">
                                            {msg.content}
                                        </div>
                                        {msg.source && (
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 mt-1 rounded-md bg-zinc-900 border border-zinc-800/50 text-xs text-zinc-400 font-medium self-start hover:bg-zinc-800 transition-colors cursor-pointer">
                                                <FileText className="w-3 h-3" />
                                                {msg.source}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* User Message Layout */}
                            {msg.role === 'user' && (
                                <div className="bg-zinc-800 text-zinc-100 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] sm:max-w-[75%] text-[15px] leading-relaxed shadow-sm">
                                    {msg.content}
                                </div>
                            )}

                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Floating Input Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-zinc-950 via-zinc-950/90 to-transparent pt-10 pb-6 px-4 md:px-0 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <form
                        onSubmit={handleSend}
                        className="relative flex items-end bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-xl overflow-hidden focus-within:ring-1 focus-within:ring-zinc-500 focus-within:border-zinc-500 transition-all"
                    >
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message StudyAssistant..."
                            className="w-full max-h-48 min-h-[52px] bg-transparent resize-none py-3.5 pl-4 pr-12 text-[15px] text-zinc-100 placeholder-zinc-400 focus:outline-none"
                            rows={1}
                            style={{ scrollbarWidth: 'none' }} // Hide scrollbar for cleaner look
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="absolute right-2 bottom-2 p-1.5 bg-zinc-100 hover:bg-zinc-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 rounded-lg transition-colors flex items-center justify-center h-8 w-8"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-zinc-500 mt-3 font-medium">
                        StudyAssistant can make mistakes. Verify important information with your professor.
                    </p>
                </div>
            </div>
        </div>
    );
}