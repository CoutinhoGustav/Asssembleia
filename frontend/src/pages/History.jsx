import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, User, Download, Trash2, Edit2, X, Check, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [tempStatus, setTempStatus] = useState('');

    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfDate, setPdfDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [previewRecords, setPreviewRecords] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, [selectedDate]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            let url = '/assembly/history';
            if (selectedDate) url += `?date=${selectedDate}`;
            const res = await api.get(url);
            setHistory(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Erro ao carregar histórico');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Excluir este registro?')) {
            try {
                await api.delete(`/assembly/attendance/${id}`);
                toast.success('Registro excluído');
                setHistory(history.filter(item => item._id !== id));
            } catch (err) {
                toast.error('Erro ao excluir');
            }
        }
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        setTempStatus(record.status);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/assembly/attendance/${editingRecord._id}`, { status: tempStatus });
            toast.success('Atualizado!');
            setHistory(history.map(item => item._id === editingRecord._id ? { ...item, status: tempStatus } : item));
            setIsEditModalOpen(false);
        } catch (err) {
            toast.error('Erro ao atualizar');
        }
    };

    useEffect(() => {
        if (isPdfModalOpen) {
            const filtered = history.filter(r => format(new Date(r.date), 'yyyy-MM-dd') === pdfDate);
            setPreviewRecords(filtered);
        }
    }, [pdfDate, isPdfModalOpen, history]);

    const generatePDF = () => {
        if (previewRecords.length === 0) return toast.error('Sem dados');
        const doc = jsPDF();
        const dateFormatted = format(new Date(pdfDate), "dd/MM/yyyy");
        doc.setFontSize(22);
        doc.setTextColor(74, 4, 4); // Wine
        doc.text('Relatório Ministerial de Presença', 14, 25);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Assembleia: ${dateFormatted}`, 14, 35);
        const present = previewRecords.filter(r => r.status === 'present').length;
        const absent = previewRecords.filter(r => r.status === 'absent').length;
        doc.text(`Presentes: ${present} | Ausentes: ${absent}`, 14, 42);
        const tableData = previewRecords.map(r => [r.studentName, r.status === 'present' ? 'P' : 'A', r.recordedBy, format(new Date(r.date), 'HH:mm')]);
        doc.autoTable({
            startY: 50,
            head: [['Membro', 'St', 'Registrador', 'Hora']],
            body: tableData,
            headStyles: { fillColor: [74, 4, 4] },
            alternateRowStyles: { fillColor: [245, 245, 220, 0.1] }
        });
        doc.save(`Relatorio_${pdfDate}.pdf`);
        setIsPdfModalOpen(false);
        toast.success('PDF Exportado!');
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#f5f5dc] tracking-tighter">Histórico Ministerial</h1>
                    <p className="text-[#d1d1d1] font-medium tracking-wide">Relatórios e arquivos de presença</p>
                </div>
                <button
                    onClick={() => setIsPdfModalOpen(true)}
                    className="w-full md:w-auto bg-[#f5f5dc] hover:bg-[#e8e8c1] text-[#4a0404] px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95"
                >
                    <Download size={22} strokeWidth={3} />
                    EXPORTAR PDF
                </button>
            </div>

            <div className="flex justify-center">
                <div className="bg-[#5a0505] p-8 rounded-[2.5rem] border border-[#6b0a0a] shadow-2xl w-full max-w-md">
                    <div className="space-y-4">
                        <label className="block text-center text-xs font-black text-[#f5f5dc]/60 uppercase tracking-widest">Filtrar Chamada Ministerial</label>
                        <div className="relative">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-[#f5f5dc]" size={24} />
                            <input
                                type="date"
                                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[#4a0404] border-2 border-[#6b0a0a] focus:border-[#f5f5dc] transition-all outline-none font-black text-xl text-[#f5f5dc]"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            {selectedDate && (
                                <button onClick={() => setSelectedDate('')} className="absolute right-12 top-1/2 -translate-y-1/2 text-[#f5f5dc]/40 hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#5a0505] rounded-[2.5rem] shadow-2xl border border-[#6b0a0a] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 font-black text-[#f5f5dc]/60 uppercase tracking-widest text-xs">
                            <tr>
                                <th className="px-8 py-5">Membro</th>
                                <th className="px-8 py-5 hidden md:table-cell">Data</th>
                                <th className="px-8 py-5 text-center hidden md:table-cell">Status</th>
                                <th className="px-8 py-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#6b0a0a]">
                            {history.map((record) => (
                                <tr key={record._id} className="hover:bg-black/10 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#f5f5dc] flex items-center justify-center font-black text-[#4a0404]">
                                                {record.studentName.charAt(0)}
                                            </div>
                                            <span className="font-bold text-white text-lg">{record.studentName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-[#d1d1d1] font-medium hidden md:table-cell">
                                        {format(new Date(record.date), "dd 'de' MMMM", { locale: ptBR })}
                                    </td>
                                    <td className="px-8 py-5 text-center hidden md:table-cell">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ${record.status === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/20 text-rose-400 border border-rose-500/20'}`}>
                                            {record.status === 'present' ? 'Presente' : 'Ausente'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(record)} className="p-3 text-[#f5f5dc]/40 hover:text-[#f5f5dc] hover:bg-[#4a0404] rounded-xl"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(record._id)} className="p-3 text-rose-400/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals remain similarly styled with deep burgundy background and beige accents */}
            <AnimatePresence>
                {(isEditModalOpen || isPdfModalOpen) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#3a0303] w-full max-w-lg rounded-3xl md:rounded-[3rem] shadow-2xl p-6 md:p-10 border border-[#5a0505]">
                            {isEditModalOpen ? (
                                <div className="space-y-6 md:space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-3xl font-black text-[#f5f5dc] tracking-tighter">Ajustar Presença</h2>
                                        <X onClick={() => setIsEditModalOpen(false)} className="text-[#f5f5dc]/40 cursor-pointer" size={24} />
                                    </div>
                                    <div className="bg-[#4a0404] p-6 rounded-2xl flex items-center gap-5 border border-[#6b0a0a]">
                                        <div className="w-14 h-14 bg-[#f5f5dc] rounded-2xl flex items-center justify-center font-black text-[#4a0404] text-xl">
                                            {editingRecord?.studentName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-white">{editingRecord?.studentName}</p>
                                            <p className="text-[#d1d1d1] font-medium">{editingRecord && format(new Date(editingRecord.date), "dd/MM/yyyy")}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button onClick={() => setTempStatus('present')} className={`py-6 rounded-2xl font-black border-2 transition-all ${tempStatus === 'present' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-[#6b0a0a] text-[#f5f5dc]/20'}`}>PRESENTE</button>
                                        <button onClick={() => setTempStatus('absent')} className={`py-6 rounded-2xl font-black border-2 transition-all ${tempStatus === 'absent' ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-[#6b0a0a] text-[#f5f5dc]/20'}`}>AUSENTE</button>
                                    </div>
                                    <button onClick={handleUpdate} className="w-full bg-[#f5f5dc] text-[#4a0404] py-5 rounded-2xl font-black text-lg shadow-xl shadow-black/40">SALVAR ALTERAÇÃO</button>
                                </div>
                            ) : (
                                <div className="space-y-6 md:space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-3xl font-black text-[#f5f5dc] tracking-tighter">Relatório PDF</h2>
                                        <X onClick={() => setIsPdfModalOpen(false)} className="text-[#f5f5dc]/40 cursor-pointer" size={24} />
                                    </div>
                                    <input type="date" className="w-full p-5 rounded-2xl bg-[#4a0404] border border-[#6b0a0a] text-[#f5f5dc] font-bold" value={pdfDate} onChange={(e) => setPdfDate(e.target.value)} />
                                    <div className="bg-black/20 rounded-2xl p-6 h-48 overflow-y-auto divide-y divide-[#6b0a0a]">
                                        {previewRecords.map(r => (
                                            <div key={r._id} className="py-3 flex justify-between">
                                                <span className="text-white font-bold">{r.studentName}</span>
                                                <span className={`font-black text-[10px] ${r.status === 'present' ? 'text-emerald-400' : 'text-rose-400'}`}>{r.status === 'present' ? 'P' : 'A'}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={generatePDF} disabled={previewRecords.length === 0} className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl ${previewRecords.length > 0 ? 'bg-[#f5f5dc] text-[#4a0404]' : 'bg-black/20 text-[#f5f5dc]/10 cursor-not-allowed'}`}>BAIXAR RELATÓRIO PDF</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default History;
