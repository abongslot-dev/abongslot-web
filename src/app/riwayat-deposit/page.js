"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter } from "next/navigation";

function RiwayatDepoContent() {
  const router = useRouter();
  const headerRef = useRef(null);
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");

    if (loginStatus !== "true" || !storedUsername) {
      router.push("/");
    } else {
      setUsername(storedUsername);
      fetchRiwayat(storedUsername);
    }
  }, [router]);

  const fetchRiwayat = async (userAktif) => {
    try {
      setLoading(true);
      // Panggil API khusus deposit
      const res = await fetch(`/api/riwayat-depo?username=${userAktif}&t=${Date.now()}`);
      const result = await res.json();
      if (result.success) {
        setDataRiwayat(result.data);
      }
    } catch (err) {
      console.error("Gagal load data riwayat deposit");
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
          <div className="absolute right-5">
            <button onClick={() => router.push("/profile")} className="bg-zinc-700 border border-zinc-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg">
              ⬅ KEMBALI
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-5xl min-h-[calc(100vh-100px)] bg-white overflow-hidden shadow-2xl border-x border-gray-300 flex flex-col mb-20">
        {/* Title Bar - Biru Tua */}
        <div className="bg-[#1a0033] px-4 py-2 border-b border-white/20">
          <h2 className="text-white text-xs font-bold uppercase tracking-wider">Riwayat Deposit</h2>
        </div>

        {/* Filter Section */}
        <div className="p-3 bg-[#1a0033]">
          <div className="border border-white/50 p-3 rounded-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end">
              <div>
                <label className="text-white text-[10px] block mb-1 font-bold">Mulai</label>
                <input type="date" className="w-full text-xs p-1 rounded-sm outline-none text-black bg-white" />
              </div>
              <div>
                <label className="text-white text-[10px] block mb-1 font-bold">Akhir</label>
                <input type="date" className="w-full text-xs p-1 rounded-sm outline-none text-black bg-white" />
              </div>
              <button className="bg-gradient-to-b from-[#d4a017] to-[#8b6508] text-white text-[10px] py-1.5 rounded-sm font-bold uppercase">🔍 Cari</button>
              <button onClick={() => fetchRiwayat(username)} className="bg-gradient-to-b from-zinc-400 to-zinc-600 text-white text-[10px] py-1.5 rounded-sm font-bold uppercase">🔄 Reset</button>
            </div>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-[11px] text-center border-collapse">
            <thead>
              <tr className="bg-gray-100 text-zinc-500 uppercase border-b border-gray-300">
                <th className="py-3 px-1 border-r border-gray-300 font-bold">NO</th>
                <th className="py-3 px-1 border-r border-gray-300 font-bold">TUJUAN</th>
                <th className="py-3 px-1 border-r border-gray-300 font-bold text-blue-700">STATUS</th>
                <th className="py-3 px-1 border-r border-gray-300 font-bold text-green-700">NOMINAL</th>
                <th className="py-3 px-1 font-bold text-black">TANGGAL</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {loading ? (
                <tr><td colSpan="5" className="py-10 text-zinc-400 italic">Memuat data...</td></tr>
              ) : dataRiwayat.length === 0 ? (
                <tr><td colSpan="5" className="py-10 text-zinc-400 italic">Tidak ada data deposit</td></tr>
              ) : (
                dataRiwayat.map((item, i) => (
                  <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 text-[10px]">
                    <td className="py-3 border-r border-gray-200 font-bold">{i + 1}</td>
                    <td className="py-3 border-r border-gray-200 uppercase font-black italic text-zinc-700">
                      {item.bank_tujuan || 'BANK'}
                    </td>
                    <td className="py-3 border-r border-gray-200 font-bold">
                      <span className={`px-2 py-1 rounded-sm text-[9px] text-white ${
                        item.status === 'approve' ? 'bg-green-600' : item.status === 'reject' ? 'bg-red-600' : 'bg-orange-500'
                      }`}>
                        {item.status === 'approve' ? 'SUCCESS' : item.status === 'reject' ? 'REJECTED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 border-r border-gray-200 text-green-700 font-black">
                      {Number(item.nominal).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 font-bold text-zinc-600">
                      {new Date(item.created_at).toLocaleString('id-ID', { 
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default function RiwayatDepositPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a0033] flex items-center justify-center text-[#D4AF37]">MENGHUBUNGKAN...</div>}>
      <RiwayatDepoContent />
    </Suspense>
  );
}