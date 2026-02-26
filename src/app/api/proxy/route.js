import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Paksa agar tidak di-cache oleh Netlify

export async function GET() {
  try {
    const response = await fetch('http://prize.kamuskeluaran.live/', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Sumber Error: ${response.status}` }, { status: response.status });
    }

    const html = await response.text();
    
    // Kirim sebagai Text, tapi pastikan statusnya 200
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*', // Izin akses agar tidak diblokir browser
      },
    });
  } catch (error: any) {
    console.error("Detail Error Proxy:", error.message);
    return NextResponse.json({ error: 'Server gagal menjangkau sumber', detail: error.message }, { status: 500 });
  }
}
