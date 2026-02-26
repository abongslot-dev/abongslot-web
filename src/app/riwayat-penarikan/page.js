"use client";
import { useState, useEffect, Suspense, useRef } from "react"; // Tambahkan Suspense & useRef
import { useRouter } from "next/navigation";

// 1. KITA BUAT KOMPONEN KONTENNYA DULU
function RiwayatContent() {
  const router = useRouter();
  const headerRef = useRef(null);
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set true untuk testing tampilan
  const [username, setUsername] = useState("MEMBER");
  const [showLainnya, setShowLainnya] = useState(false);
  const [halamanAktif, setHalamanAktif] = useState('saldo');

  const menuLainnya = [
    { name: "Panduan", icon: "📚", link: "/panduan" },
    { name: "Referral", icon: "👥", link: "/referral" },
  ];
// --- SENSOR LOGIN: CEK STATUS USER ---
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");

    if (loginStatus !== "true" || !storedUsername) {
      // Jika tidak ada data login, tendang ke halaman awal
      router.push("/");
    } else {
      // Jika login valid, izinkan akses dan ambil data
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setLoading(false);
      // Di sini Bos bisa panggil fungsi ambil data riwayat dari API
      // fetchRiwayat(storedUsername);
    }
  }, [router]);
  const handleLogin = () => { /* Fungsi Login Bos */ };

// Di dalam fungsi RiwayatContent()


