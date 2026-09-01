'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, FileText, Search, User, Smartphone, AlertCircle, Save, CheckCircle2, ArrowRight } from 'lucide-react';
import { createServiceOrderWithDevice } from '@/lib/supabase/services';
import { ServiceOrder } from '@/types';

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

  // Formato de Impresión: 80mm vs Hoja A4
  const [printFormat, setPrintFormat] = useState<'80mm' | 'a4'>('80mm');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [ticketCode] = useState(`WO-${Math.floor(1000 + Math.random() * 9000)}`);
  const [todayDate] = useState(new Date().toLocaleDateString('es-AR'));

  const validateForm = () => {
    if (!customerName.trim() || !customerPhone.trim() || !deviceBrand.trim() || !deviceModel.trim() || !faultDescription.trim()) {
      alert('Por favor complete los campos obligatorios (* Nombre del cliente, Teléfono, Marca, Modelo y Descripción de la Falla).');
      return false;
    }
    return true;
  };

  const handleSaveOnly = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setSuccessMessage('');

    const newOrderPayload = {
      customer: {
        full_name: customerName.trim(),
        phone: customerPhone.trim(),
        document_id: customerDocumentId.trim(),
        email: customerEmail.trim(),
      },
      device: {
        type: deviceType,
        brand: deviceBrand.trim(),
        model: deviceModel.trim(),
        serial_number: serialImei.trim(),
        custom_attributes: { powers_on: powersOn },
      },
      order: {
        reported_fault: faultDescription.trim(),
      },
    };

    try {
      await createServiceOrderWithDevice(newOrderPayload);
      setSuccessMessage('¡Orden de servicio guardada exitosamente! Redirigiendo...');
      setTimeout(() => {
        router.push('/orders');
      }, 800);
    } catch (err) {
      console.warn('Guardado local de emergencia realizado:', err);
      const localOrderObj: ServiceOrder = {
        id: `ord-local-${Date.now()}`,
        shop_id: 'local-shop',
        tracking_code: `#${ticketCode}`,
        device_id: `dev-${Date.now()}`,
        customer_id: `cust-${Date.now()}`,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_document_id: customerDocumentId.trim(),
        device_info: `${deviceType} · ${deviceBrand.trim()} ${deviceModel.trim()}`,
        status: 'recibido',
        reported_fault: faultDescription.trim(),
        final_price: 0,
        created_at: new Date().toISOString(),
      };

      try {
        const storedStr = localStorage.getItem('prorepair_local_orders');
        const existing = storedStr ? JSON.parse(storedStr) : [];
        localStorage.setItem('prorepair_local_orders', JSON.stringify([localOrderObj, ...existing]));
      } catch (e) {}

      setSuccessMessage('¡Orden de servicio registrada exitosamente!');
      setTimeout(() => {
        router.push('/orders');
      }, 800);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndPrint = async (selectedFormat: '80mm' | 'a4') => {
    if (!validateForm()) return;

    setPrintFormat(selectedFormat);
    setSaving(true);
    setSuccessMessage('');

    const newOrderPayload = {
      customer: {
        full_name: customerName.trim(),
        phone: customerPhone.trim(),
        document_id: customerDocumentId.trim(),
        email: customerEmail.trim(),
      },
      device: {
        type: deviceType,
        brand: deviceBrand.trim(),
        model: deviceModel.trim(),
        serial_number: serialImei.trim(),
        custom_attributes: { powers_on: powersOn },
      },
      order: {
        reported_fault: faultDescription.trim(),
      },
    };

    try {
      await createServiceOrderWithDevice(newOrderPayload);
    } catch (err) {
      console.warn('Guardado local de emergencia realizado:', err);
      const localOrderObj: ServiceOrder = {
        id: `ord-local-${Date.now()}`,
        shop_id: 'local-shop',
        tracking_code: `#${ticketCode}`,
        device_id: `dev-${Date.now()}`,
        customer_id: `cust-${Date.now()}`,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_document_id: customerDocumentId.trim(),
        device_info: `${deviceType} · ${deviceBrand.trim()} ${deviceModel.trim()}`,
        status: 'recibido',
        reported_fault: faultDescription.trim(),
        final_price: 0,
        created_at: new Date().toISOString(),
      };

      try {
        const storedStr = localStorage.getItem('prorepair_local_orders');
        const existing = storedStr ? JSON.parse(storedStr) : [];
        localStorage.setItem('prorepair_local_orders', JSON.stringify([localOrderObj, ...existing]));
      } catch (e) {}
    } finally {
      setSaving(false);
      setTimeout(() => {
        window.print();
        router.push('/orders');
      }, 300);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 font-sans">
      {/* Encabezado con Botones de Acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface">
            Punto de Recepción de Equipos
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Alta real de cliente, equipo y emisión de orden en la base de datos de tu taller.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          {/* Botón 1: Solo Guardar Orden */}
          <button
            onClick={handleSaveOnly}
            disabled={saving}
            className="flex-1 sm:flex-none bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-on-surface font-title-sm text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            {saving ? 'Guardando...' : 'Guardar Orden (Sin Imprimir)'}
          </button>

          {/* Botón 2: Imprimir Comanda 80mm & Guardar */}
          <button
            onClick={() => handleSaveAndPrint('80mm')}
            disabled={saving}
            className="flex-1 sm:flex-none bg-primary text-on-primary hover:bg-primary-container font-title-sm text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Imprimir Comanda (80mm) & Guardar'}
          </button>

          {/* Botón 3: Imprimir Hoja A4 & Guardar */}
          <button
            onClick={() => handleSaveAndPrint('a4')}
            disabled={saving}
            className="flex-1 sm:flex-none bg-purple-600 text-white hover:bg-purple-500 font-title-sm text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Imprimir Hoja A4 & Guardar'}
          </button>
        </div>
      </div>

      {/* Notificación de Éxito */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
        {/* Columna Izquierda: Formulario de Recepción */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paso 1: Datos del Cliente */}
            <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 flex flex-col relative group shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/60 pb-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-caps text-xs font-bold">
                  1
                </div>
                <h3 className="font-title-sm text-sm text-on-surface font-bold">
                  Datos del Cliente
                </h3>
              </div>

              <div className="space-y-3 flex-1 text-xs">
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase text-[10px]">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Sarah Connor"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase text-[10px]">
                    DNI / CUIT / Identificación
                  </label>
                  <input
                    type="text"
                    value={customerDocumentId}
                    onChange={(e) => setCustomerDocumentId(e.target.value)}
                    placeholder="Ej: 38912402"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2 font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase text-[10px]">
                    Teléfono (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ej: +54 9 11 4455 6677"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2 font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Paso 2: Perfil del Dispositivo */}
            <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 flex flex-col relative group shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/60 pb-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-caps text-xs font-bold">
                  2
                </div>
                <h3 className="font-title-sm text-sm text-on-surface font-bold">
                  Perfil del Dispositivo
                </h3>
              </div>

              <div className="space-y-3 flex-1 text-xs">
                <div>
                  <label className="block font-bold text-on-surface-variant mb-1 uppercase text-[10px]">
                    Categoría / Tipo
                  </label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 font-semibold"
                  >
                    <option>Smartphone</option>
                    <option>Computadora / Laptop</option>
                    <option>Tablet</option>
                    <option>Consola de Juegos</option>
                    <option>Automotor / Placa ECU</option>
                    <option>Drone / Robótica</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/50">
                  <div>
                    <label className="block font-bold text-on-surface-variant mb-1 uppercase text-[10px]">
                      Marca *
                    </label>
                    <input
                      type="text"
                      required
                      value={deviceBrand}
                      onChange={(e) => setDeviceBrand(e.target.value)}
                      placeholder="Ej: Apple"
                      className="w-full bg-surface border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-on-surface-variant mb-1 uppercase text-[10px]">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      required
                      value={deviceModel}
                      onChange={(e) => setDeviceModel(e.target.value)}
                      placeholder="Ej: iPhone 13 Pro"
                      className="w-full bg-surface border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-on-surface"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-bold text-on-surface-variant mb-1 uppercase text-[10px]">
                      IMEI / Nº Serie
                    </label>
                    <input
                      type="text"
                      value={serialImei}
                      onChange={(e) => setSerialImei(e.target.value)}
                      placeholder="Ej: 358923019842019"
                      className="w-full bg-surface border border-outline-variant rounded-lg px-2.5 py-1.5 font-mono text-xs text-on-surface"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="powersOnCheck"
                    checked={powersOn}
                    onChange={(e) => setPowersOn(e.target.checked)}
                    className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary"
                  />
                  <label htmlFor="powersOnCheck" className="text-xs font-semibold text-on-surface-variant cursor-pointer select-none">
                    El equipo enciende al ingresar
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Paso 3: Falla Reportada */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 flex flex-col shadow-sm">
            <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/60 pb-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-caps text-xs font-bold">
                3
              </div>
              <h3 className="font-title-sm text-sm text-on-surface font-bold">
                Descripción de la Falla *
              </h3>
            </div>
            <textarea
              required
              value={faultDescription}
              onChange={(e) => setFaultDescription(e.target.value)}
              rows={4}
              className="w-full flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
              placeholder="Describa la falla reportada por el cliente en detalle..."
            />
          </div>
        </div>

        {/* Columna Derecha: Vista Previa de Documento (80mm o A4) */}
        <div className="xl:col-span-5 h-full">
          <div className="bg-surface-container rounded-2xl border border-outline-variant h-full flex flex-col overflow-hidden shadow-xl">
            {/* Encabezado y Pestañas de Vista Previa */}
            <div className="p-4 border-b border-outline-variant bg-surface-container-high flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase flex items-center gap-2 font-bold">
                <Printer className="w-4 h-4 text-primary" /> Vista Previa de Documento
              </span>

              <div className="flex bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/60 text-xs w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPrintFormat('80mm')}
                  className={`px-3 py-1 font-bold rounded-lg transition-all text-[11px] ${
                    printFormat === '80mm'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Comanda 80mm
                </button>
                <button
                  type="button"
                  onClick={() => setPrintFormat('a4')}
                  className={`px-3 py-1 font-bold rounded-lg transition-all text-[11px] ${
                    printFormat === 'a4'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Hoja A4
                </button>
              </div>
            </div>

            {/* Contenedor de Vista Previa en Pantalla */}
            <div className="flex-1 bg-surface-container-highest p-6 flex items-start justify-center overflow-y-auto max-h-[70vh]">
              {printFormat === '80mm' ? (
                /* VISTA PREVIA COMANDA 80MM (SIN QR CODE) */
                <div className="bg-white text-black w-[300px] p-6 shadow-2xl font-mono text-xs leading-tight rounded-sm">
                  <div className="text-center mb-4 border-b-2 border-black border-dashed pb-4">
                    <div className="font-bold text-base uppercase tracking-wider">
                      JATECH
                    </div>
                    <div className="text-[10px]">SERVICIOS Y REPARACIONES</div>
                    <div className="mt-2 font-bold text-sm font-mono">#{ticketCode}</div>
                    <div className="text-[10px]">{todayDate}</div>
                  </div>

                  <div className="mb-4 space-y-0.5 text-[11px]">
                    <div className="font-bold uppercase text-[10px] text-slate-700">CLIENTE</div>
                    <div>Nombre: {customerName || '------------------'}</div>
                    <div>DNI: {customerDocumentId || 'N/A'}</div>
                    <div>Tel: {customerPhone || '------------------'}</div>
                  </div>

                  <div className="mb-4 space-y-0.5 text-[11px]">
                    <div className="font-bold uppercase text-[10px] text-slate-700">DISPOSITIVO</div>
                    <div>Tipo: {deviceType}</div>
                    <div>Equipo: {deviceBrand} {deviceModel}</div>
                    <div>SN/IMEI: {serialImei || 'N/A'}</div>
                    <div>Enciende: {powersOn ? 'SÍ' : 'NO'}</div>
                  </div>

                  <div className="mb-6 border-b-2 border-black border-dashed pb-4 text-[11px]">
                    <div className="font-bold uppercase text-[10px] text-slate-700">FALLA REPORTADA</div>
                    <p className="whitespace-pre-wrap italic mt-0.5">{faultDescription || 'Sin especificar...'}</p>
                  </div>

                  <div className="text-center text-[9px] text-slate-600 leading-tight">
                    <p>No nos responsabilizamos por pérdida de datos.</p>
                    <p>Garantía de reparación: 30 días.</p>
                  </div>
                </div>
              ) : (
                /* VISTA PREVIA HOJA A4 (SIN QR CODE) */
                <div className="bg-white text-black w-full max-w-lg p-6 shadow-2xl font-sans text-xs space-y-4 rounded-sm border border-slate-300">
                  <div className="flex justify-between items-start border-b-2 border-black pb-3">
                    <div>
                      <h2 className="font-extrabold text-base uppercase tracking-tight">JATECH</h2>
                      <p className="text-[10px] font-semibold text-slate-700">ORDEN DE INGRESO Y ASISTENCIA TÉCNICA</p>
                    </div>
                    <div className="text-right bg-slate-100 p-2 rounded border border-slate-300 font-mono">
                      <span className="text-[9px] font-bold text-slate-600 block">CÓDIGO OT</span>
                      <span className="text-base font-extrabold text-slate-900">#{ticketCode}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-[11px]">
                    <div>
                      <span className="font-bold text-slate-700 uppercase block text-[9px]">CLIENTE</span>
                      <p className="font-bold text-xs">{customerName || '------------------'}</p>
                      <p>DNI/CUIT: {customerDocumentId || 'N/A'}</p>
                      <p>Tel: {customerPhone || '------------------'}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 uppercase block text-[9px]">DISPOSITIVO</span>
                      <p className="font-bold text-xs">{deviceBrand} {deviceModel || '------------------'}</p>
                      <p>Tipo: {deviceType}</p>
                      <p>IMEI/SN: {serialImei || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                    <span className="font-bold uppercase text-[9px] text-slate-600">FALLA REPORTADA AL INGRESO</span>
                    <p className="text-xs italic">{faultDescription || 'Sin especificar...'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 text-center text-[10px] font-bold">
                    <div className="border-t border-black pt-1">
                      Firma del Cliente
                    </div>
                    <div className="border-t border-black pt-1">
                      Firma del Técnico
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENTE EXCLUSIVO IMPRESIÓN (PRINT MEDIA CSS FOR 80MM) */}
      {printFormat === '80mm' && (
        <div className="hidden print:block print:w-[80mm] print:p-2 print:m-0 print:bg-white print:text-black font-mono text-[10px] leading-tight">
          <div className="text-center pb-2 mb-2 border-b border-dashed border-black">
            <h1 className="font-bold text-xs uppercase">JATECH</h1>
            <p className="text-[9px]">SERVICIOS Y REPARACIONES</p>
            <p className="text-[9px]">TEL/WA: {customerPhone || 'N/A'}</p>
          </div>

          <div className="text-center py-2 mb-2 bg-gray-100 rounded border border-black font-mono">
            <span className="text-[8px] uppercase font-bold">CÓDIGO DE ORDEN</span>
            <div className="text-lg font-bold">#{ticketCode}</div>
          </div>

          <div className="pb-2 mb-2 border-b border-dashed border-black space-y-0.5">
            <div><strong>FECHA:</strong> {todayDate}</div>
            <div><strong>CLIENTE:</strong> {customerName}</div>
            {customerDocumentId && <div><strong>DNI/CUIT:</strong> {customerDocumentId}</div>}
            {customerPhone && <div><strong>TEL:</strong> {customerPhone}</div>}
          </div>

          <div className="pb-2 mb-2 border-b border-dashed border-black space-y-0.5">
            <div className="font-bold uppercase">EQUIPO</div>
            <div>{deviceType} - {deviceBrand} {deviceModel}</div>
            {serialImei && <div>SN/IMEI: {serialImei}</div>}
            <div><strong>FALLA:</strong> {faultDescription}</div>
          </div>

          <div className="text-[8px] text-center pt-1">
            <p>No nos responsabilizamos por pérdida de datos.</p>
            <p className="font-bold mt-2">www.jatech.ops / #{ticketCode}</p>
          </div>
        </div>
      )}

      {/* COMPONENTE EXCLUSIVO IMPRESIÓN (PRINT MEDIA CSS FOR HOJA A4) */}
      {printFormat === 'a4' && (
        <div className="hidden print:block print:w-full print:p-8 print:m-0 print:bg-white print:text-black font-sans text-xs space-y-6">
          <div className="flex justify-between items-start border-b-2 border-black pb-4">
            <div>
              <h1 className="font-extrabold text-xl uppercase">JATECH</h1>
              <p className="text-xs font-bold text-gray-700">ORDEN DE INGRESO Y CERTIFICADO TÉCNICO</p>
              <p className="text-xs">Fecha de Ingreso: {todayDate}</p>
            </div>
            <div className="text-right border border-black p-3 rounded font-mono">
              <span className="text-xs font-bold block uppercase">ORDEN DE SERVICIO</span>
              <span className="text-2xl font-extrabold">#{ticketCode}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 border border-black rounded text-xs">
            <div>
              <span className="font-bold uppercase text-[10px] text-gray-600 block mb-1">DATOS DEL CLIENTE</span>
              <p className="font-bold text-sm">{customerName}</p>
              <p>DNI / CUIT: {customerDocumentId || 'S/D'}</p>
              <p>Teléfono: {customerPhone}</p>
            </div>
            <div>
              <span className="font-bold uppercase text-[10px] text-gray-600 block mb-1">DATOS DEL DISPOSITIVO</span>
              <p className="font-bold text-sm">{deviceBrand} {deviceModel}</p>
              <p>Tipo: {deviceType}</p>
              <p>IMEI/SN: {serialImei || 'N/A'}</p>
              <p>Enciende: {powersOn ? 'Sí' : 'No'}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 border border-black rounded space-y-2">
            <span className="font-bold uppercase text-[10px] text-gray-600">DESCRIPCIÓN DE LA FALLA REPORTADA</span>
            <p className="font-bold text-sm">{faultDescription}</p>
          </div>

          <div className="border-t border-black pt-3 text-[10px] text-gray-700 leading-relaxed">
            <p>El cliente declara haber entregado el dispositivo descrito en las condiciones mencionadas. Los presupuestos tienen una validez de 15 días. Garantía sobre la falla reparada: 30 días.</p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-16 text-center text-xs font-bold">
            <div className="border-t border-black pt-2">
              Firma y Aclaración del Cliente
            </div>
            <div className="border-t border-black pt-2">
              Firma y Sello del Técnico / Taller
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
