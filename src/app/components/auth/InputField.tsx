import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
    icon: LucideIcon;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
                                       icon: Icon,
                                       label,
                                       type,
                                       placeholder,
                                       value,
                                       onChange,
                                   }: InputFieldProps) {
    return (
        <div>
            <div className="flex items-center gap-2 text-xs text-zinc-600 mb-2">
                <Icon className="w-3 h-3" />
                <span>{label}</span>
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-xs bg-black/50 border border-zinc-300/50 rounded-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600/20 text-zinc-400 placeholder-zinc-300/60 transition-all"
            />
        </div>
    );
}