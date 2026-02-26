import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const targetUrl = 'http://prize.kamuskeluaran.live/';

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        // Headers lengkap seolah-olah diakses dari Chrome asli
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
      },
      // Menambahkan timeout agar tidak gantung
      signal: AbortSignal.timeout(10000), 
    });

    if (!response.ok) {
      throw new Error(`Sumber Menolak (Status: ${response.status})`);
    }

    const html = await response.text();

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error("LOG ERROR PROXY:", error.message);
    
    // Jika masih gagal, kita kirim pesan error yang lebih jelas ke console browser
    return NextResponse.json({ 
      error: 'Proxy Gagal', 
      pesan: error.message,
      note: 'Cek apakah website sumber sedang down atau memblokir IP server.' 
    }, { status: 500 });
  }
}
