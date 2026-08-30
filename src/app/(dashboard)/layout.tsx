'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { Shop, UserProfile } from '@/types';
import { getCurrentUserProfile, fetchAllShopsForAdmin, forceUnlockShopByEmail } from '@/lib/supabase/services';
import {
  Lock,
  AlertTriangle,
  CreditCard,
  Building2,
  Check,
  Copy,
  MessageSquare,
  Zap,
  Loader2,
  Unlock,
} from 'lucide-react';

const MOCK_DEFAULT_USER: UserProfile = {
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
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_DEFAULT_USER);
  const [userShop, setUserShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedAlias, setCopiedAlias] = useState(false);

  const loadUserAndShopStatus = async () => {
    setLoading(true);
    try {
      const profile = await getCurrentUserProfile();
      if (profile) {
        setUserProfile(profile);
      }

      const shops = await fetchAllShopsForAdmin();
      const profileEmail = (profile?.email || 'admin@prorepair.com').toLowerCase();

      // 1. Buscar taller correspondiente por email o ID
      let currentShop = shops.find(
        (s) => (s.owner_email && s.owner_email.toLowerCase() === profileEmail) || s.id === profile?.shop_id
      ) || shops[0];

      // 2. Verificar sobreescritura directa en localStorage si existe
      if (typeof window !== 'undefined' && profileEmail) {
        try {
          const overridesStr = localStorage.getItem('prorepair_shop_overrides');
          if (overridesStr) {
            const overrides: Record<string, { subscription_status: any; active: boolean }> = JSON.parse(overridesStr);
            const overrideData = overrides[profileEmail] || (currentShop ? overrides[currentShop.id] : null);

            if (overrideData && currentShop) {
              currentShop = {
                ...currentShop,
                subscription_status: overrideData.subscription_status,
                active: overrideData.active,
              };
            }
          }
        } catch (e) {
          console.warn('Error al verificar overrides locales');
        }
      }

      if (currentShop) {
        setUserShop(currentShop);
      }
    } catch (err) {
      console.warn('Cargado perfil con mock fallback');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserAndShopStatus();

    const handleShopUpdate = () => {
      loadUserAndShopStatus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('prorepair_shop_updated', handleShopUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('prorepair_shop_updated', handleShopUpdate);
      }
    };
  }, []);

  const handleForceReactivate = () => {
    if (userProfile?.email) {
      forceUnlockShopByEmail(userProfile.email);
    }
    loadUserAndShopStatus();
  };

  // EVALUACIÓN ESTRICTA DEL ESTADO DEL TALLER:
  // 1. Taller Suspendido / Dado de baja por el Administrador (active === false o subscription_status === 'canceled'/'past_due')
  const isSuspended = userShop
    ? (!userShop.active || userShop.subscription_status === 'canceled' || userShop.subscription_status === 'past_due')
    : false;

  // 2. Nuevo Usuario Registrado que Nunca Pagó (subscription_status === 'pending_payment' y no activo)
  const isPendingPayment = userShop
    ? (userShop.subscription_status === 'pending_payment' && !userShop.active)
    : false;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface font-sans">
      {/* Sidebar Desplegable / Drawer */}
      <Sidebar
        user={userProfile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Contenedor Principal a Ancho Completo */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          user={userProfile}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-container-margin bg-surface-container-lowest relative">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="font-body-sm text-xs">Verificando estado de membresía del taller...</p>
            </div>
          ) : isSuspended ? (
            /* CASO 1: PANTALLA DE TALLER SUSPENDIDO / DADO DE BAJA */
            <div className="max-w-2xl mx-auto my-8 bg-surface-container border-2 border-error/40 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-error/20 text-error flex items-center justify-center mx-auto border border-error/30 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="font-label-caps text-xs text-error font-bold uppercase tracking-widest">
                  Acceso Restringido
                </span>
                <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface">
                  Tu Taller Se Encuentra Suspendido
                </h2>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
                  El acceso a las órdenes de servicio, inventario y datos ha sido suspendido desde el panel de administración por falta de pago o baja de membresía ($15.000 ARS/mes).
                </p>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 text-left space-y-3 font-mono-data text-xs">
                <div className="text-on-surface-variant text-[10px] uppercase font-bold">Datos para Reactivación por Transferencia:</div>
                <div className="flex justify-between items-center bg-surface-container p-3 rounded-xl border border-outline-variant/40">
                  <div>
                    <div className="text-on-surface font-bold text-sm">PROREPAIR.OPS.MP</div>
                    <div className="text-on-surface-variant text-[10px]">MercadoPago / CBU • Titular: ProRepair Ops SRL</div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('PROREPAIR.OPS.MP');
                      setCopiedAlias(true);
                      setTimeout(() => setCopiedAlias(false), 2000);
                    }}
                    className="px-3 py-1.5 bg-surface-bright text-on-surface border border-outline-variant rounded-lg hover:bg-surface-container-highest text-[11px] font-bold flex items-center gap-1"
                  >
                    {copiedAlias ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
                    {copiedAlias ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleForceReactivate}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-title-sm text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" /> Desbloquear & Reactivar Mi Taller
                </button>
                <Link
                  href="/checkout"
                  className="flex-1 bg-primary text-on-primary hover:bg-primary-container font-title-sm text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> Ir a Pasarela de Pago
                </Link>
              </div>
            </div>
          ) : isPendingPayment ? (
            /* CASO 2: PANTALLA DE PRIMER PAGO PARA USUARIO NUEVO */
            <div className="max-w-2xl mx-auto my-8 bg-surface-container border-2 border-primary/40 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto border border-primary/30 shadow-inner">
                <Zap className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest">
                  Activación Inicial Requerida
                </span>
                <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface">
                  ¡Bienvenido a ProRepair Ops!
                </h2>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
                  Para ingresar por primera vez a tu panel y habilitar la comanda de 80mm, completa el pago inicial de la membresía ($15.000 ARS/mes).
                </p>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 text-left space-y-3 font-mono-data text-xs">
                <div className="text-on-surface-variant text-[10px] uppercase font-bold">Transferencia Bancaria Directa:</div>
                <div className="flex justify-between items-center bg-surface-container p-3 rounded-xl border border-outline-variant/40">
                  <div>
                    <div className="text-on-surface font-bold text-sm">PROREPAIR.OPS.MP</div>
                    <div className="text-on-surface-variant text-[10px]">MercadoPago / CBU • $15.000 ARS</div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('PROREPAIR.OPS.MP');
                      setCopiedAlias(true);
                      setTimeout(() => setCopiedAlias(false), 2000);
                    }}
                    className="px-3 py-1.5 bg-surface-bright text-on-surface border border-outline-variant rounded-lg hover:bg-surface-container-highest text-[11px] font-bold flex items-center gap-1"
                  >
                    {copiedAlias ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
                    {copiedAlias ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/checkout"
                  className="flex-1 bg-primary text-on-primary hover:bg-primary-container font-title-sm text-xs font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> Ir a Pasarela de Pago ($15.000)
                </Link>
                <button
                  onClick={handleForceReactivate}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-title-sm text-xs font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4 text-white" /> Activar Mi Taller
                </button>
              </div>
            </div>
          ) : (
            /* CASO 3: TALLER ACTIVO -> PANEL DESBLOQUEADO */
            children
          )}
        </main>
      </div>
    </div>
  );
}
