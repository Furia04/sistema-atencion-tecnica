'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  FileText,
  Smartphone,
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  History,
  ShieldCheck,
} from 'lucide-react';
import { Customer, Device, ServiceOrder, OrderStatus } from '@/types';

interface ExtendedCustomer extends Customer {
  devices_count: number;
  orders_count: number;
  total_spent?: number;
}

const MOCK_CUSTOMERS: ExtendedCustomer[] = [
  {
    id: 'cust-1',
    shop_id: 'shop-north-station',
    full_name: 'Sarah Connor',
    document_id: '38912402',
    phone: '+5491144556677',
    email: 'sarah.connor@resistance.org',
    created_at: '2026-05-10',
    devices_count: 2,
    orders_count: 2,
    total_spent: 890.0,
  },
  {
    id: 'cust-2',
    shop_id: 'shop-north-station',
    full_name: 'Kyle Reese',
    document_id: '35123987',
    phone: '+5491188990011',
    email: 'kyle.reese@techcom.io',
    created_at: '2026-06-15',
    devices_count: 1,
    orders_count: 1,
    total_spent: 185.5,
  },
  {
    id: 'cust-3',
    shop_id: 'shop-north-station',
    full_name: 'Miles Dyson',
    document_id: '28456123',
    phone: '+5491122334455',
    email: 'm.dyson@cyberdyne.com',
    created_at: '2026-07-01',
    devices_count: 1,
    orders_count: 1,
    total_spent: 1450.0,
  },
  {
    id: 'cust-4',
    shop_id: 'shop-north-station',
    full_name: 'Carlos Gómez',
    document_id: '32987654',
    phone: '+5491199887766',
    email: 'carlos.gomez@gmail.com',
    created_at: '2026-08-12',
    devices_count: 1,
    orders_count: 1,
    total_spent: 120.0,
  },
];

const MOCK_DEVICES: Record<string, Device[]> = {
  'cust-1': [
    {
      id: 'dev-101',
      shop_id: 'shop-north-station',
      customer_id: 'cust-1',
      type: 'Computadora',
      brand: 'Lenovo',
      model: 'ThinkPad T14',
      serial_number: 'SN-90218301',
      custom_attributes: { passcode: '1234', charger_included: true },
      created_at: '2026-05-10',
    },
    {
      id: 'dev-102',
      shop_id: 'shop-north-station',
      customer_id: 'cust-1',
      type: 'Smartphone',
      brand: 'Apple',
      model: 'iPhone 12',
      serial_number: '3589120938102',
      custom_attributes: { battery_state: 'Degradada' },
      created_at: '2026-06-20',
    },
  ],
  'cust-2': [
    {
      id: 'dev-201',
      shop_id: 'shop-north-station',
      customer_id: 'cust-2',
      type: 'Smartphone',
      brand: 'Apple',
      model: 'iPhone 13 Pro',
      serial_number: '358923019842019',
      custom_attributes: { passcode: '4321', has_sim: true },
      created_at: '2026-06-15',
    },
  ],
  'cust-3': [
    {
      id: 'dev-301',
      shop_id: 'shop-north-station',
      customer_id: 'cust-3',
      type: 'Placa Base',
      brand: 'Custom',
      model: 'Neural Net Processor Board',
      serial_number: 'NNP-v2.4',
      custom_attributes: { fault_codes: 'Overheating under computation' },
      created_at: '2026-07-01',
    },
  ],
  'cust-4': [
    {
      id: 'dev-401',
      shop_id: 'shop-north-station',
      customer_id: 'cust-4',
      type: 'Smartphone',
      brand: 'Samsung',
      model: 'Galaxy S21',
      serial_number: '35912049182',
      custom_attributes: {},
      created_at: '2026-08-12',
    },
  ],
};

