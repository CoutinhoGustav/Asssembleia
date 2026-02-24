import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const ModalAluno = ({ isOpen, onClose, alunoToEdit, currentTurma }) => {
    const { addAluno, updateAluno, alunosData } = useData();
    const [nome, setNome] = useState('');
    const [turma, setTurma] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (alunoToEdit) {
                setNome(alunoToEdit.nome);
                setTurma(currentTurma); // Originally passed from parent
            } else {
                setNome('');
                setTurma(currentTurma || Object.keys(alunosData)[0]);
            }
        }
    }, [isOpen, alunoToEdit, currentTurma, alunosData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nome.trim()) {
            alert('Informe o nome');
            return;
        }

        if (alunoToEdit) {
            // Update
            // Logic: oldTurma, oldNome, newTurma, newNome
            // We assume we are editing the student FROM the current class context, 
            // but user might change the class (transfer).
            updateAluno(currentTurma, alunoToEdit.nome, turma, nome);
        } else {
            // Add
            addAluno(turma, nome);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-5 animate-in zoom-in duration-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black">{alunoToEdit ? 'Editar Aluno' : 'Novo Aluno'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Nome do aluno</label>
                        <input
                            type="text"
                            required
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            className="w-full rounded-xl border-gray-200 text-sm focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Turma</label>
                        <select
                            value={turma}
                            onChange={e => setTurma(e.target.value)}
                            className="w-full rounded-xl border-gray-200 text-sm focus:ring-primary focus:border-primary"
                        >
                            {Object.keys(alunosData).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow-lg hover:bg-primary/90 transition"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAluno;
