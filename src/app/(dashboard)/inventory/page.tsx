'use client';

import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Filter,
  Plus,
  Edit,
  EyeOff,
  Battery,
  Smartphone,
  Shield,
  Usb,
} from 'lucide-react';
import { InventoryItem } from '@/types';

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    shop_id: 'shop-north-station',
    sku: 'SCR-IP13P-01',
    name: 'Pantalla iPhone 13 Pro (OLED)',
    category: 'Pantallas',
    stock: 45,
    min_stock: 10,
    cost: 120.0,
    price: 250.0,
    created_at: '2026-10-01',
  },
  {
    id: 'inv-2',
    shop_id: 'shop-north-station',
    sku: 'BAT-SS21-02',
    name: 'Batería Samsung S21 (4000mAh)',
    category: 'Baterías',
    stock: 3, // Low stock!
    min_stock: 8,
    cost: 25.0,
    price: 75.0,
    created_at: '2026-10-05',
  },
  {
    id: 'inv-3',
    shop_id: 'shop-north-station',
    sku: 'PRT-USBC-UN',
    name: 'Puerto de Carga Universal Type-C',
    category: 'Puertos',
    stock: 18,
    min_stock: 15,
    cost: 4.5,
    price: 35.0,
    created_at: '2026-09-12',
  },
  {
    id: 'inv-4',
    shop_id: 'shop-north-station',
    sku: 'GLS-IP11-00',
    name: 'Vidrio Templado iPhone 11',
    category: 'Accesorios',
    stock: 120,
    min_stock: 20,
    cost: 1.2,
    price: 15.0,
    created_at: '2026-08-20',
  },
];

export default function InventoryPage() {
  const [inventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Simulación del permiso del usuario (Financial RBAC)
  const canSeeMoney = true;

  const lowStockCount = inventory.filter((i) => i.stock <= i.min_stock).length;

  const filteredItems = inventory.filter((i) =>
    categoryFilter === 'all' ? true : i.category === categoryFilter
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            Gestión de Inventario
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Control de repuestos, stock mínimo y rentabilidad.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-surface-container-high border border-outline-variant px-4 py-2 rounded-lg text-on-surface hover:bg-surface-container-highest transition-colors font-title-sm text-title-sm">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <button className="flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-lg hover:bg-inverse-primary transition-colors font-title-sm text-title-sm shadow-[0_0_10px_rgba(124,58,237,0.2)]">
            <Plus className="w-4 h-4" /> Agregar Repuesto
          </button>
        </div>
      </div>

      {/* KPI Stats Row (Bento Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              TOTAL ÍTEMS
            </span>
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div className="font-headline-md text-headline-md text-on-surface">
            1,248
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            +12 agregados esta semana
          </div>
        </div>

        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant flex flex-col gap-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              BAJO STOCK
            </span>
            <AlertTriangle className="w-5 h-5 text-error" />
          </div>
          <div className="font-headline-md text-headline-md text-error">
            {lowStockCount}
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            Requieren reorden urgente
          </div>
        </div>

        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              VALOR (COSTO)
            </span>
            <DollarSign className="w-5 h-5 text-tertiary" />
          </div>
          {canSeeMoney ? (
            <>
              <div className="font-headline-md text-headline-md text-on-surface font-mono-data">
                $45,230.00
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                Valor total de compra en inventario
              </div>
            </>
          ) : (
            <>
              <div className="font-headline-md text-headline-md text-on-surface-variant/40 flex items-center gap-1">
                <EyeOff className="w-5 h-5" /> ****
              </div>
              <div className="font-body-sm text-xs text-on-surface-variant/60 italic">
                Restringido por permiso financiero
              </div>
            </>
          )}
        </div>

        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              GANANCIA POTENCIAL
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          {canSeeMoney ? (
            <>
              <div className="font-headline-md text-headline-md text-on-surface font-mono-data">
                $89,500.00
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                Margen estimado de venta al público
              </div>
            </>
          ) : (
            <>
              <div className="font-headline-md text-headline-md text-on-surface-variant/40 flex items-center gap-1">
                <EyeOff className="w-5 h-5" /> ****
              </div>
              <div className="font-body-sm text-xs text-on-surface-variant/60 italic">
                Restringido por permiso financiero
              </div>
            </>
          )}
        </div>
      </div>

      {/* High Density Inventory Table */}
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden flex flex-col">
        {/* Category Tool Filter Bar */}
        <div className="p-3 border-b border-outline-variant bg-surface-container-high flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            {['all', 'Pantallas', 'Baterías', 'Puertos', 'Accesorios'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full font-label-caps text-label-caps border transition-colors ${
                    categoryFilter === cat
                      ? 'bg-secondary-container text-on-secondary-container border-primary/30'
                      : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  {cat === 'all' ? 'Todas' : cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest border-b border-outline-variant">
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant">
                  SKU / Código
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant">
                  Nombre Repuesto
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant">
                  Categoría
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant">
                  Nivel de Stock
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant">
                  Costo Compra
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant">
                  Precio Venta
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-label-caps text-label-caps text-on-surface-variant text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
              {filteredItems.map((item) => {
                const isLow = item.stock <= item.min_stock;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-surface-container-high transition-colors group ${
                      isLow ? 'bg-error/5' : ''
                    }`}
                  >
                    <td className="px-table-cell-padding-h py-table-cell-padding-v font-mono-data text-on-surface-variant">
                      {item.sku}
                    </td>
                    <td className="px-table-cell-padding-h py-table-cell-padding-v font-title-sm text-title-sm font-semibold">
                      {item.name}
                    </td>
                    <td className="px-table-cell-padding-h py-table-cell-padding-v">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-bright border border-outline-variant/30 font-label-caps text-label-caps text-on-surface-variant">
                        {item.category === 'Pantallas' && <Smartphone className="w-3.5 h-3.5" />}
                        {item.category === 'Baterías' && <Battery className="w-3.5 h-3.5" />}
                        {item.category === 'Puertos' && <Usb className="w-3.5 h-3.5" />}
                        {item.category === 'Accesorios' && <Shield className="w-3.5 h-3.5" />}
                        {item.category}
                      </span>
                    </td>
                    <td className="px-table-cell-padding-h py-table-cell-padding-v">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono-data font-bold ${
                            isLow ? 'text-error' : 'text-on-surface'
                          }`}
                        >
                          {item.stock}
                        </span>
                        <div className="w-16 h-1.5 bg-surface-bright rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              isLow ? 'bg-error w-[15%]' : 'bg-emerald-500 w-[75%]'
                            }`}
                          />
                        </div>
                        {isLow && (
                          <span title="Reorden necesario">
                            <AlertTriangle className="w-4 h-4 text-error" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-table-cell-padding-h py-table-cell-padding-v font-mono-data text-on-surface-variant">
                      {canSeeMoney ? `$${item.cost?.toFixed(2)}` : '--'}
                    </td>
                    <td className="px-table-cell-padding-h py-table-cell-padding-v font-mono-data font-bold">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-table-cell-padding-h py-table-cell-padding-v text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
