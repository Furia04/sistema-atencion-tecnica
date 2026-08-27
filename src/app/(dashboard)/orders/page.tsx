'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Calendar, Edit, Receipt, ExternalLink } from 'lucide-react';
import { OrderStatus, ServiceOrder } from '@/types';

const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'wo-8892',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8892',
    device_id: 'dev-1',
    customer_id: 'cust-1',
    customer_name: 'Acme Corp',
    device_info: 'Laptop · ThinkPad T14',
    status: 'in_progress',
    reported_fault: 'No enciende tras derrame de líquido',
    estimated_completion: 'Oct 24, 14:00',
    final_price: 450.0,
    created_at: '2026-10-22T08:00:00Z',
  },
  {
    id: 'wo-8891',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8891',
    device_id: 'dev-2',
    customer_id: 'cust-2',
    customer_name: 'Sarah Jenkins',
    device_info: 'Smartphone · iPhone 13 Pro',
    status: 'waiting_parts',
    reported_fault: 'Pantalla rota y módulo de carga dañado',
    estimated_completion: 'Oct 25, 11:30',
    final_price: 185.5,
    created_at: '2026-10-22T09:15:00Z',
  },
  {
    id: 'wo-8890',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8890',
    device_id: 'dev-3',
    customer_id: 'cust-3',
    customer_name: 'Global Logistics LLC',
    device_info: 'Scanner · Zebra TC52',
    status: 'ready',
    reported_fault: 'Calibración de cristal láser',
    estimated_completion: 'Oct 23, 10:30',
    final_price: 95.0,
    created_at: '2026-10-21T14:20:00Z',
  },
  {
    id: 'wo-8889',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8889',
    device_id: 'dev-4',
    customer_id: 'cust-4',
    customer_name: 'Marcus Vance',
    device_info: 'Drone · DJI Mavic 3',
    status: 'cancelled',
    reported_fault: 'Brazo de rotor roto por impacto',
    estimated_completion: '--',
    final_price: 0.0,
    created_at: '2026-10-20T11:00:00Z',
  },
  {
    id: 'wo-8888',
    shop_id: 'shop-north-station',
    tracking_code: '#WO-8888',
    device_id: 'dev-5',
    customer_id: 'cust-5',
    customer_name: 'Carlos Gómez',
    device_info: 'Celular · Samsung S21',
    status: 'delivered',
    reported_fault: 'Cambio de batería original',
    estimated_completion: 'Oct 19, 17:00',
    final_price: 120.0,
    created_at: '2026-10-18T10:00:00Z',
  },
];

export default function ServiceOrdersPage() {
  const [orders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Simulamos que el usuario tiene acceso financiero
  const canSeeMoney = true;

  const filteredOrders = orders.filter((ord) => {
    const matchesFilter =
      activeFilter === 'all' || ord.status === activeFilter;
    const matchesSearch =
      ord.tracking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.device_info?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            Service Orders
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Gestión y seguimiento continuo de las órdenes del taller.
          </p>
        </div>
        <Link
          href="/orders/new"
          className="bg-primary-container text-on-primary-container hover:bg-inverse-primary px-4 py-2 rounded-lg font-title-sm text-title-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nueva Orden (Ingreso)
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-unit flex flex-col xl:flex-row gap-4 items-center justify-between">
        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          {[
            { id: 'all', label: `All (${orders.length})` },
            { id: 'received', label: 'Received' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'waiting_parts', label: 'Waiting Parts' },
            { id: 'ready', label: 'Ready' },
            { id: 'delivered', label: 'Delivered' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-full font-label-caps text-label-caps border transition-colors ${
                activeFilter === f.id
                  ? 'bg-surface-container-highest border-outline-variant text-on-surface'
                  : 'bg-transparent border-outline text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search & Date Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Código OT, cliente..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md py-1.5 pl-9 pr-3 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <button className="bg-surface-container-lowest border border-outline-variant rounded-md px-3 py-1.5 font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2 hover:bg-surface-container transition-colors whitespace-nowrap">
            <Calendar className="w-4 h-4" /> Últimos 30 días
          </button>
        </div>
      </div>

      {/* High Density Table */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Tracking Code
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Dispositivo
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Estimación
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                  Total
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50 font-mono-data text-mono-data">
              {filteredOrders.map((ord) => (
                <tr
                  key={ord.id}
                  className="hover:bg-surface-container transition-colors group cursor-pointer"
                >
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-primary font-bold">
                    {ord.tracking_code}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-on-surface">
                    {ord.customer_name}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-on-surface-variant">
                    {ord.device_info}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v">
                    {ord.status === 'in_progress' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container/30 text-primary border border-primary/20 text-[10px] uppercase font-bold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
                        In Progress
                      </span>
                    )}
                    {ord.status === 'waiting_parts' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary-fixed border border-tertiary-fixed/20 text-[10px] uppercase font-bold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed mr-1.5" />
                        Waiting Parts
                      </span>
                    )}
                    {ord.status === 'ready' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                        Ready
                      </span>
                    )}
                    {ord.status === 'cancelled' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container/30 text-error border border-error/20 text-[10px] uppercase font-bold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-error mr-1.5" />
                        Cancelled
                      </span>
                    )}
                    {ord.status === 'delivered' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant text-[10px] uppercase font-bold tracking-wide">
                        Delivered
                      </span>
                    )}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-on-surface-variant">
                    {ord.estimated_completion}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-on-surface text-right font-bold">
                    {canSeeMoney ? `$${ord.final_price?.toFixed(2)}` : '--'}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors"
                        title="Editar"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
