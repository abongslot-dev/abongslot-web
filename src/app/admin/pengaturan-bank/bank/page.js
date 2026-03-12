"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';


// 1. Inisialisasi Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function BankManagementPage() {
  const router = useRouter();
  const [banks, setBanks] = useState([]); 
  const [loading, setLoading] = useState(true);

  // 2. Fungsi Ambil Data dari Database
  const loadData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) setBanks(data);
    } catch (error) {
      console.error("Gagal ambil data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* HEADER & BREADCRUMB */}
      <h1 className="text-3xl font-medium text-gray-800">Bank</h1>
      <nav className="flex mb-6 text-sm text-gray-500">
        <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
        <span className="mx-2">/</span>
        <span className="italic font-light">Bank</span>
      </nav>

      {/* TABLE CARD */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2 font-semibold text-gray-700 text-sm uppercase">
          <div className="grid grid-cols-2 gap-0.5 w-4">
             <div className="w-1.5 h-1.5 bg-gray-600"></div>
             <div className="w-1.5 h-1.5 bg-gray-600"></div>
             <div className="w-1.5 h-1.5 bg-gray-600"></div>
             <div className="w-1.5 h-1.5 bg-gray-600"></div>
          </div>
          Bank
        </div>

        <div className="p-4 relative">
          {/* Tombol Tambah */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => router.push('/admin/pengaturan-bank/bank/tambah')} 
              className="bg-[#198754] hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-all active:scale-95 shadow-sm"
            >
              <Plus size={16} /> Tambah
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-white text-gray-700 text-[13px] font-bold">
                  <th className="border p-2 text-left w-12 font-bold">No.</th>
                  <th className="border p-2 text-left font-bold">Nama</th>
                  <th className="border p-2 text-left font-bold">Tipe</th>
                  <th className="border p-2 text-left font-bold text-gray-400">Status</th>
                  <th className="border p-2 text-left font-bold">Gambar</th>
                  <th className="border p-2 text-center font-bold">Register</th>
                  <th className="border p-2 text-center font-bold">Deposit</th>
                  <th className="border p-2 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {loading ? (
                  <tr><td colSpan="8" className="p-10 text-center italic text-gray-400">Memuat data...</td></tr>
                ) : banks.length > 0 ? (
                  banks.map((bank, index) => (
                    <tr key={bank.id} className="hover:bg-gray-50 transition-colors">
                      <td className="border p-3 text-center">{index + 1}.</td>
                      <td className="border p-3 font-semibold uppercase">{bank.nama}</td>
                      <td className="border p-3">{bank.tipe}</td>
                      <td className="border p-3 text-gray-400 font-light italic">{bank.status}</td>
                      <td className="border p-3">
                        {bank.img ? (
                           <img src={bank.img} alt={bank.nama} className="h-6 object-contain mx-auto" />
                        ) : (
                           <span className="text-gray-300">No Img</span>
                        )}
                      </td>
                      <td className="border p-3 text-center">
                        <input type="checkbox" checked={bank.register} readOnly className="w-3.5 h-3.5 accent-blue-600" />
                      </td>
                      <td className="border p-3 text-center">
                        <input type="checkbox" checked={bank.deposit} readOnly className="w-3.5 h-3.5 accent-blue-600" />
                      </td>
                      <td className="border p-3 text-center">
                        {/* TOMBOL EDIT - MENGARAH KE HALAMAN UBAH */}
                        <button 
                          onClick={() => router.push(`/admin/pengaturan-bank/bank/ubah/${bank.id}`)}
                          className="bg-[#ffc107] p-1.5 rounded shadow-sm hover:bg-yellow-500 transition-colors inline-flex"
                        >
                          <Edit2 size={14} className="text-black" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-10 text-center text-gray-400 italic">
                      Belum ada data bank. Silakan klik Tambah.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}