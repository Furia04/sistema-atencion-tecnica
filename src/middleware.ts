import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtectedWorkshopRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/customers') ||
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/devices') ||
    pathname.startsWith('/settings');

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

  // 1. Redirigir a /login si intenta entrar a rutas del taller sin estar autenticado
  if (isProtectedWorkshopRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Control estricto de Super Administrador en servidor
  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const isSuperAdmin =
      user.user_metadata?.role === 'superadmin' ||
      user.email === 'furiaortiz04@gmail.com' ||
      user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

    if (!isSuperAdmin) {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
    }
  }

  // 3. Si ya está autenticado, no permitir acceso a login o registro
  if ((pathname === '/login' || pathname === '/register') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico, icon.svg y archivos de imagen
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
