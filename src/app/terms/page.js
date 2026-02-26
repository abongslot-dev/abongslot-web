"use client";
import { useState } from "react"; // 1. WAJIB TAMBAH INI BIAR GAK ERROR
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Sekarang ini sudah tidak error

const handleSetuju = () => {
    // 1. NYALAKAN LOADINGNYA DULU BOS!
    setLoading(true); 

    // 2. Tandai bahwa user sudah menyetujui aturan
    sessionStorage.setItem("hasAcceptedTerms", "true");

    // 3. KASIH JEDA (DELAY) BIAR LOADINGNYA KELIHATAN GAYA
    // Kita kasih 1.5 detik biar user ngerasa sistem lagi verifikasi
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500); 
  };

  const handleTidakSetuju = () => {
    // Jika tidak setuju, hapus semua data login dan tendang ke depan
    localStorage.clear();
    sessionStorage.clear();
    router.push('/');
  };
  return (
    <main 
      /* TAMBAHAN: 
         - backdrop-blur-md (Mobile: Background Blur)
         - md:backdrop-blur-none (Desktop: Blur Hilang/Normal)
      */
      className="h-screen w-full flex items-center justify-center p-0 md:p-4 bg-fixed bg-cover bg-center backdrop-blur-md md:backdrop-blur-none"
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >


      {loading && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/20 backdrop-blur-xl">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#d4c33d]/20 border-t-[#d4c33d] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[#d4c33d] font-black text-[8px]">
              ABONGSLOT
            </div>
          </div>
          <p className="mt-4 text-[#d4c33d] font-bold text-[10px] uppercase tracking-[4px] animate-pulse text-center">
            Mempersiapkan<br/>Dashboard Anda...
          </p>
        </div>
      )}
      {/* Container Utama */}
      <div className="w-full h-full md:h-[100vh] md:max-w-4xl flex flex-col bg-[#1a0033]/95 md:rounded-xl md:border-2 md:border-[#1a0033] shadow-2xl overflow-hidden backdrop-blur-md">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a0033] via-[#fdf59a] to-[#1a0033] py-4 text-center shadow-md flex-none">
          <h1 className="text-lg font-black uppercase tracking-[3px] text-[#5c0011]">
            Syarat dan Ketentuan
          </h1>
        </div>

        {/* Konten Aturan */}
        <div className="flex-grow p-5 md:p-12 overflow-y-auto flex flex-col items-center">
          <img 
            src="https://i.postimg.cc/SxPMK5xB/banner3.png" 
            alt="Logo" 
            className="h-16 mb-8 object-contain drop-shadow-xl" 
          />
          
          <div className="w-full space-y-4">
            {[
              "Pendaftaran harus menggunakan Data Rekening Bank yang BENAR atau ASLI.",
              "Berita transfer deposit harap dikosongkan (dilarang menulis Togel/Deposit).",
              "Wajib cek nomor rekening aktif di menu deposit sebelum melakukan transfer.",
              "Proses deposit dilakukan saat bank dalam kondisi online/normal.",
              "Keputusan management JALAWIN adalah mutlak dan tidak dapat diganggu gugat.",
              "Dilarang keras melakukan penipuan bukti transfer atau manipulasi data.",
              "Satu akun hanya berlaku untuk satu data rekening yang valid."
            ].map((text, index) => (
              <div key={index} className="flex gap-4 bg-black/40 p-4 rounded-lg border-l-4 border-[#1a0033]">
                <span className="text-[#D4AF37] font-bold">0{index + 1}</span>
                <p className="text-white text-[12px] md:text-sm font-bold uppercase leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons - Selalu Kiri Kanan */}
        <div className="p-4 bg-#1a0033/60 border-t border-[#1a0033]/30 flex-none">
          <div className="flex flex-row gap-3 w-full">
            <button 
  onClick={handleTidakSetuju} // Ganti ke fungsi logout
  className="flex-1 py-3 text-[13px] font-bold uppercase bg-[#e0e0e0] text-black rounded-md shadow-md active:scale-95 transition-all"
>
  Tidak Setuju
</button>
            
            <button 
  onClick={handleSetuju}
  className="flex-1 py-3 text-[13px] font-bold uppercase bg-[#d4c33d] text-black rounded-md shadow-md active:scale-95 transition-all hover:brightness-110"
>
  Setuju
</button>
          </div>
        </div>
      </div>


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
    </main>
  );
}