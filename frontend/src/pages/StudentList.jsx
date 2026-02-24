import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, Search, Trash2, X, AlertTriangle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [newName, setNewName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/assembly/students');
            setStudents(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Erro ao carregar membros');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assembly/students', { name: newName });
            toast.success('Membro matriculado!');
            setNewName('');
            setModalOpen(false);
            fetchStudents();
        } catch (err) {
            toast.error('Erro ao matricular membro');
        }
    };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        try {
            await api.delete(`/assembly/students/${studentToDelete._id}`);
            toast.success('Membro removido');
            setDeleteModalOpen(false);
            setStudentToDelete(null);
            fetchStudents();
        } catch (err) {
            toast.error('Erro ao remover membro');
        }
    };

    const openDeleteModal = (student) => {
        setStudentToDelete(student);
        setDeleteModalOpen(true);
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#f5f5dc] tracking-tighter">Membros Matriculados</h1>
                    <p className="text-[#d1d1d1] font-medium tracking-wide">Gerenciamento de membros da assembleia</p>
                </div>

                <button
                    onClick={() => setModalOpen(true)}
                    className="w-full md:w-auto bg-[#f5f5dc] hover:bg-[#e8e8c1] text-[#4a0404] px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 text-lg"
                >
                    <UserPlus size={24} strokeWidth={3} />
                    Novo Membro
                </button>
            </div>

            <div className="bg-[#5a0505] rounded-[2.5rem] shadow-2xl border border-[#6b0a0a] overflow-hidden">
                <div className="p-8 border-b border-[#6b0a0a] flex items-center gap-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#f5f5dc]/40" size={24} />
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#4a0404] border border-[#6b0a0a] text-white focus:border-[#f5f5dc] focus:ring-4 focus:ring-[#f5f5dc]/5 transition-all outline-none font-medium placeholder-[#f5f5dc]/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/20">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-[#f5f5dc]/60 uppercase tracking-[0.2em]">Membro</th>
                                <th className="px-8 py-5 text-xs font-black text-[#f5f5dc]/60 uppercase tracking-[0.2em] hidden md:table-cell">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-[#f5f5dc]/60 uppercase tracking-[0.2em] hidden md:table-cell">Registrador</th>
                                <th className="px-8 py-5 text-xs font-black text-[#f5f5dc]/60 uppercase tracking-[0.2em] text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#6b0a0a]">
                            {filteredStudents.map((student) => (
                                <tr key={student._id} className="hover:bg-black/10 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#f5f5dc] flex items-center justify-center font-black text-[#4a0404] text-lg shadow-lg">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-white text-lg">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 hidden md:table-cell">
                                        <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-black uppercase tracking-widest">
                                            ATIVO
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-[#d1d1d1] font-bold hidden md:table-cell">{student.registeredBy || 'Sistema'}</td>
                                    <td className="px-8 py-5 text-right opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openDeleteModal(student)}
                                            className="text-rose-400/50 hover:text-rose-500 hover:bg-rose-500/10 p-3 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-[#d1d1d1] font-bold text-lg">
                                        Nenhum membro encontrado na base de dados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {/* Add Member Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#3a0303] w-full max-w-lg rounded-3xl md:rounded-[3rem] shadow-2xl p-6 md:p-10 border border-[#5a0505]"
                        >
                            <div className="flex items-center justify-between mb-6 md:mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-[#f5f5dc] tracking-tighter">Novo Membro</h2>
                                    <p className="text-[#d1d1d1] text-xs font-bold uppercase tracking-widest mt-1">Cadastro Ministerial</p>
                                </div>
                                <button onClick={() => setModalOpen(false)} className="text-[#f5f5dc]/40 hover:text-[#f5f5dc] p-2 bg-[#4a0404] rounded-full transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-8">
                                <div>
                                    <label className="block text-sm font-black text-[#f5f5dc]/80 mb-3 ml-1 uppercase tracking-widest">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        autoFocus
                                        className="w-full px-6 py-4 rounded-2xl bg-[#4a0404] border border-[#6b0a0a] text-white focus:border-[#f5f5dc] focus:ring-4 focus:ring-[#f5f5dc]/5 transition-all outline-none font-bold text-lg placeholder-[#f5f5dc]/10"
                                        placeholder="Digite o nome..."
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row-reverse gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="w-full md:flex-1 px-8 py-4 rounded-2xl font-black bg-[#f5f5dc] text-[#4a0404] hover:bg-[#e8e8c1] shadow-xl shadow-black/40 transition-all active:scale-95"
                                    >
                                        SALVAR REGISTRO
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="w-full md:flex-1 px-8 py-4 rounded-2xl font-black bg-transparent border-2 border-[#5a0505] text-[#d1d1d1] hover:bg-[#5a0505] transition-all active:scale-95"
                                    >
                                        CANCELAR
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#3a0303] w-full max-w-md rounded-3xl md:rounded-[3rem] shadow-2xl p-6 md:p-10 border border-rose-500/20 text-center"
                        >
                            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                                <AlertTriangle size={40} strokeWidth={2.5} />
                            </div>

                            <h2 className="text-2xl font-black text-white tracking-tighter mb-2">Excluir Membro?</h2>
                            <p className="text-[#d1d1d1] font-medium leading-relaxed mb-8">
                                Você está prestes a remover <span className="text-white font-black">"{studentToDelete?.name}"</span>. Esta ação não poderá ser desfeita.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmDelete}
                                    className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-500 transition-all shadow-xl shadow-rose-900/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={20} strokeWidth={3} />
                                    SIM, EXCLUIR MEMBRO
                                </button>
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="w-full py-4 bg-transparent border-2 border-[#5a0505] text-[#d1d1d1] rounded-2xl font-black hover:bg-[#5a0505] transition-all active:scale-95"
                                >
                                    CANCELAR
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentList;
