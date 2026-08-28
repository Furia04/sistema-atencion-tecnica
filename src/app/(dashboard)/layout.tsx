'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { UserProfile } from '@/types';

const MOCK_USER: UserProfile = {
  id: 'user-001',
  email: 'admin@prorepair.com',
  full_name: 'Carlos Dueño',
  role: 'owner',
  shop_id: 'shop-north-station',
  can_view_financials: true,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      {/* Sidebar Desplegable / Drawer */}
      <Sidebar
        user={MOCK_USER}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Contenedor Principal a Ancho Completo */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          user={MOCK_USER}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-container-margin bg-surface-container-lowest">
          {children}
        </main>
      </div>
    </div>
  );
}
