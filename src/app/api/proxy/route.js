import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const targetUrl = 'http://prize.kamuskeluaran.live/';
  
  // Daftar jembatan (Proxy) untuk cadangan
 const proxies = [
    // 1. CORSProxy.io (Paling stabil buat Netlify)
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    
    // 2. Codetabs (Sangat ringan dan cepat)
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
    
    // 3. AllOrigins (Taruh terakhir karena sering lemot di server)
    `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`
  ];

  for (const url of proxies) {
    try {
      const response = await fetch(url, { 
        cache: 'no-store',
        signal: AbortSignal.timeout(5000) // Kalau 5 detik gak respon, ganti jembatan
      });

      if (!response.ok) continue;

      const data = await response.json();
      // AllOrigins pakai .contents, yang lain mungkin langsung text
      const htmlText = data.contents || data; 

      if (htmlText && htmlText.length > 100) { // Pastikan datanya gak kosong
        return new NextResponse(htmlText, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store, max-age=0',
          },
        });
      }
    } catch (e) {
      console.log(`Jembatan ${url} gagal, mencoba jembatan lain...`);
      continue; // Coba jembatan berikutnya
    }
  }

  return NextResponse.json({ error: 'Semua jembatan penuh, coba refresh' }, { status: 503 });
}

