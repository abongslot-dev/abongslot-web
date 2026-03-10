"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js"; // <--- 1. Import ini wajib

// 2. Inisialisasi variabel supabase di sini
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export default function Home() {
  const router = useRouter();
  
  // --- 1. STATE UTAMA (Dibuat satu kali, lengkap dengan pengubahnya) ---
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [username, setUsername] = useState("Guest");
const [showSaldo, setShowSaldo] = useState(false);
const [saldo, setSaldo] = useState(500000);
const [menuAktif, setMenuAktif] = useState('populer'); // Cukup ini saja
const [showLainnya, setShowLainnya] = useState(false);
const [searchTerm, setSearchTerm] = useState("");


// TAMBAHKAN DUA BARIS INI:
const [dataRiwayat, setDataRiwayat] = useState({});
const [loadingData, setLoadingData] = useState(false);
  // --- 2. REFS (Hanya boleh satu kali tulis) ---
  const headerRef = useRef(null); // Memperbaiki error image_e2e3c2
  const menuNavRef = useRef(null);

  // --- 3. DATA STATIC ---
  const menuLainnya = [
    { name: "RTP 99%", icon: "🎰", link: "#" },
    { name: "PREDIKSI TOGEL", icon: "🔮", link: "#" },
    { name: "BUKTI PEMBAYARAN", icon: "💰", link: "#" },
    { name: "LINK ALTERNATIF 1", icon: "🔗", link: "#" },
    { name: "LINK ALTERNATIF 2", icon: "🔗", link: "#" },
    { name: "JALAWIN", icon: "🏆", link: "#" },
    { name: "LOMBA TOGEL", icon: "📝", link: "#" },
    
  ];


const fetchData = async () => {
  setLoadingData(true);
  try {
    // 1. Ambil data Result dan data Pasaran (Tambahkan jam_tutup di sini)
    const [resResult, resPasaran] = await Promise.all([
      fetch("/api/get-results"),
      supabase.from("togel_pasaran").select("nama, jam_buka, jam_tutup, status")
    ]);

    const jsonResult = await resResult.json();
    const dataPasaran = resPasaran.data || [];

    if (jsonResult.success && jsonResult.data) {
      const resultsMap = {};
      
      // 2. Mapping data Pasaran (Simpan Buka & Tutup)
      const jamMap = {};
      dataPasaran.forEach(p => {
        jamMap[p.nama.trim().toUpperCase()] = {
          buka: p.jam_buka,
          tutup: p.jam_tutup
        };
      });

      // 3. Mapping data Result
      jsonResult.data.forEach((item) => {
        let keyOriginal = item.pasaran.trim().toUpperCase();
        let keyDisplay = keyOriginal;
        
        // Standarisasi Nama
        if (!keyDisplay.includes("POOLS") && !keyDisplay.includes("LOTTO") && !keyDisplay.includes("MACAU")) {
          keyDisplay += " POOLS";
        }

        if (!resultsMap[keyDisplay]) {
          resultsMap[keyDisplay] = {
            tanggal: item.tanggal,
            angka: item.result,
            periode: item.periode,
            // PASTIKAN NAMA VARIABLE SAMA DENGAN YANG DI PANGGIL DI TAMPILAN
            jam_buka: jamMap[keyOriginal]?.buka || "00:00",
            jam_tutup: jamMap[keyOriginal]?.tutup || "00:00" 
          };
        }
      });

      console.log("✅ DATA SIAP TAMPIL:", resultsMap);
      setDataRiwayat(resultsMap);
      localStorage.setItem("cache_riwayat", JSON.stringify(resultsMap));
    }
  } catch (error) {
    console.error("Gagal ambil data:", error);
  } finally {
    setLoadingData(false);
  }
};
useEffect(() => {
  fetchData();
  // Opsional: Refresh otomatis setiap 5 menit
  const interval = setInterval(fetchData, 300000);
  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const status = localStorage.getItem("isLoggedIn");
  const acceptedTerms = sessionStorage.getItem("hasAcceptedTerms");

  if (status === "true") {
    // Jika sudah login tapi BELUM klik setuju di halaman terms
    if (!acceptedTerms) {
      router.push('/terms'); 
    }
  } else {
    router.push('/'); // Jika belum login sama sekali
  }
}, []);



// --- 4. LOGIC LOGIN, LOGOUT & FETCH SALDO ---
  useEffect(() => {
    // 1. Ambil data dari laci browser
    const status = localStorage.getItem("isLoggedIn");
    const savedName = localStorage.getItem("username");

    if (status === "true" && savedName) {
      setIsLoggedIn(true);
      setUsername(savedName);

      // 2. FUNGSI AMBIL SALDO (TAMBAHKAN INI DI DALAM SINI)
      const ambilSaldoDB = async () => {
        try {
          const res = await fetch(`/api/user/saldo?username=${savedName}`);
          const data = await res.json();
          if (data.success) {
            setSaldo(data.saldo); // Saldo masuk ke state dashboard
          }
        } catch (err) {
          console.error("Gagal konek ke API Saldo");
        }
      };

      // Jalankan fungsi ambil saldo
      ambilSaldoDB();
      
    } else {
      setIsLoggedIn(false);
      // router.push("/"); // Aktifkan ini jika ingin user wajib login untuk lihat dashboard
    }
  }, []);

const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  window.location.href = "/"; 
};

  // --- 5. FUNGSI SCROLL & KLIK ---
  const scrollToSection = (id) => {
    setMenuAktif(id); 
    const targetElement = document.getElementById(id);
    if (targetElement) {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const navHeight = menuNavRef.current?.offsetHeight || 0;
      const totalOffset = headerHeight + navHeight;
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - totalOffset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleKlikLuar = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setShowLainnya(false);
      }
    };
    document.addEventListener("mousedown", handleKlikLuar);
    return () => document.removeEventListener("mousedown", handleKlikLuar);
  }, []);
  return (
    <main 
      className="min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >
      
    
<header ref={headerRef} className="w-full max-w-6xl bg-[#1a0033] shadow-2xl sticky top-0 z-[100] border-b border-[#D4AF37]/20 mx-auto">
  {/* GANTI: justify-between menjadi justify-center & tambahkan relative */}
  <div className="px-3 py-2 md:py-0 flex items-center justify-center relative min-h-[60px] md:min-h-[120px]"> 
    
    {/* --- LOGO SEKARANG PASTI DI TENGAH --- */}
    <div className="flex justify-center items-center">
      <img 
        src="https://i.postimg.cc/XYgNTswc/download-(3).png" 
        alt="Logo" 
        className="h-12 md:h-20 w-auto drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] object-contain cursor-pointer"
        onClick={() => router.push('/dashboard')}
      />
    </div>

    {/* Tombol Logout (Tetap di pojok kanan tanpa mengganggu logo) */}
    <div className="hidden md:block absolute right-5">
      <button 
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("username");
          window.location.href = "/";
        }}
        className="bg-red-600/20 border border-red-600 text-red-500 text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all"
      >
        LOGOUT
      </button>
    </div>

  </div>
