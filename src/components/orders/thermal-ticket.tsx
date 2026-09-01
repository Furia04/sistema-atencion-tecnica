'use client';

import React from 'react';
import { ServiceOrder, Shop } from '@/types';
import { Printer, X, Wrench, Calendar, Phone, User, FileText, CheckCircle2 } from 'lucide-react';

interface ThermalTicketProps {
  order: ServiceOrder;
  shop?: Shop | null;
  onClose?: () => void;
}

export const ThermalTicket: React.FC<ThermalTicketProps> = ({ order, shop, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const shopName = shop?.name || 'TALLER DE SERVICIO TÉCNICO';
  const shopPhone = (shop as any)?.phone || '+54 9 11 4455-6677';
  const termsText = (shop?.settings as any)?.ticket?.terms || 
    'Equipos no retirados después de 30 días pasarán a disponerse según reglamentación vigente. Garantía de reparación: 30 días sobre la falla reparada.';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Contenedor de Botones de Acción (Se oculta al imprimir) */}
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 max-w-md w-full space-y-6 shadow-2xl relative print:hidden">
        <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3">
          <h3 className="font-title-sm text-base font-bold text-on-surface flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" /> Vista Previa Comanda 80mm
          </h3>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-surface-container-highest rounded-lg transition-colors">
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          )}
        </div>

        {/* Vista Previa del Ticket Térmico en pantalla */}
        <div className="bg-white text-black p-4 rounded-xl shadow-inner font-mono text-xs space-y-3 border border-slate-300 max-h-[60vh] overflow-y-auto">
          <div className="text-center space-y-1 pb-2 border-b border-dashed border-black">
            <h2 className="font-bold text-sm uppercase">{shopName}</h2>
            <p className="text-[10px]">SERVICIOS Y REPARACIONES</p>
            <p className="text-[10px]">Tel / WhatsApp: {shopPhone}</p>
          </div>

          <div className="text-center py-2 bg-slate-100 rounded border border-slate-300 space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-slate-600">CÓDIGO DE ORDEN</span>
            <div className="text-xl font-extrabold tracking-wider">{order.tracking_code}</div>
          </div>

          <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-black">
            <div className="flex justify-between">
              <span className="font-bold">FECHA:</span>
              <span>{new Date(order.created_at).toLocaleDateString('es-AR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">CLIENTE:</span>
              <span>{order.customer_name}</span>
            </div>
            {order.customer_document_id && (
              <div className="flex justify-between">
                <span className="font-bold">DNI/CUIT:</span>
                <span>{order.customer_document_id}</span>
              </div>
            )}
            {order.customer_phone && (
              <div className="flex justify-between">
                <span className="font-bold">TEL:</span>
                <span>{order.customer_phone}</span>
              </div>
            )}
          </div>

          <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-black">
            <div className="font-bold uppercase text-[10px] text-slate-700">EQUIPO DE REPARACIÓN</div>
            <div className="font-bold">{order.device_info}</div>
            <div>
              <span className="font-bold">FALLA REPORTADA:</span>
              <p className="mt-0.5 italic">{order.reported_fault}</p>
            </div>
          </div>

          {order.final_price && order.final_price > 0 ? (
            <div className="flex justify-between font-bold text-sm py-1 border-b border-dashed border-black">
              <span>PRECIO ESTIMADO:</span>
              <span>${order.final_price.toLocaleString('es-AR')}</span>
            </div>
          ) : null}

          <div className="text-[9px] leading-tight text-slate-600 text-center pt-1">
            <p className="italic">{termsText}</p>
            <p className="font-bold mt-2">¡Gracias por confiar en {shopName}!</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-on-surface font-title-sm text-xs font-bold py-3 rounded-xl transition-colors"
            >
              Cerrar
            </button>
          )}
          <button
            onClick={handlePrint}
            className="flex-1 bg-primary text-on-primary hover:bg-primary-container font-title-sm text-xs font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" /> Imprimir Comanda (80mm)
          </button>
        </div>
      </div>

      {/* COMPONENTE EXCLUSIVO IMPRESIÓN (PRINT MEDIA CSS) */}
      <div className="hidden print:block print:w-[80mm] print:p-2 print:m-0 print:bg-white print:text-black font-mono text-[10px] leading-tight">
        <div className="text-center pb-2 mb-2 border-b border-dashed border-black">
          <h1 className="font-bold text-xs uppercase">{shopName}</h1>
          <p className="text-[9px]">SERVICIOS Y REPARACIONES</p>
          <p className="text-[9px]">TEL/WA: {shopPhone}</p>
        </div>

        <div className="text-center py-2 mb-2 bg-gray-100 rounded border border-black">
          <span className="text-[8px] uppercase font-bold">CÓDIGO DE ORDEN</span>
          <div className="text-lg font-bold">{order.tracking_code}</div>
        </div>

        <div className="pb-2 mb-2 border-b border-dashed border-black space-y-0.5">
          <div><strong>FECHA:</strong> {new Date(order.created_at).toLocaleDateString('es-AR')}</div>
          <div><strong>CLIENTE:</strong> {order.customer_name}</div>
          {order.customer_document_id && <div><strong>DNI/CUIT:</strong> {order.customer_document_id}</div>}
          {order.customer_phone && <div><strong>TEL:</strong> {order.customer_phone}</div>}
        </div>

        <div className="pb-2 mb-2 border-b border-dashed border-black space-y-0.5">
          <div className="font-bold uppercase">EQUIPO</div>
          <div>{order.device_info}</div>
          <div><strong>FALLA:</strong> {order.reported_fault}</div>
        </div>

        {order.final_price && order.final_price > 0 ? (
          <div className="flex justify-between font-bold text-xs pb-2 mb-2 border-b border-dashed border-black">
            <span>PRECIO:</span>
            <span>${order.final_price.toLocaleString('es-AR')}</span>
          </div>
        ) : null}

        <div className="text-[8px] text-center pt-1">
          <p>{termsText}</p>
          <p className="font-bold mt-2">www.prorepair.ops / {order.tracking_code}</p>
        </div>
      </div>
    </div>
  );
};
