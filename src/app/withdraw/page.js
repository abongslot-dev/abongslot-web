"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
  const router = useRouter();
  
  // --- 1. STATE ---
  const [username, setUsername] = useState("");
  const [nominal, setNominal] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [loadingSaldo, setLoadingSaldo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const headerRef = useRef(null); 
  const [showLainnya, setShowLainnya] = useState(false);
  const [showWdModal, setShowWdModal] = useState(false);
  const [errorNotif, setErrorNotif] = useState("");

  // --- 2. LOGIC FETCH DATA (ANTI GAGAL) ---
  // --- 2. LOGIC FETCH DATA (VERSI ANTI NYANGKUT) ---
const fetchDataLengkap = async (name) => {
  if (!name) return null; // Keamanan dasar kalau nama kosong
  
  try {
    setLoadingSaldo(true);
    // Kita pakai .toLowerCase() biar gak pusing soal huruf besar kecil
    const response = await fetch(`/api/user/saldo?username=${name.toLowerCase()}`);
    const data = await response.json();
    
    if (data.success && data.user) {
      setSaldo(data.saldo);
      setUserProfile(data.user); 
      console.log("✅ Profil Berhasil Dimuat:", data.user);
      
      // INI KUNCINYA: Mengembalikan data supaya fungsi WD bisa baca langsung
      return data.user; 
    } else {
      console.error("❌ User tidak ditemukan di database");
      return null;
    }
  } catch (error) {
    console.error("❌ Gagal konek ke API:", error);
    return null;
  } finally {
    setLoadingSaldo(false);
  }
};

// Console log ini taruh di dalam useEffect atau fungsi saja biar gak nyampah
useEffect(() => {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    setUsername(savedName);
    fetchDataLengkap(savedName);
  } else {
    router.push("/");
  }
}, [router]);




 
// --- 3. PROSES KIRIM WD (VERSI ANTI-GAGAL) ---
const handleWithdraw = async () => {
  const currentUsername = username || localStorage.getItem("username");
  
  // 1. Ambil data profil (Paksa ambil kalau state masih kosong)
  let profilAktif = userProfile;
  
  if (!profilAktif) {
    console.log("🔄 Profil kosong, mencoba ambil ulang...");
    profilAktif = await fetchDataLengkap(currentUsername);
  }

  // 2. VALIDASI AKHIR (Kalau profilAktif masih null, berarti memang gagal total)
  if (!profilAktif) {
    setErrorNotif("❌ Gagal mendapatkan data Rekening. Silakan Refresh.");
    return;
  }

  // 3. VALIDASI INPUT
  if (!password) {
    setErrorNotif("❌ Password WD wajib diisi!");
    return;
  }

  if (!nominal || Number(nominal) < 50000) {
    setErrorNotif("❌ Minimal WD Rp 50.000");
    return;
  }

  // 4. KIRIM KE API WD
  setLoading(true);
  try {
    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: currentUsername,
        nominal: Number(nominal),
        password: password,
        bank: profilAktif.nama_bank,         // Ambil dari profilAktif
        nama_rekening: profilAktif.nama_rekening, // Ambil dari profilAktif
        nomor_rekening: profilAktif.nomor_rekening, // Ambil dari profilAktif
        status: "PENDING"
      }),
    });

    const hasil = await res.json();

    if (res.ok && hasil.success) {
      setTimeout(() => {
        setLoading(false);
        setShowWdModal(true);
        setNominal("");
        setPassword("");
        fetchDataLengkap(currentUsername); // Update saldo
      }, 2000);
    } else {
      setLoading(false);
      setErrorNotif("❌ " + (hasil.message || "Gagal WD"));
    }
  } catch (err) {
    setLoading(false);
    setErrorNotif("❌ Masalah Jaringan!");
  }
};
  return (
    <main 
      className="min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >
      {/* --- HEADER --- */}
      <header ref={headerRef} className="w-full max-w-5xl bg-[#1a0033] shadow-2xl sticky top-0 z-[100] border-b border-[#D4AF37]/20">
        <div className="px-5 py-3 flex items-center justify-center min-h-[60px] md:min-h-[120px]"> 
          <div className="flex justify-center items-center">
            <img 
              src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" 
              alt="Logo" 
              className="h-12 md:h-20 w-auto drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] object-contain cursor-pointer"
              onClick={() => router.push('/dashboard')}
            />
          </div>
          <div className="hidden md:block absolute right-5">
            <button 
              onClick={() => router.push("/dashboard")}
              className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-black px-4 py-1.5 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all"
            >
              KEMBALI
            </button>
          </div>
        </div>
      </header>

      {/* --- KONTEN UTAMA --- */}
      <div className="w-full max-w-5xl bg-[#1a0033] flex flex-col items-center gap-3 p-4 shadow-2xl min-h-screen border-x border-white/5 pb-40">
        
        {/* BOX WITHDRAW PUTIH */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden text-black border-t-4 border-red-600">
          <div className="bg-white border-b p-2 text-center font-black text-gray-800 text-sm tracking-widest uppercase">
            WITHDRAW
          </div>

          <div className="p-2 bg-gray-50 flex justify-center">
            <div className="w-1/2 py-2 flex flex-col items-center justify-center border-2 border-yellow-400 bg-[#dce67b] rounded-md shadow-sm">
              <span className="text-xl">🏦</span>
              <span className="text-[9px] font-black text-black uppercase">TRANSFER</span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-[#cc3300] text-white p-3 rounded-md text-[10px] flex gap-2 items-start leading-tight">
              <div className="bg-transparent border border-white rounded-full min-w-[14px] h-[14px] flex items-center justify-center text-[10px] font-bold">i</div>
              <p>Minimal withdraw adalah Rp. 50,000.00 dan periksa kembali data Anda.</p>
            </div>

            <div className="space-y-3 text-[11px] font-bold text-gray-600">
              
              <div className="flex items-center border-2 border-gray-800 rounded-md overflow-hidden">
                <span className="w-24 px-3 py-2 text-gray-500 border-r-2 border-gray-800 font-bold bg-gray-50">Saldo</span>
                <div className="flex-1 px-3 py-2 flex items-center gap-2 bg-white">
                  <span className="text-gray-900 font-black tracking-wider">
                    {loadingSaldo ? "..." : Number(saldo).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                 <span className="w-24 px-3 py-2 text-gray-500 border-r">Nominal</span>
                 <input 
                   type="number" 
                   placeholder="Rp. 0" 
                   value={nominal}
                   onChange={(e) => setNominal(e.target.value)}
                   className="flex-1 px-3 py-2 outline-none text-black" 
                 />
              </div>

              <div className="flex items-center border border-gray-300 rounded overflow-hidden relative">
                 <span className="w-24 px-3 py-2 text-gray-500 border-r">Password</span>
                 <input 
                   type={showPassword ? "text" : "password"} 
                   placeholder="Password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="flex-1 px-3 py-2 outline-none text-black" 
                 />
                 <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400">
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                 </button>
              </div>

              {/* DETAIL REKENING */}
              <div className="bg-[#f8fbff] border border-blue-100 rounded-lg p-4 space-y-2">
                 <p className="text-center text-blue-900 text-[12px] mb-2 font-black">Detail Penarikan</p>
                 <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                    <span className="text-gray-500">Bank</span>
                    <span className="text-right text-gray-800 uppercase">: {userProfile?.nama_bank|| "-"}</span>
                    
                    <span className="text-gray-500">Nomor Rekening</span>
                    <span className="text-right text-gray-800">: {userProfile ? `* * * * * * ${userProfile.nomor_rekening.slice(-4)}` : "-"}</span>
                    
                    <span className="text-gray-500">Nominal WD</span>
                    <span className="text-right text-red-600 font-black">: Rp {Number(nominal || 0).toLocaleString('id-ID')}</span>
                 </div>
              </div>

              <button 
                onClick={handleWithdraw}
                disabled={loading}
                className={`w-full py-2.5 rounded shadow-sm font-black text-xs uppercase transition-all ${
                  nominal >= 50000 && !loading ? 'bg-[#dce67b] text-gray-700 hover:brightness-110' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {loading ? "PROSES..." : "Kirim WD"}
              </button>
            </div>
          </div>
        </div>
      
</div> {/* Tutup Konten Utama */}



{errorNotif && (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[999] bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-bounce border border-white/20">
    {errorNotif}
  </div>
)}




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



{/* 2. LOADING OVERLAY (AREA TRANSPARAN BLUR 5 DETIK) */}
      {loading && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#d4c33d]/20 border-t-[#d4c33d] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[#d4c33d] font-black text-[8px]">ABONGSLOT</div>
          </div>
          <p className="mt-4 text-[#d4c33d] font-bold text-[10px] uppercase tracking-[4px] animate-pulse text-center">
            SEDANG MEMPROSES WD...<br/>MOHON TUNGGU SEBENTAR
          </p>
        </div>
      )}

{/* MODAL WD SUKSES */}
{showWdModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    
    {/* --- AREA TRANSPARAN BLUR (OVERLAY) --- */}
    <div 
      className="absolute inset-0 bg-black/20 backdrop-blur-md" 
      onClick={() => setShowWdModal(false)}
    ></div>
    {/* -------------------------------------- */}

    {/* Kotak Modal (Tetap Solid supaya kontras) */}
    <div className="relative bg-[#2d0055]/95 border-2 border-[#d4c33d] p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="w-16 h-16 bg-[#d4c33d] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(212,175,55,0.5)]">
        <svg className="w-10 h-10 text-[#1a0033]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h2 className="text-[#d4c33d] font-black text-xl mb-4 uppercase italic">
        Withdrawal Berhasil!
      </h2>
      
      <p className="text-white font-bold text-sm leading-relaxed mb-6">
        SILAHKAN DI TUNGGU Withdrawal  <br/> ANDA SEDANG DALAM PROSES
      </p>

      <button 
        onClick={() => {
          setShowWdModal(false);
          router.push("/profile"); 
        }}
        className="w-full py-3 bg-gradient-to-r from-[#d4c33d] to-[#f5e671] text-[#1a0033] font-black rounded-lg hover:scale-105 transition-all uppercase text-xs shadow-lg"
      >
        OKE MANTAP
      </button>
    </div>
  </div>
)}










{/* --- MODAL LAINNYA: Taruh di luar div navigasi tapi di dalam <main> --- */}
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


