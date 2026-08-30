'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wrench, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@prorepair.com');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Intentar login con Supabase Auth si está configurado
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // En modo demo o login exitoso -> Redirigir al dashboard
      router.push('/dashboard');
    } catch (err: any) {
      // En entorno local/demo, redirigir
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'owner' | 'technician') => {
    if (role === 'owner') {
      setEmail('dueno@prorepair.com');
      setPassword('demo1234');
    } else {
      setEmail('tecnico@prorepair.com');
      setPassword('demo1234');
    }
    setTimeout(() => {
      router.push('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Glow / Backdrop Background Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md bg-surface-container border border-outline-variant/80 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header con Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-md group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <span className="font-headline-md text-2xl font-bold text-primary tracking-tight block">
                ProRepair Ops
              </span>
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest block">
                Software de Gestión Técnica
              </span>
            </div>
          </Link>

          <h2 className="font-title-sm text-xl font-bold text-on-surface pt-4">
            Iniciar Sesión
          </h2>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Ingresa con tus credenciales de taller.
          </p>
        </div>

        {/* Mensaje de Error */}
        {errorMessage && (
          <div className="bg-error/10 border border-error/30 text-error p-3 rounded-lg text-xs font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@taller.com"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2.5 pl-10 pr-4 font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-label-caps text-xs text-on-surface-variant uppercase font-semibold">
                Contraseña
              </label>
              <a href="#" className="font-label-caps text-[11px] text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2.5 pl-10 pr-10 font-mono-data text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary hover:bg-primary-container font-title-sm text-sm font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Ingresando...' : 'Ingresar al Taller'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Accesos Rápido Demo para Pruebas */}
        <div className="pt-2 border-t border-outline-variant/50 space-y-2">
          <p className="font-label-caps text-[10px] text-on-surface-variant uppercase text-center font-bold">
            ACCESO RÁPIDO DE PRUEBA (DEMO)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('owner')}
              className="bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container-highest p-2 rounded-lg text-xs font-title-sm text-on-surface flex items-center justify-center gap-1.5 transition-colors font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Entrar como Dueño
            </button>
            <button
              onClick={() => handleDemoLogin('technician')}
              className="bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container-highest p-2 rounded-lg text-xs font-title-sm text-on-surface flex items-center justify-center gap-1.5 transition-colors font-bold"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Entrar como Técnico
            </button>
          </div>
        </div>

        {/* Footer Link al Registro */}
        <div className="text-center pt-2">
          <p className="font-body-sm text-xs text-on-surface-variant">
            ¿No tienes cuenta aún?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Registra tu Taller Gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