</header>
     



{/* --- MENU KATEGORI GAME --- */}
<div 
  ref={menuNavRef}
  className="w-full max-w-6xl bg-[#1a0033] border-b-2 border-[#D4AF37]/20 shadow-xl sticky top-[65px] md:top-[120px] z-40 mx-auto"
>
  <div className="flex items-center justify-between px-4 py-4 overflow-x-auto no-scrollbar gap-2">
    {[
      { id: 'populer', name: 'POPULER', icon: '🔥' },
      { id: 'toto', name: 'TOTO', icon: '🎱' },
      { id: 'slot', name: 'SLOT', icon: '🎰' },
      { id: 'live', name: 'LIVE', icon: '♠️' },
      { id: 'sport', name: 'SPORT', icon: '⚽' },
      { id: 'virtual', name: 'VIRTUAL', icon: '🎮' },
      { id: 'fishing', name: 'FISHING', icon: '🎣' },
      { id: 'arcade', name: 'ARCADE', icon: '🕹️' },
    ].map((item) => (
      <div 
        key={item.id}
        onClick={() => setMenuAktif(item.id)} // <--- KLIK DISINI SEKARANG MENGUBAH STATE
        className="flex flex-col items-center min-w-[70px] cursor-pointer group"
      >
        <div className={`transition-all duration-300 p-2 mb-1 rounded-lg flex items-center justify-center
          ${menuAktif === item.id 
            ? "bg-[#4b0082] border-2 border-[#D4AF37] scale-110 shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
            : "border-2 border-transparent group-hover:translate-y-[-2px]"
          }`}
        >
          <span className={`text-xl ${menuAktif === item.id ? "" : "filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"}`}>
            {item.icon}
          </span>
        </div>
        <span className={`text-[10px] font-bold transition-colors ${menuAktif === item.id ? "text-[#D4AF37]" : "text-white group-hover:text-[#D4AF37]"}`}>
          {item.name}
        </span>
      </div>
    ))}
  </div>
