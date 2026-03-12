"use client";
import React, { useState } from "react";
import { Plus, Edit2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BankManagementPage() {
    const router = useRouter();
  const [banks, setBanks] = useState([
    { id: 1, nama: "BCA", tipe: "Bank", status: "Bank", img: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg", register: true, deposit: true }
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* HEADER TITLE */}
      <h1 className="text-3xl font-medium text-gray-800">Bank</h1>
      
      {/* BREADCRUMB */}
      <nav className="flex mb-6 text-sm">
        <Link href="/admin" className="text-blue-600 hover:underline flex items-center">
          Dashboard
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">Bank</span>
      </nav>

      {/* TABLE CARD */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5 w-4">
             <div className="w-1.5 h-1.5 bg-gray-600"></div>
             <div className="w-1.5 h-1.5 bg-gray-600"></div>
             <div className="w-1.5 h-1.5 bg-gray-600"></div>
             <div className="w-1.5 h-1.5 bg-gray-600"></div>
          </div>
          <span className="font-semibold text-gray-700 text-sm uppercase">Bank</span>
        </div>

<div className="p-4 relative"> {/* Tambah relative di sini */}
  {/* Action Button */}
  <div className="flex justify-end mb-4">
    <button 
      type="button" // Pastikan tipe button eksplisit
      onClick={(e) => {
        e.preventDefault(); // Mencegah reload halaman
        console.log("Navigasi ke halaman tambah...");
        router.push('/admin/pengaturan-bank/bank/tambah'); 
      }} 
      className="bg-[#198754] hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-colors shadow-sm relative z-[999] cursor-pointer"
    >
      <Plus size={16} /> Tambah
    </button>
  </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-white text-gray-700 text-sm">
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
              <tbody>
                {banks.map((bank, index) => (
                  <tr key={bank.id} className="text-sm text-gray-700 hover:bg-gray-50">
                    <td className="border p-3 text-center">{index + 1}.</td>
                    <td className="border p-3 font-medium">{bank.nama}</td>
                    <td className="border p-3">{bank.tipe}</td>
                    <td className="border p-3 text-gray-500">{bank.status}</td>
                    <td className="border p-3">
                      <img src={bank.img} alt={bank.nama} className="h-8 object-contain" />
                    </td>
                    <td className="border p-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={bank.register} 
                        readOnly 
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                    </td>
                    <td className="border p-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={bank.deposit} 
                        readOnly 
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                    </td>
                    <td className="border p-3 text-center">
                      <button className="bg-[#ffc107] hover:bg-yellow-500 p-2 rounded transition-colors inline-flex">
                        <Edit2 size={16} className="text-black" />
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