import { NextResponse } from 'next/server';

export function middleware(request) {
  // Ambil token/session dari cookies
  const token = request.cookies.get('auth_token')?.value;

  const isLoginPage = request.nextUrl.pathname === '/login';
  const isAdminPage = request.nextUrl.pathname.startsWith('/dashboard') || 
                      request.nextUrl.pathname.startsWith('/profil');

  // Jika mencoba akses admin tapi belum login
  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login tapi malah buka halaman login lagi
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Tentukan halaman mana saja yang diproteksi
export const config = {
  matcher: ['/dashboard/:path*', '/profil/:path*', '/login'],
};