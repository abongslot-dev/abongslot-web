"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";


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
  const [username, setUsername] = useState("Guest"); // Default Guest
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showLainnya, setShowLainnya] = useState(false);
  const [promoTerpilih, setPromoTerpilih] = useState(null);
  const [halamanAktif, setHalamanAktif] = useState('promosi');
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [errorNotif, setErrorNotif] = useState("");


  const headerRef = useRef(null);

  // --- 2. DATA STATIC ---
  const daftarPromo = [
    { 
      title: "LOMBA TEBAK ANGKA", 
      image: "https://i.postimg.cc/SxPMK5xB/banner3.png", 
      content: "Tebak 4 angka keberuntungan Anda dan menangkan total hadiah 50 Juta Rupiah setiap harinya! Berlaku untuk semua member aktif."
    },
    { 
      title: "100% BONUS DEPOSIT SLOT", 
      image: "https://i.postimg.cc/W3CrfHQm/banner1.png", 
      content: "Bonus saldo tambahan 100% untuk semua permainan slot. Minimal deposit hanya 20 ribu dengan TO yang sangat rendah!"
    },
    { 
      title: "CASHBACK MINGGUAN 10%", 
      image: "https://i.postimg.cc/SxPMK5xB/banner3.png", 
      content: "Dapatkan pengembalian kekalahan Anda setiap hari Senin secara otomatis tanpa perlu klaim ke Customer Service."
    },
    { 
      title: "ROLLINGAN ALL GAMES", 
      image: "https://i.postimg.cc/W3CrfHQm/banner1.png", 
      content: "Menang atau kalah tetap dapat bonus! Rollingan dihitung dari total turnover Anda selama satu minggu."
    }
  ];

  const menuLainnya = [
    { name: "RTP 99%", icon: "🎰", link: "#" },
    { name: "PREDIKSI TOGEL", icon: "🔮", link: "#" },
    { name: "BUKTI PEMBAYARAN", icon: "💰", link: "#" },
    { name: "LINK ALTERNATIF 1", icon: "🔗", link: "#" },
    { name: "LINK ALTERNATIF 2", icon: "🔗", link: "#" },
    { name: "LOMBA TOGEL", icon: "📝", link: "#" },
  ];

  // --- 3. LOGIC ---
  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    if (status === "true") setIsLoggedIn(true);
  }, []);



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
       className="min-h-screen text-white font-sans flex-grow flex-col items-center bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >
      
      {/* --- HEADER --- */}
      <header ref={headerRef} className="w-full max-w-5xl bg-[#1a0033] shadow-2xl sticky top-0 z-[100] border-b border-[#D4AF37]/20 mx-auto">
        <div className="px-5 py-3 md:py-0 flex items-center md:items-stretch justify-between min-h-[60px] md:min-h-[120px]"> 
          {!isLoggedIn ? (
            <>
              {/* LOGO MOBILE */}
              <div className="flex md:hidden w-full justify-center items-center">
                <img src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" alt="Logo" className="h-12 w-auto object-contain" />
              </div>

              {/* LOGO DESKTOP */}
              <div className="hidden md:flex flex-1 items-center justify-start">
                <img src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" alt="Logo" className="h-28 md:h-32 w-auto object-contain" />
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

                  <div className="bg-[#5D3FD3] rounded-full p-0.5 shadow-lg w-full flex justify-between items-center text-white">
                    <button onClick={() => router.push('/promosi')} className="flex-1 py-2.5 rounded-full text-[9px] font-bold uppercase">🎁 PROMOSI</button>
                    <button onClick={() => router.push('/hubungi')} className="flex-1 py-2.5 rounded-full text-[9px] font-bold uppercase border-l border-white/10">🎧 HUBUNGI</button>
                    <button onClick={() => router.push('/daftar')} className="flex-1 py-2.5 rounded-full text-[9px] font-bold uppercase border-l border-white/10 text-yellow-300">👤 DAFTAR</button>
                    
                    <div className="flex-1 relative"> 
                      <button onClick={() => setShowLainnya(!showLainnya)} className={`w-full py-2.5 rounded-full text-[9px] font-bold uppercase border-l border-white/10 ${showLainnya ? 'bg-yellow-400 text-black' : ''}`}>
                        💬 Lainnya
                      </button>

                      {/* Dropdown Desktop */}
                      {showLainnya && (
                        <div className="absolute top-[130%] right-0 w-60 bg-white rounded-xl shadow-2xl z-[999] border border-gray-200 overflow-hidden text-black">
                          {menuLainnya.map((item, idx) => (
                            <a key={idx} href={item.link} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-0">
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
            </>
          ) : (
            <div className="w-full flex items-center justify-center relative min-h-[60px] md:min-h-[120px]">
        {/* Logo Tetap di Tengah */}
        <img 
          src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" 
          alt="Logo" 
          className="h-12 md:h-20 w-auto drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] object-contain cursor-pointer"
          onClick={() => router.push('/dashboard')}
        />

        {/* Tombol Logout di Pojok Kanan */}
        <div className="absolute right-0">
          <button 
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("username");
              window.location.href = "/";
            }}
            className="bg-red-600/20 border border-red-600 text-red-500 text-[9px] md:text-[11px] font-black px-3 py-1.5 md:px-5 md:py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95"
          >
            LOGOUT
          </button>
        </div>
      </div>
    )}
  </div>
</header>


 
      {/* --- ISI KONTEN --- */}
    {/* --- ISI KONTEN --- */}
    
     <div className="w-full max-w-5xl bg-[#1a0033] flex flex-col gap-3 p-4 shadow-2xl border-x border-white/5 pb-24 mx-auto flex-grow">
        
        {/* Header Judul yang Lebih Tegas */}
        <div className="border-b-2 border-[#D4AF37] pb-3 mb-2">
          <h1 className="text-2xl font-black text-[#D4AF37] uppercase italic tracking-tighter flex items-center gap-2">
            <span className="text-3xl">🔥</span> Promosi Terbaru
          </h1>
        </div>

        {/* Grid Promo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {daftarPromo.map((promo, i) => (
            <div key={i} className="flex flex-col w-full overflow-hidden rounded-2xl border border-white/10 bg-[#110022] group shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-300">
              
              {/* Gambar Promo */}
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {/* Overlay gradasi agar gambar tidak mati */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#110022] via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Detail Promo */}
              <div className="p-5 flex flex-col gap-4">
                <h2 className="text-white font-black text-base md:text-lg uppercase italic leading-tight group-hover:text-[#D4AF37] transition-colors">
                  {promo.title}
                </h2>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">Limited Offer</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase">S&K Berlaku</span>
                  </div>
                  
                  <button 
                    onClick={() => setPromoTerpilih(promo)} 
                    className="bg-gradient-to-b from-[#f3d97d] via-[#d4af37] to-[#a68a2d] text-black font-black px-5 py-2.5 rounded-xl text-[11px] uppercase shadow-[0_4px_15px_rgba(212,175,55,0.3)] active:scale-95 hover:brightness-110 transition-all"
                  >
                    Ambil Promo
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
      
     
 
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



      {/* --- MODAL DETAIL PROMO --- */}
      {promoTerpilih && (
        <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={() => setPromoTerpilih(null)}></div>
          <div className="relative w-full max-w-lg bg-[#1a0033] border-t-2 md:border-2 border-[#D4AF37] rounded-t-[2.5rem] md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="p-6 md:p-8">
              <h2 className="text-[#D4AF37] text-2xl font-black uppercase italic mb-4">{promoTerpilih.title}</h2>
              <img src={promoTerpilih.image} className="w-full rounded-2xl mb-6 border border-white/10" alt="Promo" />
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-6">
                <p className="text-gray-300 text-sm leading-relaxed">{promoTerpilih.content}</p>
              </div>
              <button onClick={() => setPromoTerpilih(null)} className="w-full bg-white/10 text-white font-bold py-4 rounded-xl uppercase active:scale-95 transition-all">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL LAINNYA (MOBILE) --- */}
      {showLainnya && (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
    {/* Overlay Gelap - Pastikan klik di luar modal bisa menutup */}
    <div 
      className="absolute inset-0 bg-black/10 backdrop-blur-sm" 
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


      <div className="h-10 w-full"></div>

     
      {/* --- NAVIGATION MOBILE --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-[130] bg-black border-t border-yellow-500/30 md:hidden flex items-center justify-around py-3">
        <button onClick={() => router.push('/')} className="flex flex-col items-center flex-1 text-gray-400">
          <span className="text-xl">🏠</span>
          <span className="text-[9px] font-black uppercase">Beranda</span>
        </button>
        <button onClick={() => setHalamanAktif('promosi')} className={`flex flex-col items-center flex-1 ${halamanAktif === 'promosi' ? 'text-yellow-500' : 'text-gray-400'}`}>
          <span className="text-xl">🎁</span>
          <span className="text-[9px] font-black uppercase">Promo</span>
        </button>
        <button onClick={() => router.push('/hubungi')} className="flex flex-col items-center flex-1 text-gray-400">
          <span className="text-xl">🎧</span>
          <span className="text-[9px] font-black uppercase">Bantuan</span>
        </button>
        <button onClick={() => setShowLainnya(true)} className="flex flex-col items-center flex-1 text-gray-400">
          <span className="text-xl">💬</span>
          <span className="text-[9px] font-black uppercase">Lainnya</span>
        </button>
      </nav>




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