const MOCK_ORDERS: Record<string, ServiceOrder[]> = {
  'cust-1': [
    {
      id: 'ord-101',
      shop_id: 'shop-north-station',
      tracking_code: '#WO-8892',
      device_id: 'dev-101',
      customer_id: 'cust-1',
      status: 'en_revision',
      reported_fault: 'No enciende tras derrame de líquido sobre teclado',
      technical_diagnosis: 'Limpieza por ultrasonido y reemplazo de integrado IC de carga',
      final_price: 450.0,
      created_at: '2026-10-22 08:00',
      device_info: 'Lenovo ThinkPad T14',
    },
    {
      id: 'ord-102',
      shop_id: 'shop-north-station',
      tracking_code: '#WO-8510',
      device_id: 'dev-102',
      customer_id: 'cust-1',
      status: 'para_entregar',
      reported_fault: 'Cambio de pantalla y batería',
      technical_diagnosis: 'Modulo display OLED instalado correctamente',
      final_price: 440.0,
      created_at: '2026-06-20 11:30',
      device_info: 'Apple iPhone 12',
    },
  ],
  'cust-2': [
    {
      id: 'ord-201',
      shop_id: 'shop-north-station',
      tracking_code: '#WO-8891',
      device_id: 'dev-201',
      customer_id: 'cust-2',
      status: 'esperando_repuesto',
      reported_fault: 'Pantalla rota y módulo de carga dañado',
      technical_diagnosis: 'Repuesto en camino desde proveedor',
      final_price: 185.5,
      created_at: '2026-10-22 09:15',
      device_info: 'Apple iPhone 13 Pro',
    },
  ],
  'cust-3': [
    {
      id: 'ord-301',
      shop_id: 'shop-north-station',
      tracking_code: '#WO-8818',
      device_id: 'dev-301',
      customer_id: 'cust-3',
      status: 'para_entregar',
      reported_fault: 'Sobrecalentamiento excesivo bajo carga de trabajo',
      technical_diagnosis: 'Reemplazo de pad térmico y micro soldadura en línea principal',
      final_price: 1450.0,
      created_at: '2026-07-01 14:00',
      device_info: 'Neural Net Processor Board',
    },
  ],
  'cust-4': [
    {
      id: 'ord-401',
      shop_id: 'shop-north-station',
      tracking_code: '#WO-8888',
      device_id: 'dev-401',
      customer_id: 'cust-4',
      status: 'abandonado',
      reported_fault: 'Cambio de batería original',
      technical_diagnosis: 'Batería reemplazada pero cliente no retiró en plazo',
      final_price: 120.0,
      created_at: '2026-10-18 10:00',
      device_info: 'Samsung Galaxy S21',
    },
  ],
};

