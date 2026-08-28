'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { OrderStatus, ServiceOrder } from '@/types';

const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'wo-8888',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8888',
    device_id: 'dev-5',
    customer_id: 'cust-5',
    customer_name: 'Carlos Gómez',
    customer_document_id: '32987654',
    customer_phone: '+5491199887766',
    device_info: 'Celular · Samsung S21',
    status: 'abandonado',
    reported_fault: 'Equipo dejado en el taller por más de 90 días sin respuesta',
    technical_diagnosis: 'Batería reemplazada pero cliente nunca se presentó a retirar',
    estimated_completion: '19 Oct 2026',
    final_price: 120.0,
    created_at: '2026-07-10T10:00:00Z',
  },
  {
    id: 'wo-8889',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8889',
    device_id: 'dev-4',
    customer_id: 'cust-4',
    customer_name: 'Marcus Vance',
    customer_document_id: '29876123',
    customer_phone: '+5491133445566',
    device_info: 'Drone · DJI Mavic 3',
    status: 'esperando_cliente',
    reported_fault: 'Presupuesto enviado por reemplazo de motor del rotor',
    technical_diagnosis: 'Reemplazo de motor de brazo derecho y calibración de giroscopio',
    estimated_completion: '20 Oct 2026',
    final_price: 340.0,
    created_at: '2026-08-01T11:00:00Z',
  },
  {
    id: 'wo-8890',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8890',
    device_id: 'dev-3',
    customer_id: 'cust-3',
    customer_name: 'Global Logistics LLC',
    customer_document_id: '30999888',
    customer_phone: '+5491122334455',
    device_info: 'Scanner · Zebra TC52',
    status: 'para_entregar',
    reported_fault: 'Calibración de cristal láser y módulo óptico completada',
    technical_diagnosis: 'Lente reemplazado y pruebas de lectura pasadas',
    estimated_completion: '23 Oct 2026',
    final_price: 95.0,
    created_at: '2026-09-15T14:20:00Z',
  },
  {
    id: 'wo-8891',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8891',
    device_id: 'dev-2',
    customer_id: 'cust-2',
    customer_name: 'Sarah Jenkins',
    customer_document_id: '35123987',
    customer_phone: '+5491188990011',
    device_info: 'Smartphone · iPhone 13 Pro',
    status: 'esperando_repuesto',
    reported_fault: 'Pantalla rota y módulo de carga dañado',
    technical_diagnosis: 'En espera del repuesto original de pantalla OLED',
    estimated_completion: '25 Oct 2026',
    final_price: 185.5,
    created_at: '2026-10-01T09:15:00Z',
  },
  {
    id: 'wo-8892',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8892',
    device_id: 'dev-1',
    customer_id: 'cust-1',
    customer_name: 'Acme Corp',
    customer_document_id: '38912402',
    customer_phone: '+5491144556677',
    device_info: 'Laptop · ThinkPad T14',
    status: 'en_revision',
    reported_fault: 'No enciende tras derrame de líquido',
    technical_diagnosis: 'Limpieza por ultrasonido realizada. Revisando líneas de alimentación',
    estimated_completion: '24 Oct 2026',
    final_price: 450.0,
    created_at: '2026-10-22T08:00:00Z',
  },
];

