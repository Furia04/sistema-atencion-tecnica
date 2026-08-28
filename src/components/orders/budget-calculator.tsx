'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Package,
  Wrench,
  Calculator,
  Printer,
  Save,
  CheckCircle2,
  TrendingUp,
  EyeOff,
} from 'lucide-react';
import { InventoryItem, ServiceOrder, UserProfile } from '@/types';
import { hasFinancialAccess } from '@/lib/permissions';

export interface BudgetItem {
  id: string;
  inventory_item_id?: string;
  description: string;
  unit_cost: number;
  unit_price: number;
  quantity: number;
}

interface BudgetCalculatorProps {
  order: ServiceOrder;
  user: UserProfile;
  availableInventory: InventoryItem[];
  onSaveBudget: (
    totalLabor: number,
    totalParts: number,
    finalPrice: number,
    items: BudgetItem[]
  ) => void;
}

export function BudgetCalculator({
  order,
  user,
  availableInventory,
  onSaveBudget,
}: BudgetCalculatorProps) {
  const canSeeFinancials = hasFinancialAccess(user);

  // Initial mock budget items
  const [items, setItems] = useState<BudgetItem[]>([
    {
      id: 'b-1',
      inventory_item_id: 'inv-1',
      description: 'Pantalla iPhone 13 Pro (OLED)',
      unit_cost: 120.0,
      unit_price: 250.0,
      quantity: 1,
    },
  ]);

  const [laborCost, setLaborCost] = useState<number>(100.0);
  const [discount, setDiscount] = useState<number>(0.0);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>('');

  // Calculations
  const totalPartsCost = items.reduce(
    (sum, item) => sum + item.unit_cost * item.quantity,
    0
  );
  const totalPartsPrice = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const subtotal = totalPartsPrice + laborCost;
  const finalPrice = Math.max(0, subtotal - discount);
  const estimatedProfit = finalPrice - totalPartsCost;

  const handleAddInventoryItem = () => {
    if (!selectedInventoryId) return;

    const invItem = availableInventory.find((i) => i.id === selectedInventoryId);
    if (!invItem) return;

    const newItem: BudgetItem = {
      id: `b_${Date.now()}`,
      inventory_item_id: invItem.id,
      description: invItem.name,
      unit_cost: invItem.cost || 0,
      unit_price: invItem.price,
      quantity: 1,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedInventoryId('');
  };

  const handleAddCustomItem = () => {
    const desc = prompt('Descripción del repuesto o insumo personalizado:');
    if (!desc) return;
    const priceStr = prompt('Precio de venta al público ($):', '50');
    if (!priceStr) return;

    const price = parseFloat(priceStr) || 0;

    const newItem: BudgetItem = {
      id: `b_${Date.now()}`,
      description: desc.trim(),
      unit_cost: price * 0.5, // Estimado
      unit_price: price,
      quantity: 1,
    };

    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(1, qty) } : i
      )
    );
  };

  const handleSave = () => {
    onSaveBudget(laborCost, totalPartsPrice, finalPrice, items);
  };

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-outline-variant/50 pb-4">
        <div>
          <h3 className="font-title-sm text-lg font-bold text-primary flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> Presupuestador de Reparación
          </h3>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Carga de repuestos de inventario, mano de obra y cálculo de margen de ganancia.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-surface-bright border border-outline-variant hover:bg-surface-container-highest px-4 py-2 rounded-lg text-xs font-title-sm text-on-surface flex items-center gap-2 transition-colors font-bold self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-primary" /> Imprimir Cotización
        </button>
      </div>

      {/* Selector de Repuestos de Inventario */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 space-y-3">
        <label className="block font-label-caps text-xs text-primary uppercase font-bold">
          Agregar Repuesto desde el Inventario del Taller
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedInventoryId}
            onChange={(e) => setSelectedInventoryId(e.target.value)}
            className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
          >
            <option value="">-- Seleccionar repuesto de stock --</option>
            {availableInventory.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.name} (Stock: {inv.stock}) - ${inv.price.toFixed(2)}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddInventoryItem}
            disabled={!selectedInventoryId}
            className="bg-primary-container text-on-primary-container disabled:opacity-50 hover:bg-primary font-title-sm text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Agregar de Inventario
          </button>

          <button
            onClick={handleAddCustomItem}
            className="bg-surface-bright border border-outline-variant text-on-surface hover:bg-surface-container-highest font-title-sm text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap font-bold"
          >
            + Repuesto Libre
          </button>
        </div>
      </div>

      {/* Tabla de Repuestos Cargados */}
      <div className="space-y-2">
        <h4 className="font-label-caps text-xs text-on-surface-variant uppercase font-bold">
          Repuestos e Insumos Incluidos
        </h4>

        {items.length === 0 ? (
          <p className="text-xs text-on-surface-variant/60 italic py-4 text-center border-2 border-dashed border-outline-variant/40 rounded-xl">
            No se han agregado repuestos al presupuesto.
          </p>
        ) : (
          <div className="border border-outline-variant/60 rounded-xl overflow-hidden bg-surface-container-lowest">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-surface-container border-b border-outline-variant/60 font-label-caps text-on-surface-variant">
                <tr>
                  <th className="p-3">Descripción</th>
                  <th className="p-3 text-center">Cant.</th>
                  {canSeeFinancials && <th className="p-3 text-right">Costo Unit.</th>}
                  <th className="p-3 text-right">Precio Unit.</th>
                  <th className="p-3 text-right">Subtotal</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 font-mono-data">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-high/50">
                    <td className="p-3 font-sans font-semibold text-on-surface">
                      {item.description}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-14 bg-surface border border-outline-variant rounded text-center py-1 text-xs font-mono-data"
                      />
                    </td>
                    {canSeeFinancials && (
                      <td className="p-3 text-right text-on-surface-variant">
                        ${item.unit_cost.toFixed(2)}
                      </td>
                    )}
                    <td className="p-3 text-right text-on-surface">
                      ${item.unit_price.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-bold text-primary">
                      ${(item.unit_price * item.quantity).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cálculo de Mano de Obra y Descuentos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 space-y-2">
          <label className="block font-label-caps text-xs text-on-surface-variant uppercase font-semibold flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-primary" /> Costo Mano de Obra ($)
          </label>
          <input
            type="number"
            value={laborCost}
            onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-mono-data font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 text-right"
          />
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 space-y-2">
          <label className="block font-label-caps text-xs text-on-surface-variant uppercase font-semibold">
            Descuento Especial ($)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-mono-data font-bold text-emerald-400 focus:border-primary focus:ring-1 focus:ring-primary/50 text-right"
          />
        </div>
      </div>

      {/* Totales y Ganancia Neta (RBAC) */}
      <div className="bg-surface-container-high border-2 border-primary/30 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-label-caps text-xs text-on-surface-variant uppercase font-bold">
            Resumen de Totales
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <span>Repuestos: <strong>${totalPartsPrice.toFixed(2)}</strong></span>
            <span>•</span>
            <span>Mano de obra: <strong>${laborCost.toFixed(2)}</strong></span>
            {discount > 0 && (
              <>
                <span>•</span>
                <span className="text-emerald-400">Desc: <strong>-${discount.toFixed(2)}</strong></span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {canSeeFinancials ? (
            <div className="text-right border-r border-outline-variant/50 pr-6">
              <span className="font-label-caps text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Ganancia Neta
              </span>
              <span className="font-mono-data font-bold text-emerald-400 text-lg">
                ${estimatedProfit.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="text-right border-r border-outline-variant/50 pr-6">
              <span className="font-label-caps text-[10px] text-on-surface-variant/60 uppercase font-bold flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5" /> Ganancia
              </span>
              <span className="font-mono-data text-xs text-on-surface-variant/40 italic">
                Restringido
              </span>
            </div>
          )}

          <div className="text-right">
            <span className="font-label-caps text-xs text-primary uppercase font-bold block">
              TOTAL PRESUPUESTO
            </span>
            <span className="font-mono-data font-bold text-primary text-2xl">
              ${finalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="bg-primary-container text-on-primary-container hover:bg-primary font-title-sm text-sm px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md"
        >
          <Save className="w-4 h-4" /> Aplicar Presupuesto a la Orden
        </button>
      </div>
    </div>
  );
}
