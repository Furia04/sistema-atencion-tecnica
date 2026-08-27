'use client';

import React from 'react';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';
import { UserProfile } from '@/types';

interface HeaderProps {
  user: UserProfile;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-surface border-b border-outline-variant flex justify-between items-center w-full h-16 px-gutter z-30 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-low transition-all">
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar órdenes, clientes, IMEI o repuestos..."
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-full pl-9 pr-4 py-1.5 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
          />
        </div>
      </div>

      {/* Trailing Actions & Notifications */}
      <div className="flex items-center gap-3">
        <button
          className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all p-2 rounded-full relative"
          title="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error border border-surface" />
        </button>
        <button
          className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all p-2 rounded-full"
          title="Ayuda y Soporte"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