export default function ServiceOrdersPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estado para la Ventana Emergente (Modal de Edición y Comunicación)
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const canSeeMoney = true;

  // Filtrado y ordenamiento
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

  const handleSaveModal = () => {
    if (!editingOrder) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === editingOrder.id ? editingOrder : o))
    );
    setEditingOrder(null);
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
            Abandonado
          </span>
        );
    }
  };

  const getWhatsAppMessage = (ord: ServiceOrder) => {
    const code = ord.tracking_code;
    const device = ord.device_info || 'equipo';
    const name = ord.customer_name || 'Cliente';

    switch (ord.status) {
      case 'para_entregar':
        return `Hola ${name}, te avisamos desde ProRepair Ops que tu ${device} (Orden ${code}) está LISTO PARA RETIRAR en el taller. ¡Te esperamos!`;
      case 'esperando_cliente':
        return `Hola ${name}, te escribimos de ProRepair Ops por tu ${device} (Orden ${code}). Tenemos listo el presupuesto de reparación. Por favor indícanos si apruebas el trabajo.`;
      case 'en_revision':
        return `Hola ${name}, tu ${device} (Orden ${code}) ya ingresó a revisión en nuestro laboratorio. Te avisaremos apenas tengamos novedades.`;
      case 'esperando_repuesto':
        return `Hola ${name}, te informamos que los repuestos requeridos para la orden ${code} ya fueron solicitados a proveedor.`;
      default:
        return `Hola ${name}, te contactamos desde ProRepair Ops respecto a tu orden de servicio ${code} (${device}).`;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            Órdenes de Servicio
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Usa las acciones de la tabla para editar, imprimir ticket térmico (80mm) o ir al portal público B2C del cliente.
          </p>
        </div>
        <Link
          href="/orders/new"
          className="bg-primary-container text-on-primary-container hover:bg-inverse-primary px-5 py-2.5 rounded-lg font-title-sm text-title-sm flex items-center gap-2 transition-colors shadow-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Nueva Orden (Ingreso)
        </Link>
      </div>

      {/* Barra de Filtros por Estado */}
      <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          {[
            { id: 'all', label: `Todas (${orders.length})` },
            { id: 'recibido', label: 'Recibido' },
            { id: 'en_revision', label: 'En Revisión' },
            { id: 'esperando_repuesto', label: 'Esperando Repuesto' },
            { id: 'esperando_cliente', label: 'Esperando Resp. Cliente' },
            { id: 'para_entregar', label: 'Para Entregar' },
            { id: 'abandonado', label: 'Abandonado' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full font-label-caps text-label-caps border transition-colors ${
                activeFilter === f.id
                  ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                  : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Buscador y Ordenamiento */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por OT, DNI, cliente o equipo..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-9 pr-3 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <button
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 font-body-sm text-xs text-on-surface flex items-center gap-2 hover:bg-surface-container transition-colors whitespace-nowrap font-bold"
          >
            <ArrowUpDown className="w-4 h-4 text-primary" />
            <span>
              {sortOrder === 'asc' ? 'Más antigua → Más reciente' : 'Más reciente → Más antigua'}
            </span>
          </button>
        </div>
      </div>

      {/* Tabla de Alta Densidad */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Código OT
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Fecha Ingreso
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Cliente (DNI)
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Dispositivo / Equipo
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                  Monto Total
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50 font-mono-data text-mono-data">
              {sortedOrders.map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => setEditingOrder(ord)}
                  className="hover:bg-surface-container transition-colors group cursor-pointer"
                >
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-primary font-bold">
                    {ord.tracking_code}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-on-surface-variant text-xs">
                    {new Date(ord.created_at).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-on-surface">
                    <div>
                      <span className="font-bold">{ord.customer_name}</span>
                      {ord.customer_document_id && (
                        <span className="text-[11px] text-on-surface-variant block font-mono">
                          DNI: {ord.customer_document_id}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-on-surface-variant">
                    {ord.device_info}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v">
                    {getStatusBadge(ord.status)}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-on-surface text-right font-bold">
                    {canSeeMoney ? `$${ord.final_price?.toFixed(2)}` : '--'}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Acciones directas visibles */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingOrder(ord);
                        }}
                        className="p-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title="Editar Orden y Contactar Cliente"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.print();
                        }}
                        className="p-1.5 rounded bg-surface-bright text-on-surface hover:text-primary hover:bg-surface-container-highest transition-colors"
                        title="Imprimir Ticket Térmico 80mm"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/track/${ord.tracking_code.replace('#', '')}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded bg-surface-bright text-on-surface hover:text-primary hover:bg-surface-container-highest transition-colors"
                        title="Abrir Portal B2C Cliente"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VENTANA EMERGENTE DE EDICIÓN Y COMUNICACIÓN (MODAL) */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-surface-container border border-outline-variant rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="p-5 border-b border-outline-variant bg-surface-container-high flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-title-sm text-lg font-bold text-primary">
                    Orden {editingOrder.tracking_code}
                  </h3>
                  <span className="font-mono-data text-xs bg-surface-bright text-on-surface-variant px-2.5 py-0.5 rounded font-semibold">
                    {editingOrder.device_info}
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                  Cliente: <strong className="text-on-surface">{editingOrder.customer_name}</strong> (DNI: {editingOrder.customer_document_id || 'N/A'})
                </p>
              </div>

              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* SECCIÓN 1: CAMBIO DE ESTADO DE LA ORDEN */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 space-y-3">
                <label className="block font-label-caps text-xs text-primary uppercase font-bold">
                  1. Cambiar Estado de la Orden
                </label>
                <select
                  value={editingOrder.status}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      status: e.target.value as OrderStatus,
                    })
                  }
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface font-semibold focus:border-primary focus:ring-1 focus:ring-primary/50"
                >
                  <option value="recibido">Recibido (Ingreso)</option>
                  <option value="en_revision">En Revisión (Diagnóstico)</option>
                  <option value="esperando_repuesto">Esperando Repuesto</option>
                  <option value="esperando_cliente">Esperando Respuesta del Cliente</option>
                  <option value="para_entregar">Para Entregar (Listo)</option>
                  <option value="abandonado">Abandonado</option>
                </select>
              </div>

              {/* SECCIÓN 2: COMUNICACIÓN DIRECTA CON EL CLIENTE */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 space-y-3">
                <label className="block font-label-caps text-xs text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> 2. Comunicarse con el Cliente
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/${(editingOrder.customer_phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(getWhatsAppMessage(editingOrder))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-title-sm text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" /> Enviar WhatsApp con Plantilla
                  </a>

                  <button
                    onClick={() => {
                      const link = `${window.location.origin}/track/${editingOrder.tracking_code.replace('#', '')}`;
                      navigator.clipboard.writeText(link);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest text-on-surface px-4 py-2.5 rounded-lg font-title-sm text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> ¡Enlace Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-primary" /> Copiar Enlace B2C
                      </>
                    )}
                  </button>

                  <Link
                    href={`/track/${editingOrder.tracking_code.replace('#', '')}`}
                    target="_blank"
                    className="bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest text-on-surface px-3 py-2.5 rounded-lg font-title-sm text-xs flex items-center justify-center gap-1.5 transition-colors"
                    title="Ver Portal B2C"
                  >
                    <ExternalLink className="w-4 h-4 text-primary" /> Portal B2C
                  </Link>
                </div>
              </div>

              {/* SECCIÓN 3: EDICIÓN DE DATOS TÉCNICOS Y PRESUPUESTO */}
              <div className="space-y-4">
                <div>
                  <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
                    Falla Reportada por el Cliente
                  </label>
                  <textarea
                    value={editingOrder.reported_fault}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        reported_fault: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
                    Diagnóstico Técnico / Trabajo Realizado
                  </label>
                  <textarea
                    value={editingOrder.technical_diagnosis || ''}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        technical_diagnosis: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Escriba aquí los detalles técnicos de la revisión o reparación..."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
                      Fecha Estimada de Entrega
                    </label>
                    <input
                      type="text"
                      value={editingOrder.estimated_completion || ''}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          estimated_completion: e.target.value,
                        })
                      }
                      placeholder="Ej: 25 Oct 2026, 17:00 hs"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
                      Monto Total Presupuestado ($)
                    </label>
                    <input
                      type="number"
                      value={editingOrder.final_price ?? 0}
                      onChange={(e) =>
                        setEditingOrder({
                          ...editingOrder,
                          final_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-mono-data font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 text-right"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="p-4 border-t border-outline-variant bg-surface-container-high flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-surface-bright border border-outline-variant rounded-lg text-xs font-title-sm text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-1.5 font-bold"
              >
                <Printer className="w-4 h-4 text-primary" /> Imprimir Ticket (80mm)
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="px-5 py-2 rounded-lg text-xs font-title-sm text-on-surface-variant hover:bg-surface-container-highest"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveModal}
                  className="bg-primary-container text-on-primary-container hover:bg-primary font-title-sm text-xs px-6 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" /> Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
