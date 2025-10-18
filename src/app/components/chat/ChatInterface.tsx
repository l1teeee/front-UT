'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface ChatInterfaceProps {
    initialMessage?: string;
    onSendMessage?: (message: string) => void;
}

export default function ChatInterface({ initialMessage, onSendMessage }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [canSendMessage, setCanSendMessage] = useState(true);
    const [cooldownTime, setCooldownTime] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Inicializar con el mensaje inicial si existe
    useEffect(() => {
        if (initialMessage && messages.length === 0) {
            const userMessage: Message = {
                id: Date.now().toString() + '_user',
                text: initialMessage,
                sender: 'user',
                timestamp: new Date()
            };

            setMessages([userMessage]);

            // Simular respuesta AI después del mensaje inicial
            setTimeout(() => {
                simulateAIResponse();
            }, 500);
        }
    }, [initialMessage]);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-resize textarea
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 120;

            if (scrollHeight <= maxHeight) {
                textareaRef.current.style.height = `${scrollHeight}px`;
                textareaRef.current.style.overflowY = 'hidden';
            } else {
                textareaRef.current.style.height = `${maxHeight}px`;
                textareaRef.current.style.overflowY = 'auto';
            }
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [inputValue]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (cooldownIntervalRef.current) {
                clearInterval(cooldownIntervalRef.current);
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    // Start cooldown
    const startCooldown = () => {
        setCanSendMessage(false);
        setCooldownTime(5);

        cooldownIntervalRef.current = setInterval(() => {
            setCooldownTime((prev) => {
                if (prev <= 1) {
                    setCanSendMessage(true);
                    if (cooldownIntervalRef.current) {
                        clearInterval(cooldownIntervalRef.current);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Stop AI response
    const stopAIResponse = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        setIsTyping(false);
        startCooldown();
    };

    const simulateAIResponse = () => {
        setIsTyping(true);

        typingTimeoutRef.current = setTimeout(() => {
            const aiMessage: Message = {
                id: Date.now().toString() + '_ai',
                text: "Hola",
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
            startCooldown();
        }, 1500);
    };

    const handleSendMessage = () => {
        if (!inputValue.trim() || !canSendMessage) return;

        // Crear mensaje del usuario
        const userMessage: Message = {
            id: Date.now().toString() + '_user',
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        // Agregar mensaje del usuario
        setMessages(prev => [...prev, userMessage]);

        // Llamar callback si existe
        onSendMessage?.(inputValue);

        // Limpiar input
        setInputValue('');

        // Simular respuesta AI
        simulateAIResponse();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && canSendMessage) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col bg-transparent text-white h-full">
            {/* Contenedor de mensajes con scroll funcional */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Espaciador para empujar contenido hacia abajo SOLO cuando hay pocos mensajes */}
                        {messages.length <= 3 && <div className="h-96"></div>}

                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] group`}>
                                        {message.sender === 'ai' && (
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-semibold">AI</span>
                                                </div>
                                                <span className="text-sm text-zinc-400">Claude</span>
                                            </div>
                                        )}

                                        <div className={`p-3 rounded-2xl ${
                                            message.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-sm'
                                                : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
                                        }`}>
                                            <p className="whitespace-pre-wrap break-words">{message.text}</p>
                                        </div>

                                        {message.sender === 'user' && (
                                            <div className="flex justify-end mt-1">
                                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-semibold">U</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%]">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">AI</span>
                                            </div>
                                            <span className="text-sm text-zinc-400">Claude</span>
                                        </div>
                                        <div className="bg-zinc-800 p-3 rounded-2xl rounded-bl-sm">
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
                </div>
            </div>

            {/* Input fijo en la parte inferior */}
            <div className="flex-shrink-0 border-t border-zinc-800 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={canSendMessage ? "Escribe tu mensaje..." : `Espera ${cooldownTime}s para enviar otro mensaje...`}
                            disabled={!canSendMessage}
                            className={`w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[50px] max-h-32 transition-all ${
                                !canSendMessage ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                            style={{
                                lineHeight: '1.5',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#4a5568 #2d3748'
                            }}
                        />

                        {/* Botón dinámico: Send cuando puede enviar, Stop cuando está escribiendo */}
                        {isTyping ? (
                            <button
                                onClick={stopAIResponse}
                                className="absolute right-3 bottom-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                                title="Detener respuesta"
                            >
                                <Square size={16} />
                            </button>
                        ) : (
                            inputValue.trim() && canSendMessage && (
                                <button
                                    onClick={handleSendMessage}
                                    className="absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                                    title="Enviar mensaje"
                                >
                                    <Send size={16} />
                                </button>
                            )
                        )}

                        {/* Mostrar countdown si está en cooldown */}
                        {!canSendMessage && !isTyping && (
                            <div className="absolute right-3 bottom-3 bg-zinc-600 text-white p-2 rounded-lg text-sm font-mono">
                                {cooldownTime}s
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-zinc-500 mt-2 text-center">
                        {canSendMessage
                            ? "Presiona Enter para enviar, Shift + Enter para nueva línea"
                            : `Espera ${cooldownTime} segundos antes de enviar otro mensaje`
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}