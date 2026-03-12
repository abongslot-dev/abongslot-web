"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

function RiwayatKeluaranContent() {
  const router = useRouter();
  const [semuaData, setSemuaData] = useState([]); // Master data dari DB
  const [dataTampil, setDataTampil] = useState([]); // Data yang muncul di tabel
  const [loading, setLoading] = useState(true);
  const [pasaranInput, setPasaranInput] = useState(""); // Untuk ngetik manual
  const [selectedDetail, setSelectedDetail] = useState(null); // Untuk simpan data yang diklik
  const [showModal, setShowModal] = useState(false); // Untuk buka/tutup popup
  

  // --- 1. AMBIL DATA DARI DATABASE (JALAN SEKALI SAAT LOAD) ---
  const loadDataDariDB = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/riwayat-keluaran");
      const json = await res.json();
      if (json.success) {
        setSemuaData(json.data);
        setDataTampil(json.data); // Munculkan semua di awal
      }
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataDariDB();
  }, []); // Kosong agar hanya jalan sekali pas buka halaman

  // --- 2. FUNGSI FILTER (JALAN SAAT KLIK TOMBOL CARI) ---
  const handleCari = () => {
    if (!pasaranInput || pasaranInput === "" || pasaranInput === "SEMUA PASARAN") {
      setDataTampil(semuaData); // Balikin tampil semua kalau input kosong
      return;
    }

    // Filter dari data yang sudah ada di memori
    const hasilFilter = semuaData.filter(item => 
      item.pasaran.toUpperCase().includes(pasaranInput.toUpperCase())
    );
    setDataTampil(hasilFilter);
  };


const bukaDetail = (item) => {
  const res = item.result.toString().padStart(4, "0");
  const as = parseInt(res[0]);
  const kop = parseInt(res[1]);
  const kep = parseInt(res[2]);
  const ekor = parseInt(res[3]);

  const detail = {
    ...item,
    as, kop, kep, ekor,
    asGanjil: as % 2 !== 0 ? "GANJIL" : "GENAP",
    asBesar: as >= 5 ? "BESAR" : "KECIL",
    kopGanjil: kop % 2 !== 0 ? "GANJIL" : "GENAP",
    kopBesar: kop >= 5 ? "BESAR" : "KECIL",
    kepGanjil: kep % 2 !== 0 ? "GANJIL" : "GENAP",
    kepBesar: kep >= 5 ? "BESAR" : "KECIL",
    ekorGanjil: ekor % 2 !== 0 ? "GANJIL" : "GENAP",
    ekorBesar: ekor >= 5 ? "BESAR" : "KECIL",
  };
  setSelectedDetail(detail);
  setShowModal(true);
};


const daftarShio2026 = [
  "KUDA", "ULAR", "NAGA", "KELINCI", "HARIMAU", "KERBAU", 
  "TIKUS", "BABI", "ANJING", "AYAM", "MONYET", "KAMBING"
];

