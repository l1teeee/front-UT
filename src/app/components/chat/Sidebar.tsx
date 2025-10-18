import React from 'react';
import {X, Plus, MessageSquare, Settings, User, Zap, Sparkles} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onNewChat?: () => void; // Prop opcional para nueva conversación
}

export default function Sidebar({ isOpen, onClose, onNewChat }: SidebarProps) {
    const conversations = [
        { id: 1, title: 'Conversación sobre React', time: '2h' },
        { id: 2, title: 'Ayuda con CSS', time: '1d' },
        { id: 3, title: 'Proyecto Next.js', time: '3d' },
        { id: 4, title: 'Consulta sobre APIs', time: '1w' },
    ];

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar - Z-INDEX MÁXIMO */}
            <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                fixed inset-y-0 left-0 z-[9999] w-64 
                bg-zinc-900/80 backdrop-blur-sm border-r border-zinc-800/50 
                transform transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full">
                    {/* Header del sidebar */}
                    <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                                <Sparkles size={18} className="text-white/80" />
                            </div>
                            <span className="text-white/90 font-medium">UT</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/50 hover:text-white transition-colors"
                            aria-label="Cerrar menú"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Botón nueva conversación */}
                    <div className="p-4">
                        <button
                            onClick={onNewChat}
                            className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white/80 px-3 py-2 rounded-lg transition-colors border border-white/10 backdrop-blur-sm shadow-md"
                        >
                            <Plus size={18} />
                            <span>nueva conversación</span>
                        </button>
                    </div>

                    {/* Lista de conversaciones */}
                    <div className="flex-1 overflow-y-auto px-4">
                        <div className="space-y-2">
                            {conversations.map((conv) => (
                                <div key={conv.id} className="p-3 hover:bg-white/5 rounded-lg cursor-pointer group backdrop-blur-sm transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <MessageSquare size={16} className="text-white/40 group-hover:text-white/70 transition-colors" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white/80 truncate">{conv.title}</p>
                                            <p className="text-xs text-white/40">{conv.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer del sidebar */}
                    <div className="border-t border-zinc-800/50 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                <User size={16} className="text-white/70" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white/80">julian</p>
                                <p className="text-xs text-white/40">usuario</p>
                            </div>
                            <Settings size={16} className="text-white/40 hover:text-white/70 cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}