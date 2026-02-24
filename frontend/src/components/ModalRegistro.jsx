import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const ModalRegistro = ({ isOpen, onClose, registroToEdit }) => {
    const {
        alunosData,
        addRegistro,
        updateRegistro,
        deleteRegistro,
        getAlunosByTurma
    } = useData();

    const [turma, setTurma] = useState('');
    const [data, setData] = useState('');
    const [professor, setProfessor] = useState('');
    const [visitantes, setVisitantes] = useState('');

    const [alunosList, setAlunosList] = useState([]);
    const [checkedAlunos, setCheckedAlunos] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (registroToEdit) {
                setTurma(registroToEdit.turma);
                setData(registroToEdit.data);
                setProfessor(registroToEdit.professor);
                setVisitantes(registroToEdit.visitantes === '-' ? '' : registroToEdit.visitantes);

                const alunos = getAlunosByTurma(registroToEdit.turma);
                setAlunosList(alunos);

                const checks = {};
                alunos.forEach((a, i) => {
                    checks[a] = i < registroToEdit.presentes;
                });
                setCheckedAlunos(checks);
            } else {
                setTurma('');
                setData(new Date().toISOString().split('T')[0]);
                setProfessor('');
                setVisitantes('');
                setAlunosList([]);
                setCheckedAlunos({});
            }
        }
    }, [isOpen, registroToEdit]);

    const handleTurmaChange = (e) => {
        const selectedTurma = e.target.value;
        setTurma(selectedTurma);

        if (selectedTurma) {
            const alunos = getAlunosByTurma(selectedTurma);
            setAlunosList(alunos);

            const checks = {};
            alunos.forEach(a => (checks[a] = false));
            setCheckedAlunos(checks);
        } else {
            setAlunosList([]);
        }
    };

    const handleMonitorChange = (nome) => {
        setCheckedAlunos(prev => ({
            ...prev,
            [nome]: !prev[nome]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const presentesList = Object.keys(checkedAlunos).filter(k => checkedAlunos[k]);

        const registroData = {
            turma,
            professor,
            data,
            presentes: presentesList.length,
            total: alunosList.length,
            visitantes: visitantes || '-'
        };

        if (registroToEdit) {
            updateRegistro({ id: registroToEdit.id, ...registroData });
        } else {
            addRegistro(registroData);
        }

        onClose();
    };

    const handleDelete = () => {
        deleteRegistro(registroToEdit.id);
        setConfirmDelete(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-200">

                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold">
                        {registroToEdit ? 'Editar Registro' : 'Novo Registro de Chamada'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form id="formRegistro" className="space-y-6" onSubmit={handleSubmit}>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase">Turma</label>
                                <select
                                    required
                                    value={turma}
                                    onChange={handleTurmaChange}
                                    className="rounded-xl border-gray-200 text-sm focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Selecione...</option>
                                    {Object.keys(alunosData).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase">Data</label>
                                <input
                                    type="date"
                                    required
                                    value={data}
                                    onChange={e => setData(e.target.value)}
                                    className="rounded-xl border-gray-200 text-sm focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase">Professor Responsável</label>
                            <input
                                type="text"
                                required
                                value={professor}
                                onChange={e => setProfessor(e.target.value)}
                                placeholder="Nome do professor"
                                className="rounded-xl border-gray-200 text-sm focus:ring-primary focus:border-primary"
                            />
                        </div>

                        {alunosList.length > 0 && (
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase">Chamada de Alunos</label>
                                <div className="grid grid-cols-1 gap-2 bg-gray-50 p-3 rounded-xl border border-dashed max-h-50 overflow-y-auto custom-scrollbar">
                                    {alunosList.map(aluno => (
                                        <label key={aluno} className="flex justify-between items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                                            <span>{aluno}</span>
                                            <input
                                                type="checkbox"
                                                className="accent-primary w-4 h-4"
                                                checked={!!checkedAlunos[aluno]}
                                                onChange={() => handleMonitorChange(aluno)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase">Visitantes</label>
                            <textarea
                                rows="2"
                                value={visitantes}
                                onChange={e => setVisitantes(e.target.value)}
                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-primary focus:border-primary"
                                placeholder="Nomes dos visitantes (separados por vírgula)"
                            />
                        </div>

                    </form>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                    {registroToEdit && (
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className="text-red-600 font-bold hover:underline text-sm"
                        >
                            Excluir Registro
                        </button>
                    )}

                    <button
                        type="submit"
                        form="formRegistro"
                        className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg hover:bg-primary/90 transition"
                    >
                        Salvar Registro
                    </button>
                </div>

            </div>

            {confirmDelete && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
                        <h4 className="text-lg font-bold text-red-600">Confirmar exclusão</h4>
                        <p className="text-sm text-gray-600">
                            Tem certeza que deseja excluir este registro?
                            Essa ação não poderá ser desfeita.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="text-gray-500 font-bold"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalRegistro;