const getShio = (nomor2D) => {
  const n = parseInt(nomor2D);
  if (isNaN(n)) return "-";
  // Rumus Shio: Angka 2D dikurangi 1, lalu dimodulo 12
  const index = (n - 1) % 12;
  return `${n.toString().padStart(2, '0')} : ${daftarShio2026[index]}`;
};

  return (
    <main 
      className="min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >
      {/* Header Logo */}
      <header className="w-full max-w-5xl bg-[#1a0033] shadow-2xl sticky top-0 z-[100] border-b border-[#D4AF37]/20">
        <div className="px-5 py-3 flex items-center justify-center min-h-[60px] md:min-h-[120px]"> 
          <img 
            src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" 
            alt="Logo" 
            className="h-12 md:h-20 w-auto cursor-pointer"
            onClick={() => router.push('/dashboard')}
          />
          <div className="absolute right-5">
            <button onClick={() => router.push("/profile")} className="bg-zinc-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-zinc-600">
              ⬅ KEMBALI
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-5xl min-h-[calc(100vh-100px)] bg-white overflow-hidden shadow-2xl border-x border-gray-300 flex flex-col pb-24">
        <div className="bg-[#1a0033] px-4 py-2 border-b border-white/20 flex justify-between items-center">
          <h2 className="text-white text-[15px]  font-bold uppercase tracking-wider">Riwayat Keluaran Togel</h2>
          <span className="text-[15px] bg-green-600 px-2 py-0.5 rounded animate-pulse">LIVE</span>
        </div>

        {/* Filter Section - Input Manual */}
        <div className="p-3 bg-[#1a0033]">
          <div className="border border-white/50 p-3 rounded-sm flex gap-2">
            <input 
              list="opsi-pasaran"
              value={pasaranInput}
              onChange={(e) => setPasaranInput(e.target.value.toUpperCase())}
              placeholder="KETIK NAMA PASARAN..."
              className="flex-1 text-xs p-2 rounded-sm text-black outline-none font-bold bg-white"
            />
            <datalist id="opsi-pasaran">
              <option value="SEMUA PASARAN" />
              <option value="SINGAPORE" />
              <option value="HONGKONG" />
              <option value="SYDNEY" />
            </datalist>

            <button 
              onClick={handleCari} 
              className="bg-gradient-to-b from-[#d4a017] to-[#8b6508] px-6 py-2 rounded-sm text-[10px] font-bold uppercase active:scale-95 text-white"
            >
              🔍 CARI
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-[15px] text-center border-collapse">
            <thead>
              <tr className="bg-gray-100 text-zinc-500 uppercase border-b border-gray-300">
                <th className="py-3 px-1 border-r border-gray-300 font-bold">PASARAN</th>
                <th className="py-3 px-1 border-r border-gray-300 font-bold">PERIODE</th>
                <th className="py-3 px-1 border-r border-gray-300 font-bold text-red-700">RESULT</th>
                <th className="py-3 px-1 font-bold text-black">TANGGAL</th>
              </tr>
            </thead>
 <tbody className="text-black">
  {loading ? (
    <tr><td colSpan="4" className="py-10 text-zinc-400 italic text-center">Memuat data riwayat...</td></tr>
  ) : dataTampil.length === 0 ? (
    <tr><td colSpan="4" className="py-10 text-zinc-400 italic text-sm text-center">Data tidak ditemukan</td></tr>
  ) : (
    // 1. Ambil dataTampil, 2. Copy dulu [...], 3. Urutkan .sort(), 4. Baru .map()
    [...dataTampil]
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.tanggal || 0);
        const dateB = new Date(b.created_at || b.tanggal || 0);
        return dateB - dateA; // Terbaru di paling ATAS
      })
      .map((item, i) => (
        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
          <td className="py-3 border-r border-gray-200 font-black text-zinc-700 uppercase">
            {item.pasaran}
          </td>
          <td className="py-3 border-r border-gray-200 font-bold text-zinc-500">
            #{item.periode}
          </td>
          <td className="p-3 border-r text-center">
            <button onClick={() => bukaDetail(item)} className="hover:scale-105 transition active:scale-95">
              <span className="bg-white text-black px-3 py-1 rounded-md font-black text-sm tracking-[3px] cursor-pointer shadow-md border border-gray-100">
                {item.result}
              </span>
            </button>
          </td>
          <td className="py-3 font-bold text-zinc-600 uppercase">
            {item.created_at ? (
              new Date(item.created_at).toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })
            ) : (
              item.tanggal || "-"
            )}
          </td>
        </tr>
      ))
  )}
</tbody>
          </table>
        </div>
      </div>




