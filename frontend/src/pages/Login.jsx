import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Users, Settings, Save, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBaseURL, saveBackendURL } from '../api/discovery';
import { reconnectSocket } from '../lib/socket';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tempUrl, setTempUrl] = useState(getBaseURL());
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSaveSettings = () => {
        saveBackendURL(tempUrl);
        // Aplica a mudança imediatamente no Axios e no Socket
        import('../api/index').then(m => {
            m.default.defaults.baseURL = tempUrl;
        });
        reconnectSocket(tempUrl);
        toast.success('Configurações aplicadas!');
        setIsSettingsOpen(false);
    };

    const handleResetSettings = () => {
        localStorage.removeItem('VITE_API_URL');
        const defaultUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
        setTempUrl(defaultUrl);
        toast.success('Restaurado para o padrão');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Bem-vindo de volta!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Erro ao fazer login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#4a0404] p-6 relative overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#f5f5dc]/5 rounded-full blur-[120px] -ml-48 -mt-48" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/20 rounded-full blur-[100px] -mr-48 -mb-48" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-[#3a0303] rounded-[2.5rem] shadow-2xl p-10 relative z-10 border border-[#5a0505]"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#f5f5dc] rounded-2xl flex items-center justify-center text-[#4a0404] mx-auto mb-6 shadow-xl">
                        <Users size={32} strokeWidth={3} />
                    </div>
                    <h2 className="text-4xl font-black text-[#f5f5dc] mb-2 tracking-tighter">Login</h2>
                    <p className="text-[#d1d1d1] font-medium uppercase text-xs tracking-[0.2em]">IBRC</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#f5f5dc]/80 mb-2 ml-1">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f5f5dc]/40" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#4a0404] border border-[#6b0a0a] text-white placeholder-white/20 focus:border-[#f5f5dc] focus:ring-4 focus:ring-[#f5f5dc]/5 transition-all outline-none font-medium"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#f5f5dc]/80 mb-2 ml-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f5f5dc]/40" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#4a0404] border border-[#6b0a0a] text-white placeholder-white/20 focus:border-[#f5f5dc] focus:ring-4 focus:ring-[#f5f5dc]/5 transition-all outline-none font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#f5f5dc] hover:bg-[#e8e8c1] text-[#4a0404] font-black py-4 rounded-2xl shadow-xl shadow-black/30 transition-all active:scale-[0.97] flex items-center justify-center gap-3 group text-lg"
                    >
                        Entrar
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="mt-10 text-center text-[#d1d1d1] font-medium">
                    Ainda não tem acesso?{' '}
                    <Link to="/register" className="text-[#f5f5dc] font-black hover:text-white transition-colors underline decoration-[#f5f5dc]/30 underline-offset-4">
                        Cadastre-se
                    </Link>
                </p>

                {/* Settings Toggle */}
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="absolute top-6 right-6 p-3 text-[#f5f5dc]/20 hover:text-[#f5f5dc] hover:bg-white/5 rounded-full transition-all"
                >
                    <Settings size={20} />
                </button>
            </motion.div>

            {/* Settings Modal */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#3a0303] w-full max-w-sm rounded-[2.5rem] p-8 border border-[#5a0505] shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-[#f5f5dc] tracking-tight">Conectividade</h3>
                                <button onClick={() => setIsSettingsOpen(false)} className="text-[#f5f5dc]/20 hover:text-white"><X size={20}/></button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-[#f5f5dc]/40 uppercase tracking-widest mb-2">URL do Backend</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-[#4a0404] border border-[#6b0a0a] text-white text-sm outline-none focus:border-[#f5f5dc]/40"
                                        value={tempUrl}
                                        onChange={(e) => setTempUrl(e.target.value)}
                                        placeholder="http://seu-backend.localtunnel.me"
                                    />
                                    <p className="mt-2 text-[10px] text-[#f5f5dc]/30 leading-relaxed font-medium">
                                        Se o seu link do LocalTunnel mudar, cole o novo link aqui e o login voltará a funcionar instantaneamente.
                                    </p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={handleSaveSettings}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                                    >
                                        <Save size={16} /> SALVAR
                                    </button>
                                    <button 
                                        onClick={handleResetSettings}
                                        className="p-3 bg-[#4a0404] text-[#f5f5dc]/40 hover:text-[#f5f5dc] rounded-xl transition-all"
                                        title="Restaurar padrão"
                                    >
                                        <RefreshCw size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
