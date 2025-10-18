interface ErrorMessageProps {
    error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
    if (!error) return null;

    return (
        <div className="text-xs text-zinc-600 mt-3 p-2 bg-red-950/20 border border-red-900/30 rounded-sm flex items-center gap-2">
            <span className="text-red-500">✗</span>
            {error}
        </div>
    );
}