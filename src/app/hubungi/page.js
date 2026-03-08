"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Key, Eye, EyeOff, LayoutDashboard } from 'lucide-react';

export default function Hubungi() {
  const router = useRouter();
  const [halamanAktif] = useState('hubungi'); 
  const headerRef = useRef(null);
  
  // State Terpisah
  const [showDropdown, setShowDropdown] = useState(false); // Untuk Desktop
  const [showModalMobile, setShowModalMobile] = useState(false); // Untuk Mobile
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [errorNotif, setErrorNotif] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLainnya, setShowLainnya] = useState(false);
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const daftarKontak = [
    { name: "Live Chat", desc: "Layanan 24 Jam Nonstop", icon: "💬", color: "from-blue-600 to-blue-400", link: "#", action: "Chat Sekarang" },
    { name: "WhatsApp", desc: "Respon Cepat & Ramah", icon: "📱", color: "from-green-600 to-green-400", link: "https://wa.me/628123456789", action: "Kirim Pesan" },
    { name: "Telegram", desc: "Update Promo Tercepat", icon: "✈️", color: "from-sky-600 to-sky-400", link: "https://t.me/username", action: "Gabung Grup" },
    { 
  name: "Instagram", 
  desc: "Follow Untuk Info Event", 
  icon: <img src="https://photoku.io/images/2024/09/25/ig.png" className="w-11 h-11 object-contain" alt="IG" />, 
  color: "from-purple-600 to-pink-500", 
  link: "https://instagram.com/username", 
  action: "Follow Kami" 
}
  ];

  const menuLainnya = [
    { name: "RTP 99%", icon: "🎰", link: "#" },
    { name: "PREDIKSI TOGEL", icon: "🔮", link: "#" },
    { name: "BUKTI PEMBAYARAN", icon: "💰", link: "#" },
    { name: "LINK ALTERNATIF 1", icon: "🔗", link: "#" },
    { name: "LINK ALTERNATIF 2", icon: "🔗", link: "#" },
    { name: "JALAWIN", icon: "🏆", link: "#" },
    { name: "LOMBA TOGEL", icon: "📝", link: "#" },
    
  ];

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    if (status === "true") setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const handleKlikLuar = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleKlikLuar);
    return () => document.removeEventListener("mousedown", handleKlikLuar);
  }, []);

