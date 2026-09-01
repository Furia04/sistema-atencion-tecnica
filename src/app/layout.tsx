import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JaTech - Software para técnicos',
  description: 'Sistema de gestión para talleres de reparación de electrónica, PC, telefonía y automotores.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-background text-on-surface font-sans min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
