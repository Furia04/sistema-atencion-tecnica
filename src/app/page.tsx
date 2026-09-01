'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import {
  Wrench,
  Smartphone,
  Laptop,
  Car,
  ShieldCheck,
  CheckCircle2,
  Printer,
  QrCode,
  Search,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Zap,
  Lock,
  Layers,
  Users,
  DollarSign,
  TrendingUp,
  UserCheck,
  User,
  ChevronRight,
  Clock,
  Package,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const [heroMode, setHeroMode] = useState<'cliente' | 'tecnico'>('cliente');
  const [clientDniQuery, setClientDniQuery] = useState('');

  const handleClientSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientDniQuery.trim()) {
      router.push(`/track?q=${encodeURIComponent(clientDniQuery.trim())}`);
    } else {
      router.push('/track');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans selection:bg-primary/30">
      {/* 1. HEADER / NAVBAR */}
      <header className="sticky top-0 bg-surface/90 backdrop-blur-md border-b border-outline-variant/60 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo size={40} textSubtitle="Gestión de Servicio Técnico" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-title-sm text-sm text-on-surface-variant">
            <a href="#caracteristicas" className="hover:text-primary transition-colors">
              Características
            </a>
            <a href="#multirubro" className="hover:text-primary transition-colors">
              Multirubro
            </a>
            <a href="#planes" className="hover:text-primary transition-colors">
              Plan Único
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-on-surface hover:text-primary font-title-sm text-sm font-semibold transition-colors hidden sm:block"
            >
              Ingresar al Taller
            </Link>
            <Link
              href="/demo"
              className="bg-primary-container text-on-primary-container hover:bg-primary font-title-sm text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-primary/40 flex items-center gap-2"
            >
              Probar Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION CON SELECTOR MANUAL (SOY CLIENTE vs SOY TÉCNICO) */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden bg-gradient-to-b from-surface-container-high/40 via-background to-background">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Selector Manual Tipo Carrusel / Pestañas */}
          <div className="inline-flex p-1.5 rounded-2xl bg-surface-container border border-outline-variant/80 shadow-lg gap-2">
            <button
              onClick={() => setHeroMode('cliente')}
              className={`px-6 py-2.5 rounded-xl font-title-sm text-sm font-bold flex items-center gap-2 transition-all ${
                heroMode === 'cliente'
                  ? 'bg-primary text-on-primary shadow-md scale-105'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <User className="w-4 h-4" /> Soy Cliente
            </button>
            <button
              onClick={() => setHeroMode('tecnico')}
              className={`px-6 py-2.5 rounded-xl font-title-sm text-sm font-bold flex items-center gap-2 transition-all ${
                heroMode === 'tecnico'
                  ? 'bg-primary text-on-primary shadow-md scale-105'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Wrench className="w-4 h-4" /> Soy Técnico / Dueño de Taller
            </button>
          </div>

          {/* VISTA A: MODO "SOY CLIENTE" */}
          {heroMode === 'cliente' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-label-caps text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" /> Consulta de Reparación en Tiempo Real
              </div>

              <h1 className="font-display-lg text-4xl sm:text-6xl font-bold text-on-surface tracking-tight leading-tight">
                ¿Dejaste tu equipo en reparación? <br />
                <span className="text-primary underline decoration-primary/40 underline-offset-8">
                  Sigue su avance en vivo
                </span>
              </h1>

              <p className="font-body-md text-lg sm:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                Ingresa tu DNI o código de orden para conocer el diagnóstico técnico, repuestos asignados y cuándo estará listo para retirar.
              </p>

              {/* Buscador Rápido de Cliente */}
              <form
                onSubmit={handleClientSearchSubmit}
                className="max-w-2xl mx-auto bg-surface-container border border-outline-variant/80 rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                  <input
                    type="text"
                    value={clientDniQuery}
                    onChange={(e) => setClientDniQuery(e.target.value)}
                    placeholder="Ingresa tu DNI o Código OT (ej: 38912402)..."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3.5 pl-12 pr-4 font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm sm:text-base"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary text-on-primary hover:bg-primary-container font-title-sm text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" /> Consultar el estado de mi equipo
                </button>
              </form>

              {/* Botón Destacado de Acceso Directo */}
              <div className="pt-2">
                <Link
                  href="/track"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-surface-container-high border border-outline-variant hover:border-primary/50 rounded-2xl text-on-surface hover:text-primary transition-all font-title-sm text-sm font-bold shadow-sm group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span>Consultar el estado de mi equipo</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}

          {/* VISTA B: MODO "SOY TÉCNICO / DUEÑO DE TALLER" */}
          {heroMode === 'tecnico' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-label-caps text-xs font-bold uppercase tracking-wider animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> El SaaS B2B2C para Talleres de Precisión
              </div>

              <h1 className="font-display-lg text-4xl sm:text-6xl font-bold text-on-surface tracking-tight leading-tight">
                Gestión Inteligente para Talleres de Servicio Técnico <span className="text-primary underline decoration-primary/40 underline-offset-8">Multirubro</span>
              </h1>

              <p className="font-body-md text-lg sm:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
                Recepción rápida de equipos, emisión de <strong>ticket térmico de 80mm</strong>, portal público de seguimiento en tiempo real <strong>por DNI o WhatsApp</strong>, y control absoluto de inventario y finanzas.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-primary text-on-primary font-title-sm text-base font-bold px-8 py-4 rounded-xl hover:bg-primary-container transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-3"
                >
                  Comenzar Prueba Gratuita 14 Días <Zap className="w-5 h-5" />
                </Link>
                <Link
                  href="/demo"
                  className="w-full sm:w-auto bg-surface-container-high border border-outline-variant text-on-surface hover:bg-surface-container-highest font-title-sm text-base font-bold px-8 py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Ver Panel en Vivo (Demo)
                </Link>
              </div>

              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-on-surface-variant font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sin tarjeta requerida</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Configuración en 2 minutos</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Soporte multirubro completo</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. SHOWCASE MULTIRUBRO */}
      <section id="multirubro" className="py-20 px-6 bg-surface-container-lowest border-y border-outline-variant/60">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display-lg text-3xl sm:text-4xl font-bold text-on-surface">
              Diseñado para Adaptarse a Cualquier Rubro Técnico
            </h2>
            <p className="font-body-md text-on-surface-variant text-base">
              Gracias a nuestra arquitectura de campos dinámicos JSONB, puedes definir atributos únicos para cada tipo de dispositivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { title: 'Celulares & Tablets', icon: Smartphone, fields: ['IMEI / Serie', 'Patrón de Desbloqueo', 'Estado Batería', 'Tapa Trasera'] },
              { title: 'PC & Laptops', icon: Laptop, fields: ['Cargador Incluido', 'Contraseña OS', 'Capacidad RAM', 'Nº de Serie'] },
              { title: 'Electrónica General', icon: Wrench, fields: ['Voltaje / Amperaje', 'Fórmula de Placa', 'Componentes IC', 'Placa Madre'] },
              { title: 'Automotores / ECUs', icon: Car, fields: ['Kilometraje', 'Código Vin / Chasis', 'Escaneo OBD2', 'Patente'] },
              { title: 'Drones & Consolas', icon: Zap, fields: ['Horas de Vuelo', 'Firmware Version', 'Controles Incluidos', 'Serial Batería'] },
            ].map((cat, i) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={i}
                  className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-title-sm text-base font-bold text-on-surface">
                      {cat.title}
                    </h3>
                    <ul className="space-y-1.5 text-xs text-on-surface-variant">
                      {cat.fields.map((f, j) => (
                        <li key={j} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-primary" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CARACTERÍSTICAS PRINCIPALES */}
      <section id="caracteristicas" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display-lg text-3xl sm:text-4xl font-bold text-on-surface">
              Todo lo que Tu Taller Necesita para Crecer
            </h2>
            <p className="font-body-md text-on-surface-variant text-base">
              Funcionalidades pensadas por y para técnicos y dueños de taller.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="font-title-sm text-xl font-bold text-on-surface">
                Ticket Térmico 80mm & QR
              </h3>
              <p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">
                Imprime comprobantes físicos al instante con el formato estándar de comanda de 80mm e incluye un código QR listo para escanear.
              </p>
            </div>

            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-title-sm text-xl font-bold text-on-surface">
                Seguimiento Público por DNI
              </h3>
              <p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">
                Tus clientes pueden consultar el estado en vivo de su equipo introduciendo su DNI o código de orden desde cualquier celular.
              </p>
            </div>

            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-title-sm text-xl font-bold text-on-surface">
                Notificaciones por WhatsApp
              </h3>
              <p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">
                Envía actualizaciones automáticas cuando el equipo pasa a "Listo para Retirar" o requiere aprobación de presupuesto.
              </p>
            </div>

            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-title-sm text-xl font-bold text-on-surface">
                Bloqueo Financiero por Roles (RBAC)
              </h3>
              <p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">
                Permite a tus técnicos ver todas las órdenes de servicio sin revelar los costos de compra ni los márgenes de ganancia neta.
              </p>
            </div>

            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-title-sm text-xl font-bold text-on-surface">
                Presupuestador de Repuestos
              </h3>
              <p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">
                Desglosa mano de obra e insumos de inventario para calcular presupuestos exactos y cotizaciones en segundos.
              </p>
            </div>

            <div className="bg-surface-container border border-outline-variant/60 p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-title-sm text-xl font-bold text-on-surface">
                Arquitectura Multi-tenant
              </h3>
              <p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">
                Seguridad de nivel bancario con Row Level Security (RLS) en Supabase para aislar al 100% la información de tu taller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLAN ÚNICO PLAN TALLER PRO ($15.000 / MES) */}
      <section id="planes" className="py-24 px-6 bg-surface-container-lowest border-t border-outline-variant/60">
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-label-caps text-xs font-bold uppercase tracking-wider">
              Precio Claro y Sin Sorpresas
            </span>
            <h2 className="font-display-lg text-3xl sm:text-5xl font-bold text-on-surface">
              Un Solo Plan con Todo Incluido
            </h2>
            <p className="font-body-md text-on-surface-variant text-base max-w-xl mx-auto">
              Sin límites ocultos de órdenes ni costos extra. Activa tu taller en 2 minutos.
            </p>
          </div>

          <div className="bg-surface-container border-2 border-primary rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl shadow-primary/15 relative overflow-hidden text-left max-w-2xl mx-auto">
            <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-caps text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
              PLAN COMPLETO
            </div>

            <div className="space-y-2 border-b border-outline-variant/60 pb-6">
              <h3 className="font-headline-md text-2xl sm:text-3xl font-bold text-primary">
                Plan Taller Pro
              </h3>
              <p className="font-body-sm text-sm text-on-surface-variant">
                Acceso total a todas las herramientas operativas, financieras y de clientes para tu taller.
              </p>
              <div className="pt-4 flex items-baseline gap-2">
                <span className="font-display-lg text-4xl sm:text-6xl font-bold text-on-surface font-mono-data">
                  $15.000
                </span>
                <span className="font-title-sm text-base text-on-surface-variant font-semibold">
                  ARS / mes
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-label-caps text-xs text-primary uppercase font-bold tracking-wider">
                Todo lo que incluye tu suscripción:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-on-surface">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Órdenes de servicio ilimitadas</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Gestión de inventario y repuestos</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Rubros y campos 100% personalizables</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Seguimiento público por DNI</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Tickets térmicos de 80mm con QR</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">WhatsApp con plantillas directas</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/register"
                className="w-full bg-primary text-on-primary hover:bg-primary-container font-title-sm text-base font-bold py-4 rounded-2xl transition-all text-center block shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
              >
                Comenzar Prueba Gratuita de 14 Días <Zap className="w-5 h-5" />
              </Link>
              <p className="text-center font-body-sm text-xs text-on-surface-variant mt-3">
                Sin tarjeta de crédito requerida • Cancela cuando quieras
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-surface-container-high border-t border-outline-variant py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-on-surface-variant">
          <Logo size={32} />

          <p>© 2026 JaTech. Software para técnicos. Todos los derechos reservados.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
