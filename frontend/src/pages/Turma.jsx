import { useState, useMemo } from 'react';
import { useData, normalizeDate } from '../context/DataContext';
import { useAuth } from '../hooks/useAuth';
import ModalTurma from '../components/ModalTurma';

const Turma = () => {
    const { alunosData, registros } = useData();
    const { user } = useAuth();

    const [selectedTurma, setSelectedTurma] = useState(null);
    const [activeTab, setActiveTab] = useState('classes');
    const [dataFiltro, setDataFiltro] = useState('');

    // =====================
    // LISTA DE TURMAS
    // =====================
    const turmas = Object.keys(alunosData).map(turmaName => {
        const record = registros.find(r => r.turma === turmaName);
        return {
            turma: turmaName,
            professor: record?.professor || 'Não atribuído',
            totalAlunos: alunosData[turmaName].length
        };
    });

    // =====================
    // FILTRAGEM DE REGISTROS
    // =====================
    const registrosFiltrados = useMemo(() => {
        let filtered = registros;

        // filtra por data
        if (dataFiltro) {
            const normalizedFiltro = normalizeDate(dataFiltro);
            filtered = filtered.filter(r => r.data === normalizedFiltro);
        }

        // opcional: filtra por professor logado
        // se você quiser só professor ver suas turmas:
        // if (user?.name !== 'Admin IBRC') {
        //     filtered = filtered.filter(r => r.professor === user.name);
        // }

        return filtered;
    }, [registros, dataFiltro, user]);

    // =====================
    // FUNÇÃO DE RESUMO
    // =====================
    const calcularResumo = (lista) => {
        let presentes = 0;
        let ausentes = 0;
        let visitantes = 0;

        lista.forEach(r => {
            // presentes (pode ser Number do Modal ou Array/String legado)
            if (typeof r.presentes === 'number') {
                presentes += r.presentes;
            } else if (Array.isArray(r.presentes)) {
                presentes += r.presentes.length;
            } else if (typeof r.presentes === 'string') {
                presentes += r.presentes.split(',').filter(Boolean).length;
            }

            // ausentes (pode ser total - presentes se não existir o campo)
            if (typeof r.ausentes === 'number') {
                ausentes += r.ausentes;
            } else if (Array.isArray(r.ausentes)) {
                ausentes += r.ausentes.length;
            } else if (typeof r.ausentes === 'string') {
                ausentes += r.ausentes.split(',').filter(Boolean).length;
            } else if (r.total && typeof r.presentes === 'number') {
                // Cálculo fallback: total - presentes registrados
                ausentes += (r.total - r.presentes);
            }

            // visitantes (ignora '-' e vazios)
            if (r.visitantes && r.visitantes.trim() !== '' && r.visitantes.trim() !== '-') {
                visitantes += r.visitantes.split(',').map(v => v.trim()).filter(Boolean).length;
            }
        });

        return {
            presentes,
            ausentes,
            visitantes,
            totalPresentes: presentes + visitantes
        };
    };

    // =====================
    // RESUMOS
    // =====================
    const resumoGeral = calcularResumo(registrosFiltrados);

    const resumoPorTurma = Object.keys(alunosData).map(turma => {
        const registrosTurma = registrosFiltrados.filter(r => r.turma === turma);
        return {
            turma,
            ...calcularResumo(registrosTurma)
        };
    });

    return (
        <div className="p-4 md:p-8">
            {/* HEADER + MENU */}
            <header className="flex flex-col md:flex-row bg-white border-b rounded-2xl px-6 py-5 md:px-8 md:py-6 mb-6 md:mb-8 items-center justify-between gap-4 md:gap-0">
                <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-black">Turmas</h1>
                    <p className="text-sm md:text-base text-gray-500">
                        Relatórios e gerenciamento • {user?.name || 'Usuário'}
                    </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto justify-center">
                    <button
                        onClick={() => setActiveTab('classes')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-bold whitespace-nowrap ${activeTab === 'classes'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        Classes
                    </button>

                    <button
                        onClick={() => setActiveTab('relatorio')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-bold whitespace-nowrap ${activeTab === 'relatorio'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        Relatório
                    </button>
                </div>
            </header>

            {/* =====================
                CLASSES
            ====================== */}
            {activeTab === 'classes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {turmas.map(t => (
                        <div
                            key={t.turma}
                            className="bg-white rounded-2xl shadow p-6 space-y-3 hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-black">{t.turma}</h3>

                            <p className="text-sm text-gray-500">
                                Professor:{' '}
                                <strong className="text-gray-700">{t.professor}</strong>
                            </p>

                            <p className="text-sm text-gray-500">
                                Alunos:{' '}
                                <strong className="text-gray-700">{t.totalAlunos}</strong>
                            </p>

                            <button
                                onClick={() => setSelectedTurma(t)}
                                className="mt-3 text-primary font-bold hover:underline"
                            >
                                Gerenciar Turma
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* =====================
                RELATÓRIO
            ====================== */}
            {activeTab === 'relatorio' && (
                <div className="space-y-8">
                    {/* FILTRO */}
                    <div className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                        <label className="font-bold">Filtrar por data:</label>
                        <input
                            type="date"
                            value={dataFiltro}
                            onChange={e => setDataFiltro(e.target.value)}
                            className="border rounded-xl p-2 w-full sm:w-auto"
                        />
                    </div>

                    {/* RESUMO GERAL */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-xl font-black mb-4">Resumo Geral</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ResumoCard label="Presentes" value={resumoGeral.presentes} />
                            <ResumoCard label="Ausentes" value={resumoGeral.ausentes} />
                            <ResumoCard label="Visitantes" value={resumoGeral.visitantes} />
                            <ResumoCard
                                label="Total Presentes"
                                value={resumoGeral.totalPresentes}
                                destaque
                            />
                        </div>
                    </div>

                    {/* RESUMO POR TURMA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {resumoPorTurma.map(r => (
                            <div
                                key={r.turma}
                                className="bg-white rounded-2xl shadow p-6"
                            >
                                <h3 className="text-lg font-black mb-3">{r.turma}</h3>

                                <div className="space-y-1 text-sm">
                                    <p>Presentes: <strong>{r.presentes}</strong></p>
                                    <p>Ausentes: <strong>{r.ausentes}</strong></p>
                                    <p>Visitantes: <strong>{r.visitantes}</strong></p>
                                    <p className="font-bold text-primary">
                                        Total Presentes: {r.totalPresentes}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ModalTurma
                isOpen={!!selectedTurma}
                onClose={() => setSelectedTurma(null)}
                turmaInfo={selectedTurma}
            />
        </div>
    );
};

// COMPONENTE CARD DE RESUMO
const ResumoCard = ({ label, value, destaque }) => (
    <div
        className={`rounded-xl p-4 text-center ${destaque ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
            }`}
    >
        <p className="text-sm">{label}</p>
        <p className="text-2xl font-black">{value}</p>
    </div>
);

export default Turma;
