import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Menu, X, Settings, LogOut, Share, Download } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDocuments } from '../hooks/useDocuments';

export default function AppLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { documents, activeDocument, setActiveDocument, uploadDocument, loading: docsLoading } = useDocuments();
    const fileInputRef = useRef(null);

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
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex font-sans selection:bg-zinc-800">

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar Navigation & File Management */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col h-screen p-4
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

                {/* App Logo */}
                <div className="flex items-center gap-2 mb-8 px-2 mt-2 md:mt-0">
                    <div className="w-8 h-8 rounded bg-zinc-50 text-zinc-950 flex items-center justify-center font-bold">AI</div>
                    <h1 className="text-lg font-semibold tracking-tight text-zinc-100">StudyAssistant</h1>
                </div>

                {/* Upload Dropzone */}
                <div 
                    onClick={() => !docsLoading && fileInputRef.current?.click()}
                    className={`border border-dashed border-zinc-700 rounded-lg p-5 mb-6 text-center hover:bg-zinc-900/80 transition-colors cursor-pointer group bg-zinc-900/30 ${
                        docsLoading ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".pdf" 
                        className="hidden" 
                    />
                    <div className="text-zinc-500 mb-2 group-hover:text-zinc-300 flex justify-center transition-colors">
                        {docsLoading ? (
                            <div className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin"></div>
                        ) : (
                            <Upload className="w-5 h-5" />
                        )}
                    </div>
                    <p className="text-xs font-medium text-zinc-300">
                        {docsLoading ? "Uploading PDF..." : "Upload PDF Paper"}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">Max 10MB</p>
                </div>

                {/* Document List */}
                <div className="flex-1 overflow-y-auto">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">Library</h3>
                    <ul className="space-y-1">
                        {documents.map((doc) => {
                            const isActive = activeDocument?.id === doc.id;
                            return (
                                <li key={doc.id}>
                                    <button 
                                        onClick={() => setActiveDocument(doc)}
                                        className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-colors flex items-center justify-between group border ${
                                            isActive 
                                                ? 'bg-zinc-800/80 border-zinc-700/50 text-zinc-50 shadow-sm' 
                                                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                                            <span className="truncate font-medium">{doc.filename}</span>
                                        </div>
                                        {isActive ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500/80 shrink-0" />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-zinc-700 shrink-0 mr-1 group-hover:bg-zinc-600 transition-colors"></div>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                        {documents.length === 0 && (
                            <p className="text-xs text-zinc-600 px-2 italic mt-4">No documents uploaded yet.</p>
                        )}
                    </ul>
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
                        <NavLink to="/chat" className={({isActive}) => `text-sm font-medium h-full px-1 flex items-center transition-colors border-b-2 ${isActive ? 'text-zinc-100 border-zinc-50' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}>
                            Chat Interface
                        </NavLink>
                        <NavLink to="/dashboard" className={({isActive}) => `text-sm font-medium h-full px-1 flex items-center transition-colors border-b-2 ${isActive ? 'text-zinc-100 border-zinc-50' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}>
                            Analytics
                        </NavLink>
                        <NavLink to="/quiz" className={({isActive}) => `text-sm font-medium h-full px-1 flex items-center transition-colors border-b-2 ${isActive ? 'text-zinc-100 border-zinc-50' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}>
                            Practice Quiz
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
                <div className="flex-1 overflow-y-auto relative">
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
        </div>
    );
}