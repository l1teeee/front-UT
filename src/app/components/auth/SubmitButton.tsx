import SocialButtons from '@/app/components/auth/SocialButtons';
import { useNavigation } from '@/app/hook/useNavigation';

interface SubmitButtonProps {
    isLoading: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SubmitButton({ isLoading, onClick }: SubmitButtonProps) {
    const { goToDashboard } = useNavigation();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick(e);
        goToDashboard();
    };

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={isLoading}
                className="w-full mt-5 px-3 py-2 text-xs font-medium border border-zinc-700 bg-gradient-to-r from-zinc-900 to-black text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
            >
                {isLoading ? '⟳ procesando...' : '→ acceder'}
            </button>
            <SocialButtons />
        </div>
    );
}