useEffect(() => {
  const fetchRiwayat = async () => {
    const userAktif = localStorage.getItem("username");
    if (!userAktif) return;

    try {
      const res = await fetch(`/api/riwayat-wd?username=${userAktif}`);
      const result = await res.json();
      
      if (result.success) {
        setDataRiwayat(result.data); // Simpan hasil database ke state
      }
    } catch (err) {
      console.error("Gagal load data riwayat");
    }
  };

  fetchRiwayat();
}, []);



  return (
    <main 
      className="relative min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center "
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >
     <header ref={headerRef} className="w-full max-w-5xl bg-[#1a0033] shadow-2xl sticky top-0 z-[100] border-b border-[#D4AF37]/20">
  <div className="px-5 py-3 flex items-center justify-center min-h-[60px] md:min-h-[120px]"> 
    
    {/* --- LOGO TETAP DI TENGAH (MOBILE & DESKTOP) --- */}
    <div className="flex justify-center items-center">
      <img 
        src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" 
        alt="Logo" 
        className="h-12 md:h-20 w-auto drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] object-contain cursor-pointer"
        onClick={() => router.push('/dashboard')}
      />
    </div>

    {/* Tombol Logout (Opsional - Pojok Kanan Desktop) */}
    <div className="hidden md:block absolute right-5">
     <button 
  onClick={() => {
    // JANGAN pakai removeItem kalau cuma mau balik halaman, Bos!
    router.push("/profile"); // Atau pakai router.back()
  }}
  className="bg-zinc-700 border border-zinc-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-zinc-600 transition-all"
>
  ⬅ KEMBALI
</button>
    </div>

  </div>
</header>

      {/* --- BOX RIWAYAT SESUAI GAMBAR --- */}
       <div className="w-full max-w-5xl min-h-[calc(100vh-100px)] bg-white overflow-hidden shadow-2xl border-x border-gray-300 flex flex-col">
        {/* Title Bar Merah */}
        <div className="bg-[#1a0033] px-4 py-2 border-b border-white/20">
          <h2 className="text-white text-xs font-bold uppercase tracking-wider">Riwayat Penarikan
          </h2>
        </div>

        {/* Filter Section Merah */}
        <div className="p-3 bg-[#1a0033]">
          <div className="border border-white/50 p-3 rounded-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end">
              <div>
                <label className="text-white text-[10px] block mb-1 font-bold">Mulai</label>
                <input type="date" className="w-full text-xs p-1 rounded-sm outline-none text-black bg-white" />
              </div>
              <div>
                <label className="text-white text-[10px] block mb-1 font-bold">Akhir</label>
                <input type="date" className="w-full text-xs p-1 rounded-sm outline-none text-black bg-white" />
              </div>
              <button className="bg-gradient-to-b from-[#d4a017] to-[#8b6508] text-white text-[10px] py-1.5 rounded-sm font-bold shadow-md flex items-center justify-center gap-1 uppercase">
                🔍 Cari
              </button>
              <button className="bg-gradient-to-b from-zinc-400 to-zinc-600 text-white text-[10px] py-1.5 rounded-sm font-bold shadow-md flex items-center justify-center gap-1 uppercase">
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Tabel Data Putih */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-[11px] text-center border-collapse">
            <thead>
              <tr className="bg-gray-100 text-zinc-500 uppercase border-b border-gray-300">
                <th className="py-3 px-1 border-r border-gray-300 font-bold">NO</th>
                <th className="py-3 px-1 border-r border-gray-300 font-bold">BANK</th>
                <th className="py-3 px-1 border-r border-gray-300 font-bold text-blue-700">STATUS</th>
                <th className="py-3 px-1 border-r border-gray-300 font-bold text-red-700">NOMINAL</th>
                <th className="py-3 px-1 font-bold text-black">TANGGAL</th>
              </tr>
            </thead>
            <tbody className="text-black">
  {dataRiwayat.length === 0 ? (
    <tr>
      {/* Colspan 5 karena ada 5 kolom (NO, BANK, STATUS, NOMINAL, TANGGAL) */}
      <td colSpan="5" className="py-10 text-zinc-400 italic bg-white text-sm">Tidak ada data penarikan</td>
    </tr>
  ) : (
    dataRiwayat.map((item, i) => (
      <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 text-[10px]">
        {/* 1. KOLOM NO */}
        <td className="py-3 border-r border-gray-200 font-bold">{i + 1}</td>
        
        {/* 2. KOLOM BANK */}
        <td className="py-3 border-r border-gray-200 uppercase font-black italic text-zinc-700">
          {item.bank}
        </td>
        
        {/* 3. KOLOM STATUS */}
        <td className="py-3 border-r border-gray-200 font-bold">
          <span className={`px-2 py-1 rounded-sm text-[9px] text-white ${
            item.status === 'SUCCESS' ? 'bg-green-600' : 'bg-orange-500'
          }`}>
            {item.status}
          </span>
        </td>
        
        {/* 4. KOLOM NOMINAL */}
        <td className="py-3 border-r border-gray-200 text-red-700 font-black">
          {Number(item.nominal).toLocaleString('id-ID')}
        </td>
        
        {/* 5. KOLOM TANGGAL */}
        <td className="py-3 font-bold text-zinc-600">
          {new Date(item.created_at).toLocaleString('id-ID', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>
      </div>

      {/* --- NAVBAR BAWAH MOBILE --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-[130] bg-black border-t border-yellow-500/30 md:hidden flex items-center justify-around py-3 backdrop-blur-lg">
        <button onClick={() => router.push('/')} className="flex flex-col items-center flex-1 text-gray-400">
          <span className="text-xl">🏠</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Beranda</span>
        </button>
        <button onClick={() => router.push('/promosi')} className="flex flex-col items-center flex-1 text-gray-400">
          <span className="text-xl">🎁</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Promo</span>
        </button>
        <button onClick={() => router.push('/profile')} className="flex flex-col items-center flex-1 text-yellow-500">
          <span className="text-xl">👤</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
        </button>
        <button onClick={() => setShowLainnya(true)} className="flex flex-col items-center flex-1 text-gray-400">
          <span className="text-xl">💬</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Lainnya</span>
        </button>
      </nav>


{/* --- FLOATING SIDEBAR MENU (ADAPTIVE POSITION) --- */}
<div className="fixed 
  /* Tampilan Mobile: Bawah Kanan */
  bottom-32 right-4 
  /* Tampilan Desktop: Kiri Tengah */
  md:bottom-auto md:right-auto md:left-0 md:top-1/2 md:-translate-y-1/2 
  z-[100] flex flex-col gap-2 items-end md:items-start">
  
<a href="#" className="group flex flex-row-reverse items-center bg-[#1a0033]/95 border border-[#D4AF37] rounded-full md:rounded-l-none md:rounded-r-full p-1.5 transition-all duration-500 shadow-[5px_5px_15px_rgba(0,0,0,0.6)]">
    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
      <img 
        src="https://img-mgscorp.kangpermen13.workers.dev/whatsapp-converter.webp" 
        alt="WA" 
        className="w-full h-full object-contain p-1.5" // Ukuran penuh dengan sedikit jarak aman
      />
    </div>
    <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-500 ease-in-out text-[#D4AF37] font-black text-xs uppercase whitespace-nowrap px-0 group-hover:pl-4 group-hover:pr-2">
      WhatsApp
    </span>
  </a>

  {/* 2. RTP Gacor */}
  <a href="#" className="hidden md:flex group flex-row-reverse items-center bg-[#1a0033]/95 border border-[#D4AF37] rounded-l-none rounded-r-full p-1.5 transition-all duration-500 shadow-[5px_5px_15px_rgba(0,0,0,0.6)]">
    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10 animate-pulse overflow-hidden">
      <img 
        src="https://img-mgscorp.kangpermen13.workers.dev/rtpslot-webp-converter.webp" 
        alt="RTP" 
        className="w-full h-full object-contain p-1" // P-1 supaya lebih mepet ke pinggir (lebih besar)
      />
    </div>
    <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-500 ease-in-out text-[#D4AF37] font-black text-xs uppercase whitespace-nowrap px-0 group-hover:pl-4 group-hover:pr-2">
      RTP Gacor
    </span>
  </a>

  {/* 3. Live Chat */}
  <a href="#" className="group flex flex-row-reverse items-center bg-[#1a0033]/95 border border-[#D4AF37] rounded-full md:rounded-l-none md:rounded-r-full p-1.5 transition-all duration-500 shadow-[5px_5px_15px_rgba(0,0,0,0.6)]">
    <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
      <img 
        src="https://img-mgscorp.kangpermen13.workers.dev/livechat-converter.webp" 
        alt="LIVECHAT" 
        className="w-full h-full object-contain p-1.5" 
      />
    </div>
    <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-500 ease-in-out text-white font-black text-xs uppercase whitespace-nowrap px-0 group-hover:pl-4 group-hover:pr-2">
      Live Chat
    </span>
  </a>
</div>



      {/* --- BOTTOM NAVIGATION: MOBILE BLUR & DESKTOP SOLID --- */}
 <div className="fixed bottom-0 md:bottom-6 left-0 right-0 z-[999] flex justify-center pointer-events-none">
        <div 
          className="flex items-center justify-around px-2 py-2 w-full max-w-5xl pointer-events-auto min-h-[75px] transition-all duration-300
                     bg-[#1a0033]/90 border-t-2 border-[#D4AF37] backdrop-blur-md
                     md:bg-black/40 md:backdrop-blur-none md:border-2 md:rounded-2xl md:max-w-md md:shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          style={{ 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          {/* Tombol Permainan */}
          <button 
            onClick={() => router.push('/dashboard')} 
            className="flex flex-col items-center justify-center bg-[#D4AF37] rounded-xl px-2 py-1 min-w-[75px] shadow-lg active:scale-90 transition-all cursor-pointer"
          >
            <span className="text-xl">🎲</span>
            <span className="text-[10px] font-black text-black uppercase leading-none mt-1">Permainan</span>
          </button>

          {/* Tombol Promosi */}
          <button onClick={() => router.push('/promosi')} className="flex flex-col items-center justify-center flex-1 gap-1 active:scale-90">
            <span className="text-xl">🎁</span>
            <span className="text-[10px] font-black text-white uppercase leading-none">Promosi</span>
          </button>

          {/* Tombol Profile */}
          <button onClick={() => router.push('/profile')} className="flex flex-col items-center justify-center flex-1 gap-1 active:scale-90">
            <span className="text-xl">👤</span>
            <span className="text-[10px] font-black text-white uppercase leading-none">Profile</span>
          </button>

          {/* Tombol Hubungi (AKTIF) */}
         <button 
          onClick={(e) => {
            e.preventDefault();
                  e.stopPropagation();
              // Ganti total cara pindahnya
              window.location.replace('/hubungi');
                    }} 
            className="flex flex-col items-center justify-center flex-1 gap-1 active:scale-90 cursor-pointer"
         >
            <span className="text-xl pointer-events-none">🎧</span>
           <span className="text-[10px] font-black text-white uppercase leading-none pointer-events-none">Hubungi</span>
             </button>

          {/* Tombol Lainnya */}
          <button 
            onClick={() => setShowLainnya(true)} 
            className="flex flex-col items-center justify-center flex-1 gap-1 active:scale-90 cursor-pointer"
          >
            <span className="text-xl">💬</span>
            <span className="text-[10px] font-black text-white uppercase leading-none">Lainnya</span>
          </button>
        </div>
      </div>
    </main>
  );
}

// 2. INI SATU-SATUNYA NAKHODA (DEFAULT EXPORT)
export default function RiwayatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a0033] flex items-center justify-center text-[#D4AF37] font-bold">MENGHUBUNGKAN...</div>}>
      <RiwayatContent />
    </Suspense>
  );
}