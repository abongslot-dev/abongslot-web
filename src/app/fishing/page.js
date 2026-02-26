"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";


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

function GameFishingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const headerRef = useRef(null);

  // --- 1. STATE ---
  const [halamanAktif, setHalamanAktif] = useState('utama');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLainnya, setShowLainnya] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("MEMBER");
  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [errorNotif, setErrorNotif] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Mengambil ID provider dari URL (?provider=ID)
  const providerName = searchParams.get("provider") || "MICROGAMING";

  // --- 2. DATABASE GAME FISHING ---
  const databaseGame = {
    "MICROGAMING": [
      { name: "Fly X", img: "https://i.postimg.cc/1zf82qyB/Fly-X.png" },
      { name: "Fruit Blast", img: "https://i.postimg.cc/d0phYV13/Fruit-Blast.png" },
      { name: "Leprechaun Strike", img: "https://i.postimg.cc/HnCjrvXK/Leprechaun-Strike.png" },
      { name: "Mega Money Rush", img: "https://i.postimg.cc/RCcNk9xD/Mega-Money-Rush.png" },
      { name: "Pets Go Wild", img: "https://i.postimg.cc/pXRpx72p/Pets-Go-Wild.png" },
      { name: "Soccer Striker", img: "https://i.postimg.cc/Kzt8h7w5/Soccer-Striker.png" },
      { name: "The Incredible Balloon Machine", img: "https://i.postimg.cc/cCm1rxsM/The-Incredible-Balloon-Machine.png" },
    ],
    "CO9GAMING": [
      { name: "Ocean Lord", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
      { name: "Dino Hunter", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
    ],
    "JOKERGGAMING": [
      { name: "Fishing War", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
      { name: "Fishing God", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
      { name: "Zombie Party", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
    ],
    "SPADEGAMING": [
      { name: "Mega Fishing", img: "https://i.postimg.cc/W3CrfHQm/banner1.png" },
    ]
  };

  const menuLainnya = [
    { name: "RTP 99%", icon: "🎰", link: "#" },
    { name: "PREDIKSI TOGEL", icon: "🔮", link: "#" },
    { name: "BUKTI JP", icon: "💰", link: "#" },
  ];

  // Ambil data berdasarkan ID yang dikirim dari Home
  const listGameTampil = databaseGame[providerName.toUpperCase()] || databaseGame["MICROGAMING"];

// 2. Tambahkan pengaman (empty array []) agar jika data tetap tidak ketemu, filter tidak crash
const allGames = (listGameTampil || []).filter(game => 
  game.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  // --- 3. LOGIC ---
  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    const savedUser = localStorage.getItem("username");
    if (status === "true") setIsLoggedIn(true);
    if (savedUser) setUsername(savedUser);
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

  const handlePlayGame = (gameName) => {
    if (!isLoggedIn) {
      setSelectedGame(gameName);
      setShowModal(true);
    } else {
      alert("Memulai Game: " + gameName);
    }
  };

  return (
    <main 
      className="relative min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center pb-10"
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >

        {loading && <LoadingOverlay />}
      {/* --- HEADER START --- */}
      {/* --- HEADER UTAMA --- */}
      <header ref={headerRef} className="w-full max-w-5xl bg-[#1a0033] shadow-2xl sticky top-0 z-[100] border-b border-[#D4AF37]/20 mx-auto">
        <div className="px-5 py-3 md:py-0 flex items-center md:items-stretch justify-between min-h-[60px] md:min-h-[120px]"> 
          {!isLoggedIn ? (
            <>
              <div className="flex md:hidden w-full justify-center items-center">
                <img src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" alt="Logo" className="h-12 w-auto drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] object-contain" />
              </div>

              <div className="hidden md:flex flex-1 items-center justify-start">
                <img src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" alt="Logo" className="h-28 md:h-32 w-auto drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] object-contain" />
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

                  <div className="bg-[#5D3FD3] rounded-full p-0.5 shadow-lg w-full">
                    <div className="flex justify-between items-center text-white">
                      <button onClick={() => router.push('/promosi')} className="flex-1 py-2.5 rounded-full hover:bg-black/10 text-[9px] font-bold uppercase flex items-center justify-center gap-1">🎁 PROMOSI</button>
                      <button onClick={() => router.push('/hubungi')} className="flex-1 py-2.5 rounded-full hover:bg-black/10 text-[9px] font-bold uppercase flex items-center justify-center gap-1 border-l border-white/10">🎧 HUBUNGI</button>
                      <button onClick={() => router.push('/daftar')} className="flex-1 py-2.5 rounded-full hover:bg-black/10 text-[9px] font-bold uppercase flex items-center justify-center gap-1 border-l border-white/10 text-yellow-300">👤 DAFTAR</button>
                      <div className="flex-1 relative"> 
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowLainnya(!showLainnya); }} 
                          className={`w-full py-2.5 rounded-full transition-all text-[9px] font-bold uppercase flex items-center justify-center gap-1 border-l border-white/10 ${showLainnya ? 'bg-yellow-400 text-black' : 'hover:bg-black/10 text-white'}`}
                        >
                          <span>💬</span><span className="font-black uppercase tracking-tighter">Lainnya</span>
                        </button>
                        {showLainnya && (
                          <div className="absolute top-[130%] right-0 w-60 bg-white rounded-xl shadow-2xl z-[999] border border-gray-200 overflow-hidden text-black text-left">
                            {menuLainnya.map((item, idx) => (
                              <a key={idx} href={item.link} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-0 transition-colors">
                                <span className="text-lg">{item.icon}</span><span className="text-[11px] font-bold">{item.name}</span>
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
            <div className="w-full flex items-center justify-between py-2">
              <img src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" className="h-10 w-auto md:h-16" alt="Logo" />
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-[10px] text-gray-400">Selamat Datang,</p>
                  <p className="text-sm font-bold text-[#D4AF37]">{username || "MEMBER"}</p>
                </div>
                <button 
                  onClick={() => { localStorage.clear(); window.location.reload(); }}
                  className="bg-red-600 px-2 py-1 rounded text-[9px] font-bold shadow-md"
                >LOGOUT</button>
              </div>
            </div>
          )}
        </div>
      </header>


      {/* --- KONTEN UTAMA (Container Tanpa Transparansi) --- */}
      <div className="w-full min-h-screen  max-w-5xl bg-[#1a0033] px-5 pt-6 pb-20 shadow-2xl">
        <button 
          onClick={() => router.back()} 
          className="mb-6 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-lg font-black text-xs uppercase shadow-md active:scale-95 transition-all"
        >
          ❮ Kembali
        </button>
        



<div className="w-full md:max-w-5xl md:mx-auto"> 
  
  {/* SECTION: MAIN GRID DAFTAR GAME */}
  <section className="bg-white rounded-t-[1rem] md:rounded-t-[1rem] p-4 md:p-6 min-h-100px shadow-inner w-full">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-4 px-2">
      <div className="flex items-center gap-3">
        <div className="h-5 w-1.5 bg-red-600 rounded-full"></div>
        <span className="text-gray-900 font-black text-[14px] md:text-xs uppercase tracking-tight">
          {providerName} PLAY
        </span>
      </div>
      <div className="relative">
        <input 
          type="text" 
          placeholder="Cari game..." 
          className="bg-gray-100 border border-gray-200 rounded-full px-8 py-2 text-[10px] md:text-[11px] text-black outline-none w-32 md:w-48 focus:ring-2 focus:ring-red-500/20 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute left-3 top-2.5 text-[10px] opacity-40">🔍</span>
      </div>
    </div>

    {/* Grid Game: Full Kiri Kanan di Mobile */}
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
      {allGames.map((game, i) => (
        <div 
          key={i} 
          onClick={() => handlePlayGame(game.name)} 
          className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
        >
          <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-md border border-gray-100 aspect-square w-full relative">
            <img src={game.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={game.name} />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <span className="bg-yellow-500 text-black rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[9px] md:text-[10px] font-black shadow-xl scale-75 group-hover:scale-100 transition-transform">
                {isLoggedIn ? "PLAY" : "🔒 LOGIN"}
              </span>
            </div>
          </div>
          <p className="text-[9px] md:text-[10px] text-gray-700 font-black mt-2 text-center leading-tight uppercase px-1 h-8 overflow-hidden">
            {game.name}
          </p>
        </div>
      ))}
    </div>
  </section>
</div>
{/* --- POP-UP MODAL TENGAH --- */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 flex flex-col items-center text-center">
              {/* Pesan Error */}
              <h3 className="text-gray-700 font-bold text-lg mb-6">
                Login terlebih dahulu untuk bermain {selectedGame}
              </h3>
              
              {/* Tombol OK Kuning */}
              <button 
                onClick={() => setShowModal(false)}
                className="w-full bg-[#eab308] hover:bg-yellow-500 text-black font-black py-3 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                Ok
              </button>
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
  <span className="text-[9px] font-black uppercase tracking-tighter">Lainnya</span>
</button>


      </nav>
        <div className="h-0 w-full"></div>
      </div>
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a0033] flex items-center justify-center text-white">Memuat Games...</div>}>
      <GameFishingContent />
    </Suspense>
  );
}