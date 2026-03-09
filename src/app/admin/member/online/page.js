"use client";
import React from "react";
import { Table, CheckCircle2 } from "lucide-react";

export default function OnlineMemberPage() {
  // Data dummy sesuai yang ada di gambar Bos
  const onlineData = [
    {
      id: 1,
      username: "Rahul95",
      ip: "114.8.201.187",
      waktuRegister: "04 August 2025, 17:21:55",
      upline: "",
      status: "Aktif",
      waktuLogin: "10 March 2026, 04:34:31",
    },
    {
      id: 2,
      username: "TUWOK10",
      ip: "182.2.45.233",
      waktuRegister: "04 July 2025, 19:35:07",
      upline: "Admintahunhoki",
      status: "Aktif",
      waktuLogin: "10 March 2026, 04:51:24",
    },
    {
      id: 3,
      username: "Muksalmina",
      ip: "182.9.161.174",
      waktuRegister: "07 February 2026, 22:04:47",
      upline: "dewaraja",
      status: "Aktif",
      waktuLogin: "10 March 2026, 04:30:36",
    },
  ];

  return (
    <div className="p-6 text-[#333] font-sans">
      {/* --- JUDUL HALAMAN --- */}
      <h1 className="text-4xl font-normal mb-1 tracking-tight">Online Member</h1>
      <p className="text-sm text-blue-500 mb-8 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Online Member</span>
      </p>

      {/* --- CONTAINER TABEL --- */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {/* Header Tabel */}
        <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-sm font-bold text-gray-700">
          <Table size={16} className="text-gray-600" /> Online Member
        </div>

        <div className="p-4">
          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-gray-800 font-bold uppercase">
                  <th className="p-3 border-r border-gray-200 text-center w-14">No.</th>
                  <th className="p-3 border-r border-gray-200">Username</th>
                  <th className="p-3 border-r border-gray-200">IP</th>
                  <th className="p-3 border-r border-gray-200 font-bold">Waktu Register</th>
                  <th className="p-3 border-r border-gray-200">Upline</th>
                  <th className="p-3 border-r border-gray-200 text-center">Status</th>
                  <th className="p-3">Waktu Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {onlineData.map((member, i) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-r border-gray-200 text-center text-gray-600">
                      {i + 1}.
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <a href="#" className="text-blue-600 hover:underline">
                        {member.username}
                      </a>
                    </td>
                    <td className="p-3 border-r border-gray-200 text-gray-700 font-medium">
                      {member.ip}
                    </td>
                    <td className="p-3 border-r border-gray-200 text-gray-600">
                      {member.waktuRegister}
                    </td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">
                      {member.upline || ""}
                    </td>
                    <td className="p-3 border-r border-gray-200 text-center">
                      <div className="bg-[#d4edda] text-[#155724] border border-[#c3e6cb] px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 w-fit mx-auto">
                        <CheckCircle2 size={12} fill="#155724" className="text-white" />
                        Aktif
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">
                      {member.waktuLogin}
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
