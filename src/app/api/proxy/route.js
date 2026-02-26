import { NextResponse } from 'next/server';

// Memberitahu Netlify agar tidak menganggap ini halaman statis
export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("Memulai request proxy ke kamuskeluaran...");

  try {
    const response = await fetch('http://prize.kamuskeluaran.live/', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      },
      // Penting: Next.js di server butuh info cache ini
      next: { revalidate: 0 } 
    });

    if (!response.ok) {
      console.error(`Gagal akses sumber! Status: ${response.status}`);
      return NextResponse.json({ error: `Sumber Error: ${response.status}` }, { status: response.status });
    }

    const html = await response.text();
    console.log("Data berhasil diambil, panjang karakter:", html.length);

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: any) {
    console.error("CRASH PADA PROXY:", err.message);
    return NextResponse.json({ 
      error: 'Proxy Internal Crash', 
      detail: err.message 
    }, { status: 500 });
  }
}
