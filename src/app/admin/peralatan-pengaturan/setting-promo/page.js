"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Edit3, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PengaturanPromo() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("promosi")
        .select("*")
        .order("urutan", { ascending: true });

      if (error) throw error;
      setPromos(data || []);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-800">Pengaturan Promo</h1>
      <nav className="flex mb-6 text-sm text-blue-600 font-medium">
        <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">Pengaturan Promo</span>
      </nav>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-gray-700 font-bold flex items-center gap-2">
             Pengaturan Promosi
          </h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2 transition-all">
            <Plus size={16} /> Tambah Promo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[13px] font-bold text-gray-700 uppercase">
                <th className="p-3 border-r w-16 text-center">No.</th>
                <th className="p-3 border-r">Gambar</th>
                <th className="p-3 border-r">Judul</th>
                <th className="p-3 border-r text-center">Status</th>
                <th className="p-3 border-r text-center w-24">Urutan</th>
                <th className="p-3 text-center w-32">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-gray-600">
              {loading ? (
                <tr><td colSpan="6" className="p-10 text-center italic">Memuat data promo...</td></tr>
              ) : promos.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center italic">Belum ada data promo.</td></tr>
              ) : promos.map((p, idx) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3 border-r text-center">{idx + 1}.</td>
                  <td className="p-3 border-r">
                    <img 
                      src={p.gambar_url} 
                      alt={p.judul} 
                      className="h-10 w-40 object-cover rounded border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="p-3 border-r font-bold uppercase italic">
                    {p.judul}
                  </td>
                  <td className="p-3 border-r text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      p.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 border-r text-center font-bold">
                    {p.urutan}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded shadow-sm">
                        <Edit3 size={14} />
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded shadow-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}