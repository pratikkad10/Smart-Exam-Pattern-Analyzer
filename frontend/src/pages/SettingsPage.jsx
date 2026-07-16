import React, { useState, useEffect } from 'react';
import { User, Shield, AlertTriangle, Loader2, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('general'); // 'general' or 'security'
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Populate fields when user loads
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setPhone(user.phone || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.updateProfile({ firstName, lastName, phone });
            if (email !== user.email) {
                await authService.updateEmail({ email });
                toast.success('Profile Updated', 'A verification email has been sent to your new address.');
            } else {
                toast.success('Profile Updated', 'Your profile details have been saved successfully.');
            }
            // You might want to trigger a re-fetch of the user profile here in the future
        } catch (error) {
            console.error(error);
            toast.error('Update Failed', error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error('Validation Error', 'New passwords do not match!');
            return;
        }
        setIsLoading(true);
        try {
            await authService.updatePassword({ oldPassword, newPassword, confirmNewPassword });
            toast.success('Security Updated', 'Password updated successfully.');
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error(error);
            toast.error('Update Failed', error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you absolutely sure? This action cannot be undone.")) {
            try {
                await authService.deleteAccount();
                toast.success('Account Deleted', 'Your account has been permanently removed.');
                logout();
            } catch (error) {
                console.error(error);
                toast.error('Deletion Failed', error.response?.data?.message || 'Failed to delete account');
            }
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto w-full space-y-8">

            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Settings</h1>
                <p className="text-sm text-zinc-400 mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Tabs */}
                <aside className="w-full md:w-48 shrink-0">
                    <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === 'general' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
                        >
                            <User className="w-4 h-4" /> General
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === 'security' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
                        >
                            <Shield className="w-4 h-4" /> Security
                        </button>
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1 space-y-6">

                    {/* GENERAL TAB */}
                    {activeTab === 'general' && (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-zinc-100 mb-4">Profile Information</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                    />
                                    <p className="text-xs text-zinc-500">Note: Changing your email will require re-verification.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-zinc-50 text-zinc-950 px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors mt-4"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">

                            {/* Update Password */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-medium text-zinc-100 mb-4">Change Password</h3>
                                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-zinc-800 text-zinc-100 border border-zinc-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-700 transition-colors mt-4"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                                    </button>
                                </form>
                            </div>

                            {/* Danger Zone (Delete Account) */}
                            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-medium text-red-500 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                                </h3>
                                <p className="text-sm text-zinc-400 mb-4">
                                    Permanently delete your account and all of your uploaded PDFs, extracted questions, and generated quizzes. This action cannot be reversed.
                                </p>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-500/20 transition-colors"
                                >
                                    Delete Account
                                </button>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}