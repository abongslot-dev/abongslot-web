"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // Pastikan sudah install: npm install sweetalert2
import { Users, Landmark, Home, ChevronRight,Plus,QrCode } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DepositPage() {
  const router = useRouter();
  
  // --- 1. STATE ---
  const [username, setUsername] = useState("");
  const [nominal, setNominal] = useState("");
  const [bankTujuan, setBankTujuan] = useState("BCA");
  const [promo, setPromo] = useState("Tanpa Promo");
  const [loading, setLoading] = useState(false);
  const [showLainnya, setShowLainnya] = useState(false);
  const headerRef = useRef(null);
  const [metode, setMetode] = useState("TRANSFER");
  const [isModalPromoOpen, setIsModalPromoOpen] = useState(false);
  const [listRekeningAdmin, setListRekeningAdmin] = useState([]); // Untuk menampung semua rekening dari database
  const [bankAktif, setBankAktif] = useState({ nama: "-", nomor: "-" });
  

  

  // --- 2. LOGIC PROTEKSI ---
  useEffect(() => {
    const savedName = localStorage.getItem("username");
    if (!savedName) {
      router.push("/");
    } else {
      setUsername(savedName);
    }
  }, [router]);



  const menuLainnya = [
    { name: "RTP 99%", icon: "🎰", link: "#" },
    { name: "PREDIKSI TOGEL", icon: "🔮", link: "#" },
    { name: "BUKTI PEMBAYARAN", icon: "💰", link: "#" },
    { name: "LINK ALTERNATIF 1", icon: "🔗", link: "#" },
    { name: "LINK ALTERNATIF 2", icon: "🔗", link: "#" },
    { name: "JALAWIN", icon: "🏆", link: "#" },
    { name: "LOMBA TOGEL", icon: "📝", link: "#" },
    
  ];





const handleKirimDeposit = async () => {
  // 1. Validasi Nominal & Bank
  const nominalAngka = Number(nominal.replace(/[^0-9]/g, ""));
  const detailBankAdmin = daftarBankAdmin[bankTujuan];

  if (!bankTujuan || !detailBankAdmin) {
    return Swal.fire({
      icon: 'warning',
      title: 'PILIH TUJUAN',
      text: 'Silakan pilih bank tujuan transfer!',
      background: '#1a0033',
      color: '#fff'
    });
  }

  if (nominalAngka < 10000) {
    return Swal.fire({ icon: 'warning', title: 'NOMINAL KURANG', text: 'Minimal Rp 10.000', background: '#1a0033', color: '#fff' });
  }

  // --- PROSES LOADING DIMULAI ---
  setLoading(true);
  
  Swal.fire({
    title: 'MENGECEK MUTASI...',
    text: 'Mohon tunggu 5-7 detik sementara sistem memverifikasi.',
    allowOutsideClick: false,
    showConfirmButton: false,
    background: '#1a0033',
    color: '#fff',
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    // --- KUNCINYA DI SINI: KITA TAHAN SELAMA 5 DETIK (5000ms) ---
    await new Promise(resolve => setTimeout(resolve, 5000)); 

const response = await fetch("/api/deposit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: username,
    nominal: nominalAngka,
    promo: promo || "-",
    bank_pengirim: userProfile.nama_bank || "-",
    rek_pengirim: userProfile.nomor_rekening || "-",
    nama_pengirim: userProfile.nama_rekening || "-",
    bank_tujuan: bankTujuan,
    // GANTI DUA BARIS INI:
    rek_tujuan: bankAktif.nomor, // Mengambil dari state bankAktif.nomor
    nama_tujuan: bankAktif.nama,  // Mengambil dari state bankAktif.nama
  }),
});

    if (response.ok) {
      Swal.fire({ 
        icon: 'success', 
        title: 'BERHASIL', 
        text: 'Deposit Sedang Diproses Admin!',
        background: '#1a0033',
        color: '#fff' 
      });
      setNominal("");
    } else {
      throw new Error("Gagal");
    }
  } catch (error) {
    Swal.fire({ 
      icon: 'error', 
      title: 'GAGAL', 
      text: 'Terjadi gangguan, silakan coba lagi!',
      background: '#1a0033',
      color: '#fff' 
    });
  } finally {
    setLoading(false); 
  }
};





