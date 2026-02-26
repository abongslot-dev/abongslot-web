import { NextResponse } from 'next/server'; // FIX: Pakai 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://prize.kamuskeluaran.live/', {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error('Gagal mengambil data dari sumber');

    const html = await response.text();
    
    // Kirim balik sebagai teks HTML murni
    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: 'Gagal ambil data' }, { status: 500 });
  }
}