{showModal && selectedDetail && (
  <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-[999] p-4 overflow-y-auto">
    <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden my-auto border-t-8 border-[#1a0033]">
      
      {/* Header Modal - Merah Solid */}
      <div className="bg-[#1a0033] p-3 flex justify-between items-center text-white">
        <h3 className="font-bold uppercase text-[15px] tracking-wider">
          DETAIL RIWAYAT ANGKA {selectedDetail.pasaran} #{selectedDetail.periode}
        </h3>
        <button onClick={() => setShowModal(false)} className="text-2xl font-bold leading-none hover:text-gray-200">&times;</button>
      </div>

      {/* Konten Modal - Tabel Detail */}
      <div className="p-1">
        <table className="w-full text-[15px] border-collapse uppercase font-semibold text-gray-700">
          <thead>
            <tr className="bg-[#f2f2f2] text-gray-500">
              <th className="border p-2 text-left w-[140px]">GAMES</th>
              <th className="border p-2">AS</th>
              <th className="border p-2">KOP</th>
              <th className="border p-2">KEPALA</th>
              <th className="border p-2">EKOR</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {/* Baris 2D s/d 4D */}
            <tr className="bg-white"><td className="border p-3 text-left bg-[#f9f9f9]">2D BELAKANG</td><td className="border p-2 text-gray-300 font-normal">X</td><td className="border p-2 text-gray-300 font-normal">X</td><td className="border p-2">{selectedDetail.kep}</td><td className="border p-2">{selectedDetail.ekor}</td></tr>
            <tr className="bg-white"><td className="border p-3 text-left bg-[#f9f9f9]">2D DEPAN</td><td className="border p-2">{selectedDetail.as}</td><td className="border p-2">{selectedDetail.kop}</td><td className="border p-2 text-gray-300 font-normal">X</td><td className="border p-2 text-gray-300 font-normal">X</td></tr>
            <tr className="bg-white"><td className="border p-3 text-left bg-[#f9f9f9]">2D TENGAH</td><td className="border p-2 text-gray-300 font-normal">X</td><td className="border p-2">{selectedDetail.kop}</td><td className="border p-2">{selectedDetail.kep}</td><td className="border p-2 text-gray-300 font-normal">X</td></tr>
            <tr className="bg-white"><td className="border p-3 text-left bg-[#f9f9f9]">3D BELAKANG</td><td className="border p-2 text-gray-300 font-normal">X</td><td className="border p-2">{selectedDetail.kop}</td><td className="border p-2">{selectedDetail.kep}</td><td className="border p-2">{selectedDetail.ekor}</td></tr>
            <tr className="bg-white"><td className="border p-3 text-left bg-[#f9f9f9]">3D DEPAN</td><td className="border p-2">{selectedDetail.as}</td><td className="border p-2">{selectedDetail.kop}</td><td className="border p-2">{selectedDetail.kep}</td><td className="border p-2 text-gray-300 font-normal">X</td></tr>
            <tr className="bg-white"><td className="border p-3 text-left bg-[#f9f9f9]">4D</td><td className="border p-2">{selectedDetail.as}</td><td className="border p-2">{selectedDetail.kop}</td><td className="border p-2">{selectedDetail.kep}</td><td className="border p-2">{selectedDetail.ekor}</td></tr>
            
            {/* Baris 50-50 */}
            <tr className="bg-white">
              <td className="border p-2 text-left bg-[#f9f9f9]" rowSpan="2">50-50</td>
              <td className="border p-2">{selectedDetail.asGanjil}</td><td className="border p-2">{selectedDetail.kopGanjil}</td><td className="border p-2">{selectedDetail.kepGanjil}</td><td className="border p-2">{selectedDetail.ekorGanjil}</td>
            </tr>
            <tr className="bg-white">
              <td className="border p-2">{selectedDetail.asBesar}</td><td className="border p-2">{selectedDetail.kopBesar}</td><td className="border p-2">{selectedDetail.kepBesar}</td><td className="border p-2">{selectedDetail.ekorBesar}</td>
            </tr>

            {/* Baris Colok & Lainnya */}
            <tr className="bg-white"><td className="border p-2 text-left bg-[#f9f9f9]">COLOK BEBAS</td><td className="border p-2">{selectedDetail.as}</td><td className="border p-2">{selectedDetail.kop}</td><td className="border p-2">{selectedDetail.kep}</td><td className="border p-2">{selectedDetail.ekor}</td></tr>
            <tr className="bg-white"><td className="border p-2 text-left bg-[#f9f9f9]">COLOK JITU</td><td className="border p-2">{selectedDetail.as}</td><td className="border p-2">{selectedDetail.kop}</td><td className="border p-2">{selectedDetail.kep}</td><td className="border p-2">{selectedDetail.ekor}</td></tr>
            <tr className="bg-white">
  <td className="border p-2 text-left bg-[#f9f9f9]">DASAR</td>
  <td className="border p-2 text-center font-bold" colSpan="4">
    {(() => {
      const jumlah = selectedDetail.kep + selectedDetail.ekor;
      const ganjilGenap = jumlah % 2 === 0 ? "GENAP" : "GANJIL";
      const besarKecil = (jumlah % 10) >= 5 ? "BESAR" : "KECIL";
      return `${ganjilGenap} , ${besarKecil}`;
    })()}
  </td>
</tr>
            <tr className="bg-white">
  <td className="border p-2 text-left bg-[#f9f9f9]">SHIO</td>
  <td className="border p-2 text-center font-black text-red-600" colSpan="4">
    {getShio(selectedDetail.result.toString().slice(-2))}
  </td>
</tr>
          </tbody>
        </table>
      </div>

      {/* Footer Modal */}
      <div className="p-3 bg-gray-50 flex justify-end border-t">
        <button 
          onClick={() => setShowModal(false)}
          className="bg-[#1a0033] text-white px-6 py-2 rounded text-[15px] font-bold hover:bg-red-700 transition"
        >
          CLOSE
        </button>
      </div>
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

export default function RiwayatKeluaranPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a0033] flex items-center justify-center text-[#D4AF37]">MENGHUBUNGKAN...</div>}>
      <RiwayatKeluaranContent />
    </Suspense>
  );
}