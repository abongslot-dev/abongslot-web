"use client";
import React from "react";
import { 
  FileBarChart, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";

export default function PromosiDepositPage() {
  return (
    <div className="p-6 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-normal mb-1 text-black">Promosi Deposit</h1>
          <p className="text-xs text-blue-500 font-medium">
            Dashboard <span className="text-gray-400 font-normal">/ Promosi Deposit</span>
          </p>
        </div>
        {/* Tombol Tambah Promo Baru */}
        <button className="bg-[#007bff] hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2 shadow-sm transition-all">
          <Plus size={16}/> TAMBAH PROMO
        </button>
      </div>

      {/* TABEL PROMOSI DEPOSIT */}
      <div className="bg-white border rounded shadow-sm overflow-hidden border-gray-200">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <FileBarChart size={16}/> Pengaturan Bonus & Promosi
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-800 font-bold uppercase">
                <th className="p-3 border-r text-center w-12">No.</th>
                <th className="p-3 border-r">Nama Promosi</th>
                <th className="p-3 border-r">Tipe Durasi</th>
                <th className="p-3 border-r">Sistem Bonus</th>
                <th className="p-3 border-r text-center">Tipe</th>
                <th className="p-3 border-r text-center">Nilai</th>
                <th className="p-3 border-r text-right">Max Bonus</th>
                <th className="p-3 border-r text-center">Target TO</th>
                <th className="p-3 border-r text-center">Status</th>
                <th className="p-3 border-r text-center w-16">Urutan</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <PromoRow no="1" nama="BONUS CUAN PAGI & MALAM" durasi="Setiap hari" bagi="Otomatis di awal" tipe="Persen" nilai="50%" max="100.000" to="X5" status={false} urutan="7" />
              <PromoRow no="2" nama="BONUS CLAIM KEKALAHAN 100%" durasi="Sekali" bagi="Otomatis di akhir" tipe="Persen" nilai="100%" max="15.000" to="X5" status={true} urutan="6" />
              <PromoRow no="3" nama="BONUS SLOT 100%" durasi="Sekali" bagi="Otomatis di awal" tipe="Persen" nilai="100%" max="25.000" to="X8" status={false} urutan="5" />
              <PromoRow no="4" nama="BONUS NEW MEMBER 20%" durasi="Sekali" bagi="Otomatis di awal" tipe="Persen" nilai="20%" max="15.000" to="X2" status={true} urutan="4" />
              <PromoRow no="5" nama="BONUS HARIAN TOGEL 5%" durasi="Setiap hari" bagi="Otomatis di awal" tipe="Persen" nilai="5%" max="5.000" to="X1" status={true} urutan="3" />
              <PromoRow no="6" nama="BONUS HARIAN ALL GAME 5%" durasi="Sekali" bagi="Otomatis di awal" tipe="Persen" nilai="5%" max="5.000" to="X1" status={true} urutan="2" />
              <PromoRow no="7" nama="BONUS HARIAN 5%" durasi="Setiap hari" bagi="Otomatis di awal" tipe="Persen" nilai="5%" max="5.000" to="X1" status={true} urutan="1" />
            </tbody>
          </table>
        </div>
        
        <div className="p-3 bg-gray-50 text-[10px] text-gray-500 text-right border-t font-medium italic">
          Total: 7 Konfigurasi Promo Aktif/Non-Aktif
        </div>
      </div>
    </div>
  );
}

function PromoRow({ no, nama, durasi, bagi, tipe, nilai, max, to, status, urutan }) {
  return (
    <tr className="hover:bg-blue-50/30 transition-colors">
      <td className="p-3 border-r text-center text-gray-400 font-mono">{no}.</td>
      <td className="p-3 border-r font-bold text-gray-700 uppercase tracking-tight">{nama}</td>
      <td className="p-3 border-r text-gray-600 font-medium">{durasi}</td>
      <td className="p-3 border-r">
        <span className={`text-[10px] px-2 py-0.5 rounded border ${bagi.includes('awal') ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-purple-200 text-purple-700 bg-purple-50'}`}>
          {bagi}
        </span>
      </td>
      <td className="p-3 border-r text-center text-gray-500">{tipe}</td>
      <td className="p-3 border-r text-center font-bold text-blue-600">{nilai}</td>
      <td className="p-3 border-r text-right font-bold text-gray-800">Rp {max}</td>
      <td className="p-3 border-r text-center">
        <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded font-black">
          {to}
        </span>
      </td>
      <td className="p-3 border-r">
        {status ? (
          <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 w-fit mx-auto">
            <CheckCircle2 size={12}/> <span className="text-[9px] uppercase">Aktif</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-full border border-rose-100 w-fit mx-auto">
            <XCircle size={12}/> <span className="text-[9px] uppercase">Off</span>
          </div>
        )}
      </td>
      <td className="p-3 border-r text-center font-bold text-gray-400">{urutan}</td>
      <td className="p-3">
        <div className="flex items-center justify-center gap-2">
          <button className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-100 rounded transition-all" title="Edit">
            <Pencil size={14}/>
          </button>
          <button className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-100 rounded transition-all" title="Hapus">
            <Trash2 size={14}/>
          </button>
        </div>
      </td>
    </tr>
  );
}