</div>


{/* --- WRAPPER UTAMA KONTEN (Penyatuan agar rapi & tidak ada celah) --- */}
<div className="w-full max-w-6xl bg-[#1a0033] p-4 flex flex-col gap-6 shadow-2xl pb-20 mx-auto">
  
  {/* --- 0. PANEL INFORMASI MEMBER --- */}
  {menuAktif === 'populer' && (
  <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
    
{/* Kotak Saldo */}
<div className="bg-[#2d0055] border border-[#D4AF37]/40 rounded-2xl p-5 shadow-inner">
  <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">
  Selamat Datang, <span className="text-white  font-bold">{username || "Guest"}</span>
</p>
  
  <div className="flex items-center gap-3 mb-5">
    <h2 className="text-2xl font-black text-white italic">Rp.</h2>
    <h2 className="text-2xl font-black text-[#D4AF37] tracking-widest">
  {showSaldo ? Number(saldo || 0).toLocaleString('id-ID') : "* * * * * *"}
</h2>
    <button 
      onClick={() => setShowSaldo(!showSaldo)} 
      className="bg-white/5 p-1.5 rounded-full hover:bg-white/10 transition-all"
    >
      <span className="text-sm">{showSaldo ? "👁️‍🗨️" : "👁️"}</span>
    </button>
  </div>

 <div className="grid grid-cols-2 gap-4">
  {/* TOMBOL DEPOSIT */}
  <button 
    onClick={() => router.push("/deposit")}
    className="bg-[#D4AF37] hover:brightness-110 text-black font-black py-2.5 rounded-xl text-[11px] uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1"
  >
    <span>💰</span> Deposit
  </button>

  {/* TOMBOL WITHDRAW */}
  <button 
    onClick={() => router.push("/withdraw")}
    className="bg-[#b30000] hover:brightness-110 text-white font-black py-2.5 rounded-xl text-[11px] uppercase transition-all shadow-lg active:scale-95 border border-white/10 flex items-center justify-center gap-1"
  >
    <span>💸</span> Withdraw
  </button>
</div>
</div>

    {/* Kotak Riwayat */}
    <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
      <div className="opacity-20 mb-2">
        <span className="text-3xl">📜</span>
      </div>
      <p className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">Riwayat Permainan</p>
      <p className="text-[9px] text-gray-600 italic mt-1">Belum ada aktivitas terbaru.</p>
    </div>

  </section>
)}
</div>


 {/* --- WRAPPER UTAMA KONTEN (Agar Lebar Konsisten) --- */}
