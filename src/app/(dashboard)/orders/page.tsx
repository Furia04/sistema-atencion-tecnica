'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Calendar, Edit, Receipt, ExternalLink, ArrowUpDown, Clock } from 'lucide-react';
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
    device_info: 'Celular · Samsung S21',
    status: 'abandonado',
    reported_fault: 'Equipo dejado en el taller por más de 90 días sin respuesta',
    estimated_completion: '19 Oct 2026',
    final_price: 120.0,
    created_at: '2026-07-10T10:00:00Z', // Más antigua
  },
  {
    id: 'wo-8889',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8889',
    device_id: 'dev-4',
    customer_id: 'cust-4',
    customer_name: 'Marcus Vance',
    customer_document_id: '29876123',
    device_info: 'Drone · DJI Mavic 3',
    status: 'esperando_cliente',
    reported_fault: 'Presupuesto enviado por reemplazo de motor del rotor',
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
    device_info: 'Scanner · Zebra TC52',
    status: 'para_entregar',
    reported_fault: 'Calibración de cristal láser y módulo óptico completada',
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
    device_info: 'Smartphone · iPhone 13 Pro',
    status: 'esperando_repuesto',
    reported_fault: 'Pantalla rota y módulo de carga dañado',
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
    device_info: 'Laptop · ThinkPad T14',
    status: 'en_revision',
    reported_fault: 'No enciende tras derrame de líquido',
    estimated_completion: '24 Oct 2026',
    final_price: 450.0,
    created_at: '2026-10-22T08:00:00Z',
  },
  {
    id: 'wo-8893',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8893',
    device_id: 'dev-6',
    customer_id: 'cust-6',
    customer_name: 'Juan Pérez',
    customer_document_id: '40123456',
    device_info: 'Consola · PlayStation 5',
    status: 'recibido',
    reported_fault: 'Sobrecalentamiento y apagado repentino a los 10 minutos de juego',
    estimated_completion: '26 Oct 2026',
    final_price: 150.0,
    created_at: '2026-10-24T14:30:00Z', // Más reciente
  },
];

export default function ServiceOrdersPage() {
  const [orders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Ordenamiento: Por defecto 'asc' (De la más antigua a la más reciente)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const canSeeMoney = true;

  // Filtrado por estado y búsqueda
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

  // Ordenamiento por fecha de creación (asc: antigua -> reciente, desc: reciente -> antigua)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

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
            Esperando Respuesta Cliente
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

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            Órdenes de Servicio
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Lista de reparaciones ordenadas de la más antigua a la más reciente con filtro de estados.
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
        {/* Botones de Filtro Rápido con los 6 Estados Personalizados */}
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

        {/* Buscador y Control de Ordenamiento */}
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
            title="Cambiar orden de fechas"
          >
            <ArrowUpDown className="w-4 h-4 text-primary" />
            <span>
              {sortOrder === 'asc' ? 'Más antigua → Más reciente' : 'Más reciente → Más antigua'}
            </span>
          </button>
        </div>
      </div>

      {/* Tabla de Alta Densidad (Listado Ergonómico) */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Código OT
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Fecha de Ingreso
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
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-on-surface-variant text-xs italic">
                    No se encontraron órdenes de servicio con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((ord) => (
                  <tr
                    key={ord.id}
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
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors"
                          title="Editar Orden"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors"
                          title="Ver Ticket Térmico"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/track/${ord.tracking_code.replace('#', '')}`}
                          target="_blank"
                          className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors"
                          title="Portal B2C Cliente"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