const [userProfile, setUserProfile] = useState({
    nama_bank: "",
    nama_rekening: "",
    nomor_rekening: ""
  });



// --- LOGIC AMBIL DATA DARI PROFILE (SAMA PERSIS DENGAN PROFILE PAGE) ---
  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    const savedName = localStorage.getItem("username");

    if (status === "true" && savedName) {
      // Kita panggil API saldo karena di sana ada data User lengkap
      const fetchDataLengkap = async () => {
        try {
          const res = await fetch(`/api/user/saldo?username=${savedName}`);
          const data = await res.json();
          
          if (data.success) {
            // Masukkan data dari database ke state profile
            setUserProfile({
              nama_bank: data.user.nama_bank,
              nama_rekening: data.user.nama_rekening,
              nomor_rekening: data.user.nomor_rekening
            });
            // Simpan username juga jika perlu
            setUsername(savedName);
          }
        } catch (err) {
          console.log("Gagal sinkron data ke halaman deposit");
        }
      };
      fetchDataLengkap();
    } else {
      // Kalau belum login, lempar ke depan
      window.location.href = "/";
    }
  }, []);


const daftarPromo = [
  { id: 1, nama: "BONUS HARIAN TOGEL 5%", detail: "Bonus 5%, Maksimal Rp. 5.000", tag: "Harian" },
  { id: 2, nama: "BONUS NEW MEMBER 20%", detail: "Bonus 20%, Maksimal Rp. 20.000", tag: "Member Baru" },
  { id: 3, nama: "BONUS DEPOSIT SLOT 100%", detail: "Bonus 100%, Maksimal Rp. 25.000", tag: "Satu Kali" },
];

// Fungsi untuk merubah angka jadi format Rp. 50.000
const formatRupiah = (value) => {
  if (!value) return "";
  // Hanya ambil angka saja
  const numberString = value.replace(/[^,\d]/g, "").toString();
  const split = numberString.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return split[1] !== undefined ? "Rp. " + rupiah + "," + split[1] : "Rp. " + rupiah;
};



// Gudang data rekening Admin
// --- 3. AMBIL DATA REKENING DARI SUPABASE ---
useEffect(() => {
  const fetchRekening = async () => {
    try {
      // Kita ambil data dan join dengan tabel 'banks' untuk dapat nama banknya
      const { data, error } = await supabase
        .from('rekening_banks')
        .select(`
          *,
          banks ( nama )
        `)
        .eq('sembunyikan', 'Tidak') // Hanya ambil yang tidak disembunyikan
        .order('urutan', { ascending: true });

      if (error) throw error;
      setListRekeningAdmin(data || []);
      
      // Set default bank aktif ke yang pertama jika ada data
      if (data && data.length > 0) {
        setBankTujuan(data[0].banks.nama);
        setBankAktif({
          nama: data[0].nama_rekening,
          nomor: data[0].nomor_rekening
        });
      }
    } catch (err) {
      console.error("Gagal ambil rekening admin:", err.message);
    }
  };
  fetchRekening();
}, []);

// --- 4. LOGIKA UPDATE BANK AKTIF SAAT MEMBER PILIH BANK ---
useEffect(() => {
  if (bankTujuan && listRekeningAdmin.length > 0) {
    const cari = listRekeningAdmin.find(item => item.banks.nama === bankTujuan);
    if (cari) {
      setBankAktif({
        nama: cari.nama_rekening,
        nomor: cari.nomor_rekening
      });
    }
  }
}, [bankTujuan, listRekeningAdmin]);

// Ambil data bank yang sedang dipilih



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
    
    {/* --- LOGO TETAP DI TENGAH (MOBILE & DESKTOP) --- */}
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
    onClick={() => {
      // Mengarahkan user kembali ke dashboard tanpa menghapus login
      router.push("/dashboard"); 
    }}
    className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-black px-4 py-1.5 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg active:scale-95"
  >
    KEMBALI
  </button>
