"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Edit3, Plus, Trash2, LayoutDashboard } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PengaturanBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("urutan", { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (err) {
      alert("Gagal ambil data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 1. Header & Breadcrumb */}
      <h1 className="text-3xl font-medium text-gray-800">Pengaturan Banner</h1>
      <nav className="flex mb-6 text-sm text-blue-600 font-medium">
        <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">Pengaturan Banner</span>
      </nav>

      {/* 2. Card Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-700 font-bold">
            <LayoutDashboard size={18} />
            Pengaturan Banner
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-all">
            <Plus size={16} /> Tambah Banner
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[13px] font-bold text-gray-700">
                <th className="p-3 border-r w-12 text-center">No.</th>
                <th className="p-3 border-r">Gambar Mobile</th>
                <th className="p-3 border-r">Gambar Desktop</th>
                <th className="p-3 border-r">Judul</th>
                <th className="p-3 border-r text-center">Status</th>
                <th className="p-3 border-r text-center w-20">Urutan</th>
                <th className="p-3 text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {loading ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-400">Memuat data...</td></tr>
              ) : banners.map((bn, idx) => (
                <tr key={bn.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3 border-r text-center text-gray-500">{idx + 1}.</td>
                  
                  {/* Preview Mobile */}
                  <td className="p-3 border-r">
                    <img src={bn.gambar_mobile_url} className="h-12 w-20 object-cover rounded border border-gray-200 shadow-sm" alt="Mobile" />
                  </td>

                  {/* Preview Desktop */}
                  <td className="p-3 border-r">
                    <img src={bn.gambar_desktop_url} className="h-12 w-32 object-cover rounded border border-gray-200 shadow-sm" alt="Desktop" />
                  </td>

                  <td className="p-3 border-r font-medium text-gray-600 uppercase italic">
                    {bn.judul}
                  </td>

                  <td className="p-3 border-r text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                      bn.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${bn.status === 'Aktif' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {bn.status}
                    </span>
                  </td>

                  <td className="p-3 border-r text-center font-bold text-gray-700">
                    {bn.urutan}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded transition-all">
                        <Edit3 size={14} />
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition-all">
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