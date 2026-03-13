"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search, Calendar, BarChart3 } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// Data Dummy untuk grafik
const dataDummy = [
  { tgl: '13/05', total: 1200000 },
  { tgl: '14/05', total: 1850000 },
  { tgl: '15/05', total: 500000 },
  { tgl: '16/05', total: 2100000 },
  { tgl: '17/05', total: 1200000 },
  { tgl: '18/05', total: 1450000 },
  { tgl: '19/05', total: 2350000 },
];

export default function StatistikOnline() {
  const [fromDate, setFromDate] = useState("2026-03-07");
  const [toDate, setToDate] = useState("2026-03-13");

  const formatRupiah = (value) => {
    return "Rp " + new Intl.NumberFormat("id-ID").format(value);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-gray-800">Statistik Online Member</h1>
      <nav className="flex mb-6 text-sm text-blue-600 font-medium">
        <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">Statistik Online Member</span>
      </nav>

      {/* FILTER BOX */}
      <div className="bg-white rounded shadow-sm border border-gray-200 mb-8">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
          <BarChart3 size={18} className="text-gray-700" />
          <h2 className="text-gray-700 font-bold text-sm text-[13px]">Perkembangan Online Member</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {/* Input Dari Tanggal */}
            <div className="relative group">
              <label className="absolute left-3 top-2 text-[10px] text-gray-400 uppercase font-bold z-10">Dari Tanggal</label>
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pt-6 pb-2 px-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white"
              />
            </div>
            {/* Input Sampai Tanggal */}
            <div className="relative group">
              <label className="absolute left-3 top-2 text-[10px] text-gray-400 uppercase font-bold z-10">Sampai Tanggal</label>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pt-6 pb-2 px-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white"
              />
            </div>
          </div>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-2 text-sm font-bold shadow-sm transition-all">
            <Search size={16} /> Cari
          </button>
        </div>
      </div>

      {/* GRAFIK BOX */}
      <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-gray-700 text-sm">Accumulation of Transactions</h3>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white font-medium outline-none">
            <option>Last Week</option>
            <option>Last Month</option>
          </select>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataDummy}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis 
                dataKey="tgl" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#666'}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#666'}}
                tickFormatter={(value) => `Rp ${value/1000000}M`}
              />
              <Tooltip 
                formatter={(value) => [formatRupiah(value), "Total"]}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#f59e0b" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}