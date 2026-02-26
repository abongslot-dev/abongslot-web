import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Kita pakai AllOrigins sebagai jembatan karena Netlify langsung diblokir
  const targetUrl = 'http://prize.kamuskeluaran.live/';
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

  try {
    const response = await fetch(proxyUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Jembatan Proxy Down');

    const data = await response.json();
    
    // AllOrigins menyimpan HTML asli di dalam properti "contents"
    const htmlText = data.contents;

    if (!htmlText) throw new Error('Data kosong dari jembatan');

    return new NextResponse(htmlText, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("LOG ERROR:", error.message);
    return NextResponse.json({ 
      error: 'Gagal total', 
      detail: error.message 
    }, { status: 500 });
  }
}
