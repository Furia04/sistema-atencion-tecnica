'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Copy,
  Check,
  MessageSquare,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSimulateSuccessfulPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-xl bg-surface-container border border-outline-variant/80 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <Logo size={42} textSubtitle="Software para técnicos" />
          </Link>
          <h1 className="font-title-sm text-xl font-bold text-on-surface pt-2">
            Activación de Membresía SaaS
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Acceso instantáneo e ilimitado para tu taller de servicio técnico.
          </p>
        </div>

        {/* Resumen del Plan */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-label-caps text-xs text-primary uppercase font-bold">
              Plan Mensual SaaS
            </span>
            <h2 className="font-title-sm text-lg font-bold text-on-surface">
              JaTech — Plan Taller Pro
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Acceso completo para tu taller • Facturación mensual
            </p>
          </div>

          <div className="text-right self-end sm:self-auto">
            <div className="font-display-lg text-3xl font-bold text-emerald-400 font-mono-data">
              $15.000
            </div>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
              ARS / mes
            </span>
          </div>
        </div>

        {paymentSuccess ? (
          <div className="bg-emerald-500/10 border-2 border-emerald-500/40 rounded-2xl p-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-title-sm text-xl font-bold text-on-surface">
              ¡Pago Aprobado y Suscripción Activada!
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Redirigiendo a tu panel de administración del taller...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Opciones de Pago */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Opción A: Transferencia Bancaria Directa */}
              <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-title-sm text-sm font-bold">
                    <Building2 className="w-4 h-4" /> Transferencia Alias / CBU
                  </div>
                  <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/40 space-y-1 font-mono-data text-xs">
                    <div className="text-on-surface-variant text-[10px] uppercase font-bold">Alias MercadoPago / CBU:</div>
                    <div className="text-on-surface font-bold text-sm">JATECH.OPS.MP</div>
                    <div className="text-on-surface-variant text-[10px]">Titular: JaTech Software SRL</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText('JATECH.OPS.MP');
                    setCopiedAlias(true);
                    setTimeout(() => setCopiedAlias(false), 2000);
                  }}
                  className="w-full bg-surface-bright border border-outline-variant hover:bg-surface-container-highest text-on-surface text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedAlias ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> ¡Alias Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-primary" /> Copiar Alias de Pago
                    </>
                  )}
                </button>
              </div>

              {/* Opción B: Tarjeta o Mercado Pago Instantáneo */}
              <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-title-sm text-sm font-bold">
                    <CreditCard className="w-4 h-4" /> Mercado Pago / Tarjeta
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Aprobación inmediata en 1 clic mediante pasarela de pago segura de Mercado Pago.
                  </p>
                </div>

                <button
                  onClick={handleSimulateSuccessfulPayment}
                  disabled={processing}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-title-sm text-xs font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" /> {processing ? 'Procesando Pago...' : 'Pagar $15.000 con Mercado Pago'}
                </button>
              </div>
            </div>

            {/* Notificación de Asistencia por WhatsApp */}
            <div className="text-center pt-2 border-t border-outline-variant/40">
              <a
                href="https://wa.me/?text=Hola,%20acabo%20de%20realizar%20la%20transferencia%20de%20%2415.000%20para%20activar%20mi%20taller%20en%20JaTech."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-title-sm text-on-surface-variant hover:text-emerald-400 font-semibold transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" /> ¿Ya transferiste? Enviar comprobante por WhatsApp al Administrador
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
