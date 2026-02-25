import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    History,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink = ({ item, isActive, onClick }) => (
    <Link
        to={item.path}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive
            ? 'bg-[#f5f5dc] text-[#4a0404] shadow-lg shadow-black/20'
            : 'text-[#d1d1d1] hover:bg-[#4a0404] hover:text-white'
            }`}
    >
        <item.icon size={20} />
        {item.name}
    </Link>
);

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Membros', icon: Users, path: '/students' },
        { name: 'Fazer Chamada', icon: ClipboardCheck, path: '/call' },
        { name: 'Histórico', icon: History, path: '/history' },
    ];

    const sidebarContent = (
        <>
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#f5f5dc] rounded-xl flex items-center justify-center text-[#4a0404]">
                        <Users size={24} strokeWidth={3} />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-[#f5f5dc]">IBRC</span>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <SidebarLink
                            key={item.path}
                            item={item}
                            isActive={location.pathname === item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-[#5a0505] bg-[#3a0303]">
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 mb-6 hover:bg-[#4a0404] p-2 rounded-xl transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#f5f5dc] overflow-hidden flex items-center justify-center text-[#4a0404] font-bold">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0)
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold truncate w-32 text-white">{user?.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#d1d1d1] font-bold">ADMINISTRADOR</p>
                    </div>
                </Link>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full p-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-bold"
                >
                    <LogOut size={20} />
                    Sair do Sistema
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-[#4a0404] text-white overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-[#3a0303] border-r border-[#5a0505] hidden md:flex flex-col fixed h-full z-40">
                {sidebarContent}
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full h-16 bg-[#3a0303] border-b border-[#5a0505] px-6 flex items-center justify-between z-50">
                <span className="text-lg font-black tracking-tighter text-[#f5f5dc]">IBRC</span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-[#f5f5dc] hover:bg-[#4a0404] rounded-lg transition-all"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-[#3a0303] z-[70] flex flex-col md:hidden"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-4 md:p-10 pt-20 md:pt-10 transition-all">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default Layout;
