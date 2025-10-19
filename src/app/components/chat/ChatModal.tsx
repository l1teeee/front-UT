'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Square, X, Minimize2 } from 'lucide-react';
import localStorageService from '@/app/services/localStorageService';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReset: () => void;
    initialMessage?: string;
}

export default function ChatModal({ isOpen, onClose, onReset, initialMessage }: ChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Obtener usuario del localStorage
    const user = localStorageService.getUser();

    // Función para hacer scroll al final
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Efecto para hacer scroll cuando hay nuevos mensajes
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cleanup del timeout al desmontar
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    // Efecto para manejar el mensaje inicial
    useEffect(() => {
        if (initialMessage && messages.length === 0 && isOpen && user?.uid) {
            const userMessage: Message = {
                id: Date.now().toString() + '_user',
                text: initialMessage,
                sender: 'user',
                timestamp: new Date()
            };

            setMessages([userMessage]);
            sendToClaudeAPI(initialMessage);
        }
    }, [initialMessage, isOpen, messages.length, user?.uid]);

    // Resetear estado cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setMessages([]);
            setInputValue('');
            setIsTyping(false);
            setConversationId(null); // Nueva conversación cada vez que se abre
            setError(null);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    }, [isOpen]);

    const stopAIResponse = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        setIsTyping(false);
    };

    const sendToClaudeAPI = async (message: string) => {
        if (!user?.uid) {
            setError('Usuario no autenticado');
            return;
        }

        setIsTyping(true);
        setError(null);

        try {
            const requestBody: any = {
                uid: user.uid,
                message: message
            };

            // Si ya tenemos una conversación, incluir el ID
            if (conversationId) {
                requestBody.conversation_id = conversationId;
            }

            console.log('Enviando a Claude API:', requestBody);

            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (data.success) {
                // Guardar el conversation_id para mensajes futuros
                if (data.conversation_id) {
                    setConversationId(data.conversation_id);
                }

                // Agregar respuesta de Claude
                const aiMessage: Message = {
                    id: Date.now().toString() + '_ai',
                    text: data.response,
                    sender: 'ai',
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, aiMessage]);

                console.log('Respuesta recibida de Claude:', {
                    conversation_id: data.conversation_id,
                    message_count: data.message_count,
                    is_new_conversation: data.is_new_conversation
                });

            } else {
                setError(data.error || 'Error al comunicarse con Claude');
                console.error('Error de la API:', data.error);
            }

        } catch (error) {
            console.error('Error enviando mensaje a Claude:', error);
            setError('Error de conexión con el servidor');
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        if (!user?.uid) {
            setError('Usuario no autenticado');
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString() + '_user',
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const messageToSend = inputValue;
        setInputValue('');

        // Enviar a Claude API
        sendToClaudeAPI(messageToSend);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleTextareaResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        const newHeight = Math.min(target.scrollHeight, 120);
        target.style.height = `${Math.max(newHeight, 50)}px`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9997]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal del Chat */}
                    <motion.div
                        className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-full max-w-4xl h-[80vh] bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/60 rounded-2xl shadow-2xl flex flex-col">
                            {/* Header del Modal */}
                            <div className="flex items-center justify-between p-4 border-b border-zinc-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">AI</span>
                                    </div>
                                    <div>
                                        <h2 className="text-white font-medium">Conversación con Claude</h2>
                                        {conversationId && (
                                            <p className="text-xs text-zinc-400">
                                                {messages.length > 0 ? 'Conversación activa' : 'Nueva conversación'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={onClose}
                                        className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
                                        title="Minimizar"
                                    >
                                        <Minimize2 size={18} />
                                    </button>
                                    <button
                                        onClick={onReset}
                                        className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
                                        title="Cerrar"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mx-4 mt-4 p-3 bg-red-900/50 border border-red-700/50 rounded-lg">
                                    <p className="text-red-300 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Área de Mensajes */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-6">
                                    {messages.map((message) => (
                                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className="max-w-[80%]">
                                                {message.sender === 'ai' && (
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">AI</span>
                                                        </div>
                                                        <span className="text-sm text-zinc-300">Claude</span>
                                                    </div>
                                                )}

                                                <div className={`p-4 rounded-2xl ${
                                                    message.sender === 'user'
                                                        ? 'bg-blue-600 text-white rounded-br-md'
                                                        : 'bg-zinc-800 text-zinc-100 rounded-bl-md'
                                                }`}>
                                                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                                                </div>

                                                {message.sender === 'user' && (
                                                    <div className="flex justify-end mt-2">
                                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">U</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="max-w-[80%]">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">AI</span>
                                                    </div>
                                                    <span className="text-sm text-zinc-300">Claude está escribiendo...</span>
                                                </div>
                                                <div className="bg-zinc-800 p-4 rounded-2xl rounded-bl-md">
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Input del Modal */}
                            <div className="border-t border-zinc-700/50 p-4">
                                <div className="relative">
                                    <textarea
                                        ref={textareaRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        onInput={handleTextareaResize}
                                        placeholder={user?.uid ? "Escribe tu mensaje..." : "Inicia sesión para chatear"}
                                        disabled={!user?.uid || isTyping}
                                        className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-4 py-3 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            lineHeight: '1.5',
                                            minHeight: '50px',
                                            height: '50px',
                                            maxHeight: '120px'
                                        }}
                                    />

                                    {isTyping ? (
                                        <button
                                            onClick={stopAIResponse}
                                            className="absolute right-3 bottom-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                                            title="Detener respuesta"
                                        >
                                            <Square size={16} />
                                        </button>
                                    ) : (
                                        inputValue.trim() && user?.uid && (
                                            <button
                                                onClick={handleSendMessage}
                                                className="absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                                                title="Enviar mensaje"
                                            >
                                                <Send size={16} />
                                            </button>
                                        )
                                    )}
                                </div>

                                <div className="text-xs text-zinc-500 mt-2 text-center">
                                    {user?.uid ?
                                        'Presiona Enter para enviar, Shift + Enter para nueva línea' :
                                        'Debes iniciar sesión para usar el chat'
                                    }
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}