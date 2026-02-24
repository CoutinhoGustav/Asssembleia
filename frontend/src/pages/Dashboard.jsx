import React, { useState, useEffect } from 'react';
import api from '../api';
import { Power, Users, ClipboardCheck, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        presentToday: 0,
        absentToday: 0
    });
    const [isCallActive, setIsCallActive] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchSystemStatus();

        socket.on('attendance_update', () => {
            fetchStats();
        });

        socket.on('system_status_change', (data) => {
            setIsCallActive(data.isActive);
        });

        return () => {
            socket.off('attendance_update');
            socket.off('system_status_change');
        };
    }, []);

    const fetchStats = async () => {
        try {
            const [studentsRes, historyRes] = await Promise.all([
                api.get('/assembly/students'),
                api.get('/assembly/history')
            ]);

            const today = new Date().toISOString().split('T')[0];
            const todayRecords = historyRes.data.filter(r => r.date.split('T')[0] === today);

            setStats({
                totalStudents: studentsRes.data.length,
                presentToday: todayRecords.filter(r => r.status === 'present').length,
                absentToday: todayRecords.filter(r => r.status === 'absent').length
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSystemStatus = async () => {
        try {
            const res = await api.get('/assembly/status');
            setIsCallActive(res.data.isCallActive);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleCall = async () => {
        try {
            const res = await api.post('/assembly/status/toggle');
            setIsCallActive(res.data.isCallActive);
            socket.emit('toggle_system', { isActive: res.data.isCallActive });
            toast.success(res.data.isCallActive ? 'Sistema Ligado - Chamada Ativa' : 'Sistema Desligado');
        } catch (err) {
            toast.error('Erro ao alternar sistema');
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#5a0505] p-6 rounded-3xl shadow-xl border border-[#6b0a0a] flex items-center gap-5"
        >
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-[#f5f5dc]/70 text-sm font-bold uppercase tracking-widest">{title}</p>
                <h3 className="text-3xl font-black text-[#f5f5dc]">{value}</h3>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#f5f5dc] tracking-tighter">Dashboard de Presença</h1>
                    <p className="text-[#d1d1d1] font-medium">Monitoramento em tempo real</p>
                </div>

                <button
                    onClick={toggleCall}
                    className={`px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-2xl active:scale-95 border-2 ${isCallActive
                        ? 'bg-[#f5f5dc] text-[#4a0404] border-[#f5f5dc] shadow-black/40'
                        : 'bg-transparent text-[#f5f5dc] border-[#f5f5dc]/30 hover:bg-[#5a0505]'
                        }`}
                >
                    <Power size={22} strokeWidth={3} />
                    {isCallActive ? 'SISTEMA LIGADO' : 'SISTEMA DESLIGADO'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Membros"
                    value={stats.totalStudents}
                    icon={Users}
                    color="bg-indigo-600 shadow-lg shadow-indigo-900/20"
                />
                <StatCard
                    title="Presentes Hoje"
                    value={stats.presentToday}
                    icon={ClipboardCheck}
                    color="bg-emerald-600 shadow-lg shadow-emerald-900/20"
                />
                <StatCard
                    title="Ausentes Hoje"
                    value={stats.absentToday}
                    icon={AlertCircle}
                    color="bg-rose-600 shadow-lg shadow-rose-900/20"
                />
                <StatCard
                    title="Taxa de Presença"
                    value={stats.totalStudents ? `${Math.round((stats.presentToday / stats.totalStudents) * 100)}%` : '0%'}
                    icon={TrendingUp}
                    color="bg-amber-600 shadow-lg shadow-amber-900/20"
                />
            </div>

            <div className="bg-[#5a0505] p-10 rounded-3xl border border-[#6b0a0a] shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-black text-[#f5f5dc] mb-4 tracking-tight">Controle da Chamada</h2>
                        <p className="text-[#d1d1d1] text-lg leading-relaxed font-medium">
                            Ao ligar o sistema, você permite o registro automático de presença para hoje.
                            O status é propagado instantaneamente para todos os dispositivos conectados.
                        </p>
                    </div>
                    <div className={`px-8 py-6 rounded-2xl border-2 flex items-center gap-6 transition-all duration-500 scale-105 ${isCallActive ? 'border-[#f5f5dc] bg-[#f5f5dc]/10 text-[#f5f5dc]' : 'border-[#6b0a0a] bg-black/20 text-[#d1d1d1]'}`}>
                        <div className={`w-4 h-4 rounded-full ${isCallActive ? 'bg-[#f5f5dc] animate-ping' : 'bg-rose-500/50'}`} />
                        <span className="text-xl font-black tracking-widest uppercase">{isCallActive ? 'CHAMADA ATIVA' : 'SISTEMA INATIVO'}</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#f5f5dc]/5 -mr-32 -mt-32 rounded-full blur-[100px]" />
            </div>
        </div>
    );
};

export default Dashboard;
