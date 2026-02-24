import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ModalRegistro from '../components/ModalRegistro';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isRegistryOpen, setIsRegistryOpen] = useState(false);
    const [editingRegistry, setEditingRegistry] = useState(null);
    const { logout } = useAuth();
    const location = useLocation();

    const openRegistry = (registro = null) => {
        setEditingRegistry(registro);
        setIsRegistryOpen(true);
    };

    // Helper to get title based on path (for Mobile Header)
    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Lista de Presenças';
            case '/turmas': return 'Turmas';
            case '/configuracoes': return 'Configurações';
            default: return 'IBRC';
        }
    };

    return (
        <div className="flex min-h-screen bg-background-light">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onLogout={logout}
                onOpenNewRegistry={() => openRegistry(null)}
            />

            <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300 w-full">
                {/* MOBILE HEADER */}
                <header className="md:hidden bg-white p-4 border-b flex items-center gap-4 sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="size-10 flex items-center justify-center rounded-lg border bg-gray-50 text-gray-600"
                    >
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                    <h2 className="text-xl font-black text-gray-800">{getTitle()}</h2>
                </header>

                <main className="flex-1 p-0">
                    <Outlet context={{ openRegistry }} />
                </main>
            </div>

            <ModalRegistro
                isOpen={isRegistryOpen}
                onClose={() => setIsRegistryOpen(false)}
                registroToEdit={editingRegistry}
            />
        </div>
    );
};
export default MainLayout;
