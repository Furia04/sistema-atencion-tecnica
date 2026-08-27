'use client';

import React from 'react';
import {
  Wrench,
  Check,
  Package,
  Truck,
  Smartphone,
  Calendar,
  MessageSquare,
  LifeBuoy,
  Info,
} from 'lucide-react';
import { OrderStatus } from '@/types';

interface TrackPageProps {
  params: {
    tracking_code: string;
  };
}

export default function TrackOrderPage({ params }: TrackPageProps) {
  const trackingCode = params.tracking_code.toUpperCase();

  // Mock order details
  const shopName = 'ProRepair Ops';
  const shopStation = 'North Station';
  const shopPhone = '+5491122334455';

  const orderStatus: OrderStatus = 'in_progress';
  const deviceName = 'Smartphone - iPhone 13 Pro';
  const reportedFault = 'Pantalla rota / No enciende';
  const estimatedDate = '24 de Octubre';
  const estimatedTime = '14:00 hrs';

  // Build WhatsApp URL dynamically
  const waMessage = encodeURIComponent(
    `Hola ${shopName}, quisiera consultar por el estado de la orden de servicio #${trackingCode}.`
  );
  const waUrl = `https://wa.me/${shopPhone.replace(/[^0-9]/g, '')}?text=${waMessage}`;

  return (
    <div className="min-h-screen bg-background text-on-background font-sans flex flex-col">
      {/* Top Header B2C */}
      <header className="bg-surface-container border-b border-outline-variant py-4 px-gutter flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary-container">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-headline-md text-title-sm font-bold text-primary">
              {shopName}
            </h1>
            <p className="font-label-caps text-label-caps text-on-surface-variant">
              {shopStation}
            </p>
          </div>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-highest transition-colors font-label-caps text-label-caps"
        >
          <LifeBuoy className="w-4 h-4 text-primary" /> Contactar Soporte
        </a>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 flex justify-center items-start p-container-margin md:p-[48px]">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          {/* Page Title */}
          <div className="text-center mb-4">
            <h2 className="font-display-lg text-display-lg text-on-surface mb-2">
              Seguimiento de Reparación
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Consulta el estado en tiempo real de tu equipo.
            </p>
          </div>

          {/* Status Card (Bento-style with Stepper) */}
          <div className="bg-surface-container rounded-xl border border-outline-variant p-6 shadow-md relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/50 relative z-10">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                  CÓDIGO DE SEGUIMIENTO
                </p>
                <p className="font-mono-data text-mono-data text-primary text-lg font-bold">
                  #{trackingCode}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.3)]">
                  EN PROGRESO
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative z-10 py-4 mb-6">
              <div className="flex justify-between items-center w-full relative">
                {/* Connecting Line Background */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -translate-y-1/2 z-0" />
                {/* Active Connecting Line */}
                <div className="absolute top-1/2 left-0 w-1/2 h-[2px] bg-primary -translate-y-1/2 z-0 shadow-[0_0_5px_rgba(210,187,255,0.5)]" />

                {/* Step 1: Received */}
                <div className="flex flex-col items-center z-10 relative">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(210,187,255,0.2)]">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface">
                    Recibido
                  </span>
                </div>

                {/* Step 2: In Progress (Active) */}
                <div className="flex flex-col items-center z-10 relative">
                  <div className="w-8 h-8 rounded-full bg-surface text-primary border-2 border-primary flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(210,187,255,0.4)] relative">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping" />
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="font-label-caps text-label-caps text-primary font-bold">
                    En Progreso
                  </span>
                </div>

                {/* Step 3: Ready */}
                <div className="flex flex-col items-center z-10 relative">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant flex items-center justify-center mb-2">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    Listo
                  </span>
                </div>

                {/* Step 4: Delivered */}
                <div className="flex flex-col items-center z-10 relative">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant flex items-center justify-center mb-2">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    Entregado
                  </span>
                </div>
              </div>
            </div>

            {/* Current Status Message Box */}
            <div className="bg-surface-container-high rounded-lg p-4 border border-outline-variant flex items-start gap-4">
              <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-title-sm text-title-sm text-on-surface mb-1">
                  Estado Actual
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Tu equipo está siendo intervenido por nuestros especialistas en laboratorio técnico.
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device Info Card */}
            <div className="bg-surface-container rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-on-surface mb-2">
                <Smartphone className="w-5 h-5 text-tertiary" />
                <h3 className="font-title-sm text-title-sm">
                  Detalles del Dispositivo
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    EQUIPO
                  </p>
                  <p className="font-body-md text-body-md text-on-surface font-semibold">
                    {deviceName}
                  </p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    FALLA REPORTADA
                  </p>
                  <p className="font-body-md text-body-md text-on-surface bg-surface-container-highest p-2 rounded border border-outline-variant/50 inline-block mt-1">
                    {reportedFault}
                  </p>
                </div>
              </div>
            </div>

            {/* Timing & WhatsApp Action Card */}
            <div className="bg-surface-container rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-on-surface mb-4">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <h3 className="font-title-sm text-title-sm">Estimación</h3>
                </div>
                <div className="bg-surface p-4 rounded-lg border border-outline-variant flex flex-col items-center justify-center text-center">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase">
                    FECHA ESTIMADA DE ENTREGA
                  </p>
                  <p className="font-title-sm text-title-sm text-primary text-xl font-bold">
                    {estimatedDate}
                  </p>
                  <p className="font-mono-data text-mono-data text-on-surface mt-1">
                    {estimatedTime}
                  </p>
                </div>
              </div>

              {/* WhatsApp Floating / Direct Action Button */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-container hover:bg-primary-container/90 text-on-primary-container rounded-lg font-title-sm text-title-sm transition-colors shadow-sm font-semibold"
              >
                <MessageSquare className="w-5 h-5" /> Contactar vía WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-outline-variant text-center text-on-surface-variant font-body-sm text-body-sm">
        <p>© 2026 {shopName}. Sistema de Precisión Técnica.</p>
      </footer>
    </div>
  );
}
