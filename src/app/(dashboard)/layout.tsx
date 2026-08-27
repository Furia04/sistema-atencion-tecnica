import React from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { UserProfile } from '@/types';

// Mock user loader - en producción se consulta desde Supabase Auth / Cookie Session
async function getAuthenticatedUser(): Promise<UserProfile> {
  return {
    id: 'user-001',
    email: 'admin@prorepair.com',
    full_name: 'Tech J. Doe',
    role: 'owner', // 'owner' o 'technician'
    shop_id: 'shop-north-station',
    can_view_financials: true,
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar user={user} />

      {/* Contenedor principal con Header sticky y contenido scrolleable */}
      <div className="flex-1 md:ml-sidebar-width flex flex-col min-w-0 h-full overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-container-margin bg-surface-container-lowest">
          {children}
        </main>
      </div>
    </div>
  );
}
