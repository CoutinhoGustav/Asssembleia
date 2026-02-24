import React, { useState, useEffect } from 'react';
import api from '../api';
import { Check, X, Send, Search, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3002');

const AttendanceCall = () => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' }
    const [isCallActive, setIsCallActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();

        socket.on('system_status_change', (data) => {
            setIsCallActive(data.isActive);
        });

        return () => {
            socket.off('system_status_change');
        };
    }, []);

    const fetchData = async () => {
        try {
            const [studentsRes, statusRes] = await Promise.all([
                api.get('/assembly/students'),
                api.get('/assembly/status')
            ]);
            setStudents(studentsRes.data);
            setIsCallActive(statusRes.data.isCallActive);

            const initial = {};
            studentsRes.data.forEach(s => initial[s._id] = 'absent');
            setAttendance(initial);

            setLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error(err.response?.data?.message || 'Erro ao carregar dados');
        }
    };

    const markAttendance = (id, status) => {
        if (!isCallActive) {
            toast.error('Sistema Inativo! Ligue no Dashboard.');
            return;
        }
        setAttendance(prev => ({ ...prev, [id]: status }));
    };

    const handleSave = async () => {
        if (!isCallActive) return;

        const records = students.map(s => ({
            studentName: s.name,
            status: attendance[s._id] || 'absent'
        }));

        try {
            await api.post('/assembly/attendance', { records });
            toast.success('Chamada registrada!');
            socket.emit('mark_attendance', { timestamp: new Date() });
        } catch (err) {
            toast.error('Erro ao salvar chamada');
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-[#f5f5dc]/20 border-t-[#f5f5dc] rounded-full animate-spin" />
            <p className="text-[#f5f5dc] font-bold tracking-widest uppercase text-sm">Carregando Membros...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#f5f5dc] tracking-tighter">Realizar Chamada</h1>
                    <p className="text-[#d1d1d1] font-medium tracking-wide">Controle ministerial de presença</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!isCallActive}
                    className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 text-lg ${isCallActive
                        ? 'bg-[#f5f5dc] text-[#4a0404] hover:bg-[#e8e8c1] shadow-black/40 cursor-pointer'
                        : 'bg-black/20 text-[#f5f5dc]/20 cursor-not-allowed border-2 border-[#f5f5dc]/5'
                        }`}
                >
                    <Send size={22} strokeWidth={3} />
                    FINALIZAR CHAMADA
                </button>
            </div>

            {!isCallActive && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-500/10 border-2 border-rose-500/20 p-5 rounded-2xl flex items-center gap-4 text-rose-400"
                >
                    <AlertTriangle size={24} className="flex-shrink-0" />
                    <div>
                        <p className="font-black text-xs uppercase tracking-[0.1em]">Atenção: Sistema de Banco de Dados Inativo</p>
                        <p className="text-sm font-medium opacity-80">Você precisa ativar o sistema no Dashboard para que as presenças sejam salvas permanentemente.</p>
                    </div>
                </motion.div>
            )}

            <div className="bg-[#5a0505] rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-[#6b0a0a] overflow-hidden">
                <div className="p-6 md:p-8 border-b border-[#6b0a0a]">
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#f5f5dc]/40" size={20} md:size={24} />
                        <input
                            type="text"
                            placeholder="Localizar membro..."
                            className="w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 rounded-2xl bg-[#4a0404] border-2 border-[#6b0a0a] text-white focus:border-[#f5f5dc] focus:ring-4 focus:ring-[#f5f5dc]/5 transition-all outline-none font-bold text-lg placeholder-[#f5f5dc]/10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="divide-y divide-[#6b0a0a] max-h-[600px] overflow-y-auto custom-scrollbar">
                    {filteredStudents.map((student) => (
                        <div key={student._id} className="p-5 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-black/10 transition-all group">
                            <div className="flex items-center gap-4 md:gap-5">
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-lg md:text-xl transition-all shadow-lg ${attendance[student._id] === 'present'
                                        ? 'bg-emerald-500 text-white shadow-emerald-900/40 rotate-3'
                                        : 'bg-[#4a0404] text-[#f5f5dc]/40 border border-[#6b0a0a]'
                                        }`}>
                                    {student.name.charAt(0)}
                                </motion.div>
                                <div>
                                    <h3 className="font-black text-white text-lg md:text-xl tracking-tight leading-tight">{student.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-2 h-2 rounded-full ${attendance[student._id] === 'present' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500/50'}`} />
                                        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#d1d1d1]">
                                            {attendance[student._id] === 'present' ? 'Presente' : 'Ausente'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                <button
                                    onClick={() => markAttendance(student._id, 'absent')}
                                    className={`flex-1 sm:w-12 h-12 rounded-xl flex items-center justify-center transition-all ${attendance[student._id] === 'absent'
                                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/40'
                                        : 'bg-[#4a0404] text-[#f5f5dc]/20 hover:bg-[#6b0a0a] border border-[#6b0a0a]'
                                        }`}
                                >
                                    <X size={24} strokeWidth={3} />
                                </button>
                                <button
                                    onClick={() => markAttendance(student._id, 'present')}
                                    className={`flex-1 sm:w-12 h-12 rounded-xl flex items-center justify-center transition-all ${attendance[student._id] === 'present'
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                                        : 'bg-[#4a0404] text-[#f5f5dc]/20 hover:bg-[#6b0a0a] border border-[#6b0a0a]'
                                        }`}
                                >
                                    <Check size={24} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredStudents.length === 0 && (
                        <div className="p-12 md:p-20 text-center text-[#d1d1d1] font-bold text-lg opacity-40">
                            Nenhum membro encontrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceCall;
