"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  
  // --- 1. STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLainnya, setShowLainnya] = useState(false);
  const [username, setUsername] = useState("");
  const [saldo, setSaldo] = useState(0);

  // --- 2. REFS ---
  const headerRef = useRef(null);

  // --- 3. DATA MENU ---
  const menuProfile = [
  { name: "Riwayat Saldo", icon: "📊", path: "/riwayat-saldo" },
  { name: "Riwayat Deposit", icon: "📥", path: "/riwayat-deposit" },
  { name: "Riwayat Withdraw", icon: "📤", path: "/riwayat-penarikan" },
  { name: "Riwayat Bet Togel", icon: "🎰", path: "/riwayat-bet" },
  { name: "Riwayat Keluaran", icon: "📅", path: "/riwayat-keluaran" },
  { name: "Ganti Password", icon: "🔑", path: "/ganti-password" },
];

  const menuLainnya = [
    { name: "RTP 99%", icon: "🎰", link: "#" },
    { name: "PREDIKSI TOGEL", icon: "🔮", link: "#" },
    { name: "BUKTI PEMBAYARAN", icon: "💰", link: "#" },
    { name: "LINK ALTERNATIF 1", icon: "🔗", link: "#" },
    { name: "LINK ALTERNATIF 2", icon: "🔗", link: "#" },
    { name: "ABONGSLOT", icon: "🏆", link: "#" },
    { name: "LOMBA TOGEL", icon: "📝", link: "#" },
    
  ];

  // --- 4. LOGIC PROTEKSI & AMBIL SALDO ---
const [userProfile, setUserProfile] = useState({ 
    nama_bank: "", 
    nama_rekening: "", 
    nomor_rekening: "" 
  });

useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    const savedName = localStorage.getItem("username");
    const savedBalance = localStorage.getItem("userBalance");

    

    if (status === "true" && savedName) {
      setIsLoggedIn(true);
      setUsername(savedName);
      
      const getDataProfil = async () => {
        try {
          const res = await fetch(`/api/user/saldo?username=${savedName}`);
          const data = await res.json();
          
          if (data.success) {
            setSaldo(data.saldo);
            localStorage.setItem("userBalance", data.saldo);
            setUserProfile({
              nama_bank: data.user.nama_bank,
              nama_rekening: data.user.nama_rekening,
              nomor_rekening: data.user.nomor_rekening
            });
          }
        } catch (err) {
          console.log("Gagal ambil data profil");
        }
      };
      getDataProfil();
    } else {
      router.push("/");
    }
  }, [router]);

  const getInisial = (name) => {
    if (!name) return "??";
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };
  return (
    <main 
      className="min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center"
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
    localStorage.removeItem("isLoggedIn"); // Menghapus status login
    localStorage.removeItem("username");   // Menghapus data user
    window.location.href = "/";            // Balik ke home dan refresh total
  }}
  className="bg-red-600/20 border border-red-600 text-red-500 text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all"
>
  LOGOUT
</button>
    </div>

  </div>
</header>

     





{/* --- KONTEN PROFILE --- */}
<div className="w-full max-w-5xl bg-[#1a0033] flex flex-col gap-3 p-4 shadow-2xl min-h-screen border-x border-white/5 pb-40">
  
  {/* BOX HITAM: Kita kasih 'justify-center' agar isinya ke tengah */}
  <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center justify-center gap-5 shadow-lg min-h-[140px]">
    
    {/* 1. Inisial Bulat */}
    <div className="w-16 h-16 bg-[#4da6ff] rounded-full flex items-center justify-center text-2xl font-black text-white shadow-inner uppercase flex-shrink-0">
      {username ? username.slice(0, 2) : "??"}
    </div>
    
    {/* 2. Container Teks: Hilangkan flex-1 agar dia tidak narik ruang, biar dia nempel sama bulatannya di tengah */}
    <div className="flex flex-col">
      
      {/* Username */}
      <h2 className="text-lg font-bold leading-tight uppercase text-white">
        {username || "Loading..."}
      </h2>
      
      {/* Info Bank & Rekening */}
      <div className="flex flex-col gap-0.5 mt-1">
        {/* NAMA BANK */}
        <p className="text-[11px] text-[#4da6ff] font-black uppercase tracking-widest">
          <span className="bg-[#4da6ff]/20 px-1.5 py-0.5 rounded">
            {userProfile.nama_bank || "BANK TIDAK ADA"}
          </span>
        </p>
        
        {/* NAMA PEMILIK REKENING */}
        <p className="text-[12px] text-white/80 font-bold uppercase">
          {userProfile.nama_rekening || "NAMA TIDAK ADA"}
        </p>

        {/* NOMOR REKENING */}
        <p className="text-[14px] text-yellow-400 font-mono font-black">
          {userProfile.nomor_rekening || "0000000000"}
        </p>
      </div>

    </div>
  </div>


          

