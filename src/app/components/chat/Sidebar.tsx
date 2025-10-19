import React, { useState, useEffect } from 'react';
import {X, Plus, MessageSquare, User, Sparkles} from 'lucide-react';
import localStorageService from '@/app/services/localStorageService';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onNewChat?: () => void;
}

interface Conversation {
    _id: string;
    conversation_id: string;
    title: string;
    created_at: string;
    updated_at: string;
    message_count: number;
    status: string;
    uid: string;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const user = localStorageService.getUser();

    // Obtener el nombre a mostrar
    const displayName = user?.displayName || user?.email?.split('@')[0] || 'usuario';
    const userEmail = user?.email || 'sin email';

    // Función para obtener conversaciones de la API
    const fetchConversations = async () => {
        if (!user?.uid) {
            setError('Usuario no autenticado');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:5000/conversations?uid=${user.uid}`);
            const data = await response.json();

            if (data.success) {
                setConversations(data.conversations || []);
            } else {
                setError(data.error || 'Error al cargar conversaciones');
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    // Cargar conversaciones cuando se abra el sidebar
    useEffect(() => {
        if (isOpen && user?.uid) {
            fetchConversations();
        }
    }, [isOpen, user?.uid]);

    // Función para formatear el tiempo relativo
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'ahora';
        if (diffInMinutes < 60) return `${diffInMinutes}m`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks}w`;
    };

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
                            onClick={onClose}
                            className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white/80 px-3 py-2 rounded-lg transition-colors border border-white/10 backdrop-blur-sm shadow-md"
                        >
                            <Plus size={18} />
                            <span>nueva conversación</span>
                        </button>
                    </div>

                    {/* Lista de conversaciones */}
                    <div className="flex-1 overflow-y-auto px-4">
                        {loading && (
                            <div className="flex items-center justify-center py-4">
                                <div className="text-white/60 text-sm">Cargando conversaciones...</div>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center justify-center py-4">
                                <div className="text-red-400 text-sm text-center">{error}</div>
                            </div>
                        )}

                        {!loading && !error && conversations.length === 0 && (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-white/40 text-sm text-center">
                                    No hay conversaciones aún
                                </div>
                            </div>
                        )}

                        {!loading && !error && conversations.length > 0 && (
                            <div className="space-y-2">
                                {conversations.map((conv) => (
                                    <div
                                        key={conv.conversation_id}
                                        className="p-3 hover:bg-white/5 rounded-lg cursor-pointer group backdrop-blur-sm transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <MessageSquare size={16} className="text-white/40 group-hover:text-white/70 transition-colors" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white/80 truncate" title={conv.title}>
                                                    {conv.title}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-white/40">
                                                        {formatTimeAgo(conv.updated_at)}
                                                    </p>
                                                    <p className="text-xs text-white/30">
                                                        {conv.message_count} mensajes
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer del sidebar */}
                    <div className="border-t border-zinc-800/50 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                <User size={16} className="text-white/70" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white/80 truncate">{displayName}</p>
                                <p className="text-xs text-white/40 truncate">{userEmail}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}