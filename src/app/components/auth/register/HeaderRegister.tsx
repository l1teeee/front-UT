'use client';

import {Sparkles} from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function Header() {
    const [displayText, setDisplayText] = useState('');
    const fullText = '~/register';
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (!isDeleting && displayText.length < fullText.length) {
            timeout = setTimeout(() => {
                setDisplayText(fullText.slice(0, displayText.length + 1));
            }, 100);
        } else if (!isDeleting && displayText.length === fullText.length) {
            timeout = setTimeout(() => {
                setIsDeleting(true);
            }, 2000);
        } else if (isDeleting && displayText.length > 0) {
            timeout = setTimeout(() => {
                setDisplayText(displayText.slice(0, -1));
            }, 80);
        } else if (isDeleting && displayText.length === 0) {
            setIsDeleting(false);
        }

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting]);

    return (
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 mb-4 bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 rounded-lg">
                <Sparkles size={18} className="text-white/80" />
            </div>
            <h1 className="text-lg font-semibold text-zinc-200 tracking-tight min-h-6 flex items-center justify-center">
                {displayText}
                <span className="animate-pulse ml-0.5">|</span>
            </h1>
            <p className="text-xs text-zinc-600 mt-1">Conoce el futuro</p>
        </div>
    );
}