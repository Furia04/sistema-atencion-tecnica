'use client';

import React, { useState } from 'react';
import { Printer, QrCode, Search, User, Smartphone, AlertCircle } from 'lucide-react';

export default function NewOrderIntakePage() {
  // Form State
  const [customerName, setCustomerName] = useState('John Doe');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 019-2839');
  const [deviceType, setDeviceType] = useState('Smartphone');
  const [deviceBrand, setDeviceBrand] = useState('Apple');
  const [deviceModel, setDeviceModel] = useState('iPhone 13 Pro');
  const [serialImei, setSerialImei] = useState('358923019842019');
  const [powersOn, setPowersOn] = useState(true);
  const [faultDescription, setFaultDescription] = useState(
    'Pantalla rota. El táctil no responde en la esquina superior izquierda. Cliente menciona descarga rápida de batería.'
  );

  const [ticketCode] = useState('WO-8891');
  const [todayDate] = useState('2026-10-24 14:32');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Title & Action Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            Point of Intake
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Recepción de equipo, alta de OT y emisión de ticket térmico.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-primary-container text-on-primary-container font-title-sm text-title-sm px-6 py-2.5 rounded hover:bg-primary transition-colors flex items-center gap-2 shadow-[0_0_8px_rgba(124,58,237,0.3)]"
        >
          <Printer className="w-5 h-5" /> Imprimir Ticket & Guardar
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Intake Steps Form */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Customer */}
            <div className="bg-surface-container rounded-lg border border-outline-variant p-6 flex flex-col relative group">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-caps text-label-caps font-bold">
                  1
                </div>
                <h3 className="font-title-sm text-title-sm text-on-surface">
                  Datos del Cliente
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                    Buscar Cliente Existente
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input
                      type="text"
                      placeholder="Teléfono o Nombre..."
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded pl-9 pr-3 py-2 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 my-2">
                  <div className="h-px bg-outline-variant flex-1" />
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">
                    O ALTA RÁPIDA
                  </span>
                  <div className="h-px bg-outline-variant flex-1" />
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                    Teléfono (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-mono-data text-mono-data text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Device & JSONB Custom Attributes */}
            <div className="bg-surface-container rounded-lg border border-outline-variant p-6 flex flex-col relative group">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-caps text-label-caps font-bold">
                  2
                </div>
                <h3 className="font-title-sm text-title-sm text-on-surface">
                  Perfil del Dispositivo
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                    Categoría / Tipo
                  </label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  >
                    <option>Smartphone</option>
                    <option>Computadora / Laptop</option>
                    <option>Tablet</option>
                    <option>Consola de Juegos</option>
                    <option>Automotor / Placa</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-surface-container-lowest p-3 rounded border border-outline-variant/50">
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                      Marca
                    </label>
                    <input
                      type="text"
                      value={deviceBrand}
                      onChange={(e) => setDeviceBrand(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded px-2 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                      Modelo
                    </label>
                    <input
                      type="text"
                      value={deviceModel}
                      onChange={(e) => setDeviceModel(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded px-2 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                      IMEI / Nº Serie
                    </label>
                    <input
                      type="text"
                      value={serialImei}
                      onChange={(e) => setSerialImei(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded px-2 py-1.5 font-mono-data text-mono-data text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="powersOnCheck"
                    checked={powersOn}
                    onChange={(e) => setPowersOn(e.target.checked)}
                    className="rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary"
                  />
                  <label htmlFor="powersOnCheck" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer">
                    El equipo enciende al ingresar
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Diagnosis / Fault */}
          <div className="bg-surface-container rounded-lg border border-outline-variant p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-caps text-label-caps font-bold">
                3
              </div>
              <h3 className="font-title-sm text-title-sm text-on-surface">
                Descripción de la Falla
              </h3>
            </div>
            <textarea
              value={faultDescription}
              onChange={(e) => setFaultDescription(e.target.value)}
              rows={4}
              className="w-full flex-1 bg-surface-container-lowest border border-outline-variant rounded p-3 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
              placeholder="Describa la falla reportada en detalle..."
            />
          </div>
        </div>

        {/* Right Column: Live Thermal Ticket Preview (80mm Format) */}
        <div className="xl:col-span-4 h-full">
          <div className="bg-surface-container rounded-lg border border-outline-variant h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase flex items-center gap-2">
                <Printer className="w-4 h-4 text-primary" /> Ticket Térmico (80mm)
              </h3>
              <span className="px-2 py-0.5 bg-primary/10 text-primary font-label-caps text-xs rounded">
                Previsualización
              </span>
            </div>

            <div className="flex-1 bg-surface-container-highest p-6 flex items-start justify-center overflow-y-auto">
              {/* Simulated Printable Ticket Element */}
              <div
                id="printable-thermal-ticket"
                className="bg-white text-black w-[300px] p-6 shadow-lg font-mono-data text-xs leading-tight"
              >
                <div className="text-center mb-4 border-b-2 border-black border-dashed pb-4">
                  <div className="font-bold text-base uppercase tracking-wider">
                    PRO REPAIR OPS
                  </div>
                  <div>North Station Workshop</div>
                  <div className="mt-2 font-bold text-sm">#{ticketCode}</div>
                  <div className="text-[10px]">{todayDate}</div>
                </div>

                <div className="mb-4">
                  <div className="font-bold uppercase mb-1">CLIENTE</div>
                  <div>Nombre: {customerName}</div>
                  <div>Tel: {customerPhone}</div>
                </div>

                <div className="mb-4">
                  <div className="font-bold uppercase mb-1">DISPOSITIVO</div>
                  <div>Tipo: {deviceType}</div>
                  <div>Equipo: {deviceBrand} {deviceModel}</div>
                  <div>SN/IMEI: {serialImei}</div>
                  <div>Enciende: {powersOn ? 'SÍ' : 'NO'}</div>
                </div>

                <div className="mb-6 border-b-2 border-black border-dashed pb-4">
                  <div className="font-bold uppercase mb-1">FALLA REPORTADA</div>
                  <p className="whitespace-pre-wrap">{faultDescription}</p>
                </div>

                <div className="text-center mb-4 flex flex-col items-center">
                  <QrCode className="w-12 h-12 text-black mb-1" />
                  <div className="text-[10px] font-bold">Escanear para seguimiento</div>
                </div>

                <div className="text-center text-[9px] uppercase">
                  No nos responsabilizamos por pérdida de datos.<br />
                  Términos y condiciones vigentes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
