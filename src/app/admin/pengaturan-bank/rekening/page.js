"use client";
import React, { useState } from "react";
import { Plus, Edit2 } from "lucide-react";
import Link from "next/link";

export default function RekeningBankPage() {
  // Data dummy sesuai gambar
  const [dataRekening, setDataRekening] = useState([
    {
      id: 1,
      urutan: 0,
      bank: "BCA",
      nomor_rekening: "8421805547",
      nama_rekening: "BURHANUDIN",
      potongan: "0.00%",
      sembunyikan: "Tidak",
      waktu_diubah: "05 January 2026 10:49:52"
    }
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* HEADER TITLE */}
      <h1 className="text-3xl font-medium mb-1">Rekening Bank</h1>
      
      {/* BREADCRUMB */}
      <nav className="flex mb-6 text-sm">
        <Link href="/admin" className="text-blue-600 hover:underline flex items-center">
          Dashboard
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500 font-light">Rekening Bank</span>
      </nav>

      {/* TABLE CARD */}
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        {/* Card Header dengan Icon Grid kecil */}
        <div className="bg-[#f8f9fa] px-4 py-2.5 border-b border-gray-200 flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-1.5 h-1.5 bg-gray-700"></div>
            <div className="w-1.5 h-1.5 bg-gray-700"></div>
            <div className="w-1.5 h-1.5 bg-gray-700"></div>
            <div className="w-1.5 h-1.5 bg-gray-700"></div>
          </div>
          <span className="font-semibold text-gray-700 text-sm">Rekening Bank</span>
        </div>

     <div className="p-4">
  {/* Tombol Tambah yang sudah aktif */}
  <div className="flex justify-end mb-4">
    <Link href="/admin/pengaturan-bank/rekening/tambah"> 
      <button className="bg-[#198754] hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition-all shadow-sm">
        <Plus size={16} strokeWidth={3} /> Tambah
      </button>
    </Link>
  </div>
</div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-white">
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Urutan</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold text-gray-700">Bank</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Nomor Rekening</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Nama Rekening</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Potongan Admin</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Sembunyikan</th>
                  <th className="border border-gray-200 p-2.5 text-left font-bold">Waktu Diubah</th>
                  <th className="border border-gray-200 p-2.5 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Section Header (Baris "Member Baru") */}
                <tr className="bg-[#fcfcfc]">
                  <td colSpan="8" className="border border-gray-200 p-2 text-[13px] font-medium text-gray-600 italic">
                    Member Baru
                  </td>
                </tr>
                
                {/* Data Row */}
                {dataRekening.map((rek) => (
                  <tr key={rek.id} className="hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-200 p-3 text-left">{rek.urutan}</td>
                    <td className="border border-gray-200 p-3 text-left">{rek.bank}</td>
                    <td className="border border-gray-200 p-3 text-left">{rek.nomor_rekening}</td>
                    <td className="border border-gray-200 p-3 text-left uppercase">{rek.nama_rekening}</td>
                    <td className="border border-gray-200 p-3 text-left">{rek.potongan}</td>
                    <td className="border border-gray-200 p-3 text-left">{rek.sembunyikan}</td>
                    <td className="border border-gray-200 p-3 text-left text-gray-500 font-light">{rek.waktu_diubah}</td>
                    <td className="border border-gray-200 p-3 text-center">
                      <button className="bg-[#ffc107] hover:bg-yellow-500 p-1.5 rounded transition-all inline-flex shadow-sm border border-yellow-600/20">
                        <Edit2 size={15} className="text-black" strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}