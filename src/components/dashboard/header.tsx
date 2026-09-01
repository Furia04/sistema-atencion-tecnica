'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Menu, LogOut } from 'lucide-react';
import { UserProfile } from '@/types';

interface HeaderProps {
  user: UserProfile;
  onToggleSidebar?: () => void;
}

export function Header({ user, onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-surface border-b border-outline-variant flex justify-between items-center w-full h-16 px-gutter z-30 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {/* Botón de Menú Hamburguesa */}
        <button
          onClick={onToggleSidebar}
          className="text-on-surface-variant hover:text-on-surface p-2 rounded-lg hover:bg-surface-container-high transition-all flex items-center justify-center border border-outline-variant/50"
          title="Abrir / Cerrar Menú"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>

        {/* Buscador Global */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar órdenes, clientes, DNI, IMEI o repuestos..."
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-full pl-9 pr-4 py-1.5 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
          />
        </div>
      </div>

      {/* Acciones del Header */}
      <div className="flex items-center gap-3">
        {/* Enlace Salir / Iniciar Sesión */}
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-error hover:bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant/50 transition-colors font-semibold"
          title="Cerrar Sesión / Cambiar de Usuario"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Salir</span>
        </Link>
      </div>
    </header>
  );
}
