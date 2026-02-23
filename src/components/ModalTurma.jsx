import { useState } from 'react';
import { useData } from '../context/DataContext';
import ModalAluno from './ModalAluno';

const ModalTurma = ({ isOpen, onClose, turmaInfo }) => {
    const { getAlunosByTurma, removeAluno } = useData();

    const [isAlunoModalOpen, setIsAlunoModalOpen] = useState(false);
    const [alunoToEdit, setAlunoToEdit] = useState(null);

    if (!isOpen || !turmaInfo) return null;

    const alunos = getAlunosByTurma(turmaInfo.turma).sort((a, b) => a.localeCompare(b));

    const handleEditAluno = (aluno) => {
        setAlunoToEdit({ nome: aluno });
        setIsAlunoModalOpen(true);
    };

    const handleNewAluno = () => {
        setAlunoToEdit(null);
        setIsAlunoModalOpen(true);
    };

    const handleDeleteAluno = (aluno) => {
        if (confirm('Deseja excluir este aluno da turma?')) {
            removeAluno(turmaInfo.turma, aluno);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-black">{turmaInfo.turma}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <p className="text-sm text-gray-500">Professor: {turmaInfo.professor}</p>

                    <div className="flex justify-between items-center pt-2">
                        <h3 className="font-bold text-gray-700">Alunos</h3>
                        <button
                            onClick={handleNewAluno}
                            className="flex items-center gap-1 text-primary font-bold hover:bg-primary/5 px-3 py-1 rounded-lg transition"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            <span className="text-sm">Novo Aluno</span>
                        </button>
                    </div>

                    <ul className="space-y-2">
                        {alunos.map((aluno, index) => (
                            <li key={index} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                                <span className="font-medium">{aluno}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditAluno(aluno)}
                                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition"
                                        title="Editar"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAluno(aluno)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition"
                                        title="Excluir"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </li>
                        ))}
                        {alunos.length === 0 && (
                            <li className="text-center text-gray-400 text-sm py-4">Nenhum aluno cadastrado.</li>
                        )}
                    </ul>
                </div>
            </div>

            <ModalAluno
                isOpen={isAlunoModalOpen}
                onClose={() => setIsAlunoModalOpen(false)}
                currentTurma={turmaInfo.turma}
                alunoToEdit={alunoToEdit}
            />
        </>
    );
};

export default ModalTurma;
