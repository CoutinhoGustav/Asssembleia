import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose, onLogout, onOpenNewRegistry }) => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-primary/20 border-l-4 border-primary'
            : 'hover:bg-white/5 border-l-4 border-transparent';
    };

    return (
        <>
            {/* OVERLAY */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/50 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`}
            ></div>

            {/* SIDEBAR */}
            <aside
                className={`fixed inset-y-0 left-0 w-72 bg-sidebar-dark text-white z-40
           transform transition-transform duration-300 md:translate-x-0
           ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-6 flex flex-col gap-8 h-full">

                    {/* LOGO */}
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-2xl">
                                church
                            </span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">IBRC</h1>
                            <p className="text-xs text-white/60 uppercase">Dashboard</p>
                        </div>
                    </div>

                    {/* NAV */}
                    <nav className="flex flex-col gap-1 flex-1">
                        {/* TODO: Add logic for opening Modal via prop or context if needed here, 
                but originally it was a button. keeping it as a button but maybe 
                move the modal trigger up to layout or context. 
                For now just a placeholder button. 
            */}
                        <button
                            onClick={() => {
                                onOpenNewRegistry();
                                onClose(); // Close sidebar on mobile if open
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg w-full text-left"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            Novo Registro
                        </button>

                        <Link
                            to="/"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/')}`}
                            onClick={onClose}
                        >
                            <span className={`material-symbols-outlined ${location.pathname === '/' ? 'text-primary' : ''}`}>
                                list_alt
                            </span>
                            Lista de Presenças
                        </Link>

                        <Link
                            to="/turmas"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/turmas')}`}
                            onClick={onClose}
                        >
                            <span className={`material-symbols-outlined ${location.pathname === '/turmas' ? 'text-primary' : ''}`}>
                                groups
                            </span>
                            Turmas
                        </Link>

                        <Link
                            to="/configuracoes"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/configuracoes')}`}
                            onClick={onClose}
                        >
                            <span className={`material-symbols-outlined ${location.pathname === '/configuracoes' ? 'text-primary' : ''}`}>
                                settings
                            </span>
                            Configurações
                        </Link>
                    </nav>

                    {/* PERFIL */}
                    <div className="border-t border-white/10 pt-4">
                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl">
                            <div className="w-8 h-8 rounded-full bg-[#f5f5dc] overflow-hidden flex items-center justify-center text-[#4a0404] font-bold text-xs shadow-lg flex-shrink-0">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0) || 'U'
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate text-white">{user?.name || 'Usuário'}</p>
                                <p className="text-[10px] text-white/50 truncate uppercase tracking-widest font-black">Admin</p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="material-symbols-outlined ml-auto text-white/40 hover:text-red-400"
                                title="Sair"
                            >
                                logout
                            </button>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;
