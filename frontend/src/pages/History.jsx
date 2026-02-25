import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, User, Download, Trash2, Edit2, X, Check, FileText, Save, Eye, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const History = () => {
    const [historyGroups, setHistoryGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDateFilter, setSelectedDateFilter] = useState('');
    const [systemStatus, setSystemStatus] = useState({ isCallActive: false });

    // Modal para Ver/Editar detalhes da chamada
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedCall, setSelectedCall] = useState(null); // { date, recordedBy, records: [] }
    const [saving, setSaving] = useState(false);

    // Modal para confirmação de exclusão total
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [callToDelete, setCallToDelete] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, [selectedDateFilter]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [statusRes, historyRes] = await Promise.all([
                api.get('/assembly/status'),
                api.get(selectedDateFilter ? `/assembly/history?date=${selectedDateFilter}` : '/assembly/history')
            ]);

            setSystemStatus(statusRes.data);
            groupRecords(historyRes.data);
            setLoading(false);
        } catch (err) {
            toast.error('Erro ao carregar histórico');
        }
    };

    const groupRecords = (records) => {
        const groups = {};
        records.forEach(r => {
            // Normalizar a data para o dia local para evitar saltos de timezone
            const d = new Date(r.date);
            const dateKey = format(d, 'yyyy-MM-dd');

            if (!groups[dateKey]) {
                groups[dateKey] = {
                    date: dateKey,
                    rawDate: r.date,
                    recordedBy: r.recordedBy || 'Sistema',
                    records: []
                };
            }
            groups[dateKey].records.push(r);
        });

        // Converte o objeto em array, ordena por data decrescente e ordena nomes dentro de cada grupo
        const groupedArray = Object.values(groups).map(group => ({
            ...group,
            records: group.records.sort((a, b) => a.studentName.localeCompare(b.studentName))
        })).sort((a, b) =>
            new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
        );
        setHistoryGroups(groupedArray);
    };

    const openDeleteModal = (date) => {
        setCallToDelete(date);
        setDeleteModalOpen(true);
    };

    const confirmDeleteCall = async () => {
        if (!callToDelete) return;
        try {
            await api.delete(`/assembly/history?date=${callToDelete}`);
            toast.success('Chamada excluída com sucesso');
            setHistoryGroups(historyGroups.filter(g => g.date !== callToDelete));
            setDeleteModalOpen(false);
            setCallToDelete(null);
        } catch (err) {
            toast.error('Erro ao excluir chamada');
        }
    };

    const openViewModal = (call) => {
        // Cria uma cópia profunda para não alterar o estado principal antes de salvar
        setSelectedCall(JSON.parse(JSON.stringify(call)));
        setIsViewModalOpen(true);
    };

    const handleToggleStatusInModal = (recordIdx) => {
        const updatedCall = { ...selectedCall };
        const currentStatus = updatedCall.records[recordIdx].status;
        updatedCall.records[recordIdx].status = currentStatus === 'present' ? 'absent' : 'present';
        setSelectedCall(updatedCall);
    };

    const handleSaveUpdates = async () => {
        setSaving(true);
        try {
            // Atualiza cada registro individualmente (idealmente o backend teria um batch update melhor)
            const updatePromises = selectedCall.records.map(r =>
                api.put(`/assembly/attendance/${r._id}`, { status: r.status })
            );
            await Promise.all(updatePromises);

            toast.success('Chamada atualizada com sucesso!');
            setIsViewModalOpen(false);
            fetchInitialData(); // Recarrega tudo para garantir sincronia
        } catch (err) {
            toast.error('Erro ao salvar atualizações');
        } finally {
            setSaving(false);
        }
    };

    const isToday = (dateStr) => {
        return dateStr === format(new Date(), 'yyyy-MM-dd');
    };

    const generatePDF = (group, index) => {
        const doc = new jsPDF();
        const callDate = new Date(group.date + 'T12:00:00');
        const dateFormatted = format(callDate, "dd 'DE' MMMM 'DE' yyyy", { locale: ptBR }).toUpperCase();

        // Calcular número da sessão de forma sequencial (Base 450 para a mais antiga)
        const totalGroups = historyGroups.length;
        const sessionNum = 450 + (totalGroups - 1 - index);

        // --- CABEÇALHO ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('IGREJA BATISTA REGULAR DO CALVÁRIO', 20, 20);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('CNPJ 02.578.953/0001-67', 20, 25);
        doc.text('CHAMADA DO ROL DE MEMBROS', 20, 30);
        doc.text(`${sessionNum}ª SESSÃO ORDINÁRIA REALIZADA NO DIA ${dateFormatted}`, 20, 35);

        // --- TABELA ---
        const tableData = group.records.map((r, index) => [
            index + 1,
            r.studentName.toUpperCase(),
            r.status === 'present' ? '.' : 'F',
            '' // Coluna vazia para Assinatura
        ]);

        autoTable(doc, {
            startY: 42,
            head: [['', 'NOME DO MEMBRO', '. / F', 'ASSINATURA']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: 0.2,
                lineColor: [0, 0, 0],
                halign: 'center',
                valign: 'middle'
            },
            styles: {
                fontSize: 9,
                cellPadding: 2,
                lineColor: [0, 0, 0],
                lineWidth: 0.2,
                textColor: [0, 0, 0],
                valign: 'middle'
            },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' },
                1: { cellWidth: 80, halign: 'left' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 70, halign: 'center' }
            }
        });

        // --- RODAPÉ ---
        const finalY = doc.lastAutoTable.finalY + 10;
        const presentCount = group.records.filter(r => r.status === 'present').length;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`.: presença            F: falta`, 20, finalY);
        doc.setFont("helvetica", "bold");
        doc.text(`Total de presentes: ${presentCount}`, 145, finalY);

        // Assinaturas
        const sigY = finalY + 25;

        // Linha Pastor
        doc.setLineWidth(0.5);
        doc.line(30, sigY, 90, sigY);
        doc.setFontSize(8);
        doc.text('Francisco Ernando Sales', 60, sigY + 4, { align: 'center' });
        doc.setFont("helvetica", "normal");
        doc.text('Pastor presidente', 60, sigY + 8, { align: 'center' });

        // Linha Secretária
        doc.line(110, sigY, 180, sigY);
        doc.setFont("helvetica", "bold");
        doc.text('Priscilla Erica Miranda Carvalho Schilder', 145, sigY + 4, { align: 'center' });
        doc.setFont("helvetica", "normal");
        doc.text('Primeira secretária', 145, sigY + 8, { align: 'center' });

        doc.save(`Lista_Presenca_${group.date}.pdf`);
        toast.success('Relatório gerado com sucesso!');
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#f5f5dc] tracking-tighter">Histórico</h1>
                    <p className="text-[#d1d1d1] font-medium tracking-wide">Gerenciamento de chamadas registradas</p>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="bg-[#5a0505] p-8 rounded-[2.5rem] border border-[#6b0a0a] shadow-2xl w-full max-w-md">
                    <div className="space-y-4">
                        <label className="block text-center text-xs font-black text-[#f5f5dc]/60 uppercase tracking-widest">Filtrar por data específica</label>
                        <div className="relative">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-[#f5f5dc]" size={24} />
                            <input
                                type="date"
                                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[#4a0404] border-2 border-[#6b0a0a] focus:border-[#f5f5dc] transition-all outline-none font-black text-xl text-[#f5f5dc]"
                                value={selectedDateFilter}
                                onChange={(e) => setSelectedDateFilter(e.target.value)}
                            />
                            {selectedDateFilter && (
                                <button onClick={() => setSelectedDateFilter('')} className="absolute right-12 top-1/2 -translate-y-1/2 text-[#f5f5dc]/40 hover:text-white transition-all">
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
                        <thead className="bg-black/20 font-black text-[#f5f5dc]/60 uppercase tracking-widest text-[10px] md:text-xs">
                            <tr>
                                <th className="px-4 md:px-8 py-5">Registros</th>
                                <th className="px-8 py-5 hidden md:table-cell">Registrador</th>
                                <th className="px-4 md:px-8 py-5 text-center hidden sm:table-cell">Status</th>
                                <th className="px-4 md:px-8 py-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#6b0a0a]">
                            {historyGroups.map((group, idx) => {
                                const callIsActive = isToday(group.date) && systemStatus.isCallActive;
                                return (
                                    <tr key={group.date} className="hover:bg-black/10 transition-colors group">
                                        <td className="px-4 md:px-8 py-5">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#f5f5dc] flex items-center justify-center flex-shrink-0">
                                                    <FileText className="text-[#4a0404]" size={24} />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-white text-sm md:text-lg truncate">
                                                        {format(new Date(group.date + 'T12:00:00'), "dd 'de' MMMM", { locale: ptBR })}
                                                    </span>
                                                    <span className="text-[9px] md:text-[10px] text-[#f5f5dc]/40 font-black uppercase tracking-widest truncate">
                                                        {group.records.length} REG. | {group.records.filter(r => r.status === 'present').length} PRES.
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-[#f5f5dc] font-bold hidden md:table-cell">
                                            {group.recordedBy}
                                        </td>
                                        <td className="px-4 md:px-8 py-5 text-center hidden sm:table-cell">
                                            <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black tracking-[0.2em] uppercase ${callIsActive
                                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}>
                                                {callIsActive ? 'Pendente' : 'Salvo'}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                                            <div className="flex justify-end gap-1 md:gap-3">
                                                <button
                                                    onClick={() => generatePDF(group, idx)}
                                                    className="p-1.5 md:p-2 text-[#f5f5dc]/40 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
                                                    title="Exportar PDF"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button
                                                    onClick={() => openViewModal(group)}
                                                    className="flex items-center gap-1.5 bg-[#f5f5dc] text-[#4a0404] px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-black text-[10px] md:text-xs hover:bg-white transition-all active:scale-95 shadow-lg"
                                                >
                                                    <Eye size={16} className="md:hidden" />
                                                    <span className="hidden md:inline">VER</span>
                                                    <span className="md:hidden text-[9px]">VER</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(group.date)}
                                                    className="p-1.5 md:p-2 text-rose-400/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {historyGroups.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-[#d1d1d1] font-bold text-lg opacity-40 uppercase tracking-widest">
                                        Nenhuma chamada registrada encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL VER / EDITAR CHAMADA */}
            <AnimatePresence>
                {isViewModalOpen && selectedCall && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#3a0303] w-full max-w-2xl rounded-3xl md:rounded-[3.5rem] shadow-2xl overflow-hidden border border-[#5a0505] flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 md:p-10 border-b border-[#5a0505] space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-black text-[#f5f5dc] tracking-tighter">Detalhes da Chamada</h2>
                                        <p className="text-[#f5f5dc]/40 text-xs font-bold uppercase tracking-[0.2em] mt-1">Consulta e ajustes ministeriais</p>
                                    </div>
                                    <button
                                        onClick={() => setIsViewModalOpen(false)}
                                        className="text-[#f5f5dc]/20 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"
                                    >
                                        <X size={28} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#4a0404] p-4 rounded-2xl border border-[#5a0505]">
                                        <p className="text-[10px] font-black text-[#f5f5dc]/40 uppercase tracking-widest mb-1">Data Registrada</p>
                                        <p className="text-white font-bold">{format(new Date(selectedCall.rawDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
                                    </div>
                                    <div className="bg-[#4a0404] p-4 rounded-2xl border border-[#5a0505]">
                                        <p className="text-[10px] font-black text-[#f5f5dc]/40 uppercase tracking-widest mb-1">Registrado por</p>
                                        <p className="text-white font-bold">{selectedCall.recordedBy}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                                <div className="space-y-3">
                                    {selectedCall.records.map((record, index) => (
                                        <div key={record._id} className="flex items-center justify-between p-4 bg-[#4a0404] rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${record.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-rose-500/20 text-rose-400'
                                                    }`}>
                                                    {record.studentName.charAt(0)}
                                                </div>
                                                <span className="font-bold text-white text-lg">{record.studentName}</span>
                                            </div>
                                            <button
                                                onClick={() => handleToggleStatusInModal(index)}
                                                className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${record.status === 'present'
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                                                    : 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                                                    }`}
                                            >
                                                {record.status === 'present' ? 'Presente' : 'Ausente'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 md:p-10 bg-black/20 border-t border-[#5a0505]">
                                <button
                                    onClick={handleSaveUpdates}
                                    disabled={saving}
                                    className="w-full bg-[#f5f5dc] text-[#4a0404] py-5 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-white transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {saving ? (
                                        <div className="w-6 h-6 border-4 border-[#4a0404]/30 border-t-[#4a0404] rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={24} strokeWidth={3} />
                                            SALVAR ALTERAÇÕES
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Modal de Confirmação de Exclusão */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#3a0303] w-full max-w-md rounded-[3rem] shadow-2xl p-10 border border-rose-500/20 text-center"
                        >
                            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                                <AlertTriangle size={40} strokeWidth={2.5} />
                            </div>

                            <h2 className="text-2xl font-black text-white tracking-tighter mb-2">Excluir Chamada?</h2>
                            <p className="text-[#d1d1d1] font-medium leading-relaxed mb-8 text-sm uppercase tracking-widest">
                                Você está prestes a remover todos os registros do dia <span className="text-white font-black">{callToDelete && format(new Date(callToDelete + 'T12:00:00'), 'dd/MM/yyyy')}</span>. Esta ação é irreversível.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmDeleteCall}
                                    className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-500 transition-all shadow-xl shadow-rose-900/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={20} strokeWidth={3} />
                                    SIM, EXCLUIR TUDO
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

export default History;
