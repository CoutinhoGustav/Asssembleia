import { createContext, useContext, useState, useEffect } from 'react';
import { request } from '../services/api.js';

const DataContext = createContext();

// 🔹 Converte YYYY-MM-DD → DD/MM/YYYY
const formatDateBR = (dateISO) => {
    if (!dateISO) return '';
    const [year, month, day] = dateISO.split('-');
    if (!year || !month || !day) return '';
    return `${day}/${month}/${year}`;
};

// 🔹 Normaliza data (evita undefined/undefined)
export const normalizeDate = (date) => {
    // Já está em DD/MM/YYYY
    if (date?.includes('/')) return date;

    // Está em YYYY-MM-DD
    if (date?.includes('-')) return formatDateBR(date);

    return '';
};

// DADOS (BANCO SIMULADO)
const registrosDefault = [
    { id: 1, turma: 'Berçário', professor: 'Ana Paula', data: '15/10/2023', presentes: 8, total: 10, visitantes: 'Laura Mendes' },
    { id: 2, turma: 'Maternal', professor: 'Carla Souza', data: '15/10/2023', presentes: 12, total: 15, visitantes: '-' },
    { id: 3, turma: 'Principiantes', professor: 'Rafael Lima', data: '15/10/2023', presentes: 18, total: 20, visitantes: 'João Pedro' },
    { id: 4, turma: 'Juniores', professor: 'Marcos Silva', data: '15/10/2023', presentes: 22, total: 25, visitantes: '-' },
    { id: 5, turma: 'Intermediários', professor: 'Luciana Rocha', data: '15/10/2023', presentes: 30, total: 35, visitantes: 'Carlos André' },
    { id: 6, turma: 'Jovens', professor: 'João Paulo', data: '15/10/2023', presentes: 42, total: 50, visitantes: '-' },
    { id: 7, turma: 'Adultos', professor: 'Maria Silva', data: '15/10/2023', presentes: 35, total: 40, visitantes: 'Pedro Henrique' },
];

const alunosDataDefault = {
    'Berçário': ['Lucas Baby', 'Ana Clara', 'Miguelzinho', 'Helena Baby'],
    'Maternal': ['Joãozinho', 'Mariana', 'Davi', 'Sofia'],
    'Principiantes': ['Cauã Silva', 'Beatriz Santos', 'Daniel Oliveira', 'Enzo Gabriel', 'Helena Costa'],
    'Juniores': ['Pedro Lucas', 'Ana Júlia', 'Gustavo Lima', 'Larissa Rocha'],
    'Intermediários': ['Lucas Gabriel', 'Mariana Lima', 'Felipe Costa', 'Amanda Rocha'],
    'Jovens': ['João Pedro', 'Camila Santos', 'Matheus Oliveira', 'Bianca Lima', 'Gustavo Henrique'],
    'Adultos': ['Ricardo Alves', 'Teresa Cristina', 'Marcos Paulo', 'Juliana Nunes'],
};

export const DataProvider = ({ children }) => {
    const [registros, setRegistros] = useState(() => {
        const saved = localStorage.getItem('registros');
        return saved ? JSON.parse(saved) : registrosDefault;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [alunosData, setAlunosData] = useState(() => {
        const saved = localStorage.getItem('alunosData');
        return saved ? JSON.parse(saved) : alunosDataDefault;
    });

    useEffect(() => {
        localStorage.setItem('registros', JSON.stringify(registros));
    }, [registros]);

    useEffect(() => {
        localStorage.setItem('alunosData', JSON.stringify(alunosData));
    }, [alunosData]);

    const addRegistro = (novoRegistro) => {
        const registroWithId = {
            ...novoRegistro,
            id: Date.now(),
            data: normalizeDate(novoRegistro.data)
        };
        setRegistros(prev => [registroWithId, ...prev]);
    };

    const updateRegistro = (updatedRegistro) => {
        setRegistros(prev =>
            prev.map(r =>
                r.id === updatedRegistro.id
                    ? { ...updatedRegistro, data: normalizeDate(updatedRegistro.data) }
                    : r
            )
        );
    };

    // ✅ FUNÇÃO NECESSÁRIA PARA O MODAL
    const deleteRegistro = (id) => {
        setRegistros(prev => prev.filter(r => r.id !== id));
    };

    const getAlunosByTurma = (turma) => {
        const list = alunosData[turma] || [];
        return [...list].sort((a, b) => a.localeCompare(b));
    };

    const addAluno = (turma, nome) => {
        setAlunosData(prev => ({
            ...prev,
            [turma]: [...(prev[turma] || []), nome]
        }));
    };

    const updateAluno = (turmaOld, nomeOld, turmaNew, nomeNew) => {
        setAlunosData(prev => {
            const copy = { ...prev };

            if (copy[turmaOld]) {
                copy[turmaOld] = copy[turmaOld].filter(a => a !== nomeOld);
            }

            if (!copy[turmaNew]) copy[turmaNew] = [];
            copy[turmaNew].push(nomeNew);

            return copy;
        });
    };

    const removeAluno = (turma, nome) => {
        setAlunosData(prev => ({
            ...prev,
            [turma]: prev[turma].filter(a => a !== nome)
        }));
    };

    return (
        <DataContext.Provider value={{
            registros,
            alunosData,
            addRegistro,
            updateRegistro,
            deleteRegistro,
            getAlunosByTurma,
            addAluno,
            updateAluno,
            removeAluno
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
