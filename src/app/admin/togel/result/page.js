"use client";
import React, { useState, useEffect } from "react";

export default function TogelResultPage() {
  const [results, setResults] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [filterPasaran, setFilterPasaran] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [form, setForm] = useState({
    pasaran: "",
    periode: "",
    nomor: "",
    tanggal: new Date().toISOString().split("T")[0]
  });

  // --- 1. FUNGSI LOAD DATA ---
  const loadData = async () => {
    try {
      const res = await fetch("/api/riwayat-keluaran");
      const json = await res.json();
      if (json.success && json.data) {
        setResults(json.data);
      }
    } catch (err) {
      console.error("Koneksi ke API Putus Boss:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- 2. FUNGSI SIMPAN ---
  const handleSimpan = async (e) => {
    e.preventDefault();
    const dataInput = {
      pasaran: form.pasaran,
      periode: form.periode,
      result: form.nomor,
      tanggal: form.tanggal
    };

    try {
      const res = await fetch("/api/save-keluaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataInput),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Berhasil! Data tersimpan di Riwayat.");
        setForm({ ...form, pasaran: "", periode: "", nomor: "" });
        setShowInput(false);
        await loadData();
      }
    } catch (err) {
      alert("Gagal koneksi!");
    }
  };

  // --- 3. FUNGSI HAPUS ---
  const handleDelete = async (id) => {
    if (confirm("Apakah Boss yakin ingin menghapus data ini?")) {
      try {
        const res = await fetch(`/api/delete-keluaran?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          loadData();
        }
      } catch (err) {
        alert("Gagal menghapus data");
      }
    }
  };

  // --- 4. LOGIKA FILTER, SORTING, & PAGINATION ---
  const filteredData = results
    .filter((item) => item.pasaran.toUpperCase().includes(filterPasaran.toUpperCase()))
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-4 bg-[#f4f6f9] min-h-screen font-sans">
      <h1 className="text-3xl font-semibold text-gray-800">Togel Result</h1>
      <p className="text-blue-500 text-sm mb-6">Dashboard / Togel Result</p>

      {/* --- FILTER --- */}
      <div className="bg-white rounded shadow-sm border mb-6">
        <div className="p-3 border-b bg-gray-50 flex items-center gap-2 font-bold text-gray-700 text-sm uppercase">
          <span>▼</span> Filter
        </div>
        <div className="p-5">
          <div className="max-w-xs">
            <label className="text-[11px] text-gray-500 block mb-1 uppercase font-bold">Pasaran</label>
            <input 
              type="text"
              placeholder="Ketik Nama Pasaran..."
              className="w-full p-2 border rounded bg-white text-sm outline-none border-gray-300 font-bold uppercase"
              value={filterPasaran}
              onChange={(e) => {
                setFilterPasaran(e.target.value);
                setCurrentPage(1); // Reset ke hal 1 saat ngetik
              }}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setFilterPasaran("")} className="bg-[#00c0ef] text-white px-4 py-1.5 rounded text-sm font-bold shadow-sm active:scale-95">🔄 Reset</button>
            <button className="bg-[#3c8dbc] text-white px-4 py-1.5 rounded text-sm font-bold shadow-sm active:scale-95">🔍 Cari</button>
          </div>
        </div>
      </div>

      {/* --- FORM INPUT --- */}
      {showInput && (
        <div className="bg-white rounded shadow-md border-t-4 border-green-500 mb-6 p-6 transition-all">
          <h2 className="font-bold mb-4 text-gray-700">Input Result Baru</h2>
          <form onSubmit={handleSimpan} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="NAMA PASARAN" className="p-2 border rounded uppercase outline-none text-sm font-bold" required
              value={form.pasaran} onChange={(e) => setForm({...form, pasaran: e.target.value.toUpperCase()})} />
            <input type="text" placeholder="PERIODE" className="p-2 border rounded outline-none text-sm" required
              value={form.periode} onChange={(e) => setForm({...form, periode: e.target.value})} />
            <input type="number" placeholder="ANGKA RESULT" className="p-2 border rounded font-bold outline-none text-sm" required
              value={form.nomor} onChange={(e) => setForm({...form, nomor: e.target.value.slice(0,4)})} />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white flex-1 rounded font-bold uppercase text-[10px]">Simpan Ke Riwayat</button>
              <button type="button" onClick={() => setShowInput(false)} className="bg-gray-400 text-white px-4 rounded text-[10px] font-bold uppercase">Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* --- TABEL RIWAYAT --- */}
      <div className="bg-white rounded shadow-sm border overflow-hidden">
        <div className="p-3 border-b bg-gray-50 flex justify-between items-center text-gray-700 font-bold">
          <div className="flex items-center gap-2 text-sm uppercase">▦ Riwayat Togel Result</div>
          <button onClick={() => setShowInput(!showInput)} className="bg-[#00a65a] text-white px-3 py-1.5 rounded text-[11px] flex items-center gap-1 hover:bg-[#008d4c] transition font-bold uppercase shadow-sm">
            + Tambah Result
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b uppercase font-bold text-[11px]">
                <th className="p-3 border-r w-12 text-center">No.</th>
                <th className="p-3 border-r">Pasaran</th>
                <th className="p-3 border-r">Periode</th>
                <th className="p-3 border-r">Tanggal</th>
                <th className="p-3 border-r text-blue-600">Result</th>
                <th className="p-3 border-r text-center">Status</th>
                <th className="p-3 border-r text-center">Waktu Dibuat</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? currentItems.map((item, index) => {
                const d = item.created_at ? new Date(item.created_at) : null;
                return (
                  <tr key={item.id || index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-r text-center text-gray-400 font-medium">{indexOfFirstItem + index + 1}.</td>
                    <td className="p-3 border-r uppercase font-bold text-gray-800">{item.pasaran}</td>
                    <td className="p-3 border-r text-gray-600">{item.periode}</td>
                    <td className="p-3 border-r font-bold text-gray-700 uppercase">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-3 border-r font-black text-blue-600 text-base">{item.result}</td>
                    <td className="p-3 border-r text-center">
                      <span className="bg-[#d1f5ea] text-[#1a8a6d] px-2 py-1 rounded-full text-[9px] font-bold border border-[#a3e4d7] uppercase">
                        ✔ Sudah Dicairkan
                      </span>
                    </td>
                    <td className="p-3 border-r text-center">
                      {d ? (
                        <div className="flex flex-col items-center leading-tight">
                          <span className="text-gray-500 font-medium text-[10px] uppercase">
                            {d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                          </span>
                          <span className="text-blue-600 font-bold text-[12px]">
                            {d.getHours().toString().padStart(2, '0')}:{d.getMinutes().toString().padStart(2, '0')} 
                            <span className="text-[8px] text-gray-400 ml-0.5 font-bold">WIB</span>
                          </span>
                        </div>
                      ) : "-"}
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleDelete(item.id)} className="bg-[#dd4b39] text-white p-1.5 rounded hover:bg-[#d73925] transition shadow-sm active:scale-90">
                        <span className="text-[10px]">✖</span>
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-gray-400 italic border-b">
                    Belum ada data riwayat yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* --- PAGINATION --- */}
          <div className="p-4 flex flex-col md:flex-row justify-between items-center bg-gray-50 border-t gap-4">
            <div className="text-[12px] text-gray-500 font-medium">
              Menampilkan {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} baris
            </div>

            <div className="flex items-center bg-white border rounded shadow-sm overflow-hidden text-[12px] font-bold">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 hover:bg-gray-100 disabled:text-gray-300 text-blue-600 border-r transition-colors"
              >
                PREVIOUS
              </button>
              <span className="px-6 py-2 bg-white text-gray-800 border-r">
                HALAMAN {currentPage}
              </span>
              <button 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 hover:bg-gray-100 disabled:text-gray-300 text-blue-600 transition-colors"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}