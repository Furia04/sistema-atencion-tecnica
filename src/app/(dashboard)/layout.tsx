'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { Shop, UserProfile } from '@/types';
import { getCurrentUserProfile, fetchAllShopsForAdmin } from '@/lib/supabase/services';
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
  RefreshCcw,
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

  useEffect(() => {
    async function loadUserAndShopStatus() {
      setLoading(true);
      try {
        const profile = await getCurrentUserProfile();
        if (profile) {
          setUserProfile(profile);
        }

        const shops = await fetchAllShopsForAdmin();
        const currentShop = shops.find(
          (s) => s.owner_email === profile?.email || s.id === profile?.shop_id
        ) || shops[0];

        if (currentShop) {
          setUserShop(currentShop);
        }
      } catch (err) {
        console.warn('Cargado perfil con mock fallback');
      } finally {
        setLoading(false);
      }
    }
    loadUserAndShopStatus();
  }, []);

  // Determinar Estado de Bloqueo del Taller:
  // 1. Suspendido por el Administrador (active === false o subscription_status === 'canceled'/'past_due')
  const isSuspended = userShop ? (!userShop.active || userShop.subscription_status === 'canceled' || userShop.subscription_status === 'past_due') : false;

  // 2. Nuevo Usuario Registrado que Nunca Pagó (subscription_status === 'pending_payment')
  const isPendingPayment = userShop ? (userShop.subscription_status === 'pending_payment' && !userShop.active) : false;

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
            /* CASO 1: PANTALLA DE TALLER SUSPENDIDO / BLOQUEADO POR MORA */
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
                  El acceso a las órdenes de servicio, inventario y datos ha sido suspendido por falta de pago o vencimiento de la membresía mensual ($15.000 ARS/mes).
                </p>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 text-left space-y-3 font-mono-data text-xs">
                <div className="text-on-surface-variant text-[10px] uppercase font-bold">Datos para Reactivación por Transferencia Bancaria:</div>
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
                <a
                  href={`https://wa.me/?text=Hola,%20les%20escribo%20porque%20mi%20taller%20(${userShop?.name || 'Taller'})%20se%20encuentra%20suspendido%20y%20ya%20realicé%20la%20transferencia%20de%20%2415.000.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-title-sm text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Notificar Pago por WhatsApp
                </a>
                <Link
                  href="/checkout"
                  className="flex-1 bg-primary text-on-primary hover:bg-primary-container font-title-sm text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> Ir a Pasarela de Pago
                </Link>
              </div>
            </div>
          ) : isPendingPayment ? (
            /* CASO 2: PANTALLA DE PRIMER PAGO DE MEMBRESÍA PARA USUARIO NUEVO */
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
                  Para ingresar por primera vez a tu panel de atención técnica y habilitar la comanda de 80mm, completa el pago inicial de la membresía ($15.000 ARS/mes).
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
                <a
                  href={`https://wa.me/?text=Hola,%20acabo%20de%20registrar%20mi%20taller%20(${userShop?.name || 'Taller'})%20y%20deseo%20confirmar%20el%20pago.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest text-on-surface font-title-sm text-xs font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" /> Confirmar por WhatsApp
                </a>
              </div>
            </div>
          ) : (
            /* CASO 3: TALLER ACTIVO -> MOSTRAR PANEL NORMAL */
            children
          )}
        </main>
      </div>
    </div>
  );
}
