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
import { deductInventoryStock } from '@/lib/supabase/services';

export interface BudgetItem {
  id: string;
  inventory_item_id?: string;
  description: string;
  unit_cost: number;
  unit_price: number;
  quantity: number;
}

interface BudgetCalculatorProps {
  order?: ServiceOrder;
  user?: UserProfile;
  availableInventory?: InventoryItem[];
  inventory?: InventoryItem[];
  onApplyBudget?: (cost: number, price: number) => void;
  onSaveBudget?: (
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
  inventory,
  onApplyBudget,
  onSaveBudget,
}: BudgetCalculatorProps) {
  const inventoryList = availableInventory || inventory || [];

  const [items, setItems] = useState<BudgetItem[]>([]);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>('');

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

  const handleAddInventoryItem = async () => {
    if (!selectedInventoryId) return;

    const invItem = inventoryList.find((i) => i.id === selectedInventoryId);
    if (!invItem) return;

    const newItem: BudgetItem = {
      id: `b_${Date.now()}`,
      inventory_item_id: invItem.id,
      description: invItem.name,
      unit_cost: invItem.cost || 0,
      unit_price: invItem.price || 0,
      quantity: 1,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedInventoryId('');

    // Descontar automáticamente del stock de inventario real en Supabase
    if (invItem.id) {
      await deductInventoryStock(invItem.id, 1);
    }
  };

  const handleAddCustomItem = () => {
    const desc = prompt('Descripción del repuesto o insumo personalizado:');
    if (!desc) return;
    const priceStr = prompt('Precio de venta al público ($ ARS):', '15000');
    if (!priceStr) return;

    const price = parseFloat(priceStr) || 0;

    const newItem: BudgetItem = {
      id: `b_${Date.now()}`,
      description: desc.trim(),
      unit_cost: price * 0.5,
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
    if (onApplyBudget) {
      onApplyBudget(totalPartsCost, finalPrice);
    }
    if (onSaveBudget) {
      onSaveBudget(laborCost, totalPartsPrice, finalPrice, items);
    }
  };

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-6 text-xs font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-outline-variant/50 pb-4">
        <div>
          <h3 className="font-title-sm text-base font-bold text-primary flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> Presupuestador & Repuestos de Reparación
          </h3>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Carga de repuestos de inventario, mano de obra y cálculo de precio final.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="bg-surface-bright border border-outline-variant hover:bg-surface-container-highest px-4 py-2 rounded-lg text-xs font-title-sm text-on-surface flex items-center gap-2 transition-colors font-bold self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-primary" /> Imprimir Cotización
        </button>
      </div>

      {/* Selector de Repuestos del Inventario */}
      <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-4 space-y-3">
        <label className="block font-bold text-on-surface-variant uppercase text-[11px]">
          1. Agregar Repuesto de Inventario (Descuenta Stock Automáticamente)
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedInventoryId}
            onChange={(e) => setSelectedInventoryId(e.target.value)}
            className="flex-1 bg-surface-container border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface"
          >
            <option value="">-- Seleccionar repuesto de inventario --</option>
            {inventoryList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.category}) — Stock: {item.stock} u. — Venta: ${item.price.toLocaleString('es-AR')}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddInventoryItem}
            className="bg-primary text-on-primary font-bold px-4 py-2.5 rounded-xl shadow flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Agregar Repuesto
          </button>
        </div>
      </div>

      {/* Lista de Repuestos Involucrados */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block font-bold text-on-surface-variant uppercase text-[11px]">
            Repuestos e Insumos Involucrados ({items.length})
          </label>
          <button
            type="button"
            onClick={handleAddCustomItem}
            className="text-primary hover:underline font-bold text-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Repuesto Personalizado
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-center text-on-surface-variant bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant">
            No se han agregado repuestos aún a este presupuesto.
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-bold text-on-surface">{item.description}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono">
                      Costo: ${item.unit_cost.toLocaleString('es-AR')} • Venta: ${item.unit_price.toLocaleString('es-AR')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[11px]">Cant:</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      className="w-14 bg-surface-container border border-outline-variant rounded p-1 text-center font-mono font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-error hover:bg-error/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mano de Obra y Totales */}
      <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-on-surface-variant uppercase text-[11px] mb-1">
              Mano de Obra ($ ARS)
            </label>
            <input
              type="number"
              value={laborCost || ''}
              onChange={(e) => setLaborCost(Number(e.target.value))}
              placeholder="Ej: 15000"
              className="w-full bg-surface-container border border-outline-variant rounded-xl p-2.5 font-mono font-bold text-on-surface"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface-variant uppercase text-[11px] mb-1">
              Descuento Especial ($ ARS)
            </label>
            <input
              type="number"
              value={discount || ''}
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="Ej: 0"
              className="w-full bg-surface-container border border-outline-variant rounded-xl p-2.5 font-mono font-bold text-on-surface"
            />
          </div>
        </div>

        {/* Resumen Total */}
        <div className="flex justify-between items-center bg-primary/10 border border-primary/30 p-4 rounded-xl">
          <div>
            <span className="text-[10px] text-primary uppercase font-bold tracking-wider">PRECIO FINAL CLIENTE</span>
            <div className="text-xl font-extrabold text-primary font-mono">
              ${finalPrice.toLocaleString('es-AR')}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="bg-primary text-on-primary hover:bg-primary-container font-title-sm text-xs font-bold px-6 py-3 rounded-xl shadow flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> Aplicar al Presupuesto
          </button>
        </div>
      </div>
    </div>
  );
}
