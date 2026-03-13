"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Edit3, Headphones, LayoutDashboard } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PengaturanKontak() {
  const [listKontak, setListKontak] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKontak();
  }, []);

  const fetchKontak = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("kontak").select("*").order("id", { ascending: true });
      if (error) throw error;
      setListKontak(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-medium text-gray-800">Hubungi Kami</h1>
      <nav className="flex mb-6 text-sm text-blue-600 font-medium">
        <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">Hubungi Kami</span>
      </nav>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-gray-700 font-bold">
          <Headphones size={18} /> Hubungi Kami
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-[13px] font-bold text-gray-700 bg-white">
              <th className="p-3 border-r w-12 text-center">No.</th>
              <th className="p-3 border-r">Sosmed</th>
              <th className="p-3 border-r">Nama</th>
              <th className="p-3 border-r">URL</th>
              <th className="p-3 text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {loading ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">Memuat data...</td></tr>
            ) : listKontak.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-3 border-r text-center text-gray-500">{idx + 1}.</td>
                <td className="p-3 border-r font-semibold text-blue-600">{item.sosmed}</td>
                <td className="p-3 border-r text-gray-600">{item.nama}</td>
                <td className="p-3 border-r text-gray-500 truncate max-w-[300px]">{item.url}</td>
                <td className="p-3 text-center">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded shadow-sm">
                    <Edit3 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}