"use client";
import { useState, useEffect, Suspense, useRef } from "react"; 
import { useRouter, useSearchParams } from "next/navigation";

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


function RiwayatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const headerRef = useRef(null);

  // --- 1. DATA MASTER (Mencegah Error "Not Defined") ---
  const listPasaran = [
    "SINGAPORE POOLS",
    "HONGKONG POOLS",
    "HONGKONG LOTTO",
    "SYDNEY POOLS",
    "SYDNEY LOTTO",
    "MALAYSIA POOLS",
    "TOTO MACAU 4D 13",
    "TOTO MACAU 4D 16",
    "TOTO MACAU 4D 19",
    "TOTO MACAU 4D 22",
    "TOTO MACAU 4D 23",
    "TOTO MACAU 4D 00"
  ];

  const menuLainnya = [
    { name: "Promosi", icon: "🎁", link: "/promosi" },
    { name: "Referral", icon: "👥", link: "/referral" },
    { name: "Berita", icon: "📰", link: "/news" },
    { name: "Bantuan", icon: "❓", link: "/help" }
  ];

  // --- 2. STATE MANAGEMENT ---
const pasaranDariUrl = searchParams.get("pasaran") || "SINGAPORE POOLS";
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [showLainnya, setShowLainnya] = useState(false); 
const [pasaranAktif, setPasaranAktif] = useState(pasaranDariUrl);
const [dataRiwayat, setDataRiwayat] = useState([]);
const [halamanAktif, setHalamanAktif] = useState("riwayat"); // Tambahkan ini
const [dataTampil, setDataTampil] = useState([]);   // TAMBAHKAN INI
const [tglMulai, setTglMulai] = useState("");       // TAMBAHKAN INI (untuk input)
const [tglAkhir, setTglAkhir] = useState("");
const [loginData, setLoginData] = useState({ username: "", password: "" });
 const [errorNotif, setErrorNotif] = useState("");

// Inisialisasi dataTersaring saat dataRiwayat berubah
useEffect(() => {
  setDataTampil(dataRiwayat);
}, [dataRiwayat]);


const handleCariData = () => {
  if (!tglMulai || !tglAkhir) {
    alert("Pilih rentang tanggal dulu, Bos!");
    return;
  }

  // Set jam mulai ke 00:00:00 dan jam akhir ke 23:59:59
  const mulai = new Date(tglMulai);
  mulai.setHours(0, 0, 0, 0);
  
  const akhir = new Date(tglAkhir);
  akhir.setHours(23, 59, 59, 999);

  const hasil = dataRiwayat.filter((item) => {
    if (!item.tanggal) return false;
    const tglItem = new Date(item.tanggal).getTime();
    return tglItem >= mulai.getTime() && tglItem <= akhir.getTime();
  });

  setDataTampil(hasil);
  
  if (hasil.length === 0) {
    alert("Data tidak ditemukan untuk tanggal tersebut.");
  }
}; // HANYA SATU TUTUP KURUNG DI SINI


  // --- 3. LOGIKA LOGIN ---
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
  const loadRiwayatDariDB = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/get-results");
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        // 1. CEK DULU: Ada berapa total data dari database?
        console.log("TOTAL DATA DARI DB:", json.data.length);

        const pNamaAktif = pasaranAktif.toUpperCase().trim();

        // 2. FILTER: Ambil semua yang mengandung nama pasaran aktif