export default function CustomersPage() {
  const [customers] = useState<ExtendedCustomer[]>(MOCK_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.document_id && c.document_id.includes(searchQuery)) ||
      c.phone.includes(searchQuery)
  );

  const customerDevices = MOCK_DEVICES[selectedCustomer.id] || [];
  const customerOrders = MOCK_ORDERS[selectedCustomer.id] || [];

  const waMessage = encodeURIComponent(
    `Hola ${selectedCustomer.full_name}, nos comunicamos desde ProRepair Ops sobre sus equipos de servicio técnico.`
  );
  const waUrl = `https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=${waMessage}`;

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'recibido':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-label-caps font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">Recibido</span>;
      case 'en_revision':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-label-caps font-bold bg-primary-container/20 text-primary border border-primary/30 uppercase">En Revisión</span>;
      case 'esperando_repuesto':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-label-caps font-bold bg-tertiary-container/20 text-tertiary border border-tertiary-container/30 uppercase">Espera Repuesto</span>;
      case 'esperando_cliente':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-label-caps font-bold bg-purple-900/30 text-purple-300 border border-purple-500/30 uppercase">Esperando Resp. Cliente</span>;
      case 'para_entregar':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-label-caps font-bold bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 uppercase">Para Entregar</span>;
      case 'abandonado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-label-caps font-bold bg-error-container/30 text-error border border-error/30 uppercase">Abandonado</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Encabezado y Acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" /> Clientes e Historial por DNI
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Consulta el historial completo de equipos, reparaciones y contacto de cada cliente.
          </p>
        </div>

        <button
          onClick={() => alert('Formulario de Alta de Cliente')}
          className="bg-primary-container text-on-primary-container font-title-sm text-title-sm px-5 py-2.5 rounded-lg hover:bg-primary transition-colors flex items-center gap-2 shadow-sm font-semibold"
        >
          <Plus className="w-5 h-5" /> Nuevo Cliente
        </button>
      </div>

      {/* Buscador Destacado por DNI / Nombre / Teléfono */}
      <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cliente por DNI / CUIT, Nombre o Teléfono..."
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2.5 pl-11 pr-4 font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Layout Principal en Dos Columnas Ergonómicas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Lista de Clientes (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h3 className="font-label-caps text-xs text-on-surface-variant uppercase font-bold px-1">
            Lista de Clientes ({filteredCustomers.length})
          </h3>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.id === selectedCustomerId;

              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-secondary-container text-on-secondary-container border-primary shadow-md'
                      : 'bg-surface-container border-outline-variant/60 hover:border-outline hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-title-sm text-sm font-bold text-on-surface">
                      {cust.full_name}
                    </h4>
                    <span
                      className={`font-mono-data text-[11px] font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-primary/20 text-on-primary-container'
                          : 'bg-surface-bright text-primary'
                      }`}
                    >
                      DNI: {cust.document_id || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{cust.phone}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40 text-[11px] text-on-surface-variant">
                    <span>{cust.devices_count} Equipos</span>
                    <span>•</span>
                    <span>{cust.orders_count} Reparaciones</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Detalle e Historial del Cliente Seleccionado (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Ficha del Cliente */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/40 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-title-sm text-xl font-bold text-on-surface">
                    {selectedCustomer.full_name}
                  </h3>
                  <span className="font-mono-data text-xs font-bold px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/30">
                    DNI: {selectedCustomer.document_id || 'Sin especificar'}
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                  Cliente registrado desde el {selectedCustomer.created_at}
                </p>
              </div>

              {/* Botón WhatsApp */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 px-4 py-2 rounded-lg font-title-sm text-xs flex items-center gap-2 transition-colors font-bold"
              >
                <MessageSquare className="w-4 h-4" /> Enviar WhatsApp
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase">
                    Teléfono
                  </span>
                  <span className="font-mono-data text-on-surface font-semibold">
                    {selectedCustomer.phone}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase">
                    Correo Electrónico
                  </span>
                  <span className="font-mono-data text-on-surface font-semibold truncate">
                    {selectedCustomer.email || 'No registrado'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Equipos Registrados del Cliente */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary font-title-sm font-bold border-b border-outline-variant/40 pb-3">
              <Smartphone className="w-5 h-5" />
              <h3>Equipos Vinculados ({customerDevices.length})</h3>
            </div>

            {customerDevices.length === 0 ? (
              <p className="text-xs text-on-surface-variant italic">
                Este cliente no tiene equipos registrados aún.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customerDevices.map((dev) => (
                  <div
                    key={dev.id}
                    className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <span className="font-label-caps text-[10px] text-primary uppercase font-bold px-2 py-0.5 bg-primary/10 rounded">
                        {dev.type}
                      </span>
                      <h4 className="font-title-sm text-sm font-bold text-on-surface mt-2">
                        {dev.brand} {dev.model}
                      </h4>
                      <p className="font-mono-data text-[11px] text-on-surface-variant mt-0.5">
                        SN/IMEI: {dev.serial_number || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historial Completo de Reparaciones / Órdenes por DNI */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary font-title-sm font-bold border-b border-outline-variant/40 pb-3">
              <History className="w-5 h-5" />
              <h3>Historial Completo de Órdenes de Servicio</h3>
            </div>

            {customerOrders.length === 0 ? (
              <p className="text-xs text-on-surface-variant italic">
                No hay órdenes registradas históricamente para este cliente.
              </p>
            ) : (
              <div className="space-y-3">
                {customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-outline-variant/30 pb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono-data font-bold text-primary text-sm">
                          {ord.tracking_code}
                        </span>
                        <span className="text-xs text-on-surface font-semibold">
                          {ord.device_info}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {renderStatusBadge(ord.status)}
                        <span className="text-xs text-on-surface font-bold font-mono-data">
                          ${ord.final_price?.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-on-surface">
                        <strong className="text-on-surface-variant">Falla Reportada:</strong>{' '}
                        {ord.reported_fault}
                      </p>
                      {ord.technical_diagnosis && (
                        <p className="text-on-surface-variant bg-surface-container-low p-2 rounded border border-outline-variant/40 mt-1">
                          <strong>Diagnóstico Técnico:</strong> {ord.technical_diagnosis}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
