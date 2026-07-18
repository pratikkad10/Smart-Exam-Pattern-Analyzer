import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, FileText, User, UploadCloud, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useParams, useNavigate } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { useDocuments } from '../hooks/useDocuments';

export default function ChatInterface() {
    const { user } = useAuth();
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { documents, uploadDocument, loading: docsLoading } = useDocuments();
    const fileInputRef = useRef(null);
    
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            try {
                let currentConvId = conversationId;
                
                // If there's no conversation yet, create one so the PDF is strictly scoped!
                if (!currentConvId) {
                    const data = await chatService.createConversation();
                    currentConvId = data.conversation.id;
                    navigate(`/chat/${currentConvId}`, { replace: true });
                }

                await uploadDocument(file, currentConvId); 
                
                // Optionally add a success message to the chat
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    role: 'ai',
                    content: `I've successfully processed "${file.name}". You can now ask me questions about it!`,
                    parsedResults: []
                }]);
            } catch (error) {
                console.error("Upload failed:", error);
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    role: 'ai',
                    content: `Sorry, there was an error processing "${file.name}". Please try again.`,
                    parsedResults: []
                }]);
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    // Fetch conversation history if conversationId exists
    useEffect(() => {
        const fetchHistory = async () => {
            if (!conversationId) {
                setMessages([{
                    id: 'init',
                    role: 'ai',
                    content: "Hi! I'm your AI Study Assistant. Please attach a PDF to this chat, and ask me anything about it!"
                }]);
                return;
            }

            try {
                const data = await chatService.getConversationHistory(conversationId);
                if (data.conversation && data.conversation.messages) {
                    const loadedMessages = data.conversation.messages.map(msg => {
                        let content = msg.content;
                        let parsedResults = null;
                        
                        // If AI message, try to parse JSON
                        if (msg.role === 'assistant') {
                            try {
                                const parsed = JSON.parse(msg.content);
                                content = parsed.summary || msg.content;
                                parsedResults = parsed.results || [];
                            } catch(e) {
                                // fallback to raw
                            }
                        }

                        return {
                            id: msg.id,
                            role: msg.role === 'user' ? 'user' : 'ai',
                            content: content,
                            parsedResults: parsedResults
                        };
                    });
                    setMessages(loadedMessages);
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        };
        fetchHistory();
    }, [conversationId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMsg = inputValue;
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMsg }]);
        setInputValue('');
        setIsTyping(true);

        try {
            const data = await chatService.askQuestion(userMsg, null, conversationId);
            
            // If this was a new conversation, update URL without reloading
            if (!conversationId && data.conversationId) {
                navigate(`/chat/${data.conversationId}`, { replace: true });
            }

            let displayContent = data.summary || "Sorry, I couldn't generate an answer.";
            let parsedResults = data.results || [];

            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'ai',
                content: displayContent,
                parsedResults: parsedResults
            }]);

        } catch (error) {
            console.error("Error asking question:", error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'ai',
                content: "I encountered an error while processing your request. Please try again."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900 relative">
            {/* Chat History Area */}
            <div className="flex-1 overflow-y-auto scroll-smooth pb-32 pt-10 px-4 md:px-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Conversation Knowledge Base Header */}
                    <div className="mb-10 border-b border-zinc-800 pb-8">
                        <h1 className="text-3xl font-bold text-zinc-100 mb-6">Study Assistant</h1>
                        <div className="flex flex-col gap-4">
                            <span className="text-sm text-zinc-400">Context: {conversationId ? "Active Session Papers" : "No active session"}</span>
                            
                            <div className="flex flex-wrap items-center gap-3">
                                {docsLoading ? (
                                    <div className="text-sm text-zinc-500 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Loading papers...
                                    </div>
                                ) : documents.filter(d => d.conversationId === conversationId).length > 0 ? (
                                    documents.filter(d => d.conversationId === conversationId).map((doc, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/50 rounded-lg px-3 py-2 shadow-sm">
                                            <FileText className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-medium text-zinc-200">{doc.title || `Paper ${idx + 1}`}</span>
                                        </div>
                                    ))
                                ) : null}

                                {/* Upload more PDFs button */}
                                <div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        accept="application/pdf" 
                                        className="hidden" 
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="flex items-center gap-2 bg-zinc-900 border border-dashed border-zinc-600 rounded-lg px-3 py-2 shadow-sm hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isUploading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <UploadCloud className="w-4 h-4" />
                                        )}
                                        <span className="text-sm font-medium">
                                            {isUploading ? "Uploading & Analyzing..." : "+ Attach PDF"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                            {/* AI Message Layout */}
                            {msg.role === 'ai' && (
                                <div className="flex gap-4 max-w-[90%] sm:max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div className="flex flex-col space-y-3 pt-1.5 w-full">
                                        <div className="text-[15px] leading-relaxed text-zinc-200 whitespace-pre-wrap">
                                            {msg.content}
                                        </div>
                                        
                                        {/* Display structured parsed results if available */}
                                        {msg.parsedResults && msg.parsedResults.length > 0 && (
                                            <div className="grid gap-3 mt-4">
                                                {msg.parsedResults.map((res, idx) => (
                                                    <div key={idx} className="bg-zinc-800/80 border border-zinc-700 p-3 rounded-lg text-sm text-zinc-300">
                                                        <p className="font-medium text-zinc-200 mb-1">{res.question || "Found Question"}</p>
                                                        <div className="flex gap-2 text-xs text-zinc-500">
                                                            {res.marks && <span>{res.marks} Marks</span>}
                                                            {res.unit && <span>Unit {res.unit}</span>}
                                                        </div>
                                                    </div>
                                                ))}
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
                    
                    {isTyping && (
                        <div className="flex w-full justify-start">
                             <div className="flex gap-4 max-w-[90%] sm:max-w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 mt-1">
                                    <Bot className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="flex items-center space-x-1 pt-3">
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                </div>
                             </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Floating Input Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-zinc-900 via-zinc-900/90 to-transparent pt-10 pb-6 px-4 md:px-0 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <form
                        onSubmit={handleSend}
                        className="relative flex items-end bg-zinc-800 border border-zinc-700/60 rounded-2xl shadow-xl overflow-hidden focus-within:ring-1 focus-within:ring-zinc-500 focus-within:border-zinc-500 transition-all"
                    >
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message StudyAssistant..."
                            className="w-full max-h-48 min-h-[52px] bg-transparent resize-none py-3.5 pl-4 pr-12 text-[15px] text-zinc-100 placeholder-zinc-400 focus:outline-none"
                            rows={1}
                            style={{ scrollbarWidth: 'none' }} 
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-2 bottom-2 p-1.5 bg-zinc-100 hover:bg-zinc-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 rounded-lg transition-colors flex items-center justify-center h-8 w-8"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-zinc-500 mt-3 font-medium">
                        StudyAssistant uses advanced RAG to answer from your uploaded papers.
                    </p>
                </div>
            </div>
        </div>
    );
}