{/* 2. BARIS DOMPET, DEPOSIT, WITHDRAW, LOGOUT */}
<div className="grid grid-cols-4 gap-2">
        <div className="bg-black/40 border border-white/5 rounded-lg p-2 text-center flex flex-col justify-center">
          <p className="text-[8px] uppercase font-bold text-white/50 tracking-tighter">Dompet</p>
          <p className="text-xs font-black text-yellow-400">
            {Number(saldo).toLocaleString('id-ID')}
          </p>
        </div>
  
  <button 
    onClick={() => router.push('/deposit')}
    className="bg-[#ccff33] text-black text-[10px] font-black rounded-lg py-2 flex flex-col items-center justify-center shadow-md active:scale-95 transition-all"
  >
    DEPOSIT
  </button>
  
  <button 
    onClick={() => router.push('/withdraw')}
    className="bg-white/10 border border-white/10 text-white text-[10px] font-black rounded-lg py-2 flex flex-col items-center justify-center active:scale-95 transition-all"
  >
    WITHDRAW
  </button>

  <button 
    onClick={() => { 
      localStorage.clear(); 
      window.location.href = "/"; 
    }}
    className="bg-red-600 text-white text-[10px] font-black rounded-lg py-2 flex flex-col items-center justify-center shadow-md active:scale-95 transition-all"
  >
    LOGOUT
  </button>
</div>

{/* --- 3. REFERRAL SECTION (GRID 2 KOLOM) --- */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {/* KOTAK KIRI: LINK REFERRAL */}
  <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
    <p className="text-[10px] font-bold text-white/70 uppercase">Link Referral</p>
    <div className="flex flex-col gap-2">
      <input 
        readOnly 
        value="https://abongslot.com/register?referral=aurel123" 
        className="bg-white/90 text-black text-[10px] w-full px-3 py-2 rounded-md font-bold outline-none"
      />
      <button className="bg-[#ccff33] text-black text-[10px] font-black px-4 py-2 rounded-md active:bg-yellow-400 w-full">
        Salin Link
      </button>
    </div>
  </div>

  {/* KOTAK KANAN: DAFTAR REFERRAL */}
  <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
    <p className="text-[10px] font-bold text-white/70 uppercase">Daftar Referral</p>
    <div className="flex flex-col items-center justify-center flex-1">
       {/* Contoh tampilan jumlah referral */}
       <p className="text-xl font-black text-[#4da6ff]">0</p>
       <p className="text-[9px] text-white/50 uppercase">Total Downline</p>
    </div>
    <button className="bg-white/10 text-white text-[10px] font-bold px-4 py-2 rounded-md border border-white/10">
      Lihat Detail
    </button>
  </div>

</div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {menuProfile.map((item, index) => (
    <div
      key={index}
      onClick={() => {
        console.log("Mencoba pindah ke:", item.path); // Cek di F12
        
        // JANGAN pakai setLoading(true) dulu untuk ngetes
        // Kalau tanpa loading ini bisa pindah, berarti masalahnya di state loading Bos
        router.push(item.path); 
      }}
      className="bg-[#000080] border border-white/10 py-5 px-2 rounded-md shadow-md cursor-pointer hover:bg-[#a00000] hover:border-white/40 transition-all active:scale-95 flex items-center justify-center relative overflow-hidden group"
    >
      <span className="text-white font-bold text-[11px] uppercase tracking-tight text-center group-hover:text-yellow-400 transition-colors">
        {item.name}
      </span>
      
      {item.name === "Memo" && (
        <div className="absolute right-1 bottom-1 bg-white text-[#8b0000] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
          63
        </div>
      )}
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
    </main>
  );
}