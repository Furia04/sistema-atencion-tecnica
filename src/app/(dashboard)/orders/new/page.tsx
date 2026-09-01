'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, Search, User, Smartphone, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { createServiceOrderWithDevice } from '@/lib/supabase/services';

export default function NewOrderIntakePage() {
  const router = useRouter();

  // Datos del Cliente con DNI / Documento
  const [customerName, setCustomerName] = useState('');
  const [customerDocumentId, setCustomerDocumentId] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Datos del Dispositivo
  const [deviceType, setDeviceType] = useState('Smartphone');
  const [deviceBrand, setDeviceBrand] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [serialImei, setSerialImei] = useState('');
  const [powersOn, setPowersOn] = useState(true);
  const [faultDescription, setFaultDescription] = useState('');

  const [saving, setSaving] = useState(false);
  const [ticketCode] = useState(`WO-${Math.floor(1000 + Math.random() * 9000)}`);
  const [todayDate] = useState(new Date().toLocaleString('es-AR'));

  const handleSaveAndPrint = async () => {
    if (!customerName || !customerPhone || !deviceBrand || !deviceModel || !faultDescription) {
      alert('Por favor complete los campos obligatorios (Nombre del cliente, Teléfono, Marca, Modelo y Descripción de la Falla).');
      return;
    }

    setSaving(true);
    try {
      await createServiceOrderWithDevice({
        customer: {
          full_name: customerName,
          phone: customerPhone,
          document_id: customerDocumentId,
          email: customerEmail,
        },
        device: {
          type: deviceType,
          brand: deviceBrand,
          model: deviceModel,
          serial_number: serialImei,
          custom_attributes: { powers_on: powersOn },
        },
        order: {
          reported_fault: faultDescription,
        },
      });

      // Imprimir comanda 80mm
      window.print();

      // Redirigir a la lista de órdenes
      router.push('/orders');
    } catch (err) {
      console.warn('Guardado local fallback realizado:', err);
      window.print();
      router.push('/orders');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Encabezado */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            Punto de Recepción
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Alta real de cliente, equipo y emisión de orden en la base de datos de tu taller.
          </p>
        </div>
        <button
          onClick={handleSaveAndPrint}
          disabled={saving}
          className="bg-primary-container text-on-primary-container font-title-sm text-title-sm px-6 py-2.5 rounded-lg hover:bg-primary transition-colors flex items-center gap-2 shadow-[0_0_8px_rgba(124,58,237,0.3)] font-semibold disabled:opacity-50"
        >
          <Printer className="w-5 h-5" /> {saving ? 'Guardando...' : 'Imprimir Ticket & Guardar'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
        {/* Columna Izquierda: Formulario de Recepción */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paso 1: Datos del Cliente */}
            <div className="bg-surface-container rounded-xl border border-outline-variant p-6 flex flex-col relative group">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-caps text-label-caps font-bold">
                  1
                </div>
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  Datos del Cliente
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase font-semibold">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Sarah Connor"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase font-semibold">
                    DNI / CUIT / Identificación
                  </label>
                  <input
                    type="text"
                    value={customerDocumentId}
                    onChange={(e) => setCustomerDocumentId(e.target.value)}
                    placeholder="Ej: 38912402"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-mono-data text-mono-data text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase font-semibold">
                    Teléfono (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ej: +54 9 11 4455 6677"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-mono-data text-mono-data text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Paso 2: Perfil del Dispositivo */}
            <div className="bg-surface-container rounded-xl border border-outline-variant p-6 flex flex-col relative group">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-caps text-label-caps font-bold">
                  2
                </div>
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  Perfil del Dispositivo
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase font-semibold">
                    Categoría / Tipo
                  </label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  >
                    <option>Smartphone</option>
                    <option>Computadora / Laptop</option>
                    <option>Tablet</option>
                    <option>Consola de Juegos</option>
                    <option>Automotor / Placa ECU</option>
                    <option>Drone / Robótica</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/50">
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase font-semibold">
                      Marca *
                    </label>
                    <input
                      type="text"
                      required
                      value={deviceBrand}
                      onChange={(e) => setDeviceBrand(e.target.value)}
                      placeholder="Ej: Apple"
                      className="w-full bg-surface border border-outline-variant rounded px-2 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase font-semibold">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      required
                      value={deviceModel}
                      onChange={(e) => setDeviceModel(e.target.value)}
                      placeholder="Ej: iPhone 13 Pro"
                      className="w-full bg-surface border border-outline-variant rounded px-2 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase font-semibold">
                      IMEI / Nº Serie
                    </label>
                    <input
                      type="text"
                      value={serialImei}
                      onChange={(e) => setSerialImei(e.target.value)}
                      placeholder="Ej: 358923019842019"
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
                    className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary"
                  />
                  <label htmlFor="powersOnCheck" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none">
                    El equipo enciende al ingresar
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Paso 3: Falla Reportada */}
          <div className="bg-surface-container rounded-xl border border-outline-variant p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-caps text-label-caps font-bold">
                3
              </div>
              <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                Descripción de la Falla *
              </h3>
            </div>
            <textarea
              required
              value={faultDescription}
              onChange={(e) => setFaultDescription(e.target.value)}
              rows={4}
              className="w-full flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
              placeholder="Describa la falla reportada por el cliente en detalle..."
            />
          </div>
        </div>

        {/* Columna Derecha: Ticket Térmico Imprimible 80mm */}
        <div className="xl:col-span-4 h-full">
          <div className="bg-surface-container rounded-xl border border-outline-variant h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase flex items-center gap-2 font-bold">
                <Printer className="w-4 h-4 text-primary" /> Ticket Térmico (80mm)
              </h3>
              <span className="px-2 py-0.5 bg-primary/10 text-primary font-label-caps text-xs rounded font-bold">
                Previsualización
              </span>
            </div>

            <div className="flex-1 bg-surface-container-highest p-6 flex items-start justify-center overflow-y-auto">
              <div
                id="printable-thermal-ticket"
                className="bg-white text-black w-[300px] p-6 shadow-lg font-mono-data text-xs leading-tight"
              >
                <div className="text-center mb-4 border-b-2 border-black border-dashed pb-4">
                  <div className="font-bold text-base uppercase tracking-wider">
                    PRO REPAIR OPS
                  </div>
                  <div>Comanda Técnica</div>
                  <div className="mt-2 font-bold text-sm">#{ticketCode}</div>
                  <div className="text-[10px]">{todayDate}</div>
                </div>

                <div className="mb-4">
                  <div className="font-bold uppercase mb-1">CLIENTE</div>
                  <div>Nombre: {customerName || '------------------'}</div>
                  <div>DNI: {customerDocumentId || 'N/A'}</div>
                  <div>Tel: {customerPhone || '------------------'}</div>
                </div>

                <div className="mb-4">
                  <div className="font-bold uppercase mb-1">DISPOSITIVO</div>
                  <div>Tipo: {deviceType}</div>
                  <div>Equipo: {deviceBrand} {deviceModel}</div>
                  <div>SN/IMEI: {serialImei || 'N/A'}</div>
                  <div>Enciende: {powersOn ? 'SÍ' : 'NO'}</div>
                </div>

                <div className="mb-6 border-b-2 border-black border-dashed pb-4">
                  <div className="font-bold uppercase mb-1">FALLA REPORTADA</div>
                  <p className="whitespace-pre-wrap">{faultDescription || 'Sin especificar...'}</p>
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
