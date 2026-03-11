import { NextResponse } from 'next/server';

export function middleware(request) {
  // Ambil token (Cek semua kemungkinan nama cookie yang Bos pakai)
  const token = request.cookies.get('auth_token')?.value || request.cookies.get('isLoggedIn')?.value;

  const { pathname } = request.nextUrl;

  // Tentukan rute login dan halaman yang diproteksi
  const isLoginPage = pathname === '/login';
  const isProtectedPage = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/profil') || 
                          pathname.startsWith('/admin'); // Tambahkan jika ada folder admin

  // 1. JIKA MAU KE HALAMAN PROTEKSI TAPI TIDAK ADA TOKEN
  if (isProtectedPage && !token) {
    // Pastikan diarahkan ke /login (bukan /admin/login)
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. JIKA SUDAH LOGIN TAPI BUKA HALAMAN LOGIN LAGI
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher harus mencakup semua folder yang ingin diproteksi
  matcher: [
    '/dashboard/:path*', 
    '/profil/:path*', 
    '/admin/:path*', 
    '/login'
  ],
};