const hasilFilter = json.data.filter(item => {
  // 1. Bersihkan semua spasi, ganti semua simbol jadi kosong, paksa huruf besar
  const pNamaDB = String(item.pasaran).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const pNamaAktif = String(pasaranAktif).toUpperCase().replace(/[^A-Z0-9]/g, "");

  // 2. Cek apakah kata "CHINA" ada di dalamnya
  // Kita ambil 5 huruf pertama saja biar pasti tembus
  const kataKunci = pNamaAktif.substring(0, 5); 

  return pNamaDB.includes(kataKunci);
});
        console.log(`DATA TERFILTER UNTUK ${pNamaAktif}:`, hasilFilter.length);

        // 3. MAPPING: Pastikan nama kolom 'angka' & 'result' aman keduanya
        const dataFinal = hasilFilter.map(item => ({
          ...item,
          // Kita paksa buat properti 'angka' biar tabel Bos bisa baca
          angka: item.result || item.angka, 
          result: item.result || item.angka
        }));

        // 4. URUTKAN: Berdasarkan ID (Terbesar/Terbaru di atas)
        const dataUrut = dataFinal.sort((a, b) => Number(b.id) - Number(a.id));

        setDataRiwayat(dataUrut);
        setDataTampil(dataUrut);
      }
    } catch (err) {
      console.error("Gagal tarik riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  if (pasaranAktif) {
    loadRiwayatDariDB();
  }
}, [pasaranAktif]);


  // TIPS: Fungsi ini bisa dipanggil jika Bos ingin menambah result baru secara manual

  return (
    <main 
      className="relative min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center pb-40"
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >
      {loading && <LoadingOverlay />}
      {/* --- HEADER UTAMA --- */}
      <header ref={headerRef} className="w-full max-w-6xl bg-[#1a0033] shadow-2xl sticky top-0 z-[100] border-b border-[#D4AF37]/20 mx-auto">
        <div className="px-5 py-3 md:py-0 flex items-center md:items-stretch justify-between min-h-[60px] md:min-h-[120px]"> 
          {!isLoggedIn ? (
            <>
              <div className="flex md:hidden w-full justify-center items-center">
                <img src="https://i.postimg.cc/XYgNTswc/download-(3).png" alt="Logo" className="h-12 w-auto drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] object-contain" />
              </div>

              <div className="hidden md:flex flex-1 items-center justify-start">
                <img src="https://i.postimg.cc/XYgNTswc/download-(3).png" alt="Logo" className="h-28 md:h-32 w-auto drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] object-contain" />
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

      {/* --- MAIN CONTENT --- */}
      <div className="w-full max-w-6xl mx-auto h-auto bg-white rounded-b-xl overflow-hidden shadow-2xl border-x border-b border-gray-300 mb-10">
        <div className="bg-[#1a0033] p-3">
          <h1 className="text-white font-black text-xs md:text-sm uppercase italic">
            Riwayat Angka {pasaranAktif}
          </h1>
        </div>

        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-2 md:grid-cols-6 gap-3 items-end text-black">
  <div className="col-span-2 md:col-span-1">
    <label className="text-[13px] font-bold text-gray-600 block mb-1 uppercase">Pasaran</label>
    <select 
      value={pasaranAktif}
      onChange={(e) => setPasaranAktif(e.target.value)}
      className="w-full border p-1.5 rounded text-xs outline-none bg-white font-bold text-red-700"
    >
      {listPasaran.map((p) => <option key={p} value={p}>{p}</option>)}
    </select>
  </div>

  <div className="col-span-1">
    <label className="text-[13px] font-bold text-gray-600 block mb-1 uppercase">Mulai</label>
    <input 
      type="date" 
      value={tglMulai}
      onChange={(e) => setTglMulai(e.target.value)}
      className="w-full border p-1 rounded text-[13px]" 
    />
  </div>

  <div className="col-span-1">
    <label className="text-[13px] font-bold text-gray-600 block mb-1 uppercase">Akhir</label>
    <input 
      type="date" 
      value={tglAkhir}
      onChange={(e) => setTglAkhir(e.target.value)}
      className="w-full border p-1 rounded text-[13px]" 
    />
  </div>

  <button 
    onClick={handleCariData}
    className="bg-yellow-400 hover:bg-yellow-500 text-black font-black py-2 rounded text-[13px] uppercase shadow-md active:scale-95 transition-all"
  >
    Cari Data
  </button>
</div>

<div className="px-4"> {/* Tambahkan pembungkus dengan padding ini */}
<div className="overflow-x-auto">
  <table className="w-full text-center border-collapse">
    <thead>
      <tr className="bg-gray-100 border-b border-gray-300">
        <th className="py-3 px-1 text-[13px] font-black text-gray-500 border-r border-gray-200 uppercase italic">Periode</th>
        <th className="py-3 px-4 text-[13px] font-black text-gray-500 border-r border-gray-200 uppercase italic">Tanggal</th>
        <th className="py-3 px-4 text-[13px] font-black text-gray-500 uppercase italic">Result (Prize 1)</th>
      </tr>
    </thead>
    <tbody className="text-gray-700 text-xs font-bold">
  {dataTampil
    .filter(item => item.result && item.result !== "----") // <--- TAMBAHKAN FILTER INI
    .length > 0 ? (
      dataTampil
        .filter(item => item.result && item.result !== "----")
        .map((item, idx) => (
          <tr key={idx} className="border-b border-gray-100 hover:bg-red-50 transition-colors">
            <td className="py-4 border-r border-gray-200 text-gray-400">*{item.periode}</td>
            <td className="py-4 border-r border-gray-200">{item.tanggal}</td>
            <td className="py-4 text-[18px] font-black text-[#cc1d1d] tracking-[6px]">{item.result}</td>
          </tr>
        ))
  ) : (
    <tr>
      <td colSpan="3" className="py-10 text-gray-400 italic text-center">Data tidak ditemukan.</td>
    </tr>
  )}
</tbody>
  </table>
</div>

        <div className="p-4 bg-gray-50 text-right border-t border-gray-200">
          <button onClick={() => router.push('/')} className="text-[14px] font-black text-red-600 uppercase hover:underline">
            ← Kembali
          </button>
        </div>
      </div>
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
       <span className="text-[9px] font-black uppercase tracking-tighter">Lainnya</span></button>


      </nav>
    </main>
  );
}

export default function RiwayatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>}>
      <RiwayatContent />
    </Suspense>
  );

}

