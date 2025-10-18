import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Mi App Next.js',
    description: 'Aplicación con Router Provider',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
        <body>
            {children}
        </body>
        </html>
    );
}