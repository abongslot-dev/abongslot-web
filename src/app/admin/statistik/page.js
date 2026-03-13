"use client";
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { LayoutDashboard, Users, MousePointer2, Search, Share2 } from 'lucide-react';
import Link from 'next/link';

// Data Dummy (Nanti bisa Bos tarik dari Supabase)
const dataPie = [
  { name: 'Direct', value: 38.6, color: '#4ade80' },
  { name: 'Referral', value: 31.1, color: '#facc15' },
  { name: 'Search', value: 18.3, color: '#f87171' },
  { name: 'Social', value: 11.2, color: '#3b82f6' },
];

const dataBar = [
  { name: '27', a: 40, b: 20, c: 10 },
  { name: '42', a: 30, b: 25, c: 15 },
  { name: '61', a: 45, b: 30, c: 20 },
  { name: '12', a: 15, b: 10, c: 5 },
  { name: '23', a: 25, b: 15, c: 10 },
  { name: '36', a: 35, b: 25, c: 15 },
];

export default function StatistikMember() {
  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* HEADER & BREADCRUMB */}
      <h1 className="text-3xl font-medium text-gray-800">Statistik Member Baru</h1>
      <nav className="flex mb-6 text-sm text-blue-600 font-medium">
        <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">Statistik Member Baru</span>
      </nav>

      {/* GRID UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. DONUT CHART - SOURCE */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 col-span-1">
          <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">Traffic Source</h3>
          <div className="h-64 flex flex-col items-center relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataPie} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {dataPie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-xs text-gray-400 block">total</span>
                <span className="text-2xl font-bold">582</span>
             </div>
          </div>
          <div className="mt-4 space-y-2">
             {dataPie.map((item) => (
               <div key={item.name} className="flex justify-between text-xs font-medium">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span>{item.name}</span>
                 </div>
                 <span className="text-gray-400">{item.value}%</span>
               </div>
             ))}
          </div>
        </div>

        {/* 2. BAR CHART - YEAR DYNAMICS */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-1">
          <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">Dynamics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="a" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="b" stackId="a" fill="#facc15" />
                <Bar dataKey="c" stackId="a" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. AREA CHART - COMPARISON */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">Comparison Chart</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataBar}>
                  <defs>
                    <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="a" stroke="#f87171" fillOpacity={1} fill="url(#colorA)" strokeWidth={2} />
                  <Area type="monotone" dataKey="b" stroke="#818cf8" fill="#818cf8" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* 4. LINE CHART - DETAILED USERS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-4 mt-2">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-700">Detailed Lines Analysis</h3>
             <div className="flex gap-2 text-[10px] font-bold">
                <span className="px-3 py-1 bg-gray-100 rounded cursor-pointer">Hourly</span>
                <span className="px-3 py-1 bg-gray-100 rounded cursor-pointer">Day</span>
                <span className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer">Month</span>
             </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataBar}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="a" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
                <Line type="monotone" dataKey="b" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}