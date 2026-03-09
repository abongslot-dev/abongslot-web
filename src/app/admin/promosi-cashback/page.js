"use client";
import React from "react";
import { 
  FileBarChart, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Mail,
  Plus
} from "lucide-react";

export default function PromosiCashbackPage() {
  return (
    <div className="p-6 text-gray-800 relative">
      {/* Notifikasi Melayang Pojok Kanan Atas - Info Result Market */}
      <div className="fixed top-4 right-4 z-50 bg-[#5bc0de] text-white p-3 rounded shadow-lg flex items-start gap-3 max-w-[250px] animate-pulse border border-cyan-400">
        <div className="bg-white/20 p-1 rounded-full shrink-0">
          <Mail size={16}/>
        </div>
        <div className="text-[11px]">
          <p className="font-bold border-b border-white/20 mb-1 pb-1 uppercase tracking-wider">Result Market</p>
          <p className="leading-tight">Sudah Waktunya Result Market <span className="font-bold underline">OREGON 03</span> !</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-normal mb-1 tracking-tight text-black">Promosi Cashback</h1>
          <p className="text-xs text-blue-500 font-medium">
            Dashboard <span className="text-gray-400 font-normal">/ Promosi Cashback</span>
          </p>
        </div>
        <button className="bg-[#28a745] hover:bg-green-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2 shadow-sm transition-all">
          <Plus size={16}/> TAMBAH CASHBACK
        </button>
      </div>

      {/* TABEL PROMOSI CASHBACK */}
      <div className="bg-white border rounded shadow-sm overflow-hidden border-gray-200">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <FileBarChart size={16}/> Pengaturan Bonus Mingguan (Cashback)
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-800 font-bold uppercase">
                <th className="p-3 border-r text-center w-12">No.</th>
                <th className="p-3 border-r">Keterangan Promo</th>
                <th className="p-3 border-r">Kategori Permainan</th>
                <th className="p-3 border-r text-center">Periode</th>
                <th className="p-3 border-r text-center">Nilai (%)</th>
                <th className="p-3 border-r text-right">Min. Kalah</th>
                <th className="p-3 border-r text-right">Maks. Bonus</th>
                <th className="p-3 border-r text-center">Status</th>
                <th className="p-3 border-r text-center">Tgl Dibuat</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <CashbackRow no="1" ket="CB LIVE CASINO > 500jt" game="Live Casino" durasi="Sekali seminggu" nilai="3%" min="500.000.001" max="Unlimited" status={false} tgl="26 May 2025" />
              <CashbackRow no="2" ket="CB LIVE CASINO > 300jt" game="Live Casino" durasi="Sekali seminggu" nilai="2%" min="300.000.001" max="Unlimited" status={false} tgl="26 May 2025" />
              <CashbackRow no="3" ket="CASHBACK ALL SPORT 5%" game="Tembak Ikan, Sport, Virtual, Sabung Ayam" durasi="Sekali seminggu" nilai="5%" min="200.000" max="Unlimited" status={true} tgl="13 March 2025" />
              <CashbackRow no="4" ket="CASHBACK LIVECASINO 5%" game="Live Casino" durasi="Sekali seminggu" nilai="5%" min="200.000" max="Unlimited" status={true} tgl="13 March 2025" />
              <CashbackRow no="5" ket="CASHBACK SLOT 5%" game="Slot" durasi="Sekali seminggu" nilai="5%" min="200.000" max="5.000.000" status={true} tgl="15 February 2025" />
            </tbody>
          </table>
        </div>
        
        <div className="p-3 bg-gray-50 text-[10px] text-gray-400 text-right border-t italic font-medium">
          Note: Cashback biasanya dibagikan setiap hari Senin / Selasa secara otomatis oleh sistem.
        </div>
      </div>
    </div>
  );
}

function CashbackRow({ no, ket, game, durasi, nilai, min, max, status, tgl }) {
  return (
    <tr className="hover:bg-blue-50/30 transition-colors">
      <td className="p-3 border-r text-center text-gray-400 font-mono">{no}.</td>
      <td className="p-3 border-r font-bold text-gray-700 uppercase">{ket}</td>
      <td className="p-3 border-r italic text-gray-500 leading-tight">{game}</td>
      <td className="p-3 border-r text-center text-gray-600 font-medium">{durasi}</td>
      <td className="p-3 border-r text-center">
        <span className="text-blue-700 font-black text-[13px]">{nilai}</span>
      </td>
      <td className="p-3 border-r text-right font-bold text-gray-800">
        <span className="text-[10px] text-gray-400 mr-1">Rp</span>{min}
      </td>
      <td className="p-3 border-r text-right font-bold text-gray-800">
        {max === "Unlimited" ? (
          <span className="text-gray-400 italic font-normal">No Limit</span>
        ) : (
          <><span className="text-[10px] text-gray-400 mr-1">Rp</span>{max}</>
        )}
      </td>
      <td className="p-3 border-r text-center">
        {status ? (
          <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 w-fit mx-auto border border-emerald-100">
            <CheckCircle2 size={10}/> AKTIF
          </div>
        ) : (
          <div className="bg-rose-50 text-rose-600 px-2 py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 w-fit mx-auto border border-rose-100">
            <XCircle size={10}/> OFF
          </div>
        )}
      </td>
      <td className="p-3 border-r text-center text-[10px] text-gray-400 font-medium">{tgl}</td>
      <td className="p-3">
        <div className="flex items-center justify-center gap-2">
          <button className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-100 rounded transition-all">
            <Pencil size={14}/>
          </button>
          <button className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-100 rounded transition-all">
            <Trash2 size={14}/>
          </button>
        </div>
      </td>
    </tr>
  );
}