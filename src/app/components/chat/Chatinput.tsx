'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface ChatInputProps {
    onSendMessage?: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [displayText, setDisplayText] = useState('');
    const [hasTyped, setHasTyped] = useState(false);
    const [subtitleText, setSubtitleText] = useState('');
    const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'buenos días, julian';
        if (hour < 18) return 'buenas tardes, julian';
        return 'buenas noches, julian';
    };

    const subtitles = [
        '¿en qué te puedo ayudar?',
        '¿qué necesitas saber?',
        '¿tienes alguna pregunta?',
        '¿en qué proyecto trabajas?',
        '¿necesitas escribir algo?'
    ];

    const fullText = getGreeting();

    // Auto-resize textarea con transición suave
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            // Resetear altura para calcular correctamente
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const minHeight = 60; // altura mínima
            const maxHeight = 120; // altura máxima

            // Calcular nueva altura
            const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

            // Aplicar altura con transición suave
            textareaRef.current.style.height = `${newHeight}px`;

            // Mostrar scrollbar solo si alcanza la altura máxima
            if (scrollHeight > maxHeight) {
                textareaRef.current.style.overflowY = 'auto';
            } else {
                textareaRef.current.style.overflowY = 'hidden';
            }
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [inputValue]);

    useEffect(() => {
        if (!hasTyped) {
            let timeout: NodeJS.Timeout;

            if (displayText.length < fullText.length) {
                timeout = setTimeout(() => {
                    setDisplayText(fullText.slice(0, displayText.length + 1));
                }, 80);
            } else {
                setHasTyped(true);
            }

            return () => clearTimeout(timeout);
        }
    }, [displayText, fullText, hasTyped]);

    useEffect(() => {
        if (hasTyped) {
            let timeout: NodeJS.Timeout;
            const currentText = subtitles[currentSubtitleIndex];

            if (!isDeleting && subtitleText.length < currentText.length) {
                timeout = setTimeout(() => {
                    setSubtitleText(currentText.slice(0, subtitleText.length + 1));
                }, 100);
            } else if (!isDeleting && subtitleText.length === currentText.length) {
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, 2000);
            } else if (isDeleting && subtitleText.length > 0) {
                timeout = setTimeout(() => {
                    setSubtitleText(subtitleText.slice(0, -1));
                }, 50);
            } else if (isDeleting && subtitleText.length === 0) {
                setIsDeleting(false);
                setCurrentSubtitleIndex((prev) => (prev + 1) % subtitles.length);
            }

            return () => clearTimeout(timeout);
        }
    }, [subtitleText, isDeleting, currentSubtitleIndex, hasTyped, subtitles]);

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            onSendMessage?.(inputValue);
            console.log('Mensaje enviado:', inputValue);

            // Limpiar input con transición suave
            setInputValue('');

            // Pequeño delay para permitir que la transición se complete
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.style.height = '60px'; // volver a altura mínima
                }
            }, 50);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="w-full max-w-lg">
            <div className="text-center mb-5">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
                        <Sparkles size={20} className="text-white/80" />
                    </div>
                </div>

                <h1 className="text-3xl font-light text-white/90 tracking-wide min-h-[2.5rem] flex items-center justify-center">
                    {displayText}
                    {!hasTyped && (
                        <span className="animate-pulse ml-1 text-white/60">|</span>
                    )}
                </h1>

                <p className="text-sm text-white/50 mt-3 tracking-wide min-h-[1.25rem] flex items-center justify-center">
                    {subtitleText}
                    {hasTyped && (
                        <span className="animate-pulse ml-1 text-white/40">|</span>
                    )}
                </p>
            </div>

            <div className="relative group">
                <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="escribe tu mensaje aquí..."
                    className="w-full bg-zinc-900/50 border border-zinc-700/30 rounded-xl px-6 py-4 pr-14 text-white/90 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 backdrop-blur-sm text-lg font-light tracking-wide resize-none leading-relaxed custom-scrollbar transition-all duration-200 ease-out"
                    style={{
                        fontFamily: 'inherit',
                        lineHeight: '1.5',
                        minHeight: '60px',
                        height: '60px' // altura inicial fija
                    }}
                />

                {inputValue && (
                    <button
                        onClick={handleSendMessage}
                        className="absolute right-4 bottom-4 bg-zinc-800 hover:bg-zinc-700 text-white/90 p-2 rounded-lg border border-zinc-600/30 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                    </button>
                )}
            </div>

            <div className="text-xs text-zinc-500 mt-2 text-center">
                Presiona Enter para enviar, Shift + Enter para nueva línea
            </div>
        </div>
    );
}