'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import {
  ShieldCheck,
  Building2,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Lock,
  Unlock,
  CreditCard,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  LogOut,
  Plus,
  X,
  Save,
} from 'lucide-react';
import { Shop } from '@/types';
import { fetchAllShopsForAdmin, updateShopSubscriptionStatus } from '@/lib/supabase/services';

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedShopId, setCopiedShopId] = useState<string | null>(null);

  // Modal para agregar taller manualmente desde el Admin
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');

  const loadShops = async () => {
    setLoading(true);
    try {
      const realShops = await fetchAllShopsForAdmin();
      setShops(realShops || []);
    } catch (err) {
      console.error('Error al cargar talleres:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminSession = sessionStorage.getItem('prorepair_admin_session');
      if (adminSession !== 'authenticated_superadmin') {
        router.push('/admin/login');
        return;
      }
      setAuthorized(true);
    }

    loadShops();

    const handleShopUpdate = () => {
      loadShops();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('prorepair_shop_updated', handleShopUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('prorepair_shop_updated', handleShopUpdate);
      }
    };
  }, [router]);

  const handleAdminLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('prorepair_admin_session');
    }
    router.push('/admin/login');
  };

  const handleToggleActiveStatus = async (shop: Shop) => {
    const newActive = !shop.active;
    const newStatus = newActive ? 'active' : 'canceled';

    try {
      await updateShopSubscriptionStatus(shop.id, newStatus, newActive);
    } catch (err) {
      console.warn('Actualización local realizada');
    }

    setShops((prev) =>
      prev.map((s) =>
        s.id === shop.id
          ? { ...s, active: newActive, subscription_status: newStatus }
          : s
      )
    );
  };

  const handleMarkAsPaid = async (shop: Shop) => {
    try {
      await updateShopSubscriptionStatus(shop.id, 'active', true);
    } catch (err) {
      console.warn('Actualización local realizada');
    }

    setShops((prev) =>
      prev.map((s) =>
        s.id === shop.id
          ? { ...s, active: true, subscription_status: 'active' }
          : s
      )
    );
  };

  const handleManualAddShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName.trim() || !newOwnerEmail.trim()) return;

    const manualShopId = `shop-${Date.now()}`;
    const newShopObj: Shop = {
      id: manualShopId,
      name: newShopName.trim(),
      owner_email: newOwnerEmail.trim().toLowerCase(),
      subscription_status: 'active',
      plan_price: 15000,
      active: true,
      created_at: new Date().toISOString(),
      orders_count: 0,
    };

    if (typeof window !== 'undefined') {
      try {
        const storedStr = localStorage.getItem('prorepair_registered_shops');
        const existingShops: Shop[] = storedStr ? JSON.parse(storedStr) : [];
        const filtered = existingShops.filter((s) => s.owner_email.toLowerCase() !== newOwnerEmail.trim().toLowerCase());
        localStorage.setItem('prorepair_registered_shops', JSON.stringify([newShopObj, ...filtered]));

        // Guardar override permanente de activacion
        await updateShopSubscriptionStatus(manualShopId, 'active', true);
      } catch (err) {
        console.warn('Error al agregar taller manualmente');
      }
    }

    setShops((prev) => [newShopObj, ...prev]);
    setNewShopName('');
    setNewOwnerEmail('');
    setShowAddModal(false);
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-on-surface">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.owner_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalShops = shops.length;
  const activeShops = shops.filter((s) => s.active && s.subscription_status === 'active').length;
  const pendingShops = shops.filter((s) => !s.active || s.subscription_status === 'pending_payment').length;
  const estimatedMonthlySaaSRevenue = activeShops * 15000;

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans flex flex-col">
      {/* HEADER SUPER ADMIN CON BANDERAS DE ACCIÓN */}
      <header className="bg-surface-container border-b border-outline-variant px-6 h-20 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Logo size={40} textSubtitle="Panel de Control del Dueño (SaaS Admin)" />
          </Link>
          <span className="bg-purple-900/40 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase font-mono tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Super Admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-on-primary hover:bg-primary-container font-title-sm text-xs font-bold px-3.5 py-1.5 rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Alta Manual Taller
          </button>

          <button
            onClick={loadShops}
            className="p-2 bg-surface-bright text-on-surface hover:bg-surface-container-highest rounded-xl border border-outline-variant transition-colors"
            title="Recargar Lista de Talleres"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
          </button>

          <button
            onClick={handleAdminLogout}
            className="bg-error/20 hover:bg-error/30 text-error border border-error/30 px-3.5 py-1.5 rounded-xl font-title-sm text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Salir del Admin
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
        <div>
          <h1 className="font-display-lg text-3xl font-bold text-on-surface">
            Control Global de Talleres y Suscripciones
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
            Gestiona la activación, estado de pagos y bloqueo de acceso para cada taller registrado en ProRepair Ops.
          </p>
        </div>

        {/* MÉTRICAS CLAVE DEL SAAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container border border-outline-variant rounded-2xl p-5 space-y-2">
            <span className="font-label-caps text-xs text-on-surface-variant uppercase font-semibold">
              TOTAL TALLERES
            </span>
            <div className="font-display-lg text-3xl font-bold text-on-surface font-mono-data">
              {totalShops}
            </div>
            <span className="text-[11px] text-on-surface-variant">Registrados en la plataforma</span>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded-2xl p-5 space-y-2">
            <span className="font-label-caps text-xs text-emerald-400 uppercase font-semibold">
              TALLERES ACTIVOS (PAGADOS)
            </span>
            <div className="font-display-lg text-3xl font-bold text-emerald-400 font-mono-data">
              {activeShops}
            </div>
            <span className="text-[11px] text-on-surface-variant">Acceso total concedido</span>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded-2xl p-5 space-y-2">
            <span className="font-label-caps text-xs text-amber-400 uppercase font-semibold">
              PENDIENTES DE PAGO
            </span>
            <div className="font-display-lg text-3xl font-bold text-amber-400 font-mono-data">
              {pendingShops}
            </div>
            <span className="text-[11px] text-on-surface-variant">En pasarela checkout o suspendidos</span>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded-2xl p-5 space-y-2">
            <span className="font-label-caps text-xs text-primary uppercase font-semibold">
              INGRESOS MENSUALES (MRR)
            </span>
            <div className="font-display-lg text-3xl font-bold text-primary font-mono-data">
              ${estimatedMonthlySaaSRevenue.toLocaleString('es-AR')}
            </div>
            <span className="text-[11px] text-on-surface-variant">ARS acumulado estimado ($15.000/taller)</span>
          </div>
        </div>

        {/* TABLA DE GESTIÓN DE TALLERES */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden shadow-xl space-y-4">
          <div className="p-5 border-b border-outline-variant bg-surface-container-high flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="font-title-sm text-lg font-bold text-on-surface flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> Lista de Talleres Clientes ({shops.length})
            </h2>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre de taller o email..."
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2 pl-9 pr-3 text-xs text-on-surface"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs">Cargando talleres del sistema...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead className="bg-surface-container-highest border-b border-outline-variant font-label-caps text-on-surface-variant uppercase">
                  <tr>
                    <th className="p-4">Taller / Negocio</th>
                    <th className="p-4">Email Dueño</th>
                    <th className="p-4">Fecha Registro</th>
                    <th className="p-4">Órdenes Generadas</th>
                    <th className="p-4">Estado Suscripción</th>
                    <th className="p-4 text-center">Acceso Plataforma</th>
                    <th className="p-4 text-right">Acciones de Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 font-mono-data">
                  {filteredShops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-surface-container-high transition-colors">
                      <td className="p-4 font-sans font-bold text-on-surface text-sm">
                        {shop.name}
                      </td>
                      <td className="p-4 text-on-surface-variant font-semibold">{shop.owner_email}</td>
                      <td className="p-4 text-on-surface-variant">
                        {new Date(shop.created_at).toLocaleDateString('es-AR')}
                      </td>
                      <td className="p-4 font-bold text-primary text-center">
                        {shop.orders_count ?? 0}
                      </td>
                      <td className="p-4">
                        {shop.subscription_status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> Pagado ($15.000)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase text-[10px]">
                            <AlertTriangle className="w-3 h-3" /> Pendiente de Pago
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleActiveStatus(shop)}
                          className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 mx-auto text-[11px] ${
                            shop.active
                              ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
                              : 'bg-error/20 text-error border border-error/30 hover:bg-error/30'
                          }`}
                        >
                          {shop.active ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" /> Habilitado
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" /> Suspendido / Bloqueado
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {!shop.active || shop.subscription_status !== 'active' ? (
                          <button
                            onClick={() => handleMarkAsPaid(shop)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-[11px] shadow-sm transition-colors"
                          >
                            ✓ Aprobar Pago & Activar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleActiveStatus(shop)}
                            className="bg-error/20 hover:bg-error/30 text-error font-bold px-3 py-1 rounded-lg text-[11px] transition-colors"
                          >
                            Suspender Taller
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const link = `${window.location.origin}/checkout?shop_id=${shop.id}`;
                            navigator.clipboard.writeText(link);
                            setCopiedShopId(shop.id);
                            setTimeout(() => setCopiedShopId(null), 2000);
                          }}
                          className="bg-surface-bright border border-outline-variant hover:bg-surface-container-highest text-on-surface p-1.5 rounded-lg transition-colors inline-flex items-center"
                          title="Copiar Enlace de Cobro Checkout"
                        >
                          {copiedShopId === shop.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE ALTA MANUAL DE TALLER DESDE ADMIN */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleManualAddShop}
            className="bg-surface-container border border-outline-variant rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3">
              <h3 className="font-title-sm text-base font-bold text-primary flex items-center gap-2">
                <Plus className="w-5 h-5" /> Alta Manual de Taller
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-on-surface-variant uppercase mb-1">
                  Nombre del Taller / Negocio *
                </label>
                <input
                  type="text"
                  required
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                  placeholder="Ej: Electrónica Central"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant uppercase mb-1">
                  Email del Dueño *
                </label>
                <input
                  type="email"
                  required
                  value={newOwnerEmail}
                  onChange={(e) => setNewOwnerEmail(e.target.value)}
                  placeholder="dueno@taller.com"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-title-sm text-on-surface-variant hover:bg-surface-container-highest rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary text-on-primary font-title-sm text-xs font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" /> Dar de Alta & Activar Taller
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