<div className="w-full max-w-6xl bg-[#1a0033] p-0 flex flex-col gap-8 shadow-2xl pb-40 min-h-[70vh] md:min-h-[80vh] transition-all duration-500">    
  {/* 1. SECTION PALING POPULER */}
  {(menuAktif === 'populer') && (
  <section id="populer" className="scroll-mt-[180px] md:scroll-mt-[220px]">
    <div className="flex items-center gap-2 mb-4 border border-[#D4AF37]/50 pb-2">
      <span className="text-xl">🔥</span>
      <h2 className="text-sm font-bold uppercase text-white tracking-wider">Paling Populer</h2>
    </div>
    
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-blur snap-x">
      {[
        { name: "Mahjong Ways", prov: "Pgsoft", img: "https://i.postimg.cc/DfQTQ5Y0/mahjong-ways.png" },
  { name: "Mahjong Ways 2", prov: "Pgsoft", img: "https://i.postimg.cc/CKfyR4qw/mahjong-ways2.png" },
  { name: "Wild Bounty", prov: "Pgsoft", img: "https://i.postimg.cc/gjm1BFBZ/wilbonty.png" },
  { name: "Wild Bandito", prov: "Pgsoft", img: "https://i.postimg.cc/k4dHBPCN/wild-bandito.png" },
  { name: "Gates of Olympus", prov: "Pragmatic", img: "https://i.postimg.cc/bYg5N5Bs/vs20olympgate.png" },
  { name: "queen bounty", prov: "Pragmatic", img: "https://i.postimg.cc/pdKGNcjr/queen-bounty.png" },
  { name: "Starlight Princess 1000", prov: "Pragmatic", img: "https://i.postimg.cc/FH5CPQd4/Starlight-Princess-1000.png" },
  { name: "Sweet Rush Bonanza", prov: "Pragmatic", img: "https://i.postimg.cc/Kzz0KGV3/Sweet-Rush-Bonanza.png" },
  { name: "Dragon Hatch", prov: "Pragmatic", img: "https://i.postimg.cc/4dqjsHd3/dragon-hatch.png" },
  { name: "sugar rush1000", prov: "Pragmatic", img: "https://i.postimg.cc/SRDY05L2/sugar-rush1000.png" },
  { name: "Captain s Bounty", prov: "Pgsoft", img: "https://i.postimg.cc/xjtX1wHX/Captain-s-Bounty.png" },
  { name: "Ganesha Fortune", prov: "Pgsoft", img: "https://i.postimg.cc/9f5MkC3s/Ganesha-Fortune.png" },
  { name: "Gates of Olympus 1000", prov: "Pragmatic", img: "https://i.postimg.cc/vHCJ9Dxt/Gates-of-Olympus-1000.png" },
  { name: "Wild West Gold", prov: "Pragmatic", img: "https://i.postimg.cc/fTsQ1ykf/Wild-West-Gold.png" },
      ].map((game, i) => (
    <div 
      key={i} 
      /* min-w-[140px] di mobile, dan kita beri lebar tetap di desktop agar tidak mengecil */
      className="min-w-[140px] md:min-w-[180px] bg-[#2d0055] border border-[#D4AF37]/40 rounded-xl overflow-hidden shadow-lg group snap-center"
    >
      <div className="aspect-square relative overflow-hidden">
        <img src={game.img} alt={game.name || "Game"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="p-2">
        <p className="text-[10px] md:text-xs font-bold truncate text-white uppercase">{game.name}</p>
        <p className="text-[8px] md:text-[10px] text-gray-400">{game.prov}</p>
      </div>
    </div>
  ))}
</div>
  </section>
  )}

{/* 2. SECTION TOTO GAMES */}
{(menuAktif === 'populer' || menuAktif === 'toto') && (

<section id="toto" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[#1a0033] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl">
  <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
    <div className="flex items-center gap-2">
      <span className="text-xl">🎱</span>
      <h2 className="text-sm font-bold uppercase text-white tracking-widest">Toto Games</h2>
    </div>
    <div className="relative">
       <input 
         type="text" 
         placeholder="Cari game..." 
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         className="bg-black/40 border border-[#D4AF37]/30 rounded-full py-1 px-4 text-[10px] w-32 text-white outline-none" 
       />
    </div>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {[
      { name: "SINGAPORE POOLS", date: "11-Feb-2026", time: "17:45:00", result: "4405", bg: "https://i.postimg.cc/yNXkKWy8/PCSO.png" },
      { name: "GERMANY PLUS5 POOLS", date: "11-Feb-2026", time: "21:47:37", result: "8017", bg: "https://i.postimg.cc/gJmLL326/TENESE-EVE.png" },
      { name: "CHINA POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/x1LdGq7v/totomacau00.png" },
      { name: "HONGKONG LOTTO", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/j2WxDjNp/TENNES-DAY.png" },
      { name: "HONGKONG POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/g0NLRnXt/totomacau13.png" },
      { name: "TOTO MACAU 4D 13", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/JzdG4S9v/totomacau16.png" },
      { name: "TOTO MACAU 4D 16", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/sDjXPVzm/totomacau19.png" },
      { name: "TOTO MACAU 4D 19", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/MT06RLrN/totomacau22.png" },
      { name: "TOTO MACAU 4D 22", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/RVpMcKXt/totomacau23.png" },
      { name: "TOTO MACAU 4D 23", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/MT06RLrN/totomacau22.png" },
      { name: "TOTO MACAU 4D 00", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/L4qvwxsK/carolinaday.png" },
      { name: "SYDNEY LOTTO", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/V629zck2/carolinaeve.png" },
      { name: "SYDNEY POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/LsXjfsYH/libanon.png" },
      { name: "CAMBODIA POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/CLgD77B7/kamboja.png" },
      { name: "TAIWAN POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/kgjbnd13/taiwan.png" },
      { name: "JAPAN POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/26WbFLCw/mongolia.png" },
      { name: "MONGOLIA POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/gcvLxhSj/tasmania16.png" },
      { name: "CALIFORNIA POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/ZKH9cSzM/tasmania13.png" },
      { name: "LIBANON POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/FKM1RF0V/tasmania10.png" },
      { name: "KAMBOJA POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/sf91jrxQ/tasmania06.png" },
      { name: "TASMANIA POOLS 06", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/XJ67WH0K/fujian-23.png" },
      { name: "TASMANIA POOLS 10", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/NG4fhkCC/fujian20.png" },
      { name: "TASMANIA POOLS 13", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/zG9qwt3y/fujian15.png" },
      { name: "TASMANIA POOLS 16", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/mDSRsTj2/fujian12.png" },
      { name: "CHICAGO POOLS DAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/vTHy8C2r/maroko.png" },
      { name: "CHICAGO POOLS NIGHT", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/PxbZnv0L/jakarta.png" },
      { name: "FUJIAN POOLS 12", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/nrHmFctq/westvirgina.png" },
      { name: "FUJIAN POOLS 15", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/5ynC6d4c/virginanight.png" },
      { name: "FUJIAN POOLS 20", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/BZgDhDTG/virginaday.png" },
      { name: "FUJIAN POOLS 23", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/Qxd7vtms/kentuckyday.png" },
      { name: "OREGON POOLS 3", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/fTRd1LCf/kentucykeve.png" },
      { name: "OREGON POOLS 6", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/c4k3WSkm/floridaday.png" },
      { name: "OREGON POOLS 9", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/bJgLP52W/FLORIDAEVE.png" },
      { name: "OREGON POOLS 12", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/yNXkKWy8/PCSO.png" },
      { name: "TENNESSEE POOLS MORNING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/gJmLL326/TENESE-EVE.png" },
      { name: "TENNESSEE POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/x1LdGq7v/totomacau00.png" },
      { name: "TENNESSEE POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/j2WxDjNp/TENNES-DAY.png" },
      { name: "FLORIDA POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/g0NLRnXt/totomacau13.png" },
      { name: "FLORIDA POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/JzdG4S9v/totomacau16.png" },
      { name: "PCSO POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/RVpMcKXt/totomacau23.png" },
      { name: "YORDANIA POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/L4qvwxsK/carolinaday.png" },
      { name: "JAKARTA POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/V629zck2/carolinaeve.png" },
      { name: "MAROKO POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/LsXjfsYH/libanon.png" },
      { name: "TURKI POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/CLgD77B7/kamboja.png" },
      { name: "TEXAS POOLS MORNING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/kgjbnd13/taiwan.png" },
      { name: "TEXAS POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/26WbFLCw/mongolia.png" },
      { name: "TEXAS POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/gcvLxhSj/tasmania16.png" },
      { name: "TEXAS POOLS NIGHT", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/ZKH9cSzM/tasmania13.png" },
      { name: "NEW YORK POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/FKM1RF0V/tasmania10.png" },
      { name: "NEW YORK POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/sf91jrxQ/tasmania06.png" },
      { name: "ILLINOIS POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/XJ67WH0K/fujian-23.png" },
      { name: "ILLINOIS POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/NG4fhkCC/fujian20.png" },
      { name: "KENTUCKY POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/zG9qwt3y/fujian15.png" },
      { name: "KENTUCKY POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/mDSRsTj2/fujian12.png" },
      { name: "BULLSEYE POOLS", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/vTHy8C2r/maroko.png" },  
      { name: "NEW JERSEY POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/PxbZnv0L/jakarta.png" },  
      { name: "NEW JERSEY POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/nrHmFctq/westvirgina.png" },  
      { name: "VIRGINIA POOLS DAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/5ynC6d4c/virginanight.png" },  
      { name: "VIRGINIA POOLS NIGHT", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/BZgDhDTG/virginaday.png" },  
      { name: "GEORGIA POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/Qxd7vtms/kentuckyday.png" },  
       { name: "GEORGIA POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/fTRd1LCf/kentucykeve.png" },
        { name: "GEORGIA POOLS NIGHT", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/c4k3WSkm/floridaday.png" },
         { name: "NEW YORK POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/bJgLP52W/FLORIDAEVE.png" },
         { name: "NEW YORK POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/ZKH9cSzM/tasmania13.png" },
         { name: "NORTH CAROLINA POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/ZKH9cSzM/tasmania13.png" },
         { name: "NORTH CAROLINA POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/ZKH9cSzM/tasmania13.png" },
         { name: "SOUTH CAROLINA POOLS MIDDAY", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/ZKH9cSzM/tasmania13.png" },
         { name: "SOUTH CAROLINA POOLS EVENING", date: "11-Feb-2026", time: "21:47:37", result: "#", bg: "https://i.postimg.cc/ZKH9cSzM/tasmania13.png" },
    ]
    .filter(game => game.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((toto, i) => {
      const dataLive = dataRiwayat[toto.name.toUpperCase().trim()];
      
      return (
        <div key={i} className="relative group rounded-xl border border-white/10 overflow-hidden flex flex-col bg-black shadow-2xl transition-all hover:scale-[1.02]">
          
         <div 
    className="h-48 relative flex flex-col items-start p-3 bg-cover bg-center transition-all duration-10 group-hover:brightness-240 group-hover:contrast-110"
    style={{ 
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('${toto.bg}')` 
    }}
  >
    <h3 className="text-white font-black text-[15px] tracking-tight drop-shadow-md">{toto.name}</h3>
    <div className="mt-auto">
      <p className="text-white text-[11px] font-bold drop-shadow-md">
        {dataLive?.tanggal || toto.date}
      </p>
     {/* Paparan JAM BUKA | JAM TUTUP */}
  <div className="flex flex-col border-t border-white/20 pt-1 mt-1">
    <div className="flex justify-between text-[12px] text-gray-300 font-black uppercase tracking-tighter">
      <span>Jam Buka</span>
      <span>Jam Tutup</span>
    </div>
    <div className="flex justify-between text-white text-[13px] font-black drop-shadow-md">
      {/* Ambil dari database, kalau tak ada pakai default */}
      <span>{dataLive?.jam_buka || "00:00"}</span>
      <span className="text-gray-400">|</span>
      <span>{dataLive?.jam_tutup || "00:00"}</span>
    </div>
  </div>
</div>
</div>

          <div className="flex flex-col p-2 gap-1.5 bg-black/90">
            <div className="bg-[#5D3FD3] py-1.5 rounded-lg border border-white/20 shadow-inner text-center min-w-[120px]">
              <span className="text-white font-black text-lg tracking-[4px] drop-shadow-md">
                {dataLive ? dataLive.angka : toto.result}
              </span>
            </div>

            <button onClick={() => router.push(`/riwayat?pasaran=${toto.name}`)} className="bg-[#660011] hover:bg-[#880011] text-white text-[11px] font-extrabold py-2 rounded-lg transition-colors border-t border-white/10 shadow-md">
              Riwayat
            </button>
            <button onClick={() => window.location.href = '/permainan'} className="bg-[#d4af37] hover:bg-[#ffcc33] text-black text-[11px] font-extrabold py-2 rounded-lg transition-colors shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              Main
            </button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        </div>
      );
    })}
  </div>
</section>
)}
  
  {(menuAktif === 'slot') && (
  <section id="slot" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[1a0033] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl">
    <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎰</span>
        <h2 className="text-sm font-bold uppercase text-white tracking-widest">Slot Games</h2>
      </div>
      <div className="relative">
         <input type="text" placeholder="Cari game..." className="bg-black/40 border border-[#D4AF37]/30 rounded-full py-1 px-4 text-[10px] w-32 text-white outline-none" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
   { id: "PRAGMATIC", name: "PRAGMATIC PLAY", img: "https://i.postimg.cc/SKScTcYQ/PRAMATIG.png" },
  { id: "PGSOFT", name: "PG SOFT", img: "https://i.postimg.cc/9079RpsC/pg-soft.png" },
  { id: "SPADEGAMING", name: "SPADEGAMING", img: "https://i.postimg.cc/fLSd7H9R/Spade-Gaming.png" },
  { id: "MICROGAMING", name: "MICROGAMING", img: "https://i.postimg.cc/zvnR6V7c/MICROGAMING.png" },
  { id: "JILI", name: "JILI", img: "https://i.postimg.cc/KjJGzs9G/JILI.png" },
  { id: "BESOFT", name: "BESOFT", img: "https://i.postimg.cc/9F7d7SRV/BESOFT.png" },
  { id: "FASTSPIN", name: "FASTSPIN", img: "https://i.postimg.cc/J7bJ7X9j/FASTSPIN.png" },
  { id: "BTG", name: "BTG", img: "https://i.postimg.cc/yxPkmmHG/BTG.png" },
  { id: "FC FACHAI", name: "FC FACHAI", img: "https://i.postimg.cc/15v84rM4/FC-FACHAI.png" },
  { id: "CQ9", name: "CQ9", img: "https://i.postimg.cc/ydhdKmkq/CQ9.png" },
  { id: "GG SOFT", name: "GG SOFT", img: "https://i.postimg.cc/d0rQR2Rq/gg-soft.png" },
  { id: "HABANERO", name: "HABANERO", img: "https://i.postimg.cc/C5PwMmYw/HABANERO.png" },
  { id: "HACKSWA", name: "HACKSWA", img: "https://i.postimg.cc/1tySpL3m/HACKSWA.png" },
  { id: "JOKER", name: "JOKER", img: "https://i.postimg.cc/G37Ryg0g/JOKER.png" },
  { id: "MW", name: "MW", img: "https://i.postimg.cc/2SvNgzqp/MW.png" },
  { id: "NAGA", name: "NAGA", img: "https://i.postimg.cc/RFgkwhYZ/NAGA.png" },
  { id: "NETENT", name: "NETENT", img: "https://i.postimg.cc/h45FjJx3/NETENT.png" },
  { id: "NOLIMITED", name: "NOLIMITED", img: "https://i.postimg.cc/zDMMNsZQ/NOLIMITED.png" },
  { id: "PLAYGO", name: "PLAYGO", img: "https://i.postimg.cc/jS6kzCwj/PLAYGO.png" },
  { id: "PLAYTECH", name: "PLAYTECH", img: "https://i.postimg.cc/4yhWn3Rf/playtech.png" },
  { id: "R88", name: "R88", img: "https://i.postimg.cc/kg9dr0WR/R88.png" },
  { id: "REDTIGER", name: "REDTIGER", img: "https://i.postimg.cc/QtF2khZn/REDTIGER.png" },
  { id: "RELAX", name: "RELAX", img: "https://i.postimg.cc/Fs5McMWD/RELAX.png" },
  { id: "SBOBETSLOT", name: "SBOBETSLOT", img: "https://i.postimg.cc/Lsb7swg0/SBOBETSLOT.png" },
  { id: "YGGDRASIL", name: "YGGDRASIL", img: "https://i.postimg.cc/gjvBN0tF/YGGDRASIL.png" },
].map((slot, i) => (
  <div 
    key={i} 
    onClick={() => router.push(`/game?provider=${slot.id}`)} 
    className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer"
  >
    <img src={slot.img} alt={slot.name || "Slot"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
    <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20">{slot.name}</div>
    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-30"></div>
  </div>
))}
    </div>
  </section>
)}
  
  {(menuAktif === 'live') && (
  <section id="live" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[1a0033] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl">
    <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">♠️</span>
        <h2 className="text-sm font-bold uppercase text-white tracking-widest">Live Games</h2>
      </div>
      <div className="relative">
         <input type="text" placeholder="Cari game..." className="bg-black/40 border border-[#D4AF37]/30 rounded-full py-1 px-4 text-[10px] w-32 text-white outline-none" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { name: "PRAGMATIC PLAY", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "PG SOFT", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "SPADEGAMING", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "MICROGAMING", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
      ].map((slot, i) => (
        <div key={i} className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer">
          <img src={slot.img} alt={slot.name || "Slot"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20">{slot.name}</div>
        </div>
      ))}
    </div>
  </section>
  )}

{(menuAktif === 'sport') && (
  <section id="sport" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[1a0033] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl">
    <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚽</span>
        <h2 className="text-sm font-bold uppercase text-white tracking-widest">Sport Games</h2>
      </div>
      <div className="relative">
         <input type="text" placeholder="Cari game..." className="bg-black/40 border border-[#D4AF37]/30 rounded-full py-1 px-4 text-[10px] w-32 text-white outline-none" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { name: "PRAGMATIC PLAY", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "PG SOFT", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "SPADEGAMING", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "MICROGAMING", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
      ].map((slot, i) => (
        <div key={i} className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer">
          <img src={slot.img} alt={slot.name || "Slot"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20">{slot.name}</div>
        </div>
      ))}
    </div>
  </section>
)}

  {(menuAktif === 'virtual') && (
  <section id="virtual" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[1a0033] border border-[#D4AF37]/30 rounded-2xl p-4 shadow-2xl">
    <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎮</span>
        <h2 className="text-sm font-bold uppercase text-white tracking-widest">Virtual Games</h2>
      </div>
      <div className="relative">
         <input type="text" placeholder="Cari game..." className="bg-black/40 border border-[#D4AF37]/30 rounded-full py-1 px-4 text-[10px] w-32 text-white outline-none" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { name: "PRAGMATIC PLAY", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "PG SOFT", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "SPADEGAMING", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "MICROGAMING", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
      ].map((slot, i) => (
        <div key={i} className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer">
          <img src={slot.img} alt={slot.name || "Slot"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20">{slot.name}</div>
        </div>
      ))}
    </div>
  </section>
)}


{(menuAktif === 'fishing') && (
   <section id="fishing" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[1a0033] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl">
    <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎣</span>
        <h2 className="text-sm font-bold uppercase text-white tracking-widest">Fishing Games</h2>
      </div>
      <div className="relative">
         <input type="text" placeholder="Cari game..." className="bg-black/40 border border-[#D4AF37]/30 rounded-full py-1 px-4 text-[10px] w-32 text-white outline-none" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { name: "PRAGMATIC PLAY", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "PG SOFT", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "SPADEGAMING", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "MICROGAMING", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
      ].map((slot, i) => (
        <div key={i} className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer">
          <img src={slot.img} alt={slot.name || "Slot"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20">{slot.name}</div>
        </div>
      ))}
    </div>
  </section>)}

{(menuAktif === 'arcade') && (
 <section id="arcade" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[1a0033] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl">
    <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">🕹️</span>
        <h2 className="text-sm font-bold uppercase text-white tracking-widest">Arcade Games</h2>
      </div>
      <div className="relative">
         <input type="text" placeholder="Cari game..." className="bg-black/40 border border-[#D4AF37]/30 rounded-full py-1 px-4 text-[10px] w-32 text-white outline-none" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { name: "PRAGMATIC PLAY", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "PG SOFT", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "SPADEGAMING", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
        { name: "MICROGAMING", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
      ].map((slot, i) => (
        <div key={i} className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer">
          <img src={slot.img} alt={slot.name || "Slot"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20">{slot.name}</div>
        </div>
      ))}
    </div>
  </section>
)}



      </div> {/* Penutup Wrapper Utama (Container Gantung) */}





      {/* Jarak gantung ke bawah layar agar background mengintip sedikit */}
 



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

{/* MODAL MOBILE (Pop-up di tengah layar) */}
{showLainnya && (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
    {/* Overlay Gelap - Pastikan klik di luar modal bisa menutup */}
    <div 
      className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
      onClick={(e) => {
        e.stopPropagation();
        setShowLainnya(false);
      }}
    ></div>
    
    {/* Konten Modal */}
    <div className="relative w-full max-w-sm bg-[#110022] border-2 border-[#D4AF37] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.3)] animate-in zoom-in-95 duration-300 z-[1001]">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
        <h3 className="font-black text-[#D4AF37] uppercase italic">Lainnya</h3>
        <button onClick={() => setShowLainnya(false)} className="text-white text-2xl font-bold p-2">✕</button>
      </div>
      
      <div className="p-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto pointer-events-auto">
        {menuLainnya.map((item, i) => (
          <a key={i} href={item.link} className="flex items-center gap-4 bg-black/60 border border-white/5 p-4 rounded-xl active:bg-[#D4AF37] active:text-black group transition-all">
            <span className="text-xl">{item.icon}</span>
            <span className="font-black text-[12px] uppercase tracking-wider">{item.name}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
)}
{/* --- BOTTOM NAVIGATION: MOBILE BLUR & DESKTOP SOLID --- */}

 <div className="fixed bottom-0 md:bottom-0 left-0 right-0 z-[999] flex justify-center pointer-events-none">
        <div 
          className="flex items-center justify-around px-2 py-2 w-full max-w-5xl pointer-events-auto min-h-[75px] transition-all duration-300
                     bg-[#1a0033]/90 border-t-2 border-[#D4AF37] backdrop-blur-md
                     md:bg-[#1a0033] md:backdrop-blur-none md:border-2 md:rounded-2xl md:max-w-md md:shadow-[0_0_20px_rgba(0,0,0,0.8)]"
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
          <button onClick={() => router.push('/promo-user')} className="flex flex-col items-center justify-center flex-1 gap-1 active:scale-90">
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
    window.location.replace('/hubungi-user');
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



