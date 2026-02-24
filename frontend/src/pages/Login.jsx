import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

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
                        <Users size={32} weight="bold" />
                    </div>
                    <h2 className="text-4xl font-black text-[#f5f5dc] mb-2 tracking-tighter">Login Admin</h2>
                    <p className="text-[#d1d1d1] font-medium uppercase text-xs tracking-[0.2em]">Painel Assembleia</p>
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
                        ACESSAR SISTEMA
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="mt-10 text-center text-[#d1d1d1] font-medium">
                    Ainda não tem acesso?{' '}
                    <Link to="/register" className="text-[#f5f5dc] font-black hover:text-white transition-colors underline decoration-[#f5f5dc]/30 underline-offset-4">
                        Cadastre-se
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
