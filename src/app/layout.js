// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- METADATA SUPER LENGKAP UNTUK SEO & SHARE WA ---
export const metadata = {
  title: "ABONGSLOT - Link Situs Gacor Portal VIP Resmi 24 Jam",
  description: "Selamat datang di ABONGSLOT, portal VIP resmi dengan layanan terbaik 24 jam nonstop. Mainkan Demo Slot terlengkap dan cek hasil Togel tercepat.",
  keywords: "ABONGSLOT, slot gacor, demo slot, portal vip, prediksi togel",

  // Metadata untuk tampilan saat link di-share (WA, FB, Twitter)
  openGraph: {
    title: "ABONGSLOT VIP - Portal Gacor Terpercaya",
    description: "Layanan VIP 24 jam nonstop dengan hasil result tercepat!",
    url: 'https://abongslot.vercel.app', // Ganti dengan link Vercel kamu nanti
    siteName: 'ABONGSLOT',
    images: [
      {
        url: 'https://i.postimg.cc/ZqJdrrFL/japan.png', // Ganti dengan link logo brand kamu
        width: 1200,
        height: 630,
        alt: 'ABONGSLOT Banner',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  // Icon kecil di tab browser
  icons: {
    icon: '/favicon.ico', // Pastikan kamu punya file favicon di folder public
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning> 
    <meta name="google-site-verification" content="P2K28zgoQYYkwKxiP-R2_3Db8lW8e0_U8YyO1H4DTDc" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a0033]`} // Tambahkan background default biar gak kedip putih
      >
        {children}
      </body>
    </html>
  );
}
