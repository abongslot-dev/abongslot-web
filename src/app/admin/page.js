"use client";
import React, { useState, useEffect } from "react";
import { FileBarChart, Users, ArrowRightLeft, LayoutDashboard, UserPlus } from "lucide-react";
import Link from "next/link";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  AreaChart, Area 
} from 'recharts';

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
      <span className={`font-bold block ${color}`}>{count}</span>
      {amount !== undefined && (
        <span className="text-xs text-gray-400 font-medium">{amount}</span>
      )}
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    deposit: { countPending: 0, totalPending: 0, countSuccess: 0, totalSuccess: 0 },
    withdrawal: { countPending: 0, totalPending: 0, countSuccess: 0, totalSuccess: 0 },
    members: { total: 0, newToday: 0 },
    today: { deposit: 0, withdrawal: 0 }
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

  // --- Mapping Data untuk Grafik agar Dinamis ---
  const dataStatistikReal = [
    { name: 'Depo Hari Ini', value: stats.today.deposit || 1, color: '#4ade80' },
    { name: 'WD Hari Ini', value: stats.today.withdrawal || 1, color: '#f87171' },
  ];

  const dataMemberReal = [
    { name: 'Total Member', value: stats.members.total, color: '#3b82f6' },
    { name: 'Member Baru', value: stats.members.newToday, color: '#fb923c' },
  ];

  return (
    <div className="p-6 bg-[#f8fafc]">
      <h1 className="text-3xl font-normal mb-1 text-gray-800">Dashboard</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium uppercase tracking-wider">Dashboard Overview</p>
      
      {/* 4 STAT CARDS UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-white">
        <Link href="/admin/deposit">
          <div className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-4 font-bold text-xs uppercase opacity-80"><FileBarChart size={14}/> Depo Hari Ini</div>
            <div className="text-xl font-bold mb-1">{formatRupiah(stats.today.deposit)}</div>
            <div className="bg-black/10 p-1 px-3 text-[9px] inline-block uppercase font-bold rounded">Lihat Detail →</div>
          </div>
        </Link>

        <Link href="/admin/withdrawal">
          <div className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-4 font-bold text-xs uppercase opacity-80"><ArrowRightLeft size={14}/> WD Hari Ini</div>
            <div className="text-xl font-bold mb-1">{formatRupiah(stats.today.withdrawal)}</div>
            <div className="bg-black/10 p-1 px-3 text-[9px] inline-block uppercase font-bold rounded">Lihat Detail →</div>
          </div>
        </Link>

        <Link href="/admin/member">
          <div className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-4 font-bold text-xs uppercase opacity-80"><UserPlus size={14}/> Member Baru</div>
            <div className="text-2xl font-bold mb-1">{stats.members.newToday} <span className="text-xs font-normal opacity-60">User</span></div>
            <div className="bg-black/10 p-1 px-3 text-[9px] inline-block uppercase font-bold rounded italic">Hari Ini</div>
          </div>
        </Link>

        <Link href="/admin/member">
          <div className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-4 font-bold text-xs uppercase opacity-80"><Users size={14}/> Total Member</div>
            <div className="text-2xl font-bold mb-1">{stats.members.total} <span className="text-xs font-normal opacity-60">User</span></div>
            <div className="bg-black/10 p-1 px-3 text-[9px] inline-block uppercase font-bold rounded italic">Database</div>
          </div>
        </Link>
      </div>

      {/* RINGKASAN TRANSAKSI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryBox title="Ringkasan Deposit" icon="💰">
          <SummaryItem label="Menunggu (Pending)" count={stats.deposit.countPending + " Transaksi"} amount={formatRupiah(stats.deposit.totalPending)} color="text-yellow-600" />
          <SummaryItem label="Berhasil Hari Ini" count={stats.deposit.countSuccess + " Transaksi"} amount={formatRupiah(stats.today.deposit)} color="text-emerald-600" />
        </SummaryBox>
  
        <SummaryBox title="Ringkasan Withdrawal" icon="💸">
          <SummaryItem label="Menunggu (Pending)" count={stats.withdrawal.countPending + " Transaksi"} amount={formatRupiah(stats.withdrawal.totalPending)} color="text-yellow-600" />
          <SummaryItem label="Berhasil Hari Ini" count={stats.withdrawal.countSuccess + " Transaksi"} amount={formatRupiah(stats.today.withdrawal)} color="text-emerald-600" />
        </SummaryBox>

        <SummaryBox title="Informasi Member" icon="👥">
          <SummaryItem label="Pendaftaran Baru" count={stats.members.newToday + " Member"} color="text-blue-600" />
          <SummaryItem label="Total Database" count={stats.members.total + " Member"} color="text-purple-600" />
        </SummaryBox>
      </div>

      {/* --- BAGIAN GRAFIK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Grafik 1: Perbandingan Depo vs WD */}
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100 relative">
          <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">Transaksi Hari Ini (Rp)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataStatistikReal} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                  {dataStatistikReal.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => formatRupiah(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {dataStatistikReal.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div> {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Grafik 2: Perbandingan Member */}
        <div className="bg-white p-6 rounded shadow-sm border border-gray-100 relative">
          <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">Pertumbuhan Member</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataMemberReal} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                  {dataMemberReal.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {dataMemberReal.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div> {item.name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}