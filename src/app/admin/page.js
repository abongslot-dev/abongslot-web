"use client";
import React, { useState, useEffect } from "react";
import { FileBarChart, Users, ArrowRightLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
// --- Import Tambahan untuk Grafik ---
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  AreaChart, Area, LineChart, Line 
} from 'recharts';

// --- Data Dummy untuk Grafik (Bisa Bos ganti dengan API nanti) ---
const dataTraffic = [
  { name: 'Direct', value: 38.6, color: '#4ade80' },
  { name: 'Referral', value: 31.1, color: '#facc15' },
  { name: 'Search', value: 18.3, color: '#f87171' },
  { name: 'Social', value: 3b82f6, color: '#3b82f6' },
  { name: 'Other', value: 7.8, color: '#94a3b8' },
];

const dataDevices = [
  { name: 'Desktop', value: 46.2, color: '#4ade80' },
  { name: 'Smartphone', value: 38.7, color: '#fb923c' },
  { name: 'Tablet', value: 15.1, color: '#3b82f6' },
];

const dataBar = [
  { name: '27', a: 40, b: 20, c: 10 },
  { name: '42', a: 30, b: 25, c: 15 },
  { name: '61', a: 45, b: 30, c: 20 },
  { name: '12', a: 15, b: 10, c: 5 },
  { name: '23', a: 25, b: 15, c: 10 },
  { name: '36', a: 35, b: 25, c: 15 },
  { name: '54', a: 30, b: 20, c: 10 },
];

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
    <div className="p-6 bg-[#f8fafc]">
      <h1 className="text-3xl font-normal mb-1">Dashboard</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">Dashboard Overview</p>
      
      {/* 3 STAT CARDS UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-white">
        <Link href="/admin/deposit">
          <div className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-4 font-bold text-white"><FileBarChart size={16}/> Permintaan Deposit</div>
            <div className="bg-black/10 p-1.5 px-4 text-[10px] inline-block text-white uppercase font-bold group-hover:bg-black/30">Lihat →</div>
            <FileBarChart size={50} className="absolute -right-2 -top-1 opacity-20 text-white" />
          </div>
        </Link>

        <Link href="/admin/withdrawal">
          <div className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-4 font-bold text-white"><ArrowRightLeft size={16}/> Permintaan Withdrawal</div>
            <div className="bg-black/10 p-1.5 px-4 text-[10px] inline-block text-white uppercase font-bold group-hover:bg-black/30">Lihat →</div>
            <ArrowRightLeft size={50} className="absolute -right-2 -top-1 opacity-20 text-white" />
          </div>
        </Link>

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
          <SummaryItem label="Butuh Diproses" count={stats?.deposit?.countPending ?? 0} amount={formatRupiah(stats?.deposit?.totalPending ?? 0)} color="text-yellow-600" />
          <SummaryItem label="Diterima" count={stats?.deposit?.countSuccess ?? 0} amount={formatRupiah(stats?.deposit?.totalSuccess ?? 0)} color="text-emerald-600" />
          <SummaryItem label="Ditolak" count={stats?.deposit?.countReject ?? 0} amount={formatRupiah(stats?.deposit?.totalReject ?? 0)} color="text-rose-600" />
        </SummaryBox>
  
        <SummaryBox title="Total Withdrawal" icon="📄">
          <SummaryItem label="Butuh Diproses" count={stats?.withdrawal?.countPending ?? 0} amount={formatRupiah(stats?.withdrawal?.totalPending ?? 0)} color="text-yellow-600" />
          <SummaryItem label="Diterima" count={stats?.withdrawal?.countSuccess ?? 0} amount={formatRupiah(stats?.withdrawal?.totalSuccess ?? 0)} color="text-emerald-600" />
        </SummaryBox>

        <SummaryBox title="Total Penyesuaian Saldo" icon="📄">
          <SummaryItem label="Ditambah" count={0} amount="Rp 0" color="text-emerald-600" />
          <SummaryItem label="Dikurangi" count={0} amount="Rp 0" color="text-rose-600" />
        </SummaryBox>
      </div>

      {/* --- BAGIAN STATISTIK BARU (SESUAI GAMBAR) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Donut 1: total 582 */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-100 relative">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataTraffic} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                  {dataTraffic.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">total</span>
              <span className="text-xl font-bold text-gray-700">582</span>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {dataTraffic.map((item) => (
              <div key={item.name} className="flex justify-between text-[10px] font-bold">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div> {item.name}
                </div>
                <span className="text-gray-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut 2: total 715 */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-100 relative">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataDevices} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                  {dataDevices.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">total</span>
              <span className="text-xl font-bold text-gray-700">715</span>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {dataDevices.map((item) => (
              <div key={item.name} className="flex justify-between text-[10px] font-bold">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div> {item.name}
                </div>
                <span className="text-gray-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Year Dynamics - Bar Chart */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase mb-4">Year dynamics</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="a" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="b" stackId="a" fill="#fb923c" />
                <Bar dataKey="c" stackId="a" fill="#4ade80" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Chart - Area Chart */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase mb-4">Comparison chart</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataBar}>
                <Tooltip />
                <Area type="monotone" dataKey="a" stroke="#f87171" fill="#fecaca" fillOpacity={0.4} strokeWidth={2} />
                <Area type="monotone" dataKey="b" stroke="#818cf8" fill="#c7d2fe" fillOpacity={0.4} strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}