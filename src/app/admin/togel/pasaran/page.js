"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TogelPasaranPage() {
  const [pasaran, setPasaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // State untuk melacak data yang diedit

  const initialForm = {
    nama: "",
    prize: "1 Prize",
    hari_tutup: "-",
    jam_tutup: "00:00",
    jam_buka: "00:00",
    urutan: 1,
    status: true,
  };

  const [form, setForm] = useState(initialForm);

  const fetchPasaran = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("togel_pasaran")
        .select("*")
        .order("urutan", { ascending: true });

      if (error) throw error;
      setPasaran(data || []);
    } catch (err) {
      console.error("Error fetch:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasaran();
  }, []);

  // --- FUNGSI SIMPAN (BISA INSERT & UPDATE) ---
  const handleSimpan = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Jika ada editId, maka lakukan UPDATE
        const { error } = await supabase
          .from("togel_pasaran")
          .update(form)
          .eq("id", editId);
        if (error) throw error;
        alert("Pasaran Berhasil Diupdate!");
      } else {
        // Jika tidak ada editId, maka lakukan INSERT
        const { error } = await supabase.from("togel_pasaran").insert([form]);
        if (error) throw error;
        alert("Pasaran Berhasil Ditambahkan!");
      }

      closeModal();
      fetchPasaran();
    } catch (err) {
      alert("Gagal Proses: " + err.message);
    }
  };

  // --- FUNGSI HAPUS ---
  const handleHapus = async (id) => {
    if (confirm("Yakin ingin menghapus pasaran ini?")) {
      try {
        const { error } = await supabase.from("togel_pasaran").delete().eq("id", id);
        if (error) throw error;
        fetchPasaran();
      } catch (err) {
        alert("Gagal Hapus: " + err.message);
      }
    }
  };

  // --- FUNGSI BUKA MODAL UNTUK EDIT ---
  const openEditModal = (item) => {
    setEditId(item.id);
    setForm({
      nama: item.nama,
      prize: item.prize,
      hari_tutup: item.hari_tutup,
      jam_tutup: item.jam_tutup,
      jam_buka: item.jam_buka,
      urutan: item.urutan,
      status: item.status,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(initialForm);
  };

  return (
    <div className="p-6 bg-[#f4f6f9] min-h-screen font-sans text-gray-800">
      <h1 className="text-3xl font-semibold">Togel Pasaran</h1>
      <p className="text-blue-500 text-sm mb-6">Dashboard / Togel Pasaran</p>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-3 border-b bg-gray-50 flex justify-between items-center font-bold">
          <div className="flex items-center gap-2 text-sm uppercase italic">
            <span>▦</span> Togel Pasaran
          </div>
         
        </div>

        <div className="flex justify-end bg-white p-2 rounded shadow-sm border border-gray-200 overflow-hidden">
  <button 
    onClick={() => setShowModal(true)}
    className="bg-[#00a65a] text-white px-3 py-1.5 rounded text-[11px] flex items-center gap-1 hover:bg-[#008d4c] transition uppercase font-bold"
  >
    <Plus size={14} /> Tambah Pasaran
  </button>
</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-white border-b uppercase font-bold text-gray-600">
                <th className="p-3 border-r w-12 text-center">No.</th>
                <th className="p-3 border-r">Nama</th>
                <th className="p-3 border-r">Prize</th>
                <th className="p-3 border-r">Hari Tutup</th>
                <th className="p-3 border-r text-center">Waktu</th>
                <th className="p-3 border-r text-center w-20">Urutan</th>
                <th className="p-3 border-r text-center w-28">Status</th>
                <th className="p-3 text-center w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="p-10 text-center italic text-gray-400">Loading data...</td></tr>
              ) : pasaran.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 border-r text-center text-gray-400 font-medium">{index + 1}.</td>
                  <td className="p-3 border-r uppercase font-bold">{item.nama}</td>
                  <td className="p-3 border-r">{item.prize}</td>
                  <td className="p-3 border-r text-gray-500">{item.hari_tutup}</td>
                  <td className="p-3 border-r text-center">
                    Tutup: <span className="font-bold">{item.jam_tutup}</span> | Buka: <span className="font-bold">{item.jam_buka}</span>
                  </td>
                  <td className="p-3 border-r text-center font-bold">{item.urutan}</td>
                  <td className="p-3 border-r text-center">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 border ${
                      item.status ? 'bg-[#d1f5ea] text-[#1a8a6d] border-[#a3e4d7]' : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {item.status ? <CheckCircle2 size={10}/> : <XCircle size={10}/>}
                      {item.status ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="bg-[#f39c12] text-white p-1.5 rounded hover:bg-[#e67e22] transition"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => handleHapus(item.id)}
                      className="bg-[#dd4b39] text-white p-1.5 rounded hover:bg-[#c0392b] transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL INPUT/EDIT --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border-t-4 border-green-500">
            <div className="p-4 border-b font-bold uppercase text-gray-700">
              {editId ? "Edit Pasaran" : "Tambah Pasaran Baru"}
            </div>
            <form onSubmit={handleSimpan} className="p-5 space-y-4 text-[13px]">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nama Pasaran</label>
                <input type="text" className="w-full border p-2 rounded outline-none uppercase font-bold focus:border-green-500" required
                  value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value.toUpperCase()})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Jam Tutup</label>
                  <input type="time" className="w-full border p-2 rounded outline-none focus:border-green-500" required
                    value={form.jam_tutup} onChange={(e) => setForm({...form, jam_tutup: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Jam Buka</label>
                  <input type="time" className="w-full border p-2 rounded outline-none focus:border-green-500" required
                    value={form.jam_buka} onChange={(e) => setForm({...form, jam_buka: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Urutan</label>
                  <input type="number" className="w-full border p-2 rounded outline-none focus:border-green-500"
                    value={form.urutan} onChange={(e) => setForm({...form, urutan: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
                  <select className="w-full border p-2 rounded outline-none focus:border-green-500 font-bold"
                    value={form.status ? "true" : "false"} onChange={(e) => setForm({...form, status: e.target.value === "true"})}>
                    <option value="true">AKTIF</option>
                    <option value="false">NON-AKTIF</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition uppercase">
                  {editId ? "Update Data" : "Simpan Data"}
                </button>
                <button type="button" onClick={closeModal} className="px-4 bg-gray-200 text-gray-600 py-2 rounded font-bold hover:bg-gray-300 transition uppercase">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}