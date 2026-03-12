"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';

// Hubungkan ke Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function RekeningBankPage() {
  const [dataRekening, setDataRekening] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data dari Supabase
  const fetchRekening = async () => {
    setLoading(true);
    try {
      // Kita ambil data dan join dengan tabel 'banks' untuk dapat nama banknya
      const { data, error } = await supabase
        .from('rekening_banks')
        .select(`
          *,
          banks ( nama )
        `)
        .order('urutan', { ascending: true });

      if (error) throw error;
      setDataRekening(data || []);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekening();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <h1 className="text-3xl font-medium mb-1">Rekening Bank</h1>
      
      <nav className="flex mb-6 text-sm">
        <Link href="/admin" className="text-blue-600 hover:underline flex items-center">
          Dashboard
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500 font-light">Rekening Bank</span>
      </nav>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#f8f9fa] px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-1.5 h-1.5 bg-gray-700"></div>
              <div className="w-1.5 h-1.5 bg-gray-700"></div>
              <div className="w-1.5 h-1.5 bg-gray-700"></div>
              <div className="w-1.5 h-1.5 bg-gray-700"></div>
            </div>
            <span className="font-semibold text-gray-700 text-sm">Rekening Bank</span>
          </div>
          {/* Tombol Refresh kecil */}
          <button onClick={fetchRekening} className="text-gray-400 hover:text-black transition-all">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-end mb-4">
            <Link href="/admin/pengaturan-bank/rekening/tambah"> 
              <button className="bg-[#198754] hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition-all shadow-sm">
                <Plus size={16} strokeWidth={3} /> Tambah
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-white text-gray-700">
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Urutan</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Bank</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Nomor Rekening</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Nama Rekening</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Potongan Admin</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Sembunyikan</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Waktu Diubah</th>
                  <th className="border border-gray-200 p-2.5 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#fcfcfc]">
                  <td colSpan="8" className="border border-gray-200 p-2 text-[13px] font-medium text-gray-600 italic">
                    Daftar Rekening Aktif
                  </td>
                </tr>
                
                {loading ? (
                  <tr><td colSpan="8" className="text-center p-10 italic text-gray-400">Memuat data...</td></tr>
                ) : dataRekening.length === 0 ? (
                  <tr><td colSpan="8" className="text-center p-10 text-gray-400">Belum ada data rekening. Klik "Tambah" untuk mengisi.</td></tr>
                ) : (
                  dataRekening.map((rek) => (
                    <tr key={rek.id} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-200 p-3 text-left">{rek.urutan}</td>
                      <td className="border border-gray-200 p-3 text-left font-bold text-blue-700">
                        {rek.banks?.nama || "Unknown"}
                      </td>
                      <td className="border border-gray-200 p-3 text-left">{rek.nomor_rekening}</td>
                      <td className="border border-gray-200 p-3 text-left uppercase">{rek.nama_rekening}</td>
                      <td className="border border-gray-200 p-3 text-left">{rek.persen_potongan}%</td>
                      <td className="border border-gray-200 p-3 text-left">
                         <span className={rek.sembunyikan ? "text-red-500 font-bold" : "text-green-600"}>
                            {rek.sembunyikan ? "Ya" : "Tidak"}
                         </span>
                      </td>
                      <td className="border border-gray-200 p-3 text-left text-gray-500 font-light">
                        {new Date(rek.created_at).toLocaleString('id-ID')}
                      </td>
                      <td className="border border-gray-200 p-3 text-center">
                        <button className="bg-[#ffc107] hover:bg-yellow-500 p-1.5 rounded transition-all inline-flex shadow-sm border border-yellow-600/20">
                          <Edit2 size={15} className="text-black" strokeWidth={2.5} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}