"use client";
import { useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";

// 1. BUAT KONTEN UTAMA
function GantiPasswordContent() {
  const [form, setForm] = useState({ oldPass: "", newPass: "", confirmPass: "" });
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState({ msg: "", type: "" });
  const [showLainnya, setShowLainnya] = useState(false); // State untuk menu lainnya
  const router = useRouter();
  const headerRef = useRef(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirmPass) {
      setNotif({ msg: "Konfirmasi password baru tidak cocok!", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          oldPassword: form.oldPass,
          newPassword: form.newPass,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNotif({ msg: "Password berhasil diganti, Bos!", type: "success" });
        setTimeout(() => router.push("/profile"), 2000);
      } else {
        setNotif({ msg: data.message, type: "error" });
      }
    } catch (err) {
      setNotif({ msg: "Gagal menyambung ke server", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      className="relative min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >
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
              onClick={() => router.back()}
              className="bg-zinc-700 border border-zinc-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-zinc-600 transition-all"
            >
              ⬅ KEMBALI
            </button>
          </div>
        </div>
      </header>

      {/* --- FORM GANTI PASSWORD --- */}
      {/* --- BOX RIWAYAT SESUAI GAMBAR --- */}
       <div className="w-full max-w-5xl min-h-[calc(100vh-100px)] bg-[#1a0033] overflow-hidden shadow-2xl   flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 w-full mb-20">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-white p-4 text-center border-b">
            <h1 className="text-[#cc1d1d] font-black uppercase text-sm">Ganti Password</h1>
          </div>

          <form onSubmit={handleUpdate} className="p-6 space-y-4">
            {notif.msg && (
              <div className={`p-2 text-xs text-center rounded ${notif.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {notif.msg}
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1 uppercase">Password Lama *</label>
              <input
                type="password"
                placeholder="Masukkan password lama"
                className="w-full border rounded p-3 text-sm text-black outline-none focus:border-red-500"
                onChange={(e) => setForm({...form, oldPass: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1 uppercase">Password Baru *</label>
              <input
                type="password"
                placeholder="6-14 kombinasi huruf & angka"
                className="w-full border border-green-500 rounded p-3 text-sm text-black outline-none"
                onChange={(e) => setForm({...form, newPass: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1 uppercase">Konfirmasi Password Baru *</label>
              <input
                type="password"
                placeholder="Ulangi password baru"
                className="w-full border border-green-500 rounded p-3 text-sm text-black outline-none"
                onChange={(e) => setForm({...form, confirmPass: e.target.value})}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e6db82] hover:bg-[#d4c86a] text-black font-black py-3 rounded shadow-md transition-all uppercase text-sm"
            >
              {loading ? "Memproses..." : "Submit"}
            </button>
          </form>
        </div>
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



      {/* --- NAVBAR BAWAH MOBILE --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-[130] bg-black border-t border-yellow-500/30 md:hidden flex items-center justify-around py-3 backdrop-blur-lg">
        <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center flex-1 text-gray-400">
          <span className="text-xl">🏠</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Beranda</span>
        </button>
        <button onClick={() => router.push('/promosi')} className="flex flex-col items-center flex-1 text-gray-400">
          <span className="text-xl">🎁</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Promo</span>
        </button>
        <button onClick={() => router.push('/profile')} className="flex flex-col items-center flex-1 text-yellow-500">
          <span className="text-xl">👤</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
        </button>
        <button onClick={() => window.location.replace('/hubungi')} className="flex flex-col items-center flex-1 text-gray-400">
          <span className="text-xl">🎧</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Hubungi</span>
        </button>
      </nav>






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

// 2. SATU-SATUNYA DEFAULT EXPORT
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a0033] flex items-center justify-center text-[#D4AF37] font-bold">MENGHUBUNGKAN...</div>}>
      <GantiPasswordContent />
    </Suspense>
  );
}