// Fungsi saat tombol LOGIN diklik
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
// Tambahkan ini di bawah fungsi handleLogin Bos
const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  setIsLoggedIn(false);
  router.push("/");
};


 return (
  <main 
    className={`relative min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center ${!username ? "justify-center p-0" : ""}`}
    style={{ 
      backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
      backgroundColor: "#1a0033" 
    }}
  >
    
      
      {/* --- HEADER --- */}
      <header ref={headerRef} className="w-full max-w-6xl bg-[#1a0033] shadow-2xl sticky top-0 z-[100] border-b border-[#D4AF37]/20 mx-auto">
<div className="px-3 py-2 md:py-0 flex items-center md:items-stretch justify-between min-h-[60px] md:min-h-[160px]"> 
    
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
    className="h-28 md:h-32 w-80 md:w-[450px] drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] object-fill" 
  />
</div>

        {/* --- PANEL LOGIN DESKTOP --- */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-end py-2">
          <div className="w-full max-w-[600px] flex flex-col gap-3">
            {/* INPUT LOGIN */}
            <div className="flex items-center gap-1 w-full">
<div className="relative flex-1 group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <User size={25} strokeWidth={2.5} />
        </div>
        <input 
          type="text" 
          name="username"
          value={loginData.username}
          onChange={(e) => setLoginData({...loginData, username: e.target.value})}
          placeholder="Username" 
          className="w-full bg-white text-black pl-10 pr-4 py-3 rounded-md text-sm md:text-base outline-none border-2 border-zinc-300 focus:border-blue-500 transition-all font-bold shadow-sm placeholder:font-normal"
        />
      </div>
<div className="relative flex-1 group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <Key size={25} strokeWidth={2.5} />
        </div>
        <input 
          type={showPassword ? "text" : "password"}
          name="password"
          value={loginData.password}
          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Password" 
          className="w-full bg-white text-black pl-10 pr-10 py-3 rounded-md text-sm md:text-base outline-none border-2 border-zinc-300 focus:border-blue-500 transition-all font-bold shadow-sm placeholder:font-normal"
        />
        {/* Tombol Mata untuk intip password */}
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
<button 
  onClick={handleLogin} 
  disabled={loading}    
  className="relative overflow-hidden bg-[#c5a021] hover:bg-yellow-500 text-black font-black px-8 py-3 rounded-md text-sm md:text-base uppercase whitespace-nowrap disabled:opacity-50 transition-all shadow-lg active:scale-95 flex items-center justify-center min-w-[120px] border-b-4 border-yellow-700 hover:border-yellow-600 h-[52px] group"
>
  {/* --- INI CAHAYA BERJALANNYA (PASTI NYALA) --- */}
  <style jsx>{`
    @keyframes shimmer {
      0% { transform: translateX(-150%) skewX(-20deg); }
      100% { transform: translateX(150%) skewX(-20deg); }
    }
    .shimmer-effect {
      animation: shimmer 2.5s infinite;
      background: linear-gradient(
        to right, 
        transparent, 
        rgba(255, 255, 255, 0.6), 
        transparent
      );
    }
  `}</style>
  
  <span className="absolute inset-0 shimmer-effect w-[100px] h-full"></span>

  {loading ? (
    <div className="flex items-center gap-1">
      <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  ) : (
    <span className="relative z-10">LOGIN</span>
  )}
</button>      </div>



<div className="bg-[#5D3FD3] rounded-full p-1 shadow-lg w-full mt-2"> {/* P-1 biar border luarnya lebih kelihatan mewah */}
  <div className="flex justify-between items-center text-white">
    
    {/* Tombol Promosi - PY-4 biar lebih tinggi */}
    <button onClick={() => router.push('/promosi')} className="flex-1 py-3 rounded-full hover:bg-black/10 text-[11px] font-black uppercase flex flex-col md:flex-row items-center justify-center gap-1 transition-all">
      <span>🎁</span> PROMOSI
    </button>
    
    <button onClick={() => router.push('/hubungi')} className="flex-1 py-3 rounded-full hover:bg-black/10 text-[11px] font-black uppercase flex flex-col md:flex-row items-center justify-center gap-1 border-l border-white/20">
      <span>🎧</span> HUBUNGI
    </button>
    
    <button onClick={() => router.push('/daftar')} className="flex-1 py-3 rounded-full hover:bg-black/10 text-[11px] font-black uppercase flex flex-col md:flex-row items-center justify-center gap-1 border-l border-white/20 text-yellow-300">
      <span>👤</span> DAFTAR
    </button>
    
    <div className="flex-1 relative"> 
      <button 
        type="button" 
        onClick={(e) => {
          e.stopPropagation();
          setShowLainnya(!showLainnya);
        }} 
        className={`w-full py-4 rounded-full transition-all text-[11px] font-black uppercase flex flex-col md:flex-row items-center justify-center gap-1 border-l border-white/20 ${
          showLainnya ? 'bg-yellow-400 text-black shadow-inner scale-95' : 'hover:bg-black/10 text-white'
        }`}
      >
        <span>💬</span>
        <span className="tracking-tighter">Lainnya</span>
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
     <div className="w-full flex items-center justify-center min-h-[60px] md:min-h-[120px] relative">
        {/* Logo Tengah */}
        <div className="flex justify-center items-center">
          <img 
            src="https://i.postimg.cc/XYgNTswc/download-(3).png" 
            alt="Logo" 
            className="h-12 md:h-20 w-auto drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] object-contain cursor-pointer"
            onClick={() => router.push('/dashboard')}
          />
        </div>

        {/* Tombol Logout Kanan (Hanya Desktop) */}
        <div className="hidden md:block absolute right-5">
          <button 
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("username");
              window.location.href = "/";
            }}
            className="bg-red-600/20 border border-red-600 text-red-500 text-[10px] font-black px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all uppercase"
          >
            LOGOUT
          </button>
     </div>
  </div>
)}
  </div>
