import React, { useState, useRef, useEffect } from 'react';
import { Folder, Plus } from 'lucide-react';
import { useNavigation } from '@/app/hook/useNavigation';
import localStorageService from '@/app/services/localStorageService';

interface NavigationBarProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    handleUserButtonClick: () => void;
    userInitial: string;
}

export default function NavigationBar({
                                          sidebarOpen,
                                          toggleSidebar,
                                          userInitial
                                      }: NavigationBarProps) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { goToLogin } = useNavigation();

    // Obtener datos del usuario autenticado
    const user = localStorageService.getUser();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    const handleLogout = () => {
        console.log('Cerrando sesión...');
        localStorageService.logout();
        setUserMenuOpen(false);
        goToLogin();
    };

    return (
        <div className="absolute left-0 top-0 bottom-0 z-30">
            <div className="hidden md:flex flex-col items-center justify-between h-full py-6 px-2 bg-white/10 backdrop-blur-md border-r border-white/20">
                <div className="flex flex-col items-center gap-2">
                    <button
                        onClick={toggleSidebar}
                        className="text-white/70 hover:text-white p-1.5 rounded-lg transition-colors duration-200"
                        aria-label={sidebarOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
                        title="Menú"
                    >
                        <Folder size={18} />
                    </button>

                    <button
                        className="text-white/70 hover:text-white p-1.5 rounded-lg transition-colors duration-200"
                        aria-label="Nuevo chat"
                        title="Nuevo chat"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={toggleUserMenu}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white/90 text-sm font-medium border border-white/30 hover:bg-white/30 transition-all duration-200"
                        aria-label="Perfil de usuario"
                        title="Perfil"
                    >
                        {userInitial}
                    </button>

                    {userMenuOpen && (
                        <div className="absolute bottom-0 left-12 w-64 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-xl shadow-black/30 py-2">
                            {/* Header del menú */}
                            <div className="px-4 py-3 border-b border-zinc-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                        <span className="text-white/90 text-sm font-medium">
                                            {userInitial}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {user?.displayName && (
                                            <p className="text-sm text-white/90 font-medium truncate">
                                                {user.displayName}
                                            </p>
                                        )}
                                        <p className="text-xs text-white/60 truncate">
                                            {user?.email || 'Sin email'}
                                        </p>
                                    </div>
                                </div>
                            </div>


                            {/* Opciones del menú */}
                            <div className="py-1">

                                <div className="border-t border-zinc-700/50 my-1"></div>

                                <button
                                    className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    onClick={handleLogout}
                                >
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="md:hidden absolute top-6 left-4">
                <button
                    onClick={toggleSidebar}
                    className="text-white/70 hover:text-white p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 transition-colors duration-200"
                    aria-label={sidebarOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
                    title="Menú"
                >
                    <Folder size={20} />
                </button>
            </div>
        </div>
    );
}