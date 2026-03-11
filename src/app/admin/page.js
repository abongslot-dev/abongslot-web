"use client";
import React, { useState, useEffect } from "react";
import { FileBarChart, Users, ArrowRightLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link"; // Import Link untuk navigasi

// --- Komponen Kecil untuk Kotak Ringkasan ---
const SummaryBox = ({ title, icon, children }) => (
  <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
    <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
      <span className="font-bold text-gray-700 text-sm">{title}</span>
      <span className="text-lg">{icon}</span>
    </div>
    <div className="p-4 space-y-3">
      {children}
    </div>
  </div>
);

const SummaryItem = ({ label, count, amount, color }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <div className="text-right">
      <span className={`font-bold block ${color}`}>{count} Transaksi</span>
      {amount !== undefined && (
        <span className="text-xs text-gray-400">{amount}</span>
      )}
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    deposit: { countPending: 0, totalPending: 0, countSuccess: 0, totalSuccess: 0, countReject: 0, totalReject: 0 },
    withdrawal: { countPending: 0, totalPending: 0, countSuccess: 0, totalSuccess: 0 },
    members: { total: 0 }
  });

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard-summary');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Gagal ambil data dashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number || 0);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-normal mb-1">Dashboard</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">Dashboard Overview</p>
      
      {/* 3 STAT CARDS UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-white">
        
        {/* KOTAK DEPOSIT - Sekarang bisa diklik */}
        <Link href="/admin/deposit">
          <div className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-4 font-bold text-white"><FileBarChart size={16}/> Permintaan Deposit</div>
            <div className="bg-black/10 p-1.5 px-4 text-[10px] inline-block text-white uppercase font-bold group-hover:bg-black/30">Lihat →</div>
            <FileBarChart size={50} className="absolute -right-2 -top-1 opacity-20 text-white" />
          </div>
        </Link>

        {/* KOTAK WITHDRAWAL - Sekarang bisa diklik */}
        <Link href="/admin/withdrawal">
          <div className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-4 font-bold text-white"><ArrowRightLeft size={16}/> Permintaan Withdrawal</div>
            <div className="bg-black/10 p-1.5 px-4 text-[10px] inline-block text-white uppercase font-bold group-hover:bg-black/30">Lihat →</div>
            <ArrowRightLeft size={50} className="absolute -right-2 -top-1 opacity-20 text-white" />
          </div>
        </Link>

        {/* KOTAK MEMBER - Sekarang bisa diklik */}
        <Link href="/admin/member">
          <div className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-4 font-bold text-white"><Users size={16}/> Daftar Member</div>
            <div className="bg-black/10 p-1.5 px-4 text-[10px] inline-block text-white uppercase font-bold group-hover:bg-black/30">Lihat →</div>
            <Users size={50} className="absolute -right-2 -top-1 opacity-20 text-white" />
          </div>
        </Link>
      </div>

      {/* RINGKASAN TRANSAKSI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryBox title="Total Deposit" icon="📄">
          <SummaryItem 
            label="Butuh Diproses" 
            count={stats?.deposit?.countPending ?? 0} 
            amount={formatRupiah(stats?.deposit?.totalPending ?? 0)} 
            color="text-yellow-600" 
          />
          <SummaryItem 
            label="Diterima" 
            count={stats?.deposit?.countSuccess ?? 0} 
            amount={formatRupiah(stats?.deposit?.totalSuccess ?? 0)} 
            color="text-emerald-600" 
          />
          <SummaryItem 
            label="Ditolak" 
            count={stats?.deposit?.countReject ?? 0} 
            amount={formatRupiah(stats?.deposit?.totalReject ?? 0)} 
            color="text-rose-600" 
          />
        </SummaryBox>
  
        <SummaryBox title="Total Withdrawal" icon="📄">
          <SummaryItem 
            label="Butuh Diproses" 
            count={stats?.withdrawal?.countPending ?? 0} 
            amount={formatRupiah(stats?.withdrawal?.totalPending ?? 0)} 
            color="text-yellow-600" 
          />
          <SummaryItem 
            label="Diterima" 
            count={stats?.withdrawal?.countSuccess ?? 0} 
            amount={formatRupiah(stats?.withdrawal?.totalSuccess ?? 0)} 
            color="text-emerald-600" 
          />
        </SummaryBox>

        <SummaryBox title="Total Penyesuaian Saldo" icon="📄">
          <SummaryItem label="Ditambah" count={0} amount="Rp 0" color="text-emerald-600" />
          <SummaryItem label="Dikurangi" count={0} amount="Rp 0" color="text-rose-600" />
        </SummaryBox>
      </div>
    </div>
  );
}