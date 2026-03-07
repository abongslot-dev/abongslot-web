"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'; // Pastikan di import di paling atas file
import { User, Key, Eye, EyeOff, LayoutDashboard } from 'lucide-react';

export default function DaftarPage() {
  const router = useRouter();
  
  // --- SEMUA STATE DISINI (TIDAK ADA DUPLIKAT) ---
  const [halamanAktif] = useState('daftar');
  const [showLainnya, setShowLainnya] = useState(false);
  const [bankTerpilih, setBankTerpilih] = useState("");
  const headerRef = useRef(null);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [errorNotif, setErrorNotif] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

// Tambahkan ini di bawah state isLoggedIn

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    konfirmasiPassword: "",
    whatsapp: "",
    namaRekening: "",
    nomorRekening: "",
  });

const [statusCek, setStatusCek] = useState({
  username: { msg: "", color: "" },
  whatsapp: { msg: "", color: "" },
  nomorRekening: { msg: "", color: "" }
});

// Tambahkan ini untuk mengatur jeda ngetik
const typingTimeoutRef = useRef(null);

const handleChange = (e) => {
  const { name, value } = e.target;
  let finalValue = value;

  // --- 1. FILTER HANYA ANGKA (Khusus WA & Rekening) ---
  if (name === "whatsapp" || name === "nomorRekening") {
    // Menghapus semua karakter yang BUKAN angka
    finalValue = value.replace(/\D/g, ""); 
  }

  // --- 2. UPDATE STATE FORM ---
  setFormData((prev) => ({ 
    ...prev, 
    [name]: finalValue 
  }));

  // --- 3. LOGIKA LIVE CHECK (Cek Database) ---
  if (["username", "whatsapp", "nomorRekening"].includes(name)) {
    if (finalValue.length >= 3) {
      // Set status Orange (Loading)
      setStatusCek(prev => ({
        ...prev,
        [name]: { msg: "↻ Mengecek ketersediaan...", color: "text-orange-400" }
      }));

      // Bersihkan timer lama (Debounce)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // Mulai cek database setelah 500ms berhenti ngetik
      typingTimeoutRef.current = setTimeout(() => {
        execLiveCheck(name, finalValue);
      }, 500);
    } else {
      // Jika input dihapus/terlalu pendek, hilangkan pesan
      setStatusCek(prev => ({ ...prev, [name]: { msg: "", color: "" } }));
    }
  }
};

// Fungsi eksekusi ke API
const execLiveCheck = async (field, value) => {
  try {
    const res = await fetch("/api/check-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value })
    });
    const data = await res.json();

    if (data.exists) {
      setStatusCek(prev => ({
        ...prev,
        [field]: { msg: `X ${field === 'username' ? 'Username' : field === 'whatsapp' ? 'WA' : 'Rekening'} sudah digunakan`, color: "text-red-500" }
      }));
    } else {
      setStatusCek(prev => ({
        ...prev,
        [field]: { msg: `✓ ${field === 'username' ? 'Username' : field === 'whatsapp' ? 'WA' : 'Rekening'} tersedia`, color: "text-green-500" }
      }));
    }
  } catch (err) {
    console.error("Gagal cek data:", err);
  }
};

const handleDaftar = async (e) => {
  e.preventDefault();

  // 1. VALIDASI FRONTEND: Password tidak boleh sama dengan Username
  if (formData.password.toLowerCase() === formData.username.toLowerCase()) {
    return Swal.fire({
      icon: 'error',
      title: 'PENDAFTARAN GAGAL',
      text: 'Password tidak boleh sama dengan Username demi keamanan Bos!',
      background: '#1a0033',
      color: '#fff',
      confirmButtonColor: '#d33'
    });
  }

  // 2. VALIDASI FRONTEND: Konfirmasi Password
  if (formData.password !== formData.konfirmasiPassword) {
    return Swal.fire({
      icon: 'warning',
      title: 'PASSWORD TIDAK MATCH',
      text: 'Pastikan konfirmasi password sama dengan password utama.',
      background: '#1a0033',
      color: '#fff'
    });
  }

  // 3. VALIDASI FRONTEND: Pilih Bank
  if (!bankTerpilih) {
    return Swal.fire({
      icon: 'info',
      text: 'Silakan pilih metode Bank/E-Wallet terlebih dahulu.',
      background: '#1a0033',
      color: '#fff'
    });
  }

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        bank: bankTerpilih
      }),
    });

    const data = await response.json(); // Ambil respon dari API

    if (response.ok) {
      // BERHASIL: Simpan Session
      localStorage.setItem("username", formData.username); 
      localStorage.setItem("isLoggedIn", "true");

      Swal.fire({
        title: 'REGISTER BERHASIL',
        text: 'Selamat bergabung! Akun Anda sudah aktif.',
        icon: 'success',
        background: '#1a0033',
        color: '#ffffff',
        confirmButtonColor: '#c5a021',
        confirmButtonText: 'SUBMIT',
        backdrop: `rgba(0,0,0,0.8)`,
        customClass: { popup: 'rounded-3xl border border-white/10 shadow-2xl' }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/dashboard");
        }
      });

    } else {
      // GAGAL: (Username/WA/Rekening sudah terdaftar - pesan dari API)
      Swal.fire({
        icon: 'error',
        title: 'DATA SUDAH ADA',
        text: data.message || "Gagal mendaftar",
        background: '#1a0033',
        color: '#fff',
        confirmButtonColor: '#d33'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'KONEKSI ERROR',
      text: 'Gagal terhubung ke server. Coba lagi nanti.',
      background: '#1a0033',
      color: '#fff'
    });
  }
};





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

  const daftarBank = [
    'BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA', 'CIMB', 
    'DANA', 'OVO', 'LINK AJA', 'GOPAY', 'MAYBANK', 'BANK JAGO',
    'DANAMON', 'SEABANK', 'JENIUS', 'SINARMAS'
  ];
