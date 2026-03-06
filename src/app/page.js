
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Taruh komponen ini di atas (atau di file terpisah)
const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1a0033]/90 backdrop-blur-md">
    <div className="relative flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-[#d4c33d]/20 border-t-[#d4c33d] rounded-full animate-spin"></div>
      <div className="absolute text-[#d4c33d] font-black text-[10px]">ABONGSLOT</div>
    </div>
    <p className="mt-4 text-[#d4c33d] font-black text-[10px] uppercase tracking-[4px] animate-pulse">
      Memverifikasi Akun...
    </p>
  </div>
);


export default function Home() {
  const router = useRouter();

  // --- 1. STATE UTAMA ---

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [menuAktif, setMenuAktif] = useState('populer');
  const [showLainnya, setShowLainnya] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [errorNotif, setErrorNotif] = useState("");
  

  // --- 2. STATE DATA API (PENTING: Agar tidak "Not Defined") ---
  const [dataRiwayat, setDataRiwayat] = useState({});
  const [loadingData, setLoadingData] = useState(true);
const [halamanAktif, setHalamanAktif] = useState('utama');
  // --- DATA STATIC ---
  const gambarHero = [
    "https://i.postimg.cc/bY0Q4P8x/banner1.png",
    "https://i.postimg.cc/W3CrfHQm/banner1.png",
    "https://i.postimg.cc/SxPMK5xB/banner3.png",
    "https://i.postimg.cc/W3CrfHQm/banner1.png"
  ];

  const menuLainnya = [
    { name: "RTP 99%", icon: "🎰", link: "#" },
    { name: "PREDIKSI TOGEL", icon: "🔮", link: "#" },
    { name: "BUKTI PEMBAYARAN", icon: "💰", link: "#" },
    { name: "LINK ALTERNATIF 1", icon: "🔗", link: "#" },
    { name: "LINK ALTERNATIF 2", icon: "🔗", link: "#" },
    { name: "JALAWIN", icon: "🏆", link: "#" },
    { name: "LOMBA TOGEL", icon: "📝", link: "#" },
    { name: "INFO JALAWIN", icon: "ℹ️", link: "#" },
  ];

  const headerRef = useRef(null);
  const menuNavRef = useRef(null);
  const audioRef = useRef(null);

const fetchData = async () => {
    setLoadingData(true);
    try {
      // 1. Ambil data langsung dari API Supabase kita
      const response = await fetch("/api/get-results");
      const json = await response.json();

      if (json.success && json.data) {
        const resultsMap = {};
        
        // 2. Mapping data agar pasaran jadi KEY (biar kotak di depan update)
        json.data.forEach((item) => {
          let key = item.pasaran.trim().toUpperCase();
          
          // Standarisasi Nama (Sama dengan logika Bos sebelumnya)
          if (!key.includes("POOLS") && !key.includes("LOTTO") && !key.includes("MACAU")) {
            key += " POOLS";
          }

          // Hanya ambil yang paling baru untuk setiap pasaran
          if (!resultsMap[key]) {
            resultsMap[key] = {
              tanggal: item.tanggal,
              angka: item.result,
              periode: item.periode
            };
          }
        });

        console.log("✅ DATA SUPABASE SIAP:", resultsMap);
        
        // 3. Update tampilan muka
        setDataRiwayat(resultsMap);
        
        // Simpan cache ringan buat performa
        localStorage.setItem("cache_riwayat", JSON.stringify(resultsMap));
      }
    } catch (error) {
      console.error("Gagal ambil data Supabase:", error);
    } finally {
      setLoadingData(false);
    }
  };
  
  // --- 4. EFFECTS ---
  useEffect(() => {
    fetchData();



    
    // Cek Login
    const status = localStorage.getItem("isLoggedIn");
    if (status === "true") {
      setIsLoggedIn(true);
      router.push('/dashboard');
    }

    // Audio Setup
    audioRef.current = new Audio("/sounds/");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    const playMusic = () => audioRef.current.play().catch(() => {});
    window.addEventListener("click", playMusic);

    return () => {
      if (audioRef.current) audioRef.current.pause();
      window.removeEventListener("click", playMusic);
    };
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % gambarHero.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [gambarHero.length]);




const handleLogin = async () => {
  // --- 1. VALIDASI KOSONG ---
  if (!loginData.username.trim() || !loginData.password.trim()) {
    setErrorNotif("Username dan Password jangan kosong.");
    setTimeout(() => setErrorNotif(""), 3000);
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("username", data.username);
      localStorage.setItem("isLoggedIn", "true");
      
      setTimeout(() => {
        router.push("/terms");
      }, 1000);
    } else {
      // --- 2. VALIDASI SALAH USERNAME/PASSWORD ---
      setLoading(false); 
      // Ambil pesan error dari API (misal: "Password Salah" atau "User Tidak Ditemukan")
      setErrorNotif(data.message || "Username/Password salah, Bos!");
      
      // Hilangkan otomatis setelah 3 detik
      setTimeout(() => setErrorNotif(""), 3000);
    }
  } catch (err) {
    setLoading(false);
    setErrorNotif("Waduh, koneksi internet Bos lagi bermasalah nih.");
    setTimeout(() => setErrorNotif(""), 3000);
  }
};


const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  setIsLoggedIn(false);
  window.location.reload(); // Biar halaman balik ke tampilan awal
};
// Fungsi Baru untuk tombol "SETUJU" di dalam Modal
const handleSetujuLogin = () => {
  localStorage.setItem("isLoggedIn", "true");
  setIsLoggedIn(true);
  setShowSK(false);
  router.push('/dashboard');
};

  const scrollToSection = (id) => {
    setMenuAktif(id);
    const targetElement = document.getElementById(id);
    if (targetElement) {
      const offset = 220; // Jarak aman agar tidak tertutup sticky header
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <main 
      className="min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center "
      
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >
      {loading && <LoadingOverlay />}
      {/* --- HEADER START --- */}
   
     {/* HEADER UTAMA (Nempel di atas baik di HP maupun Laptop) */}
      {/* GANTI BARIS INI */}
       <header ref={headerRef} className="w-full max-w-5xl bg-[#1a0033] shadow-2xl sticky top-0 z-[100] border-b border-[#D4AF37]/20 mx-auto">
  <div className="px-5 py-2 md:py-0 flex items-center md:items-stretch justify-between min-h-[60px] md:min-h-[120px]"> 
    
    {/* SEMUA ISI HEADER DIBUNGKUS KONDISI !isLoggedIn */}
    {!isLoggedIn ? (
      <>
        {/* --- LOGO MOBILE (Hanya muncul di HP sebelum login) --- */}
        <div className="flex md:hidden w-full justify-center items-center">
          <img 
            src="https://i.postimg.cc/XYgNTswc/download-(3).png" 
            alt="Logo" 
            className="h-12 w-auto drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] object-contain" 
          />
        </div>

        {/* --- LOGO DESKTOP (Hanya muncul di Laptop sebelum login) --- */}
        <div className="hidden md:flex flex-1 items-center justify-start">
          <img 
            src="https://i.postimg.cc/XYgNTswc/download-(3).png" 
            alt="Logo" 
            className="h-28 md:h-50 w-auto drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] object-contain" 
          />
        </div>

        {/* --- PANEL LOGIN DESKTOP --- */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-end py-2">
          <div className="w-full max-w-[450px] flex flex-col gap-1.5">
            {/* INPUT LOGIN */}
            <div className="flex items-center gap-1 w-full">
              <input 
    type="text" 
    name="username" // Tambahkan identitas
    value={loginData.username} // Hubungkan ke state
    onChange={(e) => setLoginData({...loginData, username: e.target.value})} // Simpan ketikan user
    placeholder="Username" 
    className="bg-white text-black px-4 py-2 rounded text-[11px] flex-1 min-w-0 outline-none border border-zinc-300" 
  />
  <input 
  type="password" 
  name="password"
  value={loginData.password}
  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
  // --- TAMBAHAN BIAR BISA ENTER ---
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }}
  placeholder="Password" 
  className="bg-white text-black px-4 py-2 rounded text-[11px] flex-1 min-w-0 outline-none border border-zinc-300" 
/>
<button 
  onClick={handleLogin} 
  disabled={loading}    
  className="bg-[#c5a021] hover:bg-yellow-500 text-black font-black px-5 py-2 rounded text-[11px] uppercase whitespace-nowrap disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center justify-center min-w-[80px]"
>
  {loading ? (
    <div className="flex items-center gap-1">
      {/* Spinner kecil di dalam tombol */}
      <svg className="animate-spin h-3 w-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  ) : "LOGIN"}
</button>      </div>

            {/* TOMBOL NAVIGASI BAWAH */}
            <div className="bg-[#5D3FD3] rounded-full p-0.5 shadow-lg w-full">
              <div className="flex justify-between items-center text-white">
                <button onClick={() => router.push('/promosi')} className="flex-1 py-2.5 rounded-full hover:bg-black/10 text-[9px] font-bold uppercase flex items-center justify-center gap-1">🎁 PROMOSI</button>
                <button onClick={() => router.push('/hubungi')} className="flex-1 py-2.5 rounded-full hover:bg-black/10 text-[9px] font-bold uppercase flex items-center justify-center gap-1 border-l border-white/10">🎧 HUBUNGI</button>
                <button onClick={() => router.push('/daftar')} className="flex-1 py-2.5 rounded-full hover:bg-black/10 text-[9px] font-bold uppercase flex items-center justify-center gap-1 border-l border-white/10 text-yellow-300">👤 DAFTAR</button>
                <div className="flex-1 relative"> 
                  <button 
    type="button" // Pastikan tipenya button
    onClick={(e) => {
      e.stopPropagation(); // Mencegah klik "tembus" ke elemen di bawahnya
      setShowLainnya(!showLainnya);
    }} 
    className={`w-full py-2.5 rounded-full transition-all text-[9px] font-bold uppercase flex items-center justify-center gap-1 border-l border-white/10 ${
      showLainnya ? 'bg-yellow-400 text-black' : 'hover:bg-black/10 text-white'
    }`}
  >
    <span>💬</span>
    <span className="font-black uppercase tracking-tighter">Lainnya</span>
  </button>

  {/* Dropdown Menu */}
  {showLainnya && (
    <div className="absolute top-[130%] right-0 w-60 bg-white rounded-xl shadow-2xl z-[999] border border-gray-200 overflow-hidden text-black">
      {menuLainnya.map((item, idx) => (
        <a 
          key={idx} 
          href={item.link} 
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-0 transition-colors"
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-[11px] font-bold">{item.name}</span>
        </a>
      ))}
    </div>
  )}
</div>
              </div>
            </div>
          </div>
        </div>
      </>
    ) : (
      /* --- TAMPILAN SETELAH LOGIN (Ganti dengan Saldo/Username) --- */
     <div className="w-full flex items-center justify-between py-2">
     <img src="https://i.postimg.cc/XYgNTswc/download-(3).png" className="h-10 w-auto" alt="Logo" />
     <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[10px] text-gray-400">Selamat Datang,</p>
          {/* Tampilkan Nama yang baru login dari state username */}
          <p className="text-sm font-bold text-[#D4AF37] uppercase">{username || "User"}</p>
        </div>
        {/* Tombol Logout (Opsional tapi penting) */}
        <button 
          onClick={handleLogout} 
          className="text-[10px] bg-red-600 px-2 py-1 rounded font-bold"
        >
          LOGOUT
        </button>
     </div>
  </div>
)}
  </div>
</header>

      {/* Running Text */}
      
      <div className="w-full max-w-5xl bg-[#5D3FD3] border-x border-b border-yellow-600/30 py-1">
        <div className="px-4 flex items-center gap-2 text-[16px] font-bold italic">
           <span className="text-yellow-300 whitespace-nowrap">📢 INFO:</span>
           <marquee scrollamount="5">Selamat Datang Di Situs ABONGSLOT GACOR ! Prediksi Anda Akan Merubah Hidup Anda ! ! !</marquee>
        </div>
      </div>

      <div className="w-full max-w-5xl overflow-hidden relative border-b-4 border-[#D4AF37] shadow-2xl">
        <div 
          className="flex transition-transform duration-700 ease-in-out" 
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {gambarHero.map((src, index) => (
            <div key={index} className="w-full flex-shrink-0 aspect-[21/9] md:aspect-[25/10] relative">
              <img 
                src={src} 
                alt={`Banner ${index}`} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {gambarHero.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${current === i ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/50"}`}></div>
          ))}
        </div>
      </div>


<div className="md:hidden w-full px-4 py-4 bg-black/40 backdrop-blur-sm flex flex-col gap-2">
  {/* Input Username */}
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <span className="text-gray-500 text-lg">👤</span>
    </div>
    <input 
      type="text" 
      placeholder="Username" 
      /* TAMBAHKAN DUA BARIS INI BOSKU */
      value={loginData.username}
      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none sm:text-sm font-bold"
    />
  </div>

  {/* Input Password */}
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <span className="text-gray-500 text-lg">🔑</span>
    </div>
    <input 
      type="password" 
      placeholder="Password" 
      /* TAMBAHKAN DUA BARIS INI JUGA */
      value={loginData.password}
      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none sm:text-sm font-bold"
    />
  </div>

  {/* Tombol Login */}
  <button 
    onClick={handleLogin}
    disabled={loading}
    className="w-full bg-[#c5a021] hover:bg-yellow-500 text-black font-black py-3 rounded-md shadow-lg transition-all active:scale-95 uppercase text-sm flex justify-center items-center"
  >
    {loading ? (
      <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
    ) : "Login"}
  </button>

  {/* Tombol Daftar */}
  <button 
    onClick={() => router.push('/daftar')}
    className="w-full bg-[#1a0033] hover:bg-red-700 text-white font-black py-3 rounded-md shadow-lg transition-all active:scale-95 uppercase text-sm border border-white/10"
  >
    Daftar
  </button>
</div>
     
     



{/* --- MENU KATEGORI GAME --- */}
<div 
  ref={menuNavRef} // <--- 1. TAMBAHKAN REF DI SINI
  className="w-full max-w-5xl bg-[#1a0033] border-b-2 border-[#D4AF37]/20 shadow-xl sticky top-[65px] md:top-[120px] z-40"
>
  <div className="flex items-center justify-between px-4 py-4 overflow-x-auto no-scrollbar-blur gap-2">
    
    
    {[
      { id: 'populer', name: 'POPULER', icon: '🔥' },
      { id: 'toto', name: 'TOTO', icon: '🎱' },
      { id: 'slot', name: 'SLOT', icon: '🎰' },
      { id: 'live', name: 'LIVE', icon: '♠️' },
      { id: 'sport', name: 'SPORT', icon: '⚽' },
      { id: 'virtual', name: 'VIRTUAL', icon: '🎮' },
      { id: 'fishing', name: 'FISHING', icon: '🎣' },
      { id: 'crash', name: 'CRASH GAME', icon: '🚀' },
    ].map((item) => (
      <div 
        key={item.id}
        onClick={() => scrollToSection(item.id)} // <--- 2. GANTI FUNGSI KLIK DISINI
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
        <span className={`text-[13px] font-bold transition-colors ${menuAktif === item.id ? "text-[#D4AF37]" : "text-white group-hover:text-[#D4AF37]"}`}>
          {item.name}
        </span>
      </div>
    ))}

  </div>
</div>



 {/* --- WRAPPER UTAMA KONTEN (Agar Lebar Konsisten) --- */}
<div className="w-full max-w-5xl bg-[#1a0033] p-0 flex flex-col gap-8 shadow-2xl pb-20">
    
  {/* 1. SECTION PALING POPULER */}
  <section id="populer" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[#1a0033] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl">
    <div className="flex items-center gap-2 mb-4 border-b border-[#D4AF37]/30 pb-2">
      <span className="text-xl">🔥</span>
      <h2 className="text-sm font-bold uppercase text-white tracking-wider">Paling Populer</h2>
    </div>
    <div className="w-full overflow-hidden">
    <div className="flex gap-3 pb-4 animate-scroll-horizontal">
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
    // TAMBAHKAN ONCLICK DI SINI UNTUK CEK LOGIN
    onClick={() => {
      if (!isLoggedIn) {
        setSelectedGame(game.name); // Set nama game yang diklik
        setShowModal(true);         // Munculkan Pop-up
      } else {
        // Ganti dengan link tujuan jika sudah login
        window.location.href = `/play/${game.name.toLowerCase().replace(/\s+/g, '-')}`;
      }
    }}
    className="w-[140px] md:w-[180px] flex-shrink-0 bg-[#2d0055] border border-[#D4AF37]/40 rounded-xl overflow-hidden shadow-lg group cursor-pointer active:scale-95 transition-all"
  >
    <div className="aspect-square relative overflow-hidden">
      <img 
        src={game.img} 
        alt={game.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
      />
      {/* OVERLAY PLAY: Biar user tahu ini bisa diklik */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
        <span className="bg-yellow-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl scale-75 group-hover:scale-100 transition-transform">
          {isLoggedIn ? "MAIN SEKARANG" : "🔒 LOGIN"}
        </span>
      </div>
    </div>
    <div className="p-2 bg-black/20">
      <p className="text-[11px] md:text-xs font-bold truncate text-white uppercase tracking-tighter">
        {game.name}
      </p>
      <p className="text-[8px] md:text-[9px] text-yellow-500 font-bold uppercase">
        {game.prov}
      </p>
    </div>
  </div>
))}
</div>
</div>
  </section>

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

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
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
     const keyDitemukan = dataRiwayat ? Object.keys(dataRiwayat).find(key => 
  key.includes(toto.name.toUpperCase().trim().replace(" POOLS", "").replace(" LOTTO", "")) || 
  toto.name.toUpperCase().trim().includes(key)
) : null;
      const dataLive = dataRiwayat[keyDitemukan];
      
      return (
        <div 
  key={i} 
  className="relative group rounded-xl border border-white/10 overflow-hidden flex flex-col bg-black shadow-2xl transition-all hover:scale-[1.02]"
>
  {/* BAGIAN YANG DIUBAH: Tambahkan transition dan group-hover:brightness */}
  <div 
    className="h-32 relative flex flex-col items-start p-3 bg-cover bg-center transition-all duration-10 group-hover:brightness-240 group-hover:contrast-110"
    style={{ 
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('${toto.bg}')` 
    }}
  >
    <h3 className="text-white font-black text-[15px] tracking-tight drop-shadow-md">{toto.name}</h3>
    <div className="mt-auto">
      <p className="text-white text-[11px] font-bold drop-shadow-md">
        {dataLive?.tanggal || toto.date}
      </p>
      <p className="text-white text-[11px] font-bold drop-shadow-md">
        {toto.time || "00:00:00"}
      </p>
    </div>
  </div>

  <div className="flex flex-col p-2 gap-1.5 bg-black/90">
  <div className="bg-[#5D3FD3] py-1.5 rounded-lg border border-white/20 shadow-inner text-center min-w-[120px]">
  <span className="text-white font-black text-lg tracking-[4px] drop-shadow-md">{dataLive ? dataLive.angka : toto.result}</span></div>

  <button onClick={() => router.push(`/riwayat?pasaran=${toto.name}`)} className="bg-[#660011] hover:bg-[#880011] text-white text-[11px] font-extrabold py-2 rounded-lg transition-colors border-t border-white/10 shadow-md">Riwayat</button>
  <button onClick={() => {
    if (!isLoggedIn) {
      setSelectedGame(toto.name); // Set nama pasaran untuk muncul di modal
      setShowModal(true);        // Munculkan modal
    } else {
      window.location.href = '/permainan'; // Jika sudah login, langsung gas
    }
  }} 
  className="bg-[#d4af37] hover:bg-[#ffcc33] text-black text-[11px] font-extrabold py-2 rounded-lg transition-colors shadow-[0_0_10px_rgba(212,175,55,0.3)]"
>
  Main
</button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        </div>
      );
    })}
  </div>
</section>
  
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
    <img src={slot.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
    <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20">{slot.name}</div>
    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-30"></div>
  </div>
))}
    </div>
  </section>

  
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
    <div 
      key={i} 
      // LOGIKA KLIK: Cek login sebelum masuk
      onClick={() => {
        if (!isLoggedIn) {
          setSelectedGame(slot.name); // Simpan nama provider untuk di modal
          setShowModal(true);        // Munculkan pop-up modal
        } else {
          // Jika sudah login, arahkan ke halaman game provider tersebut
          window.location.href = `/provider/${slot.name.toLowerCase().replace(/\s+/g, '-')}`;
        }
      }}
      className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer active:scale-95 transition-all shadow-lg"
    >
      {/* Gambar Banner */}
      <img 
        src={slot.img} 
        alt={slot.name}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
      />
      
      {/* Nama Provider */}
      <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20 z-10">
        {slot.name}
      </div>

      {/* Efek Sinar (Shinning) saat Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-30"></div>
      
      {/* Overlay Lock jika Belum Login */}
      {!isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <span className="bg-black/80 text-white p-2 rounded-full border border-yellow-500/50">
            MAIN▶️
          </span>
        </div>
      )}
    </div>
  ))}
</div>
  </section>


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
    { name: "SBOBET SPORT", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
    { name: "CMD368", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
    { name: "SABA SPORTS", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
    { name: "UG SPORT", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
  ].map((slot, i) => (
    <div 
      key={i} 
      // LOGIKA KLIK: Cek login sebelum masuk
      onClick={() => {
        if (!isLoggedIn) {
          setSelectedGame(slot.name); // Simpan nama provider untuk di modal
          setShowModal(true);        // Munculkan pop-up modal
        } else {
          // Jika sudah login, arahkan ke halaman game provider tersebut
          window.location.href = `/provider/${slot.name.toLowerCase().replace(/\s+/g, '-')}`;
        }
      }}
      className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer active:scale-95 transition-all shadow-lg"
    >
      {/* Gambar Banner */}
      <img 
        src={slot.img} 
        alt={slot.name}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
      />
      
      {/* Nama Provider */}
      <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20 z-10">
        {slot.name}
      </div>

      {/* Efek Sinar (Shinning) saat Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-30"></div>
      
      {/* Overlay Lock jika Belum Login */}
      {!isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <span className="bg-black/80 text-white p-2 rounded-full border border-yellow-500/50">
            MAIN▶️
          </span>
        </div>
      )}
    </div>
  ))}
</div>
  </section>


  
  <section id="virtual" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[1a0033] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl">
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
    { name: "SBO VIRTUAL", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
    { name: "PRAGMATIC VIRTUAL", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
    { name: "BETRADAR", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
    { name: "GOLDEN RACE", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
  ].map((slot, i) => (
    <div 
      key={i} 
      // LOGIKA KLIK: Cek login sebelum masuk
      onClick={() => {
        if (!isLoggedIn) {
          setSelectedGame(slot.name); // Simpan nama provider untuk di modal
          setShowModal(true);        // Munculkan pop-up modal
        } else {
          // Jika sudah login, arahkan ke halaman game provider tersebut
          window.location.href = `/provider/${slot.name.toLowerCase().replace(/\s+/g, '-')}`;
        }
      }}
      className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer active:scale-95 transition-all shadow-lg"
    >
      {/* Gambar Banner */}
      <img 
        src={slot.img} 
        alt={slot.name}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
      />
      
      {/* Nama Provider */}
      <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20 z-10">
        {slot.name}
      </div>

      {/* Efek Sinar (Shinning) saat Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-30"></div>
      
      {/* Overlay Lock jika Belum Login */}
      {!isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <span className="bg-black/80 text-white p-2 rounded-full border border-yellow-500/50">
            MAIN▶️
          </span>
        </div>
      )}
    </div>
  ))}
</div>
  </section>


  <section id="fishing" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[#1a0033] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl">
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
      { id: "MICROGAMING", name: "MICRO GAMING", img: "https://i.postimg.cc/YSwsvpZh/p1.png" },
      { id: "CO9GAMING", name: "CQ9 GAMING", img: "https://i.postimg.cc/DyptCkDG/CO9GAMING.png" },
      { id: "JOKERGGAMING", name: "JOKER GAMING", img: "https://i.postimg.cc/8kt35g1V/JOKERGAMING.png" },
      { id: "SPADEGAMING", name: "SPADE GAMING", img: "https://i.postimg.cc/gjXvmhz0/SPADEGAMING.png" },
      { id: "R88RICH88", name: "R88RICH88", img: "https://i.postimg.cc/FHgBJYS8/R88RICH88.png" },
      { id: "WMWORLDMATCH", name: "WM WORLDMATCH", img: "https://i.postimg.cc/8kRKYFK0/WMWORLDMATCH.png" },
      { id: "JILI", name: "JILI", img: "https://i.postimg.cc/prCBLF4J/JILI.png" },
      { id: "FCFACHAI", name: "FC FA CHAI", img: "https://i.postimg.cc/Prf4FS8q/FC-FA-CHAI.png" },
      { id: "FASTSPIN", name: "FAST SPIN", img: "https://i.postimg.cc/9f9tqSsg/FASTSPIN.png" },
    ].map((slot, i) => (
      <div 
        key={i} 
        // PERBAIKAN: Menggunakan slot.id agar sesuai dengan mapping
        onClick={() => router.push(`/fishing?provider=${slot.id}`)} 
        className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer active:scale-95 transition-all shadow-lg"
      >
        <img 
          src={slot.img} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
        />
        <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20 z-10">
          {slot.name}
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-30"></div>
      </div>
    ))}
  </div>
</section>

 <section id="crash" className="scroll-mt-[180px] md:scroll-mt-[220px] bg-[1a0033] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl">
    <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">🚀</span>
        <h2 className="text-sm font-bold uppercase text-white tracking-widest">crash game</h2>
      </div>
      <div className="relative">
         <input type="text" placeholder="Cari game..." className="bg-black/40 border border-[#D4AF37]/30 rounded-full py-1 px-4 text-[10px] w-32 text-white outline-none" />
      </div>
    </div>
   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[
      { id: "Mikiworld", name: "Mikiworld", img: "https://i.postimg.cc/QdybBx7X/Mikiworld.png" },
      ].map((slot, i) => (
      <div 
        key={i} 
        // PENYAMBUNG UTAMA: Mengirim id ke halaman /game
        onClick={() => router.push(`/crash?provider=${crash.id}`)} 
        className="relative rounded-xl border border-yellow-500/20 bg-black overflow-hidden aspect-[4/3] group cursor-pointer active:scale-95 transition-all shadow-lg"
      >
        <img 
          src={slot.img} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
        />
        <div className="absolute bottom-0 w-full p-2 bg-black/60 text-[10px] text-yellow-400 text-center font-bold border-t border-yellow-500/20 z-10">
          {slot.name}
        </div>
        {/* Efek Kilau Sinar */}
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-30"></div>
      </div>
    ))}
  </div>
</section>




{/* Penutup Wrapper Utama */}

    <footer className="w-full flex flex-col items-center">
          
          {/* 1. Logo Bank & Partner */}
<div className="w-full px-1 py-5 flex flex-col items-center gap-10">
  <p className="text-[13px] font-bold text-white/30 uppercase tracking-[0.2em]">Partner Resmi</p>
  <div className="w-full overflow-hidden">
    <div className="flex gap-3 pb-4 animate-scroll-horizontal">
    {[
      { name: "BCA", img: "https://cdn.bunkerkiamat.com/djarum4d/images/bank/BCA-ON_NEW.gif" },
      { name: "BNI", img: "https://i.ibb.co/0Y7KZJ6/bni.gif" },
      { name: "BRI", img: "https://i.ibb.co/WPBzqD7/bri.gif" },
      { name: "Mandiri", img: "https://i.ibb.co/pvvtN4p/mandiri.gif" },
      { name: "DANA", img: "https://i.ibb.co/30WnMnD/dana.gif" },
      { name: "OVO", img: "https://i.ibb.co/ggVpydg/ovo.gif" },
      { name: "Gopay", img: "https://i.ibb.co/fNSDN3F/gopay.gif" },
      { name: " BSI", img: "https://i.ibb.co/6txWM16/bsi.gif" },
      { name: "BCA", img: "https://cdn.bunkerkiamat.com/djarum4d/images/bank/BCA-ON_NEW.gif" },
      { name: "BNI", img: "https://i.ibb.co/0Y7KZJ6/bni.gif" },
      { name: "BRI", img: "https://i.ibb.co/WPBzqD7/bri.gif" },
      { name: "Mandiri", img: "https://i.ibb.co/pvvtN4p/mandiri.gif" },
      { name: "DANA", img: "https://i.ibb.co/30WnMnD/dana.gif" },
      { name: "OVO", img: "https://i.ibb.co/ggVpydg/ovo.gif" },
      { name: "Gopay", img: "https://i.ibb.co/fNSDN3F/gopay.gif" },
      { name: " BSI", img: "https://i.ibb.co/6txWM16/bsi.gif" },
    ].map((bank, i) => (
      <div 
        key={i} 
        className="bg-white/90 border border-[#D4AF37]/20 rounded-md p-0 flex items-center justify-center aspect-[3/2] shadow-inner grayscale hover:grayscale-0 transition-all duration-400"
      >
        <img 
          src={bank.img} 
          alt={bank.name} 
          className="max-w-full max-h-full object-contain" 
        />
      </div>
    ))}
  </div>
</div>
</div>




           {/* SEO */}
        <div className="px-1 pb-8">
        <div className="bg-[#2d0055]/60 border border-[#D4AF37]/50 rounded-2xl p-6 md:p-8 text-left shadow-2xl">
          
          {/* Judul Utama */}
          <h1 className="text-base md:text-xl font-black text-[#D4AF37] mb-4 uppercase leading-tight">
            ABONGSLOT - Link Situs Toto Slot Gacor Terbaru Berikan Jackpot Maksimal
          </h1>
          
          {/* Konten Artikel */}
          <div className="text-[11px] md:text-[13px] leading-relaxed text-gray-200 space-y-6">
            <p>
              <a href="#" className="text-blue-400 underline font-bold">ABONGSLOT</a> adalah link situs toto slot gacor terbaru menjadi pilihan utama pecinta slot gacor untuk meraih jackpot maksimal secara mudah. Situs slot gacor resmi yang menghadirkan berbagai game slot populer, termasuk slot gacor modern serta jackpot progresif.
            </p>

            {/* Sub-judul 1 */}
            <div>
              <h2 className="font-bold text-white text-[13px] md:text-[15px] mb-2 uppercase border-l-4 border-[#D4AF37] pl-3">
                Cara Daftar Cepat dan Aman
              </h2>
              <p className="mb-3">ABONGSLOT juga menyediakan proses pendaftaran aman dan terpercaya yang mudah dilakukan tanpa ribet. Data pribadi anda pasti aman 100% karena kami mengutamakan keamanan dan kenyamanan member. Berikut langkah-langkah daftar akun di JALAWIN:</p>
              <ul className="list-decimal list-inside space-y-1 ml-2 text-gray-300">
                <li>Buka link resmi ABONGSLOT.</li>
                <li>Klik tombol "Daftar".</li>
                <li>Isi username, password, nomor HP aktif.</li>
                <li>Pilih metode transaksi bank, e-wallet, atau pulsa.</li>
                <li>Tekan "Kirim", akun langsung aktif.</li>
              </ul>
            </div>

            {/* Sub-judul 2 */}
            <div>
              <h2 className="font-bold text-white text-[13px] md:text-[15px] mb-2 uppercase border-l-4 border-[#D4AF37] pl-3">
                Cara Bermain Slot Gacor Dengan Mudah
              </h2>
              <p className="mb-3">Bermain di JALAWIN sangat praktis dan cocok untuk semua level pemain, baik pemula maupun profesional. Berikut panduan bermain yang dapat diikuti:</p>
              <ul className="list-decimal list-inside space-y-1 ml-2 text-gray-300">
                <li>Login ke akun ABONGSLOT kamu.</li>
                <li>Buka menu Slot Online dan pilih provider favorit.</li>
                <li>Pilih permainan yang diinginkan dan tekan Spin.</li>
                <li>Jangan lupa manfaatkan fitur buy spin untuk memperbesar peluang menang.</li>
              </ul>
            </div>

            {/* Sub-judul 3 */}
            <div>
              <h2 className="font-bold text-white text-[13px] md:text-[15px] mb-2 uppercase border-l-4 border-[#D4AF37] pl-3">
                Keuntungan Bermain Situs abongslot
              </h2>
              <p className="mb-3">Ada banyak sekali keuntungan dan manfaat ketika kamu bermain situs abongslot yang sudah terbukti profesional:</p>
              <ul className="list-decimal list-inside space-y-1 ml-2 text-[#D4AF37] font-medium">
                <li>RTP Live Update Setiap Saat</li>
                <li>Sistem Permainan Aman & Adil</li>
                <li>Proses Deposit & Withdraw Kilat</li>
                <li>Bonus & Event Menggiurkan Setiap Hari</li>
                <li>Pelayanan Kualitas Tinggi</li>
              </ul>
            </div>

            <p className="italic text-gray-400 pt-4 border-t border-white/5">
              Tunggu apalagi segera bergabung dan rasakan sensasi bermain di situs toto slot gacor terbaru.
            </p>
          </div>
        </div>
      </div>
    </footer> {/* Penutup Footer */}
  </div> {/* Penutup Wrapper Utama (Container Gantung) */}

<div className="h-5 w-full"></div>{/* Jarak gantung ke bawah layar agar background mengintip sedikit */}



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



{/* --- POP-UP MODAL TENGAH --- */}
{showModal && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="p-8 flex flex-col items-center text-center">
        {/* Pesan Error */}
        <p className="text-gray-700 font-bold text-[14px] mb-6 leading-relaxed">
          Login terlebih dahulu untuk bermain <br/>
          <span className="text-red-600 uppercase">{selectedGame}</span>
        </p>
        
        {/* Tombol OK Kuning */}
        <button 
          onClick={() => setShowModal(false)}
          className="w-full bg-[#eab308] hover:bg-yellow-400 text-black font-black py-3 rounded-xl shadow-lg transition-transform active:scale-95"
        >
          Ok
        </button>
      </div>
    </div>
  </div>
)}



{/* MODAL MOBILE (Pop-up di tengah layar) */}
{showLainnya && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center px-6 md:hidden">
    {/* Overlay Gelap */}
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLainnya(false)}></div>
    
    {/* Konten Modal */}
    <div className="relative w-full max-w-sm bg-[#110022] border-2 border-[#D4AF37] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.3)] animate-in zoom-in-95 duration-300">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
        <h3 className="font-black text-[#D4AF37] uppercase italic">Lainnya</h3>
        <button onClick={() => setShowLainnya(false)} className="text-white text-2xl font-bold">✕</button>
      </div>
      
      <div className="p-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
        {menuLainnya.map((item, i) => (
          <a key={i} href={item.link} className="flex items-center gap-4 bg-black/60 border border-white/5 p-4 rounded-xl active:bg-[#D4AF37] active:text-black group transition-all">
            <span className="text-xl group-active:scale-125 transition-transform">{item.icon}</span>
            <span className="font-black text-[12px] uppercase tracking-wider">{item.name}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
)}


{/* POP UP NOTIFIKASI ERROR KECIL */}
{errorNotif && (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10001] animate-in fade-in slide-in-from-top-4 duration-300">
    <div className="bg-white/95 backdrop-blur-sm border-l-4 border-red-600 shadow-xl rounded-lg p-3 flex items-center gap-3 min-w-[300px]">
      {/* Ikon Bulat Merah */}
      <div className="bg-red-600 rounded-full p-1">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      
      {/* Pesan Error */}
      <span className="text-red-700 font-bold text-[11px] flex-1">
        {errorNotif}
      </span>

      {/* Tombol Tutup Kecil */}
      <button 
        onClick={() => setErrorNotif("")}
        className="bg-red-600 text-white text-[9px] px-2 py-1 rounded font-black hover:bg-red-700 transition-colors uppercase"
      >
        Tutup
      </button>
    </div>
  </div>
)}


     <nav className="fixed bottom-0 left-0 right-0 z-[130] bg-black border-t border-yellow-500/30 md:hidden flex items-center justify-around py-3 backdrop-blur-lg pointer-events-auto">
        <button 
          onClick={() => { console.log("Beranda klik"); router.push('/'); }} 
          className={`flex flex-col items-center flex-1 ${halamanAktif === 'utama' ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Beranda</span>
        </button>

        <button 
          onClick={() => { 
            console.log("Promo klik"); 
            setHalamanAktif('promosi');
            router.push('/promosi'); 
          }} 
          className={`flex flex-col items-center flex-1 ${halamanAktif === 'promosi' ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          <span className="text-xl">🎁</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Promo</span>
        </button>

        <button 
          onClick={() => router.push('/hubungi')} 
          className="flex flex-col items-center flex-1 text-gray-400"
        >
          <span className="text-xl">🎧</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Bantuan</span>
        </button>

        <button 
        onClick={() => setShowLainnya(true)} 
        className="flex flex-col items-center flex-1 text-gray-400"
        >
       <span className="text-xl">💬</span>
       <span className="text-[9px] font-black uppercase tracking-tighter">Lainnya</span></button>


      </nav>
    </main>
  );
}