</div>
  </div>
</header>






{/* --- KONTEN UTAMA --- */}
<div className="w-full max-w-5xl bg-[#1a0033] flex flex-col items-center gap-3 p-4 shadow-2xl min-h-screen border-x border-white/5 pb-40">
  
  {/* BOX DEPOSIT PUTIH */}
  <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden mt-6 text-black border-t-4 border-red-600">
    <div className="bg-white border-b p-2 text-center font-black text-gray-800 text-sm tracking-widest">
      DEPOSIT
    </div>

    {/* Tab Menu QRIS & TRANSFER */}
    <div className="flex p-2 gap-2 bg-gray-50">
      <button 
        onClick={() => setMetode("QRIS")}
        className={`flex-1 py-2 flex flex-col items-center justify-center border rounded-md transition-all ${metode === 'QRIS' ? 'bg-[#dce67b] border-yellow-500 shadow-sm' : 'bg-gray-100 border-gray-200'}`}
      >
        <span className="text-xl">📲</span>
        <span className="text-[9px] font-black text-gray-500 uppercase">QRIS</span>
      </button>
      <button 
        onClick={() => setMetode("TRANSFER")}
        className={`flex-1 py-2 flex flex-col items-center justify-center border rounded-md transition-all ${metode === 'TRANSFER' ? 'bg-[#dce67b] border-yellow-500 shadow-sm' : 'bg-gray-100 border-gray-200'}`}
      >
        <span className="text-xl">🏦</span>
        <span className="text-[9px] font-black text-black uppercase">TRANSFER</span>
      </button>
    </div>

    <div className="p-4 space-y-3">
      {/* Warning Box Merah */}
      <div className="bg-[#cc3300] text-white p-3 rounded-md text-[10px] flex gap-2 items-start leading-tight">
        <div className="bg-transparent border border-white rounded-full min-w-[14px] h-[14px] flex items-center justify-center text-[10px] font-bold">i</div>
        <p>Minimal deposit adalah Rp. 10,000.00 dan periksa rekening aktif sebelum transfer.</p>
      </div>

      {/* --- KONDISI TAMPILAN QRIS --- */}
      {/* --- KONDISI TAMPILAN QRIS (100% PERSISI GAMBAR) --- */}
{metode === "QRIS" ? (
  <div className="space-y-5 animate-in fade-in duration-300">
    
    {/* Logo QRIS Besar */}
    <div className="flex justify-center py-4">
      <img 
        src="https://i.postimg.cc/5tJsDHTn/8815e2cf5c04cd1e82a9a68df1b28566.jpg" 
        alt="QRIS" 
        className="h-16 object-contain" 
      />
    </div>
    
    {/* Input Box Nominal */}
{/* Input Box Nominal */}
<div className="space-y-1.5 px-1">
  <label className="text-[12px] font-bold text-gray-500">Jumlah Deposit</label>
  <div className="relative flex items-center">
    <span className="absolute left-4 font-black text-gray-800">Rp.</span>
    
    <input 
      type="text" 
      placeholder="0"
      // Format nominal dengan titik saat tampil
      value={nominal ? Number(nominal).toLocaleString('id-ID') : ""} 
      onChange={(e) => {
        // Hapus semua karakter selain angka agar bisa dihitung
        const value = e.target.value.replace(/\D/g, "");
        setNominal(value);
      }}
      className="w-full bg-white border-2 border-gray-800 rounded-lg p-3.5 pl-12 text-[16px] font-black text-gray-800 focus:outline-none shadow-sm"
    />
  </div>
  <p className="text-[10px] text-gray-400 mt-1 italic font-medium">
    Contoh: 50.000 (Otomatis memformat angka)
  </p>
</div>

    {/* Grid Tombol Pilihan (Warna Merah Marun) */}
    <div className="grid grid-cols-3 gap-3 px-1">
      {[10000, 50000, 100000, 200000, 500000, 1000000].map((val) => (
        <button 
          key={val}
          onClick={() => setNominal(val)}
          className="bg-[#7b111a] hover:bg-[#9a1622] text-white text-[12px] font-bold py-3.5 rounded-lg shadow-md active:scale-95 transition-all uppercase"
        >
          Rp. {val >= 1000000 ? "1 jt" : (val/1000) + " rb"}
        </button>
      ))}
    </div>

    {/* Pilih Promo Box */}
    <div className="space-y-1.5 px-1 pt-2">
      <label className="text-[12px] font-bold text-gray-500">Pilih Promo</label>
      <div 
        onClick={() => setIsModalPromoOpen(true)}
        className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-md p-3 cursor-pointer"
      >
        <span className="text-[13px] text-gray-800 font-medium">
          {promo || "Pilih Promo"}
        </span>
        <ChevronRight size={18} className="text-gray-400" />
      </div>
    </div>

    {/* Tombol Submit Kuning */}
    <div className="px-1 pt-2">
  <button className="w-full py-3 bg-[#dce67b] text-[#7d7d7d] rounded-md font-bold text-[18px] shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
    {/* Icon QR Code sesuai gambar */}
    <QrCode size={26} strokeWidth={2.5} /> 
    <span className="tracking-tight">Deposit</span>
  </button>
</div>

    {/* Riwayat Deposit QRIS */}
    <div className="pt-6">
       <p className="text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-tight">Riwayat Deposit QRIS</p>
       <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center shadow-sm">
          <div className="text-gray-300 mb-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
            </svg>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">Belum ada transaksi</p>
       </div>
    </div>
  </div>
      ) : (



        
/* --- TAMPILAN TRANSFER IDENTIK GAMBAR --- */
<div className="space-y-4 animate-in fade-in duration-300 px-1">
  
  {/* 1. SECTION DATA PENGIRIM (AMBIL DARI PROFILE) */}
{/* 1. SECTION DATA PENGIRIM (AMBIL DARI PROFILE) */}
<div className="space-y-2">
  {/* Row Nama Rekening */}
  <div className="flex items-center gap-4">
    <span className="w-28 text-[11px] font-bold text-gray-700">Nama Rekening</span>
    <div className="flex-1 flex items-center bg-[#f0f2f5] rounded border border-gray-200 overflow-hidden h-9">
      <div className="bg-[#e9ecef] px-2.5 h-full flex items-center text-gray-400 border-r border-gray-300">
        <Users size={14} />
      </div>
      <div className="px-3 text-[11px] text-gray-500 italic font-bold uppercase">
        {userProfile.nama_rekening || "LOADING..."} 
      </div>
    </div>
  </div>

  {/* Row Nomor Rekening */}
  <div className="flex items-center gap-4">
    <span className="w-28 text-[11px] font-bold text-gray-700">Nomor Rekening</span>
    <div className="flex-1 flex items-center bg-[#f0f2f5] rounded border border-gray-200 overflow-hidden h-9">
      <div className="bg-[#e9ecef] px-2.5 h-full flex items-center text-gray-400 border-r border-gray-300">
        <Landmark size={14} />
      </div>
      <div className="px-3 text-[11px] text-gray-500 font-mono tracking-widest">
        {/* Ini otomatis ambil dari data profile dan disensor tengahnya */}
        * * * * * * * * {userProfile.nomor_rekening ? userProfile.nomor_rekening.slice(-4) : "0000"}
      </div>
    </div>
  </div>

  {/* Row Nama Bank Pengirim */}
  <div className="flex items-center gap-4">
    <span className="w-28 text-[11px] font-bold text-gray-700">Nama Bank</span>
    <div className="flex-1 flex items-center bg-[#f0f2f5] rounded border border-gray-200 overflow-hidden h-9">
      <div className="bg-[#e9ecef] px-2.5 h-full flex items-center text-gray-400 border-r border-gray-300">
        <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center text-[8px]">🛡️</div>
      </div>
      <div className="px-3 text-[11px] text-gray-500 font-bold uppercase">
        {userProfile.nama_bank || "BANK"}
      </div>
    </div>
  </div>
</div>


  <hr className="border-gray-100" />

  {/* 2. SECTION INPUT & PROMO */}
  <div className="space-y-2">
    {/* Pilih Bank */}
    <div className="flex items-center gap-4">
      <span className="w-28 text-[11px] font-bold text-gray-700">Pilih Bank</span>
      <div className="flex-1">
        <select 
  value={bankTujuan}
  onChange={(e) => setBankTujuan(e.target.value)}
  className="w-full h-9 px-3 border-2 border-black rounded text-[11px] font-bold outline-none bg-white focus:border-blue-500"
>
  <option value="BCA">BCA</option>
  <option value="BNI">BNI</option>
  <option value="BRI">BRI</option>
  <option value="MANDIRI">MANDIRI</option>
  <option value="DANA">DANA</option>
  <option value="OVO">OVO</option>
</select>
      </div>
    </div>

    {/* Nominal */}
    <div className="flex items-center gap-4">
  <span className="w-28 text-[11px] font-bold text-gray-700">Nominal</span>
  <div className="flex-1 relative">
    <input 
      type="text" 
      placeholder="Rp. 0" 
      value={nominal}
      onChange={(e) => setNominal(formatRupiah(e.target.value))}
      className="w-full h-9 border-2 border-black rounded px-3 text-[11px] font-bold outline-none text-gray-800"
    />
  </div>
</div>
    {/* Pilih Promo */}
    <div className="flex items-center gap-4">
  <span className="w-28 text-[11px] font-bold text-gray-700">Pilih Promo</span>
  <div 
    className="flex-1 flex justify-between items-center h-9 px-3 border border-gray-300 rounded text-[11px] text-gray-700 bg-white cursor-pointer active:bg-gray-50"
    onClick={() => setIsModalPromoOpen(true)} // KLIK UNTUK BUKA
  >
    <span className="font-bold">{promo || "Pilih Promo"}</span>
    <ChevronRight size={14} />
  </div>
</div>
  </div>

{/* 3. SECTION DETAIL TUJUAN (DIBUAT LURUS PRESISI) */}
<div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mt-4">
  <h3 className="text-center text-[13px] font-bold text-gray-800 mb-1">Deposit Bank</h3>
  <p className="text-[10px] text-gray-400 text-center leading-tight mb-4 px-2">
    Batas maksimal deposit senilai Rp. 100,000,000.00, perhatikan nominal transaksi dan nomor rekening tujuan deposit
  </p>
  
  <div className="space-y-1.5 text-[11px]">
    {/* Grid dengan kolom pertama dikunci lebarnya agar titik dua lurus */}
    <div className="grid grid-cols-[150px_15px_1fr] items-center">
      <span className="text-gray-600 font-medium">Nama Rekening</span>
      <span className="text-gray-800">:</span>
      <span className="font-bold text-gray-800">{bankAktif.nama}</span>
    </div>

    <div className="grid grid-cols-[150px_15px_1fr] items-center">
      <span className="text-gray-600 font-medium">Nomor Rekening</span>
      <span className="text-gray-800">:</span>
      <span className="font-bold text-gray-800 font-mono">{bankAktif.nomor}</span>
    </div>

    <div className="grid grid-cols-[150px_15px_1fr] items-center">
      <span className="text-gray-600 font-medium">Bank</span>
      <span className="text-gray-800">:</span>
      <span className="font-bold text-gray-800">{bankTujuan}</span>
    </div>

    <div className="grid grid-cols-[150px_15px_1fr] items-center">
      <span className="text-gray-600 font-medium">Nominal</span>
      <span className="text-gray-800">:</span>
      <span className="font-bold text-gray-800">{nominal || "Rp. 0"}</span>
    </div>
  </div>
</div>

  {/* 4. SECTION ACTION BUTTONS */}
  <div className="space-y-2 pt-2">
   <button 
  className="w-full bg-black text-white py-2.5 rounded font-bold text-[11px] uppercase tracking-tighter active:bg-gray-800 transition-colors"
  onClick={() => {
    if (bankAktif.nomor && bankAktif.nomor !== "-") {
      navigator.clipboard.writeText(bankAktif.nomor);
      
      // NOTIFIKASI KECIL (TOAST)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Disalin!',
        text: `${bankTujuan}: ${bankAktif.nomor}`,
        toast: true,                // Membuatnya jadi notif kecil (toast)
        position: 'top-end',        // Muncul di pojok kanan atas
        showConfirmButton: false,   // Hilangkan tombol OK
        timer: 2000,                // Hilang otomatis dalam 2 detik
        timerProgressBar: true,     // Ada bar loading jalannya
        background: '#1a0033',      // Warna gelap biar matching sama tema Bos
        color: '#fff'
      });
      
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Nomor rekening tidak ditemukan.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#1a0033',
        color: '#fff'
      });
    }
  }}
