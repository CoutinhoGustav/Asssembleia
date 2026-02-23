import { useOutletContext } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Dashboard = () => {
    const { registros } = useData();
    const { openRegistry } = useOutletContext();

    return (
        <div className="p-4 md:p-8">
            {/* Header is handled by global logic or duplicated here for desktop style consistency */}
            {/* The original 'dashboard.html' had header inside main. */}
            <header className="hidden md:flex bg-white border-b -mx-8 -mt-8 px-8 h-20 items-center mb-8">
                <h2 className="text-3xl font-black">Lista de Presenças</h2>
            </header>

            <div className="bg-white rounded-2xl shadow border overflow-x-auto">
                <table className="min-w-[800px] w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-xs uppercase text-left font-bold text-gray-500">Turma</th>
                            <th className="px-6 py-4 text-xs uppercase text-left font-bold text-gray-500">Professor</th>
                            <th className="px-6 py-4 text-xs uppercase text-left font-bold text-gray-500">Data</th>
                            <th className="px-6 py-4 text-xs uppercase text-center font-bold text-gray-500">Presentes</th>
                            <th className="px-6 py-4 text-xs uppercase text-center font-bold text-gray-500">Visitantes</th>
                            <th className="px-6 py-4 text-xs uppercase text-right font-bold text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {registros.map((reg) => (
                            <tr key={reg.id} className="hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4 font-medium">{reg.turma}</td>
                                <td className="px-6 py-4">{reg.professor}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{reg.data}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                        {reg.presentes}/{reg.total}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center text-sm text-gray-500 truncate max-w-[200px]">
                                    {reg.visitantes}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => openRegistry(reg)}
                                        className="text-primary font-bold hover:underline text-sm"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {registros.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Dashboard;
