import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Menu, X, Settings, LogOut, Share, Download, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDocuments } from '../hooks/useDocuments';
import { chatService } from '../services/chatService';

export default function AppLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { documents, activeDocument, setActiveDocument, uploadDocument, loading: docsLoading } = useDocuments();
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { conversationId } = useParams();

    const [conversations, setConversations] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, convId: null });
    const [sidebarWidth, setSidebarWidth] = useState(288);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            let newWidth = e.clientX;
            if (newWidth < 200) newWidth = 200; // Min width
            if (newWidth > 600) newWidth = 600; // Max width
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const startResizing = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await chatService.getConversations();
                if (data.conversations) {
                    setConversations(data.conversations);
                }
            } catch (err) {
                console.error("Failed to load conversations in sidebar", err);
            }
        };
        fetchConversations();
    }, []);

    const handleDeleteConversation = (e, convId) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteModal({ isOpen: true, convId });
    };

    const confirmDelete = async () => {
        const { convId } = deleteModal;
        if (!convId) return;

        try {
            await chatService.deleteConversation(convId);
            setConversations(prev => prev.filter(c => c.id !== convId));

            // If we are currently on this conversation, navigate away
            if (window.location.pathname === `/chat/${convId}`) {
                navigate('/chat');
            }
        } catch (error) {
            console.error("Failed to delete conversation", error);
        } finally {
            setDeleteModal({ isOpen: false, convId: null });
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await uploadDocument(file);
            } catch (error) {
                console.error("Upload failed:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-zinc-50 flex font-sans selection:bg-zinc-800 overflow-x-hidden">

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar Navigation & File Management */}
            <aside
                className={`
                    fixed md:static inset-y-0 left-0 z-40
                    border-r border-zinc-800 bg-zinc-950 flex flex-col h-screen p-4
                    transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
                style={{ width: isMobileMenuOpen ? '288px' : `${sidebarWidth}px`, flexShrink: 0 }}
            >
                {/* Drag Handle for Resizing */}
                <div
                    className="hidden md:block absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-emerald-500/50 z-50 transition-colors"
                    onMouseDown={startResizing}
                />

                {/* App Logo */}
                <div className="flex items-center gap-2 mb-6 px-2 mt-2 md:mt-0">
                    <div className="w-8 h-8 rounded bg-zinc-50 text-zinc-950 flex items-center justify-center font-bold">AI</div>
                    <h1 className="text-lg font-semibold tracking-tight text-zinc-100">StudyAssistant</h1>
                </div>

                {/* New Chat Button */}
                <button
                    onClick={() => navigate('/chat')}
                    className="w-full flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mb-6 shadow-sm border border-zinc-700/50">
                    <Plus className="w-4 h-4" />
                    New Conversation
                </button>

                {/* Scrollable Middle Section */}
                <div className="flex-1 overflow-y-auto space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full pr-2">

                    {/* Conversations List (Dynamic) */}
                    <div>
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">Recent Chats</h3>
                        <ul className="space-y-1">
                            {conversations.length === 0 ? (
                                <li className="px-2 text-xs text-zinc-500">No recent chats</li>
                            ) : (
                                conversations.map(conv => (
                                    <li key={conv.id} className="group flex items-center relative">
                                        <NavLink
                                            to={`/chat/${conv.id}`}
                                            className={({ isActive }) => `flex-1 text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2 pr-10 ${isActive ? 'text-zinc-200 bg-zinc-800/80 border border-zinc-700/50' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'}`}
                                        >
                                            <MessageSquare className={`w-4 h-4 shrink-0`} />
                                            <span className="truncate">{conv.title || "Study Session"}</span>
                                        </NavLink>
                                        <button
                                            onClick={(e) => handleDeleteConversation(e, conv.id)}
                                            className="absolute right-2 p-1.5 rounded text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete Chat"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                {/* User Settings */}
                <div className="pt-4 border-t border-zinc-800 mt-auto">
                    {user && (
                        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-md hover:bg-zinc-900/50">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-semibold text-xs text-zinc-200 uppercase shrink-0">
                                {user.firstName?.[0] || ""}{user.lastName?.[0] || ""}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-zinc-200 truncate">{user.firstName} {user.lastName}</p>
                                <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <Link to="/settings" className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-red-400 transition-colors mt-1 cursor-pointer">
                        <LogOut className="w-4 h-4" /> Log out
                    </button>
                </div>
            </aside>

            {/* Main Workspace */}
            <main className="flex-1 flex flex-col h-screen bg-zinc-950/50 relative overflow-hidden w-full">

                {/* Dynamic Header */}
                <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 shrink-0 w-full">
                    {/* View Tabs */}
                    <nav className="flex items-center gap-6 h-full pt-1">
                        <NavLink 
                            to={`/chat${conversationId ? `/${conversationId}` : ''}`} 
                            end 
                            className={({ isActive }) => `text-sm font-medium h-full px-1 flex items-center transition-colors border-b-2 ${isActive ? 'text-zinc-100 border-zinc-50' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
                        >
                            Chat Interface
                        </NavLink>
                        <NavLink 
                            to={`/chat${conversationId ? `/${conversationId}` : ''}/questions`} 
                            className={({ isActive }) => `text-sm font-medium h-full px-1 flex items-center transition-colors border-b-2 ${isActive ? 'text-zinc-100 border-zinc-50' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
                        >
                            Question Bank
                        </NavLink>
                    </nav>

                    {/* Actions Group */}
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors">
                            <Share className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-2 text-xs font-medium bg-zinc-50 text-zinc-950 hover:bg-zinc-200 px-3 py-1.5 rounded-md transition-colors shadow-sm">
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </button>
                    </div>
                </header>

                {/* Dynamic Content Area (Chat, Analytics, or Quiz will render here) */}
                <div className="flex-1 overflow-y-auto relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {children}
                </div>

            </main>

            {/* Mobile Overlay Background */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteModal({ isOpen: false, convId: null })}>
                    <div
                        className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-sm w-full p-6 shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-zinc-100 mb-2 flex items-center gap-2">
                            <Trash2 className="w-5 h-5 text-red-400" /> Delete Conversation
                        </h3>
                        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                            Are you sure you want to delete this conversation? This action cannot be undone and will permanently remove all associated messages.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, convId: null })}
                                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}