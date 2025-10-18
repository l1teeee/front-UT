import React, { useState, useRef, useEffect } from 'react';
import { Folder, Plus, Bell, Settings, User, ChevronRight } from 'lucide-react';
import { useNavigation } from '@/app/hook/useNavigation';

interface NavigationBarProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    handleUserButtonClick: () => void;
    userInitial: string;
}

export default function NavigationBar({
                                          sidebarOpen,
                                          toggleSidebar,
                                          handleUserButtonClick,
                                          userInitial
                                      }: NavigationBarProps) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { goHome } = useNavigation();

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
                        <div className="absolute bottom-0 left-12 w-56 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-xl shadow-black/30 py-2">
                            {/* Header del menú */}
                            <div className="px-4 py-3 border-b border-zinc-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                        <User size={16} className="text-white/70" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/90 font-medium">desarrollo@ukiyo.sv</p>
                                    </div>
                                </div>
                            </div>

                            {/* Opción de cerrar sesión */}
                            <div className="py-1">
                                <button
                                    className="w-full flex items-center px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition-colors"
                                    onClick={() => {
                                        console.log('Cerrar sesión');
                                        setUserMenuOpen(false);
                                        goHome();
                                    }}
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