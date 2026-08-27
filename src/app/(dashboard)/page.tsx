import React from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ArrowRight,
  EyeOff,
} from 'lucide-react';
import { UserProfile, ServiceOrder } from '@/types';
import { hasFinancialAccess } from '@/lib/permissions';

// Mock user loader (reemplazable por Supabase auth)
async function getCurrentUser(): Promise<UserProfile> {
  return {
    id: 'user-001',
    email: 'admin@prorepair.com',
    full_name: 'Tech J. Doe',
    role: 'owner',
    shop_id: 'shop-north-station',
    can_view_financials: true,
  };
}

const MOCK_RECENT_ORDERS: ServiceOrder[] = [
  {
    id: '1',
    shop_id: 'shop-north-station',
    tracking_code: '#ORD-9021',
    device_id: 'dev-1',
    customer_id: 'cust-1',
    customer_name: 'Sarah Connor',
    device_info: 'Cybernetic Arm Mod',
    status: 'in_progress',
    reported_fault: 'Joint motor calibration loss',
    final_price: 450.0,
    created_at: '2026-08-27T10:45:00Z',
  },
  {
    id: '2',
    shop_id: 'shop-north-station',
    tracking_code: '#ORD-9020',
    device_id: 'dev-2',
    customer_id: 'cust-2',
    customer_name: 'Kyle Reese',
    device_info: 'Plasma Rifle Scope',
    status: 'ready',
    reported_fault: 'Lens focus assembly misaligned',
    final_price: 185.5,
    created_at: '2026-08-27T09:15:00Z',
  },
  {
    id: '3',
    shop_id: 'shop-north-station',
    tracking_code: '#ORD-9019',
    device_id: 'dev-3',
    customer_id: 'cust-3',
    customer_name: 'T-800 Unit',
    device_info: 'Optic Sensor Array',
    status: 'waiting_parts',
    reported_fault: 'Red filter glass replacement',
    final_price: 320.0,
    created_at: '2026-08-26T16:20:00Z',
  },
  {
    id: '4',
    shop_id: 'shop-north-station',
    tracking_code: '#ORD-9018',
    device_id: 'dev-4',
    customer_id: 'cust-4',
    customer_name: 'Miles Dyson',
    device_info: 'Neural Net Processor Board',
    status: 'received',
    reported_fault: 'Overheating under heavy computation load',
    final_price: 95.0,
    created_at: '2026-08-26T14:10:00Z',
  },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const canSeeMoney = hasFinancialAccess(user);

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface">
          Dashboard Overview
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Resumen técnico y operacional del taller en tiempo real.
        </p>
      </div>

      {/* Bento Grid Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Card 1: Total Orders */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              TOTAL ORDERS
            </span>
            <span className="bg-primary/10 text-primary p-1.5 rounded-md">
              <ClipboardList className="w-4 h-4" />
            </span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">
            1,248
          </div>
          <div className="font-mono-data text-mono-data text-primary mt-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +12% esta semana
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              PENDING
            </span>
            <span className="bg-tertiary-container/20 text-tertiary p-1.5 rounded-md">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">
            42
          </div>
          <div className="font-mono-data text-mono-data text-on-surface-variant mt-1">
            Requieren atención
          </div>
        </div>

        {/* Card 3: Ready for Pickup */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              READY FOR PICKUP
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-md">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">
            18
          </div>
          <div className="font-mono-data text-mono-data text-on-surface-variant mt-1">
            Esperando retiro de cliente
          </div>
        </div>

        {/* Card 4: Today's Revenue (Financial Masking) */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              TODAY'S REVENUE
            </span>
            <span className="bg-primary/10 text-primary p-1.5 rounded-md">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          {canSeeMoney ? (
            <>
              <div className="font-display-lg text-display-lg text-on-surface font-mono-data">
                $4,590.00
              </div>
              <div className="font-mono-data text-mono-data text-primary mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +5% vs ayer
              </div>
            </>
          ) : (
            <>
              <div className="font-display-lg text-display-lg text-on-surface-variant/40 flex items-center gap-2">
                <EyeOff className="w-6 h-6" /> ****
              </div>
              <div className="font-mono-data text-xs text-on-surface-variant/60 italic mt-1">
                Restringido para técnico
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Orders Table Area */}
      <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high">
          <h3 className="font-title-sm text-title-sm text-on-surface">
            Órdenes Recientes
          </h3>
          <Link
            href="/orders"
            className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors flex items-center gap-1"
          >
            Ver Todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest border-b border-outline-variant font-label-caps text-label-caps text-on-surface-variant">
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-semibold">
                  Order ID
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-semibold">
                  Cliente
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-semibold">
                  Dispositivo
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-semibold">
                  Estado
                </th>
                <th className="px-table-cell-padding-h py-table-cell-padding-v font-semibold text-right">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="font-mono-data text-mono-data divide-y divide-outline-variant/50">
              {MOCK_RECENT_ORDERS.map((ord) => (
                <tr
                  key={ord.id}
                  className="hover:bg-surface-container-high transition-colors group cursor-pointer"
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
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-container/20 text-primary border border-primary/30">
                        In Progress
                      </span>
                    )}
                    {ord.status === 'ready' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Ready
                      </span>
                    )}
                    {ord.status === 'waiting_parts' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-tertiary-container/20 text-tertiary border border-tertiary-container/30">
                        Waiting Parts
                      </span>
                    )}
                    {ord.status === 'received' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-variant text-on-surface-variant border border-outline-variant">
                        Received
                      </span>
                    )}
                  </td>
                  <td className="px-table-cell-padding-h py-table-cell-padding-v text-right text-on-surface">
                    {canSeeMoney ? (
                      `$${ord.final_price?.toFixed(2)}`
                    ) : (
                      <span className="text-on-surface-variant/40 italic">
                        --
                      </span>
                    )}
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