const [isLoggedIn, setIsLoggedIn] = useState(false);

// Cek status login setiap kali halaman dimuat
useEffect(() => {
  const status = localStorage.getItem("isLoggedIn");
  if (status === "true") {
    setIsLoggedIn(true);
  }
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




  // Logic Klik Luar untuk Dropdown
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
      className="relative min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >
      
     {/* HEADER UTAMA (Sticky & Responsive) */}
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
            className="h-13 w-auto drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] object-contain" 
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


{/* --- WRAPPER UTAMA (CONTAINER UNGU SOLID - TIDAK TRANSPARAN) --- */}
<div className="w-full max-w-6xl bg-[#1a0033] p-4 md:p-10 flex flex-col items-center gap-6 shadow-2xl min-h-screen pb-40 border-x border-white/10">
  
  

 {/* --- KOTAK PUTIH FORM --- */}
<div className="w-full max-w-2xl bg-white rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] mt-4 text-black">
  <form className="flex flex-col gap-5" onSubmit={handleDaftar}>
    
    {/* Username */}
    <div className="flex flex-col gap-1.5">
  <label className="text-xs font-black text-gray-700 uppercase italic">Username <span className="text-red-500">*</span></label>
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
    <input 
      type="text" 
      name="username"
      value={formData.username}
      onChange={handleChange}
      // PANGGIL FUNGSI CEK DI SINI
      onBlur={(e) => handleLiveCheck("username", e.target.value)}
      required
      placeholder="4-14 kombinasi huruf dan angka" 
      className={`w-full border rounded-xl py-3.5 pl-11 text-sm outline-none transition-all ${
        statusCek.username.color === "text-red-500" ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]" : 
        statusCek.username.color === "text-green-500" ? "border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.2)]" : "border-gray-200"
      }`} 
    />
  </div>
  {/* PESAN DI BAWAH INPUT */}
  {statusCek.username.msg && (
  <div className={`text-[10px] font-bold italic mt-1 ml-2 flex items-center gap-1.5 ${statusCek.username.color}`}>
    
    {/* JIKA SEDANG LOADING, TAMPILKAN ICON BERPUTAR */}
    {statusCek.username.msg.includes("Mengecek") && (
      <span className="animate-spin inline-block text-lg">↻</span>
    )}

    {/* TAMPILKAN TEKS PESAN */}
    <span>{statusCek.username.msg}</span>
    
  </div>
)}
</div>

    {/* Password & Konfirmasi Grid */}
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-black text-gray-700 uppercase italic">Password <span className="text-red-500">*</span></label>
    <input 
      type="password" 
      name="password"
      value={formData.password}
      onChange={handleChange}
      required
      placeholder="Min 6 karakter" 
      className={`w-full border rounded-xl py-3.5 px-4 text-sm outline-none transition-all ${
        formData.password && formData.password.toLowerCase() === formData.username.toLowerCase() 
        ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]" 
        : "border-gray-200 focus:border-[#D4AF37]"
      }`} 
    />
    {formData.password && formData.password.toLowerCase() === formData.username.toLowerCase() && (
      <p className="text-[10px] text-red-500 font-bold italic ml-2">X Password tidak boleh sama dengan username!</p>
    )}
  </div>
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-black text-gray-700 uppercase italic">Konfirmasi <span className="text-red-500">*</span></label>
    <input 
      type="password" 
      name="konfirmasiPassword"
      value={formData.konfirmasiPassword}
      onChange={handleChange}
      required
      placeholder="Ulangi password" 
      className={`w-full border rounded-xl py-3.5 px-4 text-sm outline-none transition-all ${
        formData.konfirmasiPassword && formData.password !== formData.konfirmasiPassword 
        ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]" 
        : "border-gray-200 focus:border-[#D4AF37]"
      }`} 
    />
    {formData.konfirmasiPassword && formData.password !== formData.konfirmasiPassword && (
      <p className="text-[10px] text-red-500 font-bold italic ml-2">X Konfirmasi password tidak cocok!</p>
    )}
  </div>
</div>


    {/* No HP */}
   <div className="flex flex-col gap-1.5">
  <label className="text-xs font-black text-gray-700 uppercase italic">Nomor WhatsApp <span className="text-red-500">*</span></label>
  <input 
    type="tel" 
    name="whatsapp"
    value={formData.whatsapp}
    onChange={handleChange}
    required
    placeholder="08xxxxxxxxxx" 
    className={`w-full border rounded-xl py-3.5 px-4 text-sm outline-none transition-all duration-300 ${
      statusCek.whatsapp.color === "text-red-500" ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]" : 
      statusCek.whatsapp.color === "text-green-500" ? "border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.2)]" : "border-gray-200 focus:border-[#D4AF37]"
    }`} 
  />
  {statusCek.whatsapp.msg && (
    <div className={`text-[10px] font-bold italic ml-2 flex items-center gap-1.5 ${statusCek.whatsapp.color}`}>
      {statusCek.whatsapp.msg.includes("Mengecek") && <span className="animate-spin inline-block">↻</span>}
      <span>{statusCek.whatsapp.msg}</span>
    </div>
  )}
</div>

    {/* Pilih Bank */}
    <div className="flex flex-col gap-3">
      <label className="text-xs font-black text-gray-700 uppercase italic">Pilih Bank / E-Wallet <span className="text-red-500">*</span></label>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {daftarBank.map((bank) => (
          <button 
            key={bank} 
            type="button"
            onClick={() => setBankTerpilih(bank)}
            className={`py-3 text-[10px] font-black border rounded-lg transition-all uppercase ${
              bankTerpilih === bank 
              ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg scale-[1.05]" 
              : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#D4AF37]"
            }`}
          >
            {bank}
          </button>
        ))}
      </div>
    </div>

    {/* Rekening Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-black text-gray-700 uppercase italic">Nama Rekening <span className="text-red-500">*</span></label>
    <input 
      type="text" 
      name="namaRekening"
      value={formData.namaRekening}
      onChange={handleChange}
      required
      placeholder="Sesuai buku tabungan" 
      className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3.5 px-4 text-sm outline-none focus:border-[#D4AF37] transition-all" 
    />
  </div>
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-black text-gray-700 uppercase italic">Nomor Rekening <span className="text-red-500">*</span></label>
    <input 
      type="text" 
      name="nomorRekening"
      value={formData.nomorRekening}
      onChange={handleChange}
      required
      placeholder="Masukkan nomor" 
      className={`w-full border rounded-xl py-3.5 px-4 text-sm outline-none transition-all duration-300 ${
        statusCek.nomorRekening.color === "text-red-500" ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]" : 
        statusCek.nomorRekening.color === "text-green-500" ? "border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.2)]" : "border-gray-200 focus:border-[#D4AF37]"
      }`} 
    />
    {statusCek.nomorRekening.msg && (
      <div className={`text-[10px] font-bold italic ml-2 flex items-center gap-1.5 ${statusCek.nomorRekening.color}`}>
        {statusCek.nomorRekening.msg.includes("Mengecek") && <span className="animate-spin inline-block">↻</span>}
        <span>{statusCek.nomorRekening.msg}</span>
      </div>
    )}
  </div>
</div>


    {/* Tombol Submit */}
    <button 
      type="submit" 
      className="w-full bg-gradient-to-b from-[#f3d97d] via-[#d4af37] to-[#a68a2d] text-black font-black py-4 rounded-xl text-sm uppercase shadow-xl hover:brightness-110 active:scale-95 transition-all mt-4"
    >
      Daftar Sekarang
    </button>

  </form>
</div>
</div>

      {/* Jarak gantung ke bawah layar agar background mengintip sedikit */}
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


      {/* --- MOBILE NAVIGATION --- */}
      {/* z-[130] dipastikan paling atas agar bisa diklik tanpa halangan */}
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

        {/* Pindah ke halaman lainnya */}
        <button 
  onClick={() => setShowLainnya(true)} 
  className="flex flex-col items-center flex-1 text-gray-400"
>
  <span className="text-xl">💬</span>
  <span className="text-[9px] font-black uppercase tracking-tighter">Lainnya</span>
</button>
      </nav>

    </main>
  );
}