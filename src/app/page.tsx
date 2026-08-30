'use client';

import React from 'react';
import Link from 'next/link';
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
  Star,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans selection:bg-primary/30">
      {/* 1. HEADER / NAVBAR */}
      <header className="sticky top-0 bg-surface/90 backdrop-blur-md border-b border-outline-variant/60 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo size={40} textSubtitle="SaaS Técnico Multirubro" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-title-sm text-sm text-on-surface-variant">
            <a href="#caracteristicas" className="hover:text-primary transition-colors">
              Características
            </a>
            <a href="#multirubro" className="hover:text-primary transition-colors">
              Multirubro
            </a>
            <a href="#planes" className="hover:text-primary transition-colors">
              Planes y Precios
            </a>
            <a href="#testimonios" className="hover:text-primary transition-colors">
              Testimonios
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
              href="/dashboard"
              className="bg-primary-container text-on-primary-container hover:bg-primary font-title-sm text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-primary/40 flex items-center gap-2"
            >
              Probar Demo Gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden bg-gradient-to-b from-surface-container-high/40 to-background">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
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
              href="/dashboard"
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
                Seguimiento B2C por DNI
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

      {/* 5. PLANES Y PRECIOS */}
      <section id="planes" className="py-24 px-6 bg-surface-container-lowest border-t border-outline-variant/60">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display-lg text-3xl sm:text-4xl font-bold text-on-surface">
              Planes Transparentes para Cada Etapa de Tu Taller
            </h2>
            <p className="font-body-md text-on-surface-variant text-base">
              Suscríbete mensualmente de forma segura. Cancela cuando quieras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="font-title-sm text-xl font-bold text-on-surface">Plan Técnico</h3>
                <p className="font-body-sm text-xs text-on-surface-variant">Ideal para talleres unipersonales o inicio de actividades.</p>
                <div className="font-display-lg text-4xl font-bold text-on-surface font-mono-data">
                  $15 <span className="text-xs font-sans text-on-surface-variant font-normal">/mes</span>
                </div>
                <ul className="space-y-3 text-xs text-on-surface-variant pt-4 border-t border-outline-variant/50">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Sucursal</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hasta 2 Usuarios Térmicos</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Órdenes Ilimitadas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ticket 80mm & Portal B2C</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface hover:bg-surface-container-highest font-title-sm text-sm font-bold py-3 rounded-xl transition-colors text-center block"
              >
                Comenzar Plan Técnico
              </Link>
            </div>

            <div className="bg-surface-container border-2 border-primary rounded-2xl p-8 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-primary/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-label-caps text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider">
                MÁS POPULAR
              </div>
              <div className="space-y-4">
                <h3 className="font-title-sm text-xl font-bold text-primary">Plan Pro Taller</h3>
                <p className="font-body-sm text-xs text-on-surface-variant">Para talleres consolidados con varios técnicos.</p>
                <div className="font-display-lg text-4xl font-bold text-on-surface font-mono-data">
                  $35 <span className="text-xs font-sans text-on-surface-variant font-normal">/mes</span>
                </div>
                <ul className="space-y-3 text-xs text-on-surface-variant pt-4 border-t border-outline-variant/50">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Sucursal</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hasta 10 Técnicos (RBAC)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> WhatsApp Directo con Plantillas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Presupuestador de Repuestos</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Historial Completo por DNI</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full bg-primary text-on-primary hover:bg-primary-container font-title-sm text-sm font-bold py-3 rounded-xl transition-all text-center block shadow-lg"
              >
                Probar Gratis 14 Días
              </Link>
            </div>

            <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="font-title-sm text-xl font-bold text-on-surface">Multi-Sucursal</h3>
                <p className="font-body-sm text-xs text-on-surface-variant">Redes de servicio técnico con múltiples ubicaciones.</p>
                <div className="font-display-lg text-4xl font-bold text-on-surface font-mono-data">
                  $75 <span className="text-xs font-sans text-on-surface-variant font-normal">/mes</span>
                </div>
                <ul className="space-y-3 text-xs text-on-surface-variant pt-4 border-t border-outline-variant/50">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Múltiples Sucursales</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Usuarios & Técnicos Ilimitados</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dominio Personalizado</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Soporte VIP 24/7</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface hover:bg-surface-container-highest font-title-sm text-sm font-bold py-3 rounded-xl transition-colors text-center block"
              >
                Contactar Ventas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIOS */}
      <section id="testimonios" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display-lg text-3xl sm:text-4xl font-bold text-on-surface">
              Confían en Nosotros Más de 400 Talleres
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="font-body-sm text-sm text-on-surface-variant italic">
                "El seguimiento por DNI nos redujo un 80% las llamadas de clientes preguntando por su equipo. Además la plantilla de WhatsApp es fantástica."
              </p>
              <div>
                <p className="font-title-sm text-sm font-bold text-on-surface">Matías Fernández</p>
                <p className="font-label-caps text-xs text-primary">Dueño de Electrónica Sur</p>
              </div>
            </div>

            <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="font-body-sm text-sm text-on-surface-variant italic">
                "Poder configurar campos dinámicos para laptops y luego otros para drones nos permitió unificar todo el taller en un solo sistema."
              </p>
              <div>
                <p className="font-title-sm text-sm font-bold text-on-surface">Gonzalo Rossi</p>
                <p className="font-label-caps text-xs text-primary">Tech Repair Argentina</p>
              </div>
            </div>

            <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="font-body-sm text-sm text-on-surface-variant italic">
                "El bloqueo de finanzas para los técnicos es exactamente lo que necesitábamos para mantener la privacidad de costos de compra."
              </p>
              <div>
                <p className="font-title-sm text-sm font-bold text-on-surface">Lucía Mendoza</p>
                <p className="font-label-caps text-xs text-primary">Gerente en AutoCheck ECU</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-surface-container-high border-t border-outline-variant py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-on-surface-variant">
          <Logo size={32} />

          <p>© 2026 ProRepair Ops Inc. Todos los derechos reservados.</p>

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
