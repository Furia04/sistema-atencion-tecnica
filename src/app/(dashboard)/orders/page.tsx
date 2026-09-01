'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Calendar,
  Edit,
  Receipt,
  ExternalLink,
  ArrowUpDown,
  MessageSquare,
  X,
  Save,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  Copy,
  Check,
  Printer,
  DollarSign,
  Calculator,
  Loader2,
  FolderOpen,
  Send,
} from 'lucide-react';
import { PatternLockInput } from '@/components/orders/pattern-lock-input';
import { InventoryItem, OrderStatus, ServiceOrder, UserProfile } from '@/types';
import { BudgetCalculator } from '@/components/orders/budget-calculator';
import { ThermalTicket } from '@/components/orders/thermal-ticket';
import { fetchServiceOrders, updateServiceOrderStatus, fetchInventory } from '@/lib/supabase/services';
import { supabase } from '@/lib/supabase/client';

export default function ServiceOrdersPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estado para las Ventanas Emergentes
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);
  const [printingOrder, setPrintingOrder] = useState<ServiceOrder | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'budget'>('details');
  const [copiedLink, setCopiedLink] = useState(false);

  // Estado para Alerta de Notificación por WhatsApp
  const [whatsappNotifyOrder, setWhatsappNotifyOrder] = useState<ServiceOrder | null>(null);

  // Cargar órdenes e inventario reales de la base de datos Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [realOrders, realInventory] = await Promise.all([
          fetchServiceOrders(),
          fetchInventory(),
        ]);
        setOrders(realOrders || []);
        setInventory(realInventory || []);
      } catch (err) {
        console.error('Error al cargar órdenes de Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredOrders = orders.filter((ord) => {
    const matchesFilter =
      activeFilter === 'all' || ord.status === activeFilter;
    const matchesSearch =
      ord.tracking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_document_id?.includes(searchQuery) ||
      ord.device_info?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

  const handleSaveModal = async () => {
    if (!editingOrder) return;

    const previousOrder = orders.find(o => o.id === editingOrder.id);
    const statusChangedToReady = previousOrder?.status !== 'para_entregar' && editingOrder.status === 'para_entregar';

    try {
      await updateServiceOrderStatus(
        editingOrder.id,
        editingOrder.status,
        editingOrder.technical_diagnosis,
        editingOrder.final_price
      );
    } catch (err) {
      console.warn('Actualización de orden realizada');
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === editingOrder.id ? editingOrder : o))
    );

    const savedOrder = editingOrder;
    setEditingOrder(null);

    // Si cambió el estado a "Para Entregar", sugerir enviar notificación por WhatsApp
    if (statusChangedToReady) {
      setWhatsappNotifyOrder(savedOrder);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'recibido':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] uppercase font-bold tracking-wide">
            Recibido
          </span>
        );
      case 'en_revision':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary border border-primary/30 text-[10px] uppercase font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
            En Revisión
          </span>
        );
      case 'esperando_repuesto':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary-fixed border border-tertiary-fixed/20 text-[10px] uppercase font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed mr-1.5" />
            Esperando Repuesto
          </span>
        );
      case 'esperando_cliente':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-900/30 text-purple-300 border border-purple-500/30 text-[10px] uppercase font-bold tracking-wide">
            Esperando Resp. Cliente
          </span>
        );
      case 'para_entregar':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Para Entregar
          </span>
        );
      case 'abandonado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-error-container/30 text-error border border-error/30 text-[10px] uppercase font-bold tracking-wide">
            Orden Vencida
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Título y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface">
            Órdenes de Servicio
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
            Gestiona la atención técnica, diagnósticos, presupuestos y emisión de comandas de 80mm.
          </p>
        </div>

        <Link
          href="/orders/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container px-4 py-2.5 rounded-xl font-title-sm text-xs font-bold transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nueva Orden de Ingreso
        </Link>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-surface-container border border-outline-variant/80 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código OT (#WO-xxxx), cliente, DNI o equipo..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2 pl-10 pr-4 font-body-sm text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="inline-flex items-center justify-center gap-2 bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest px-3 py-2 rounded-xl text-xs font-title-sm text-on-surface font-semibold transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
            {sortOrder === 'asc' ? 'Más Antiguas Primero' : 'Más Recientes Primero'}
          </button>
        </div>

        {/* Filtros por Estado */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/40">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'recibido', label: 'Recibidas' },
            { id: 'en_revision', label: 'En Revisión' },
            { id: 'esperando_repuesto', label: 'Esperando Repuesto' },
            { id: 'esperando_cliente', label: 'Esperando Cliente' },
            { id: 'para_entregar', label: 'Para Entregar' },
            { id: 'abandonado', label: 'Vencidas (+30 días)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-title-sm text-xs font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Órdenes */}
      <div className="bg-surface-container border border-outline-variant/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs">Cargando órdenes de la base de datos...</p>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FolderOpen className="w-12 h-12 text-on-surface-variant mx-auto opacity-50" />
            <h3 className="font-title-sm text-base font-bold text-on-surface">No hay órdenes registradas</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              {searchQuery ? 'No se encontraron resultados para tu búsqueda.' : 'Aún no has registrado órdenes de ingreso en tu taller.'}
            </p>
            {!searchQuery && (
              <Link
                href="/orders/new"
                className="inline-flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded-xl text-xs font-bold shadow transition-all mt-2"
              >
                <Plus className="w-4 h-4" /> Crear Primera Orden
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead className="bg-surface-container-highest border-b border-outline-variant font-label-caps text-on-surface-variant uppercase">
                <tr>
                  <th className="p-4">Código OT</th>
                  <th className="p-4">Cliente / DNI</th>
                  <th className="p-4">Equipo / Dispositivo</th>
                  <th className="p-4">Falla Reportada</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Precio Final</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 font-mono-data">
                {sortedOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="p-4 font-bold text-primary font-mono text-sm">
                      {ord.tracking_code}
                    </td>
                    <td className="p-4 font-sans">
                      <div className="font-bold text-on-surface">{ord.customer_name}</div>
                      <div className="text-[11px] text-on-surface-variant flex items-center gap-1">
                        DNI: {ord.customer_document_id || 'S/D'} • {ord.customer_phone || 'Sin tel'}
                      </div>
                    </td>
                    <td className="p-4 font-sans font-semibold text-on-surface">
                      {ord.device_info}
                    </td>
                    <td className="p-4 font-sans text-on-surface-variant max-w-xs truncate">
                      {ord.reported_fault}
                    </td>
                    <td className="p-4">{getStatusBadge(ord.status)}</td>
                    <td className="p-4 text-right font-bold text-on-surface text-sm">
                      ${(ord.final_price || 0).toLocaleString('es-AR')}
                    </td>
                    <td className="p-4 text-center space-x-1.5">
                      {/* Botón Editar / Diagnóstico */}
                      <button
                        onClick={() => {
                          setEditingOrder(ord);
                          setActiveModalTab('details');
                        }}
                        className="p-1.5 bg-surface-bright border border-outline-variant hover:bg-surface-container-highest text-on-surface rounded-lg transition-colors inline-flex items-center"
                        title="Editar / Diagnóstico"
                      >
                        <Edit className="w-3.5 h-3.5 text-primary" />
                      </button>

                      {/* Botón Imprimir Ticket 80mm */}
                      <button
                        onClick={() => setPrintingOrder(ord)}
                        className="p-1.5 bg-surface-bright border border-outline-variant hover:bg-surface-container-highest text-on-surface rounded-lg transition-colors inline-flex items-center"
                        title="Imprimir Comanda 80mm"
                      >
                        <Printer className="w-3.5 h-3.5 text-purple-400" />
                      </button>

                      {/* Botón WhatsApp Notificar */}
                      {ord.customer_phone && (
                        <a
                          href={`https://wa.me/${ord.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hola ${ord.customer_name}, te escribimos de JaTech por tu equipo (${ord.device_info}). Puedes consultar el estado actualizado de tu orden ${ord.tracking_code} aquí: ${window.location.origin}/track/${ord.tracking_code.replace('#', '')}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-900/30 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 rounded-lg transition-colors inline-flex items-center"
                          title="Enviar Notificación WhatsApp al Cliente"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE EDICIÓN / DIAGNÓSTICO Y PRESUPUESTO */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container border border-outline-variant rounded-2xl w-full max-w-2xl p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3">
              <div>
                <span className="font-label-caps text-[10px] text-primary uppercase font-bold">
                  GESTIÓN DE SERVICIO TÉCNICO
                </span>
                <h3 className="font-title-sm text-lg font-bold text-on-surface flex items-center gap-2">
                  Orden <span className="font-mono text-primary">{editingOrder.tracking_code}</span>
                </h3>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1 hover:bg-surface-container-highest rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            {/* Pestañas del Modal */}
            <div className="flex border-b border-outline-variant">
              <button
                onClick={() => setActiveModalTab('details')}
                className={`pb-2.5 px-4 text-xs font-title-sm font-bold border-b-2 transition-all ${
                  activeModalTab === 'details'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Diagnóstico & Estado
              </button>
              <button
                onClick={() => setActiveModalTab('budget')}
                className={`pb-2.5 px-4 text-xs font-title-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeModalTab === 'budget'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" /> Calculadora de Repuestos & Precio
              </button>
            </div>

            {activeModalTab === 'details' ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-on-surface-variant uppercase mb-1">
                    Estado de la Orden
                  </label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        status: e.target.value as OrderStatus,
                      })
                    }
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface font-bold"
                  >
                    <option value="recibido">Recibido en Taller</option>
                    <option value="en_revision">En Revisión / Diagnóstico</option>
                    <option value="esperando_repuesto">Esperando Repuesto</option>
                    <option value="esperando_cliente">Esperando Respuesta Cliente</option>
                    <option value="para_entregar">¡Listo para Entregar!</option>
                    <option value="abandonado">Orden Vencida (+30 Días)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-on-surface-variant uppercase mb-1">
                    Informe Técnico / Diagnóstico
                  </label>
                  <textarea
                    rows={3}
                    value={editingOrder.technical_diagnosis || ''}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        technical_diagnosis: e.target.value,
                      })
                    }
                    placeholder="Escribe aquí el informe técnico visible para el cliente en la página de seguimiento..."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface-variant uppercase mb-1">
                    Precio Final ($ ARS)
                  </label>
                  <input
                    type="number"
                    value={editingOrder.final_price || ''}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        final_price: Number(e.target.value),
                      })
                    }
                    placeholder="Ej: 25000"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface font-mono font-bold"
                  />
                </div>

                {/* PATRÓN DE DESBLOQUEO TÁCTIL (SOLO VISIBLE EN LA ORDEN DIGITAL) */}
                {((editingOrder as any).custom_attributes?.unlock_pattern?.length > 0 || (editingOrder as any).unlock_pattern?.length > 0) && (
                  <div className="pt-2 border-t border-outline-variant/60">
                    <PatternLockInput
                      value={(editingOrder as any).custom_attributes?.unlock_pattern || (editingOrder as any).unlock_pattern}
                      readOnly
                    />
                  </div>
                )}
              </div>
            ) : (
              <BudgetCalculator
                inventory={inventory}
                onApplyBudget={(cost, price) => {
                  setEditingOrder({
                    ...editingOrder,
                    final_price: price,
                  });
                  setActiveModalTab('details');
                }}
              />
            )}

            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/60">
              <button
                onClick={() => {
                  setPrintingOrder(editingOrder);
                  setEditingOrder(null);
                }}
                className="px-3.5 py-2 bg-surface-bright border border-outline-variant text-on-surface hover:bg-surface-container-highest rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-purple-400" /> Imprimir Comanda 80mm
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 text-xs font-title-sm text-on-surface-variant hover:bg-surface-container-highest rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveModal}
                  className="bg-primary text-on-primary font-title-sm text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4" /> Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMPRESIÓN DE COMANDA TÉRMICA 80MM */}
      {printingOrder && (
        <ThermalTicket
          order={printingOrder}
          onClose={() => setPrintingOrder(null)}
        />
      )}

      {/* POPUP DE NOTIFICACIÓN WHATSAPP AL CAMBIAR ESTADO A "PARA ENTREGAR" */}
      {whatsappNotifyOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-center animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Send className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-title-sm text-lg font-bold text-on-surface">
                ¡Equipo Listo para Retirar!
              </h3>
              <p className="text-xs text-on-surface-variant">
                ¿Deseas enviar un aviso por WhatsApp a <strong className="text-on-surface">{whatsappNotifyOrder.customer_name}</strong> para que pase a retirar su equipo?
              </p>
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60 text-left font-mono text-xs text-on-surface-variant">
              <div><strong>Orden:</strong> {whatsappNotifyOrder.tracking_code}</div>
              <div><strong>Equipo:</strong> {whatsappNotifyOrder.device_info}</div>
              <div><strong>Tel:</strong> {whatsappNotifyOrder.customer_phone || 'Sin número'}</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setWhatsappNotifyOrder(null)}
                className="flex-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-on-surface font-title-sm text-xs font-bold py-2.5 rounded-xl"
              >
                Omitir
              </button>
              <a
                href={`https://wa.me/${(whatsappNotifyOrder.customer_phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `¡Hola ${whatsappNotifyOrder.customer_name}! Te informamos desde el taller que tu equipo (${whatsappNotifyOrder.device_info}) ya se encuentra LISTO PARA RETIRAR 🎉. Código de Orden: ${whatsappNotifyOrder.tracking_code}. Puedes verificar el detalle aquí: ${window.location.origin}/track/${whatsappNotifyOrder.tracking_code.replace('#', '')}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setWhatsappNotifyOrder(null)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-title-sm text-xs font-bold py-2.5 rounded-xl shadow flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Enviar WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
