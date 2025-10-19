// app/pages/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChatInput from '@/app/components/chat/Chatinput';
import Sidebar from '@/app/components/chat/Sidebar';
import NavigationBar from '@/app/components/chat/NavigationBar';
import ChatModal from '@/app/components/chat/ChatModal';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import localStorageService from '@/app/services/localStorageService';

function DashboardContent() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasStartedChat, setHasStartedChat] = useState(false);
    const [chatModalOpen, setChatModalOpen] = useState(false);
    const [initialMessage, setInitialMessage] = useState('');
    const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();

    // Obtener datos del usuario autenticado
    const user = localStorageService.getUser();
    const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleUserButtonClick = () => {
        console.log('Botón de usuario presionado', user);
        // Aquí podrías abrir un menú de usuario, mostrar perfil, etc.
    };

    // Resetear completamente el chat (nueva conversación)
    const resetChat = () => {
        setHasStartedChat(false);
        setChatModalOpen(false);
        setInitialMessage('');
        setSelectedConversationId(undefined);
    };

    // Cerrar modal sin resetear (minimizar)
    const closeChatModal = () => {
        setChatModalOpen(false);
    };

    // Manejar nueva conversación desde el sidebar
    const handleNewChat = () => {
        setSelectedConversationId(undefined);
        setInitialMessage('');
        setHasStartedChat(false);
        setChatModalOpen(true);
    };

    // Manejar selección de conversación existente desde el sidebar
    const handleSelectConversation = (conversationId: string) => {
        console.log('Conversación seleccionada:', conversationId);
        setSelectedConversationId(conversationId);
        setInitialMessage('');
        setHasStartedChat(true);
        setChatModalOpen(true);
    };

    // Manejar mensaje desde ChatInput (nueva conversación)
    const handleSendMessage = (message: string) => {
        console.log('Mensaje recibido:', message);

        // Primer mensaje desde ChatInput - crear nueva conversación
        setInitialMessage(message);
        setSelectedConversationId(undefined); // Asegurar que es nueva conversación
        setHasStartedChat(true);
        setChatModalOpen(true);
    };

    return (
        <motion.div
            className="h-screen bg-black flex overflow-hidden font-mono relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            {!hasStartedChat && <div className="light-effect"></div>}

            {/* Efectos de fondo animados */}
            <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-zinc-900 rounded-full blur-3xl opacity-10"
                style={{ zIndex: 0 }}
                animate={{
                    scale: [1, 1.05, 1],
                    x: [0, 10, 0],
                    y: [0, -5, 0]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-800 rounded-full blur-3xl opacity-10"
                style={{ zIndex: 0 }}
                animate={{
                    scale: [1, 1.08, 1],
                    x: [0, -8, 0],
                    y: [0, 8, 0]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3
                }}
            />

            {/* Sidebar con funcionalidad completa */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
                onNewChat={handleNewChat}
                onSelectConversation={handleSelectConversation}
            />

            <motion.div
                className="flex-1 flex flex-col relative h-full overflow-hidden"
                style={{ zIndex: 10 }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
                <NavigationBar
                    sidebarOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    handleUserButtonClick={handleUserButtonClick}
                    userInitial={userInitial}
                />

                {/* Pantalla principal con ChatInput centrado */}
                <motion.div
                    className="flex-1 flex items-center justify-center p-6"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                >
                    <ChatInput onSendMessage={handleSendMessage} />
                </motion.div>
            </motion.div>

            {/* Modal de Chat con funcionalidad completa */}
            <ChatModal
                isOpen={chatModalOpen}
                onClose={closeChatModal}
                onReset={resetChat}
                initialMessage={initialMessage}
                existingConversationId={selectedConversationId}
            />
        </motion.div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute
            requireAuth={true}
            redirectTo="/pages/login"
            loadingComponent={
                <div className="h-screen bg-black flex items-center justify-center">
                    <div className="text-center">
                        <motion.div
                            className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full mx-auto mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-zinc-400 text-sm font-mono">verificando autenticación...</p>
                    </div>
                </div>
            }
        >
            <DashboardContent />
        </ProtectedRoute>
    );
}