</header>



      {/* --- KONTEN TENGAH --- */}
      <div className="w-full max-w-6xl bg-[#1a0033] p-4 md:p-8 flex flex-col gap-8 shadow-2xl min-h-screen pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {daftarKontak.map((kontak, i) => (
            <div key={i} className="bg-[#2d0055] border border-white/10 rounded-2xl p-6 flex items-center justify-between group shadow-xl">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${kontak.color} flex items-center justify-center shadow-lg`}>
  <div className="flex items-center justify-center w-full h-full p-1.5"> 
    {/* p-1.5 memberikan sedikit ruang napas agar logo tidak nempel ke pinggir */}
    {kontak.icon}
  </div>
</div>
                <div>
                  <h3 className="font-black text-lg text-white uppercase tracking-tighter">{kontak.name}</h3>
                  <p className="text-[10px] text-gray-300 uppercase italic">{kontak.desc}</p>
                </div>
              </div>
              <a href={kontak.link} className="bg-white/10 hover:bg-[#D4AF37] hover:text-black border border-white/10 text-white text-[10px] font-black px-4 py-2.5 rounded-lg uppercase">
                {kontak.action}
              </a>
            </div>
          ))}
        </div>
      </div>
<div className="h-10 w-full"></div>


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



      {/* --- MODAL MOBILE --- */}
      {showModalMobile && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6 md:hidden"> 
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModalMobile(false)}></div>
          <div className="relative w-full max-w-sm bg-[#110022] border-2 border-[#D4AF37] rounded-3xl overflow-hidden z-[1001]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h3 className="font-black text-[#D4AF37] uppercase italic">Lainnya</h3>
              <button onClick={() => setShowModalMobile(false)} className="text-white text-2xl font-bold p-2">&times;</button>
            </div>
            <div className="p-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              {menuLainnya.map((item, i) => (
                <a key={i} href={item.link} className="flex items-center gap-4 bg-black/60 border border-white/5 p-4 rounded-xl active:bg-[#D4AF37] active:text-black">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-black text-[12px] uppercase">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}



{/* --- MODAL LAINNYA: Taruh di luar div navigasi tapi di dalam <main> --- */}
{/* --- MODAL LAINNYA (MOBILE) --- */}
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

      {/* --- NAV MOBILE (GUEST) --- */}
      {!isLoggedIn && (
        <nav className="fixed bottom-0 left-0 right-0 z-[130] bg-black border-t border-yellow-500/30 md:hidden flex items-center justify-around py-3">
          <button onClick={() => router.push('/')} className="flex flex-col items-center flex-1 text-gray-400">
            <span className="text-xl">🏠</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Beranda</span>
          </button>
          <button onClick={() => router.push('/promosi')} className="flex flex-col items-center flex-1 text-gray-400">
            <span className="text-xl">🎁</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Promo</span>
          </button>
          <button onClick={() => router.push('/hubungi')} className="flex flex-col items-center flex-1 text-yellow-500">
            <span className="text-xl">🎧</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Bantuan</span>
          </button>
          <button onClick={() => setShowModalMobile(true)} className="flex flex-col items-center flex-1 text-gray-400">
            <span className="text-xl">💬</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Lainnya</span>
          </button>
        </nav>
      )}

      {/* --- NAV MOBILE (LOGGED IN) --- */}
    
        {/* --- BOTTOM NAV SETELAH LOGIN --- */}
      {isLoggedIn && (
        <div className="fixed bottom-0 md:bottom-0 left-0 right-0 z-[999] flex justify-center pointer-events-none">
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
      )}
    </main>
  );
}