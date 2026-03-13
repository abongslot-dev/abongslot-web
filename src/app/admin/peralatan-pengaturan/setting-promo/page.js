"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HalamanPromo() {
  const [listPromo, setListPromo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromo();
  }, []);

  const fetchPromo = async () => {
    try {
      setLoading(true);
      // Ambil data yang statusnya 'Aktif' dan urutkan berdasarkan kolom 'urutan'
      const { data, error } = await supabase
        .from("promosi")
        .select("*")
        .eq("status", "Aktif")
        .order("urutan", { ascending: true });

      if (error) throw error;
      setListPromo(data || []);
    } catch (err) {
      console.error("Gagal ambil data promo:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-[#1a0033] p-4 text-center border-b border-yellow-500">
        <h1 className="text-white font-bold text-xl uppercase tracking-widest">
          Promosi Spektakuler
        </h1>
      </div>

      <div className="p-3 space-y-4">
        {loading ? (
          // Skeleton Loading biar gak kaku
          [1, 2, 3].map((i) => (
            <div key={i} className="w-full h-40 bg-gray-300 animate-pulse rounded-xl" />
          ))
        ) : listPromo.length === 0 ? (
          <div className="text-center py-20 text-gray-500 italic">
            Belum ada promo aktif saat ini.
          </div>
        ) : (
          listPromo.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 group"
            >
              {/* Gambar Promo Otomatis dari Admin */}
              <div className="relative overflow-hidden">
                <img
                  src={item.gambar_url}
                  alt={item.judul}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Detail Singkat */}
              <div className="p-4 flex justify-between items-center bg-white">
                <h2 className="font-black text-gray-800 text-[14px] uppercase italic">
                  {item.judul}
                </h2>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-4 rounded-full text-[11px] transition-all">
                  LIHAT DETAIL
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}