>
  Copy Nomor Rekening
</button>
    
    <button className="w-full border border-gray-300 py-2.5 rounded font-bold text-[11px] text-gray-700 uppercase">
      Upload Bukti Transfer
    </button>

 <button
  onClick={handleKirimDeposit}
  disabled={loading}
  className={`w-full py-4 rounded-md font-black transition-all duration-200 flex items-center justify-center gap-3 ${
    loading 
      ? "bg-zinc-700 text-gray-400 cursor-not-allowed" 
      : "bg-yellow-500 hover:bg-yellow-600 text-black shadow-[0_4px_0_0_#b8860b] active:translate-y-1 active:shadow-none"
  }`}
>
  {loading ? (
    <>
      {/* Animasi Muter SVG */}
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>VALIDASI DATA...</span>
    </>
  ) : (
    "KIRIM DEPOSIT"
  )}
</button>
  </div>
</div>
      )}
    </div>
  </div> {/* Tutup Box Putih */}

  {/* Tombol Bantuan di bawah Box */}
  <div className="w-full max-w-md mt-4">
      <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Butuh Bantuan?</p>
          <p className="text-xs text-white font-bold">Hubungi Customer Service 24/7</p>
      </div>
  </div>


















</div> {/* Tutup Konten Utama */}
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






{/* MODAL POPUP PROMO */}
{/* MODAL POPUP PROMO */}
{isModalPromoOpen && (
  /* Hilangkan backdrop-blur-sm, ganti p-50 jadi p-4 agar pas di tengah */
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    
    {/* Box Modal: rounded-2xl untuk melengkung di semua sisi sesuai gambar */}
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      
      {/* Header Promo */}
      <div className="p-5 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Promo</h2>
      </div>

      {/* List Promo */}
      <div className="p-0 max-h-[60vh] overflow-y-auto">
        {daftarPromo.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-5 border-b last:border-0">
            <div className="space-y-1">
              <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-tight">{item.nama}</h3>
              <p className="text-[11px] text-gray-500 font-medium">{item.detail}</p>
              <span className="inline-block bg-gray-200 text-gray-500 text-[10px] px-2 py-0.5 rounded font-bold mt-1">
                {item.tag}
              </span>
            </div>
            
            {/* Tombol (+) Tanpa Hover */}
            <button 
              className="bg-[#dce67b] p-1.5 rounded text-gray-800 flex-shrink-0"
              onClick={() => {
                setPromo(item.nama);
                setIsModalPromoOpen(false);
              }}
            >
              <Plus size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Tombol Tutup di Bawah */}
      <div className="p-4 bg-white">
        <button 
          className="w-full bg-[#dce67b] py-3.5 rounded-xl font-black text-gray-800 uppercase text-[13px] tracking-wider"
          onClick={() => setIsModalPromoOpen(false)}
        >
          Tutup
        </button>
      </div>
    </div>

    {/* Area Klik Luar untuk Menutup (Opsional) */}
    <div 
      className="absolute inset-0 -z-10" 
      onClick={() => setIsModalPromoOpen(false)}
    ></div>
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