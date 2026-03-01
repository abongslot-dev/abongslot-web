"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { 
  Search, RotateCcw, CheckCircle2, XCircle, 
  ChevronDown, Landmark, ArrowRightLeft, LayoutDashboard, 
  Users, Gift, Gamepad2, FileBarChart, Mail, FileDown, Key 
} from "lucide-react";


// KOMPONEN PEMBANTU SIDEBAR (Agar Responsive)
const SidebarItem = ({ icon, label, active, hasChild, isOpen, onClick, children }) => (
  <div className="flex flex-col">
    <div 
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer transition-all duration-200
        ${active ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-[#c2c7d0]'}
        justify-center md:justify-start`} 
    >
      <div className="flex-shrink-0 text-white">{icon}</div>
      {/* Label teks: Hilang di mobile (hidden), muncul di desktop (md:block) */}
      <span className="hidden md:block ml-3 font-medium flex-1 overflow-hidden whitespace-nowrap">{label}</span>
      {hasChild && (
        <ChevronDown 
          size={14} 
          className={`hidden md:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      )}
    </div>
    {/* Sub-menu: WAJIB hidden di mobile agar konten kanan tidak kepotong */}
    {isOpen && (
      <div className="hidden md:block bg-black/20 transition-all">
        {children}
      </div>
    )}
  </div>
); // <--- Tadi di kode Bos bagian ini hilang penutupnya

const SubMenuItem = ({ label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`py-2 pl-11 pr-4 cursor-pointer text-[12px] transition-colors truncate
      ${active ? 'text-blue-400 font-bold bg-white/5' : 'text-[#8a99af] hover:text-white hover:bg-white/5'}`}
  >
    {label}
  </div>
);


export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [openMenu, setOpenMenu] = useState("transaksi");
  const [stats, setStats] = useState(null);


useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard-summary');
      const result = await res.json();
      if (result.success) setStats(result);
    } catch (err) {
      console.error("Gagal load dashboard stats", err);
    }
  };
  fetchStats();
}, []);

// Fungsi pembantu format rupiah agar tidak pusing
const formatRupiah = (val) => Number(val || 0).toLocaleString('id-ID');




  const bukaEditMember = (userData) => {
    setUserTerpilih(userData);        // Simpan data user
    setActiveMenu("daftar-member");   // Pindah ke menu member
  };
  // --- STATE UNTUK OPER DATA USER ---
  const [userTerpilih, setUserTerpilih] = useState(null);




  // 1. Efek untuk ambil menu terakhir saat pertama kali load
  useEffect(() => {
    const savedMenu = localStorage.getItem("activeAdminMenu");
    if (savedMenu) {
      setActiveMenu(savedMenu);
    }
  }, []);

  // 2. Efek untuk simpan menu setiap kali activeMenu berubah
  useEffect(() => {
    localStorage.setItem("activeAdminMenu", activeMenu);
  }, [activeMenu]);

// 3. FUNGSI RENDER UTAMA (Sudah dirapikan, Boss!)
  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard": 
        return (
          <DashboardPage 
            setActiveMenu={setActiveMenu} 
            stats={stats} 
            formatRupiah={formatRupiah} 
          />
        );
      
      // --- MENU TRANSAKSI ---
      case "deposit-baru": 
        return (
          <DepositBaruPage 
            onUserClick={(data) => {
              setUserTerpilih(data); 
              setActiveMenu("daftar-member"); 
            }} 
          />
        );

      case "withdrawal-baru": 
        return (
          <WithdrawalBaruPage 
            setActiveMenu={setActiveMenu} 
            onUserClick={(data) => {
              setUserTerpilih(data);
              setActiveMenu("daftar-member");
            }} 
          />
        );

      case "Rangkuman-Deposit": return <RangkumanDepositPage />;
      case "Rangkuman-Withdrawal": return <RangkumanWithdrawalPage />;

      // --- MENU MEMBER ---
      case "daftar-member": 
        return (
          <MemberPage 
            initialUser={userTerpilih} 
            clearInitialUser={() => setUserTerpilih(null)} 
          />
        );

      // --- MENU TOGEL (INI YANG BARU, BOSS!) ---
      case "input-result": 
  return <InputResultPage setActiveMenu={setActiveMenu} />; // Pastikan fungsi InputResultPage yang saya buat tadi ada di file yang sama

      case "pasaran-togel":
        return <div className="p-8"><h2>Halaman Pasaran Togel (Coming Soon)</h2></div>;

      case "togel-result": 
        return <TogelResultPage />;  

      // --- MENU PROMO & LAPORAN ---
      case "daftar-promo": return <PromosiDepositPage />;
      case "promo-cashback": return <PromosiCashbackPage />;
      case "promo-referral": return <PromosiReferralPage />;
      case "Proses-Bonus": return <ProsesBonusPage />;
      case "Laporan-Bonus": return <LaporanBonusPage />;
      case "Laporan-Cashback": return <LaporanCashbackPage />;
      case "Laporan-Referral": return <LaporanReferralPage />;
      case "Laporan-Rolling": return <LaporanRollingPage />;

      // --- DEFAULT (KEMBALI KE DASHBOARD) ---
      default: 
        return (
          <DashboardPage 
            setActiveMenu={setActiveMenu} 
            stats={stats} 
            formatRupiah={formatRupiah} 
          />
        );
    }
  };





  return (
    // 1. CONTAINER UTAMA: h-screen (pas selayar) & overflow-hidden (scroll luar mati)
    <div className="flex h-screen w-full bg-[#1a0033] font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR: Tetap Diam di Kiri */}
      <aside className="w-16 md:w-64 bg-[#1a0033] text-[#c2c7d0] flex-shrink-0 flex flex-col shadow-xl h-screen sticky top-0 transition-all duration-300">
        <div className="p-4 bg-[#1e2225] border-b border-zinc-800 flex items-center justify-center md:justify-start gap-2">
  <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">A</div>
  {/* Tambahkan hidden md:block agar tulisan hilang di mobile */}
  <span className="hidden md:block font-bold text-white tracking-tight text-sm uppercase">ABONGSLOT</span>
</div>
        
  <nav className="mt-2 flex-1 overflow-y-auto custom-scrollbar">
  {/* DASHBOARD */}
  <SidebarItem 
    icon={<LayoutDashboard size={16}/>} 
    label="Dashboard" 
    active={activeMenu === "dashboard"} 
    onClick={() => setActiveMenu("dashboard")} 
  />

  {/* MENU TRANSAKSI */}
  <SidebarItem 
    icon={<ArrowRightLeft size={16}/>} 
    label="Transaksi" 
    hasChild 
    isOpen={openMenu === "transaksi"} 
    onClick={() => setOpenMenu(openMenu === "transaksi" ? "" : "transaksi")}
  >
    <SubMenuItem label="Deposit Baru" active={activeMenu === "deposit-baru"} onClick={() => setActiveMenu("deposit-baru")} />
    <SubMenuItem label="Withdrawal Baru" active={activeMenu === "withdrawal-baru"} onClick={() => setActiveMenu("withdrawal-baru")} />
    <SubMenuItem label="Rangkuman Deposit"active={activeMenu === "Rangkuman-Deposit"} onClick={() => setActiveMenu("Rangkuman-Deposit")} />
    <SubMenuItem 
  label="Rangkuman Withdrawal" 
  active={activeMenu === "Rangkuman-Withdrawal"} 
  onClick={() => setActiveMenu("Rangkuman-Withdrawal")} 
/>
    <SubMenuItem label="Penyesuaian Saldo" />
    <SubMenuItem label="Rangkuman Deposit Auto" />
  </SidebarItem>

  {/* MENU MEMBER - INI PERBAIKANNYA */}
  <SidebarItem 
    icon={<Users size={16}/>} 
    label="Member" 
    hasChild 
    isOpen={openMenu === "member"} 
    onClick={() => setOpenMenu(openMenu === "member" ? "" : "member")}
  >
    <SubMenuItem 
      label="Daftar Member" 
      active={activeMenu === "daftar-member"} 
      onClick={() => setActiveMenu("daftar-member")} 
    />
    <SubMenuItem label="Member Online" />
    <SubMenuItem label="Lihat IP" />
  </SidebarItem>

 {/* MENU PROMOSI */}
<SidebarItem 
  icon={<Gift size={16}/>} 
  label="Promosi" 
  hasChild 
  isOpen={openMenu === "promo"} 
  onClick={() => setOpenMenu(openMenu === "promo" ? "" : "promo")}
>
  <SubMenuItem label="Promosi Deposit" active={activeMenu === "daftar-promo"} onClick={() => setActiveMenu("daftar-promo")} />
  <SubMenuItem label="Promosi Cashback" active={activeMenu === "promo-cashback"} onClick={() => setActiveMenu("promo-cashback")}/>
  <SubMenuItem label="Promosi Referral" active={activeMenu === "promo-referral"} onClick={() => setActiveMenu("promo-referral")}/>
  <SubMenuItem label="Proses Bonus" active={activeMenu === "Proses-Bonus"} onClick={() => setActiveMenu("Proses-Bonus")}/>
  <SubMenuItem label="Laporan Bonus" active={activeMenu === "Laporan-Bonus"} onClick={() => setActiveMenu("Laporan-Bonus")}/>  
  <SubMenuItem label="Laporan Cashback" active={activeMenu === "Laporan-Cashback"} onClick={() => setActiveMenu("Laporan-Cashback")}/>  
  <SubMenuItem label="Laporan Referral " active={activeMenu === "Laporan-Referral "} onClick={() => setActiveMenu("Laporan-Referral")}/>  
  <SubMenuItem label="Laporan Rolling" active={activeMenu === "Laporan-Rolling"} onClick={() => setActiveMenu("Laporan-Rolling")}/>  
</SidebarItem>

{/* MENU TOGEL */}
<SidebarItem 
  icon={<Gamepad2 size={16}/>} 
  label="Togel" 
  hasChild 
  isOpen={openMenu === "togel"} 
  onClick={() => setOpenMenu(openMenu === "togel" ? "" : "togel")}
>
  {/* Menu Input Result (Yang barusan kita bikin fungsinya) */}
  <SubMenuItem 
    label="Input Result" 
    active={activeMenu === "input-result"}
    onClick={() => setActiveMenu("input-result")} 
  />

  {/* Menu Pasaran */}
  <SubMenuItem 
    label="Pasaran Togel" 
    active={activeMenu === "pasaran-togel"}
    onClick={() => setActiveMenu("pasaran-togel")} 
  />

  {/* Menu Lainnya (Bisa Boss buat halamannya nanti) */}
 <SubMenuItem 
  label="Togel Result" 
  active={activeMenu === "togel-result"}
  onClick={() => setActiveMenu("togel-result")} 
/>
  <SubMenuItem 
    label="Limit Bet" 
    active={activeMenu === "limit-bet"}
    onClick={() => setActiveMenu("limit-bet")} 
  />
</SidebarItem>

{/* MENU LAPORAN */}
<SidebarItem 
  icon={<FileBarChart size={16}/>} 
  label="Laporan" 
  hasChild 
  isOpen={openMenu === "laporan"} 
  onClick={() => setOpenMenu(openMenu === "laporan" ? "" : "laporan")}
>
  <SubMenuItem label="Laporan Transaksi" />
  <SubMenuItem label="Laporan Game" />
  <SubMenuItem label="Laporan Referral" />
  <SubMenuItem label="Win Lose Member" />
</SidebarItem>

{/* MENU PENGATURAN BANK */}
<SidebarItem 
  icon={<Landmark size={16}/>} 
  label="Pengaturan Bank" 
  hasChild 
  isOpen={openMenu === "bank"} 
  onClick={() => setOpenMenu(openMenu === "bank" ? "" : "bank")}
>
  <SubMenuItem label="Bank List" />
  <SubMenuItem label="Rekening Admin" />
  <SubMenuItem label="Setting WD/Depo" />
</SidebarItem>

{/* MENU PESAN */}
<SidebarItem 
  icon={<Mail size={16}/>} 
  label="Pesan" 
  hasChild 
  isOpen={openMenu === "pesan"} 
  onClick={() => setOpenMenu(openMenu === "pesan" ? "" : "pesan")}
>
  <SubMenuItem label="Pesan Masuk" />
  <SubMenuItem label="Kirim Pesan" />
</SidebarItem>
</nav>
        <div className="p-4 bg-[#1e2225] text-[11px] border-t border-zinc-800 flex flex-col items-center md:items-start">
  <p className="hidden md:block opacity-40 uppercase mb-1">Login sebagai:</p>
  <p className="hidden md:block text-white font-semibold italic">ABONGSLOT</p>
  <div className="md:hidden w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
</div>
      </aside>






      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* HEADER: Tinggi 12 (h-12) dengan Glassmorphism */}
        <header className="h-12 bg-[#1a0033] flex items-center justify-between px-4 shadow-lg z-10 border-b border-white/5">
          {/* Tombol Hamburger (Bisa Bos fungsikan nanti untuk toggle sidebar full) */}
          <button className="text-white opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-xl">☰</span>
          </button>

          <div className="flex items-center gap-3">
            {/* SALDO ADMIN: Pakai Font Mono agar angka tidak goyang saat berubah */}
            <div className="bg-[#1e2225] px-3 py-1.5 rounded-lg border border-yellow-500/30 flex items-center gap-2 shadow-inner">
              <span className="text-yellow-500 font-black text-[11px] font-mono tracking-tight">
                💰 {formatRupiah(256375664.04)}
              </span>
            </div>
            
            {/* IKON NOTIF/USER */}
            <div className="relative group">
              <Users size={18} className="text-white opacity-70 cursor-pointer hover:opacity-100 transition-all" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#1a0033]"></span>
            </div>
          </div>
        </header>

        {/* AREA HALAMAN UTAMA */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <div className="p-4 md:p-6 min-h-full flex flex-col">
            
            {/* TEMPAT RENDER KONTEN (Dashboard, Transaksi, dll) */}
            <div className="flex-1">
              {renderContent()}
            </div>

            {/* FOOTER: Bersih & Profesional */}
            <footer className="py-8 text-center border-t border-gray-200 mt-12">
              <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-bold">
                Copyright © ABONGSLOT 2026
              </p>
              <p className="text-[9px] text-gray-300 mt-1">
                Versi Sistem 2.0.4 - Secure Connection Enabled
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}



const FilterInput = ({ label, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-bold text-gray-600 uppercase">{label}</label>
    <input type="text" placeholder={placeholder} className="border rounded px-2 py-1.5 text-xs outline-none bg-white" />
  </div>
);

const FilterSelect = ({ label, placeholder = "Pilih" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-bold text-gray-600 uppercase">{label}</label>
    <div className="relative">
      <select className="w-full border rounded px-2 py-1.5 text-xs outline-none bg-white appearance-none">
        <option value="">{placeholder}</option>
        {label === "Ke Bank" && ["BCA", "BNI", "MANDIRI"].map(b => <option key={b}>{b}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const FilterDate = ({ label }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-bold text-gray-600 uppercase">{label}</label>
    <input type="date" className="border rounded px-2 py-1.5 text-xs outline-none bg-white" />
  </div>
);
// --- HALAMAN-HALAMAN ---

function DashboardPage({ setActiveMenu, stats, formatRupiah }) { // Tambahkan { setActiveMenu } di sini agar tombol berfungsi
  return (
    <div className="p-6">
      <h1 className="text-3xl font-normal mb-1">Dashboard</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">Dashboard</p>
      
      {/* 3 STAT CARDS UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-white">
        
        {/* KOTAK BIRU - DEPOSIT */}
        <div 
          onClick={() => setActiveMenu("deposit-baru")} 
          className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-center gap-2 mb-4 font-bold text-white"><FileBarChart size={16}/> Permintaan Deposit</div>
          <div className="bg-black/10 p-1.5 px-4 text-[10px] cursor-pointer hover:bg-black/20 inline-block text-white uppercase font-bold">Lihat →</div>
          <FileBarChart size={50} className="absolute -right-2 -top-1 opacity-20 text-white" />
        </div>

        {/* KOTAK KUNING - WITHDRAWAL */}
        <div 
          onClick={() => setActiveMenu("withdrawal-baru")} 
          className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-center gap-2 mb-4 font-bold text-white"><ArrowRightLeft size={16}/> Permintaan Withdrawal</div>
          <div className="bg-black/10 p-1.5 px-4 text-[10px] cursor-pointer hover:bg-black/20 inline-block text-white uppercase font-bold">Lihat →</div>
          <ArrowRightLeft size={50} className="absolute -right-2 -top-1 opacity-20 text-white" />
        </div>

        {/* KOTAK HIJAU - MEMBER */}
        <div 
          onClick={() => setActiveMenu("daftar-member")} 
          className="bg-[#1a0033] rounded shadow-sm relative overflow-hidden group p-4 border-b-4 border-black/10 cursor-pointer transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-center gap-2 mb-4 font-bold text-white"><Users size={16}/> Member</div>
          <div className="bg-black/10 p-1.5 px-4 text-[10px] cursor-pointer hover:bg-black/20 inline-block text-white uppercase font-bold">Lihat →</div>
          <Users size={50} className="absolute -right-2 -top-1 opacity-20 text-white" />
        </div>
      </div>

      {/* RINGKASAN TRANSAKSI (SUMMARY BOX) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryBox title="Total Deposit" icon="📄">
     <SummaryItem 
  label="Butuh Diproses" 
  count={stats?.deposit?.countPending ?? 0} 
  amount={formatRupiah(stats?.deposit?.totalPending ?? 0)} 
  color="text-yellow-600" 
  bg="bg-yellow-50" 
  icon="ⓘ" 
/>

<SummaryItem 
  label="Diterima" 
  count={stats?.deposit?.countSuccess ?? 0} 
  amount={formatRupiah(stats?.deposit?.totalSuccess ?? 0)} 
  color="text-emerald-600" 
  bg="bg-emerald-50" 
  icon="✔" 
  isHighlight/>
      
      <SummaryItem label="Ditolak" 
        count={stats?.deposit.countReject || 0} 
        amount={formatRupiah(stats?.deposit.totalReject)} 
        color="text-rose-600" bg="bg-rose-50" icon="✖" isHighlight />
  </SummaryBox>
  
  {/* TOTAL WITHDRAWAL */}
  <SummaryBox title="Total Withdrawal" icon="📄">
      <SummaryItem label="Butuh Diproses" 
        count={stats?.withdraw.countPending || 0} 
        amount={formatRupiah(stats?.withdraw.totalPending)} 
        color="text-yellow-600" bg="bg-yellow-50" icon="ⓘ" />
      
      <SummaryItem label="Diterima" 
        count={stats?.withdraw.countSuccess || 0} 
        amount={formatRupiah(stats?.withdraw.totalSuccess)} 
        color="text-emerald-600" bg="bg-emerald-50" icon="✔" isHighlight />
      
      <SummaryItem label="Ditolak" 
        count={stats?.withdraw.countReject || 0} 
        amount={formatRupiah(stats?.withdraw.totalReject)} 
        color="text-rose-600" bg="bg-rose-50" icon="✖" />
  </SummaryBox>

        <SummaryBox title="Total Penyesuaian Saldo" icon="📄">
            <SummaryItem label="Ditambah" count={0} amount="0" color="text-emerald-600" bg="bg-emerald-50" icon="✔" />
            <SummaryItem label="Dikurangi" count={0} amount="0" color="text-rose-600" bg="bg-rose-50" icon="✖" />
        </SummaryBox>
      </div>
    </div>
  );
}




























// --- DEPO ---//
function DepositBaruPage({ onUserClick }) {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Boss bisa ganti mau berapa data per halaman

  // Logika hitung data yang tampil
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = deposits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(deposits.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchDepo = async () => {
    try {
      const res = await fetch("/api/admin?target=deposits-pending");
      const data = await res.json();
      // Pastikan format data sesuai API kamu
      setDeposits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal ambil data Depo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepo();
  }, []);

const onAction = async (id, status, amount, user) => {
  // Samakan status: SUCCESS untuk terima, REJECTED untuk tolak
  const finalStatus = status === 'SUCCESS' ? 'SUCCESS' : 'REJECTED';
  const pesan = status === 'SUCCESS' ? 'MENERIMA' : 'MENOLAK';

  if (!confirm(`Yakin ingin ${pesan} Deposit dari ${user}?`)) return;

  try {
  const res = await fetch('/api/update-depo', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: id,            
        status: 'SUCCESS',  // <--- WAJIB PAKAI PETIK ' '
        username: user,
        nominal: amount
      }),
    });

    const result = await res.json();

    if (result.success) {
      alert(`✅ Berhasil di-${finalStatus}!`);
      // INI YANG BIKIN DATA MENGHILANG DARI LIST (Pindah ke Rangkuman)
      setDeposits((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("❌ Gagal Update: " + result.message);
    }
  } catch (err) {
    alert("❌ Error Server: " + err.message);
  }
};


// --- 2. LOGIKA CHECKBOX ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = deposits.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- 3. FUNGSI TERIMA/TOLAK SEMUA ---
  const handleBulkAction = async (status) => {
    const label = status === 'SUCCESS' ? 'TERIMA' : 'TOLAK';
    if (!confirm(`Yakin ingin ${label} ${selectedIds.length} deposit sekaligus?`)) return;

    try {
      // Loop untuk eksekusi API satu per satu atau buat API Bulk di backend
      const promises = selectedIds.map(async (id) => {
        const item = deposits.find(d => d.id === id);
        return fetch('/api/update-depo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: id,
            status: status,
            username: item.username,
            nominal: item.nominal
          }),
        });
      });

      await Promise.all(promises);
      alert(`✅ Berhasil ${label} massal!`);
      
      // Update tampilan: hapus data yang sudah diproses
      setDeposits((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]); // Kosongkan centang kembali
    } catch (err) {
      alert("❌ Gagal Bulk Action: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-normal mb-1">Deposit Baru</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">Dashboard <span className="text-gray-400 font-normal">/ Deposit Baru</span></p>
      <FilterBox />


      
      <div className="bg-white border rounded shadow-sm overflow-hidden mt-6">
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600"><FileBarChart size={16}/> Deposit Baru</div>
        <div className="overflow-x-auto">


          
<table className="w-full text-left text-[11px] border-collapse">
<thead>
  <tr className="border-b bg-white text-[11px] font-bold text-gray-800">
    <th className="p-3 border-r w-8 text-center"><input type="checkbox" /></th>
    <th className="p-2 border-r text-left">No.</th>
    <th className="p-2 border-r text-left">Username</th>
    <th className="p-2 border-r text-left">Promo</th>
    <th className="p-2 border-r text-left">Pembagian Bonus</th>
    <th className="p-2 border-r text-left">Total</th>
    <th className="p-2 border-r text-left">Potongan Admin</th>
    <th className="p-2 border-r text-left">Bonus</th>
    <th className="p-2 border-r text-left">Grand Total</th>
    <th className="p-2 border-r text-left">Nomor Seri</th>
    <th className="p-2 border-r text-left">Dari Bank</th>
    <th className="p-2 border-r text-left">Ke Bank</th>
    <th className="p-2 border-r text-left">Bukti</th>
    <th className="p-2 border-r text-left">Waktu Deposit</th>
    <th className="p-2 text-center">Action</th>
  </tr>
</thead>
            <tbody>
  {deposits.length > 0 ? (
  deposits.map((item, index) => (
    <DepositRow 
      key={item.id}
      item={item} // <--- TAMBAHKAN INI Bossku, agar semua data masuk
      no={index + 1}
      id={item.id}
      user={item.username}
      total={item.nominal}
      bank={item.bank}
      promo={item.promo}
      waktu={item.created_at}
      onAction={onAction}
      onUserClick={onUserClick}
      
    />
  ))
) : (
    <tr>
      <td colSpan="8" className="p-10 text-center text-gray-400 italic">
        Belum ada deposit baru masuk...
      </td>
    </tr>
  )}
</tbody>
          </table>

          {/* --- FOOTER PAGINATION --- */}
<div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between shadow-inner">
  <div className="text-[11px] text-gray-500 font-medium italic">
    Menampilkan <span className="text-blue-600 font-bold">{indexOfFirstItem + 1}</span> sampai <span className="text-blue-600 font-bold">{Math.min(indexOfLastItem, deposits.length)}</span> dari <span className="text-gray-800 font-bold">{deposits.length}</span> data
  </div>
  
  <div className="flex gap-1">
    {/* Tombol Back */}
    <button 
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-blue-600 hover:text-white'}`}
    >
      PREV
    </button>

    {/* Nomor Halaman */}
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i + 1}
        onClick={() => paginate(i + 1)}
        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white border text-gray-700 hover:bg-blue-100'}`}
      >
        {i + 1}
      </button>
    ))}

    {/* Tombol Next */}
    <button 
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-blue-600 hover:text-white'}`}
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




// TAMBAHKAN 'item' di dalam kurung kurawal ini Bossku
// 1. Pastikan semua props penting ini ada, terutama item dan onAction
function DepositRow({ item, no, onAction, onUserClick }) {
  
  // 1. Ambil 'nominal' dari item (sesuaikan dengan nama kolom di DB kamu)
  // 2. Kita kasih alias ': total_deposit' supaya kodingan di bawahnya tidak perlu diubah banyak
  const { 
    id, 
    user_id, 
    username, 
    nominal: total_deposit, // Mengambil 'nominal' tapi dinamai 'total_deposit'
    created_at, 
    promo_name 
  } = item;

  const potonganAdmin = 0;
  const bonus = 0;
  
  // Pastikan menggunakan Number() agar tidak terjadi error matematika
  const nominalBersih = Number(total_deposit || item.nominal || item.amount || 0);
  const grandTotal = nominalBersih - potonganAdmin + bonus;

  return (
    <tr className="border-b hover:bg-gray-50 transition-all text-gray-700">
      <td className="p-3 border-r text-center"><input type="checkbox" /></td>
      <td className="p-2 border-r text-center">{no}.</td>
      
      {/* Kolom User */}
      <td 
        className="p-2 border-r text-blue-600 font-bold cursor-pointer hover:underline hover:text-blue-800"
        onClick={() => onUserClick({ id: user_id, username: username })} 
      >
        {username}
      </td>

      <td className="p-2 border-r">{promo_name || ""}</td>
      <td className="p-2 border-r"></td>
      <td className="p-2 border-r font-bold text-right">
  {Number(item.nominal || 0).toLocaleString('id-ID')}
</td>

<td className="p-2 border-r text-right">0.00%</td>
<td className="p-2 border-r text-right">0,00</td>

{/* Kolom Grand Total - Sama dengan nominal kalau belum ada bonus */}
<td className="p-2 border-r font-bold text-right">
  {Number(item.nominal || 0).toLocaleString('id-ID')}
</td>
      <td className="p-2 border-r text-center"></td>

      {/* DATA PENGIRIM */}
      <td className="p-2 border-r text-[10px] leading-tight text-black bg-white">
        <div className="font-bold uppercase">
          {item.bank_pengirim} - {item.rek_pengirim}
        </div>
        <div className="text-gray-600 font-medium italic">
          a.n {item.nama_pengirim}
        </div>
      </td>

      {/* DATA TUJUAN */}
      <td className="p-2 border-r text-[10px] leading-tight text-blue-900 bg-blue-50/30">
        <div className="font-bold uppercase text-blue-800">
          {item.bank_tujuan} - {item.rek_tujuan}
        </div>
        <div className="text-gray-700 font-bold italic">
          a.n {item.nama_tujuan}
        </div>
      </td>

      <td className="p-2 border-r text-center"></td>
      <td className="p-2 border-r text-[10px] text-gray-500 whitespace-nowrap">
        {new Date(created_at).toLocaleString('en-GB', { 
          day: '2-digit', month: 'long', year: 'numeric', 
          hour: '2-digit', minute: '2-digit', second: '2-digit' 
        })}
      </td>

        {/* ACTION BUTTONS - SEKARANG PASTI BISA DIKLIK */}
  <td className="p-2 flex gap-1 justify-center">
  <button 
    type="button"
    onClick={(e) => {
      e.stopPropagation(); 
      // GANTI 'APPROVE' JADI 'SUCCESS' BIAR COCOK SAMA FUNGSI ONACTION
      onAction(item.id, 'SUCCESS', item.nominal, item.username); 
    }}
    className="bg-[#007bff] text-white px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold hover:bg-blue-700 transition-all uppercase cursor-pointer"
  >
    <CheckCircle2 size={12}/> TERIMA
  </button>

  {/* Tombol TOLAK - Pastikan kirim 'REJECT' */}
  <button 
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onAction(item.id, 'REJECT', item.nominal, item.username); 
    }}
    className="bg-[#dc3545] text-white px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold hover:bg-red-700 transition-all uppercase cursor-pointer"
  >
    <XCircle size={12}/> TOLAK
  </button>
  </td>
      </tr>
    );
  }





function RangkumanDepositPage() {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({ totalNominal: 0, totalBonus: 0, grandTotal: 0 });
  const [loading, setLoading] = useState(true);

// --- LOGIKA PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Boss bisa ubah mau tampil 10, 20, atau 50 data

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


const fetchRangkuman = async () => {
  try {
    setLoading(true);
    // 1. Tambahkan timestamp (?t=...) supaya browser tidak ambil data lama (cache)
    const res = await fetch(`/api/update-depo?t=${Date.now()}`); 
    if (!res.ok) throw new Error("Gagal mengambil data");

    const result = await res.json();
    console.log("Data dari API:", result); // <--- CEK DI KONSOL BROWSER (F12)

    // 2. Cara ambil data yang lebih aman
    const dataAsli = result.data ? result.data : (Array.isArray(result) ? result : []);
    
    setData(dataAsli);
    
    // 3. Hitung Total
    let totalNom = 0;
    let totalBns = 0;

dataAsli.forEach(curr => {
  let s = curr.status ? String(curr.status).toUpperCase().trim() : "";

  // Tambahkan 'APPROVE' di sini
  if (s === 'SUCCESS' || s === 'APPROVED' || s === 'SUKSES' || s === 'APPROVE') {
    totalNom += Number(curr.nominal || 0);
    totalBns += Number(curr.bonus || 0);
  }
});

    setTotals({
      totalNominal: totalNom,
      totalBonus: totalBns,
      grandTotal: totalNom + totalBns
    });

  } catch (err) {
    console.error("ERROR RANGKUMAN:", err.message);
    setData([]);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchRangkuman();
  }, []);

  return (
    <div className="p-6 text-gray-800">
      {/* --- JUDUL HALAMAN --- */}
      <h1 className="text-3xl font-normal mb-1 tracking-tight">Rangkuman Deposit</h1>
      <p className="text-[11px] text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Rangkuman Deposit</span>
      </p>

      {/* --- FILTER AREA --- */}
      <div className="bg-[#fcfcfc] border rounded shadow-sm overflow-hidden border-gray-200 mb-6">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[12px] font-bold text-gray-600 uppercase">
          <span className="text-[10px]">▼</span> Filter
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Username</label>
            <input type="text" placeholder="Cari Username..." className="w-full border p-2 text-xs rounded outline-none focus:border-blue-400 bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Ke Bank Tujuan</label>
            <select className="w-full border p-2 text-xs rounded outline-none bg-white font-medium text-gray-600">
              <option>Pilih Bank</option>
              <option>BCA</option>
              <option>BNI</option>
              <option>MANDIRI</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Mulai Tanggal</label>
            <input type="date" className="w-full border p-2 text-xs rounded outline-none bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Sampai Tanggal</label>
            <input type="date" className="w-full border p-2 text-xs rounded outline-none bg-white" />
          </div>
        </div>
        <div className="px-4 pb-4 flex gap-1">
          <button className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-cyan-600 shadow-sm"><RotateCcw size={12}/> Reset</button>
          <button className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-blue-700 shadow-sm"><Search size={12}/> Cari</button>
        </div>
      </div>

      {/* --- TABEL DATA & TOTAL --- */}
      <div className="bg-white border rounded shadow-sm overflow-hidden border-gray-200">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[12px] font-bold text-gray-600 uppercase">
          <FileBarChart size={14}/> List Rangkuman Deposit
        </div>
        
        <div className="p-4">
          {/* BOX TOTAL (Sesuai Gambar) */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-[#f8f9fa] p-4 rounded border border-gray-200 min-w-[200px] shadow-inner">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Deposit</p>
              <p className="text-xl font-black text-gray-800">Rp. {Number(totals.totalNominal).toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-[#f8f9fa] p-4 rounded border border-gray-200 min-w-[200px] shadow-inner">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Bonus</p>
              <p className="text-xl font-black text-gray-800">Rp. {Number(totals.totalBonus).toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div className="overflow-x-auto border rounded border-gray-100">
            <table className="w-full text-left text-[11px] border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b bg-[#f9fafb] text-gray-700 font-bold uppercase">
                  <th className="p-3 border-r text-center w-12">No.</th>
                  <th className="p-3 border-r">Username</th>
                  <th className="p-3 border-r text-right">Nominal</th>
                  <th className="p-3 border-r text-right">Bonus</th>
                  <th className="p-3 border-r text-right">Grand Total</th>
                  <th className="p-3 border-r">Dari Bank (User)</th>
                  <th className="p-3 border-r">Ke Bank (Admin)</th>
                  <th className="p-3 border-r text-center">Waktu</th>
                  <th className="p-3 border-r text-center">Status</th>
                  <th className="p-3 text-center">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="10" className="p-10 text-center italic">Memuat data...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="10" className="p-10 text-center text-gray-400 italic">Riwayat deposit tidak ditemukan.</td></tr>
                ) : (
                  currentItems.map((item, i) => (
  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
    <td className="p-3 border-r text-center text-gray-400 font-medium">{i + 1}.</td>
    <td className="p-3 border-r font-bold text-blue-600 uppercase italic underline cursor-pointer">
      {item.username}
    </td>
    
    {/* NOMINAL - Paksa jadi angka 0 kalau undefined */}
    <td className="p-3 border-r text-right font-bold text-gray-700">
      {Number(item.nominal || 0).toLocaleString('id-ID')}
    </td>

    {/* BONUS - Pakai fallback 0 */}
    <td className="p-3 border-r text-right text-green-600 font-bold">
      {Number(item.bonus || 0).toLocaleString('id-ID')}
    </td>

    {/* TOTAL - Pastikan dihitung ulang kalau API tidak mengirim total_deposit */}
    <td className="p-3 border-r text-right font-black text-blue-800">
      {Number(item.total_deposit || (Number(item.nominal || 0) + Number(item.bonus || 0))).toLocaleString('id-ID')}
    </td>

    {/* DARI BANK - Cek nama kolom alternatif */}
    <td className="p-3 border-r text-[10px] leading-tight text-gray-600 uppercase">
      <span className="font-bold">{item.bank_pengirim || item.bank || "-"}</span><br/>
      {item.rek_pengirim || item.nomor_rekening || "-"} <br/>
      <span className="italic font-normal normal-case text-gray-400 text-[9px]">
        a.n {item.nama_pengirim || item.nama_rekening || "-"}
      </span>
    </td>

    {/* KE BANK - Seringkali admin bank disimpan di kolom berbeda */}
    <td className="p-3 border-r text-[10px] leading-tight text-blue-900 uppercase">
      <span className="font-bold">{item.bank_tujuan || "BCA"}</span><br/>
      {item.rek_tujuan || "123456789"} <br/>
      <span className="italic font-normal normal-case text-gray-500 text-[9px]">
        a.n {item.nama_tujuan || "ADMIN"}
      </span>
    </td>

    <td className="p-3 border-r text-center text-gray-500 text-[10px]">
      {item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : "-"}
    </td>

<td className="p-3 border-r text-center">
  <div className="flex flex-col items-center gap-1">
    {(() => {
      // 1. Ambil status asli dari DB
      let s = item.status ? String(item.status).toUpperCase().trim() : "";
      
      // 2. JURUS SAKTI: Kalau status KOSONG tapi jam proses ADA, paksa jadi SUCCESS
      if (s === "" && item.processed_at) {
        s = "SUCCESS";
      }

      // 3. Tentukan kategori warna
     const isTerima = ['SUCCESS', 'APPROVED', 'SUKSES', 'APPROVE'].includes(s);
const isTolak = ['REJECT', 'REJECTED', 'TOLAK'].includes(s);

      return (
        <>
          <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-bold text-white uppercase shadow-sm inline-block min-w-[65px] ${
            isTerima ? 'bg-[#28a745]' : isTolak ? 'bg-[#dc3545]' : 'bg-[#ffc107] text-black'
          }`}>
            {isTerima ? '✓ Terima' : isTolak ? '✕ Tolak' : 'PENDING'}
          </span>
          
          <span className="text-[9px] text-gray-500 font-normal italic leading-none mt-1">
            {item.processed_at ? (
              new Date(item.processed_at).toLocaleTimeString('id-ID').replace(/\./g, ':')
            ) : "-"}
          </span>
        </>
      );
    })()}
  </div>
</td>
<td className="p-3 text-center font-bold text-gray-400 uppercase text-[9px]">
        {item.admin_name || 'abongslot'}
      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

{/* --- FOOTER PAGINATION --- */}
{/* --- FOOTER PAGINATION --- */}
<div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between shadow-inner">
  <div className="text-[11px] text-gray-500 font-medium italic">
    Menampilkan <span className="text-blue-600 font-bold">{indexOfFirstItem + 1}</span> sampai <span className="text-blue-600 font-bold">{Math.min(indexOfLastItem, data.length)}</span> dari <span className="text-gray-800 font-bold">{data.length}</span> data
  </div>
  
  <div className="flex gap-1">
    {/* Tombol Back */}
    <button 
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-blue-600 hover:text-white'}`}
    >
      PREV
    </button>

    {/* Nomor Halaman */}
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i + 1}
        onClick={() => paginate(i + 1)}
        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white border text-gray-700 hover:bg-blue-100'}`}
      >
        {i + 1}
      </button>
    ))}

    {/* Tombol Next */}
    <button 
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-blue-600 hover:text-white'}`}
    >
      NEXT
    </button>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}



























// --- WD ---

function WithdrawalBaruPage({ setActiveMenu, onUserClick }){
  const [dataWD, setDataWD] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWD = async () => {
    try {
      const res = await fetch("/api/admin/withdrawals");
      const data = await res.json();
      if (data.success) {
        setDataWD(data.requests);
      }
    } catch (error) {
      console.error("Gagal ambil data WD:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWD();
  }, []);

  // FUNGSI INI HARUS BISA DIAKSES OLEH TOMBOL
const onAction = async (id, status) => {
  if (!confirm(`Yakin ingin ${status === 'SUCCESS' ? 'Menerima' : 'Menolak'} WD ini?`)) return;

  try {
    const res = await fetch('/api/update-wd', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });

    const result = await res.json();

    if (result.success) {
      alert(`✅ Berhasil! Data telah diproses.`);
      
      // --- INI KUNCINYA AGAR BARIS HILANG TAPI TETAP DI HALAMAN INI ---
      // Kita filter dataWD, buang data yang ID-nya barusan kita klik
      setDataWD((prevData) => prevData.filter((item) => item.id !== id));
      
      // JANGAN panggil setActiveMenu kalau Bos mau tetap di sini
      // setActiveMenu("Rangkuman-Withdrawal"); 
      
    } else {
      alert("❌ Gagal: " + result.message);
    }
  } catch (err) {
    alert("❌ Error: " + err.message); 
  }
};
  return (
   <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-normal mb-1">Withdrawal Baru</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium cursor-pointer">
        Dashboard <span className="text-gray-400 font-normal">/ Withdrawal Baru</span>
      </p>

      {/* FILTER AREA */}
      <div className="bg-[#fcfcfc] border rounded shadow-sm overflow-hidden border-gray-200 mb-6">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <span className="text-[10px]">▼</span> Filter
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FilterSelect label="Ke Bank" />
        </div>
        <div className="px-4 pb-4 flex gap-1">
          <button className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-cyan-600">
            <RotateCcw size={12}/> Reset
          </button>
          <button className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-blue-700">
            <Search size={12}/> Cari
          </button>
        </div>
      </div>

      {/* DATA AREA */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <Landmark size={14}/> Antrean Withdrawal
        </div>
        
        <div className="p-4">
          <div className="overflow-x-auto border rounded">
            {/* Pakai min-w-[1000px] supaya kolom tidak kepotong di layar kecil */}
            <table className="w-full text-left text-[11px] border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-800 font-bold uppercase">
                  <th className="p-2 border-r w-8 text-center"><input type="checkbox" /></th>
                  <th className="p-2 border-r text-center w-10">No.</th>
                  <th className="p-2 border-r">Username</th>
                  <th className="p-2 border-r text-right">Total</th>
                  <th className="p-2 border-r">Bank</th>
                  <th className="p-2 border-r">Waktu</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
            <tbody>
                {dataWD.length > 0 ? (
                  dataWD.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-all">
                      <td className="p-3 border-r text-center"><input type="checkbox"/></td>
                      <td className="p-3 border-r text-center text-gray-400">{index + 1}.</td>
           <td 
  className="p-3 border-r text-blue-600 font-bold cursor-pointer hover:underline hover:text-blue-800 uppercase italic"
  onClick={() => onUserClick({ id: item.id, username: item.username })} 
>
  {item.username}
</td>
                      <td className="p-3 border-r text-right font-black text-gray-800 tracking-tighter">
                        Rp {Number(item.nominal).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 border-r leading-tight">
                        <div className="font-bold uppercase text-gray-700">{item.bank}</div>
                        <div className="text-blue-500 font-mono text-[10px] bg-blue-50 px-1 rounded inline-block">
                          {item.nomor_rekening}
                        </div>
                        <div className="text-gray-900 font-bold uppercase text-[11px] block mt-0.5">
    A.N: {item.nama_rekening || "-"}
  </div>
                      </td>
                      <td className="p-3 border-r text-center text-gray-400">
                        {new Date(item.created_at).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 flex gap-1 justify-center">
                        {/* TOMBOL LANGSUNG PANGGIL onAction DI SINI */}
                        <button 
                          onClick={() => onAction(item.id, 'SUCCESS')}
                          className="bg-[#28a745] text-white px-3 py-1.5 rounded-[3px] text-[10px] font-bold hover:bg-green-700 uppercase transition-all"
                        >
                          Terima
                        </button>
                        <button 
                          onClick={() => onAction(item.id, 'REJECT')}
                          className="bg-[#dc3545] text-white px-3 py-1.5 rounded-[3px] text-[10px] font-bold hover:bg-red-700 uppercase transition-all"
                        >
                          Tolak
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-400 italic font-medium">
                      {loading ? "Sedang memuat antrean..." : "Antrean kosong, belum ada WD baru."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
// --- KOMPONEN ROW (Action Terima & Tolak) ---//

// 1. Tambahkan 'nama' ke dalam parameter fungsi
function WithdrawalRow({ no, user, total, bank, rekening, nama, waktu, id, onAction }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-all">
      <td className="p-2 border-r text-center"><input type="checkbox" /></td>
      <td className="p-2 border-r text-center text-gray-500">{no}</td>
         <td 
  className="p-3 border-r text-blue-600 font-bold cursor-pointer hover:underline hover:text-blue-800 uppercase italic"
  onClick={() => onUserClick({ id: item.id, username: item.username })} 
>
  {item.username}
</td>
      <td className="p-2 border-r text-right font-mono font-bold text-red-600">Rp {total}</td>
      <td className="p-2 border-r">
        <div className="font-bold text-gray-800 uppercase">{bank}</div>
        <div className="text-blue-600 font-mono text-[12px] bg-blue-50 px-1 rounded inline-block mt-1">
          {rekening}
        </div>
        {/* 2. TAMPILKAN NAMA DI SINI */}
        <div className="text-gray-600 text-[11px] font-bold block uppercase mt-1">
          A.N: {nama || "-"} 
        </div>
      </td>
      <td className="p-2 border-r text-gray-400 text-[10px]">
        {new Date(waktu).toLocaleString('id-ID')}
      </td>
      <td className="p-2 flex gap-1 justify-center">
        <button 
          onClick={() => onAction(id, 'SUCCESS')}
          className="bg-[#28a745] text-white px-2 py-1 rounded-[3px] text-[9px] font-bold hover:bg-green-700 uppercase"
        >
          Terima
        </button>
        <button 
          onClick={() => onAction(id, 'REJECT')}
          className="bg-[#dc3545] text-white px-2 py-1 rounded-[3px] text-[9px] font-bold hover:bg-red-700 uppercase"
        >
          Tolak
        </button>
      </td>
    </tr>
  );
}


function RangkumanWithdrawalPage() {
  const [data, setData] = useState([]);
  const [totalWD, setTotalWD] = useState(0);
  const [loading, setLoading] = useState(true);


  // --- LOGIKA PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem); // Ini yang dipake di tabel
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 1. Ambil Data dari API khusus Rangkuman (Status != PENDING)
  const fetchRangkuman = async () => {
    try {
      const res = await fetch('/api/update-wd');
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setTotalWD(result.totalAll);
      }
    } catch (err) {
      console.error("Gagal load data rangkuman", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRangkuman();
  }, []);

  return (
    <div className="p-6 text-gray-800">
      {/* --- JUDUL HALAMAN --- */}
      <h1 className="text-3xl font-normal mb-1 tracking-tight">Rangkuman Withdrawal</h1>
      <p className="text-[11px] text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Rangkuman Withdrawal</span>
      </p>

      {/* --- FILTER AREA (Gaya Dashboard Admin) --- */}
      <div className="bg-[#fcfcfc] border rounded shadow-sm overflow-hidden border-gray-200 mb-6">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[12px] font-bold text-gray-600 uppercase">
          <span className="text-[10px]">▼</span> Filter
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Username</label>
            <input type="text" placeholder="Cari Username..." className="w-full border p-2 text-xs rounded outline-none focus:border-blue-400 bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Ke Bank</label>
            <select className="w-full border p-2 text-xs rounded outline-none bg-white">
              <option>Ke Bank (Pilih)</option>
              <option>BCA</option>
              <option>BNI</option>
              <option>MANDIRI</option>
              <option>DANA/OVO</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Mulai Tanggal</label>
            <input type="date" className="w-full border p-2 text-xs rounded outline-none bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-bold mb-1 block uppercase text-gray-400">Sampai Tanggal</label>
            <input type="date" className="w-full border p-2 text-xs rounded outline-none bg-white" />
          </div>
        </div>
        <div className="px-4 pb-4 flex gap-1">
          <button className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-cyan-600">
            <RotateCcw size={12}/> Reset
          </button>
          <button className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-blue-700">
            <Search size={12}/> Cari
          </button>
        </div>
      </div>

      {/* --- TABEL DATA & TOTAL SALDO --- */}
      <div className="bg-white border rounded shadow-sm overflow-hidden border-gray-200">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[12px] font-bold text-gray-600 uppercase">
          <FileBarChart size={14}/> Rangkuman Withdrawal
        </div>
        
        <div className="p-4">
          {/* BOX TOTAL WD (Warna Abu-abu bersih sesuai gambar) */}
          <div className="bg-[#f8f9fa] p-4 rounded border border-gray-200 w-full md:w-64 mb-6 shadow-inner">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Withdrawal</p>
            <p className="text-2xl font-black text-gray-800">
              Rp. {Number(totalWD).toLocaleString('id-ID')}
            </p>
          </div>

          <div className="overflow-x-auto border rounded border-gray-100">
            <table className="w-full text-left text-[11px] border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b bg-[#f9fafb] text-gray-700 font-bold uppercase">
                  <th className="p-3 border-r text-center w-12">No.</th>
                  <th className="p-3 border-r">Username</th>
                  <th className="p-3 border-r text-right">Total</th>
                  <th className="p-3 border-r">Ke Bank</th>
                  <th className="p-3 border-r text-center">Waktu Withdrawal</th>
                  <th className="p-3 border-r text-center">Status</th>
                  <th className="p-3 text-center">Admin Respon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="7" className="p-10 text-center italic">Mengambil data dari server...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="7" className="p-10 text-center text-gray-400 italic">Data riwayat masih kosong.</td></tr>
                ) : (
                  currentItems.map((item, i) => (
  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
    <td className="p-3 border-r text-center font-medium text-gray-400">{i + 1}.</td>
    <td className="p-3 border-r font-bold text-blue-600 underline cursor-pointer hover:text-blue-800 uppercase italic">
      {item.username}
    </td>
    <td className="p-3 border-r text-right font-black text-gray-800 tracking-tight">
      {Number(item.nominal).toLocaleString('id-ID')}
    </td>
    <td className="p-3 border-r leading-tight font-medium uppercase text-gray-600">
      {item.bank} - {item.nomor_rekening} <br/>
      <span className="text-[9px] text-gray-400 font-normal normal-case italic">a.n {item.nama_rekening}</span>
    </td>
    <td className="p-3 border-r text-center text-gray-500 text-[10px]">
      {new Date(item.created_at).toLocaleString('id-ID')}
    </td>
    
    {/* KOLOM STATUS DENGAN JAM TERIMA */}
    <td className="p-3 border-r text-center">
      <div className="flex flex-col items-center gap-1">
        <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-bold text-white uppercase shadow-sm ${
          item.status === 'SUCCESS' ? 'bg-[#28a745]' : 'bg-[#dc3545]'
        }`}>
          {item.status === 'SUCCESS' ? '✓ Terima' : '✕ Tolak'}
        </span>
        
        {/* Menampilkan Jam Proses (processed_at) */}
        {item.processed_at ? (
          <span className="text-[9px] text-gray-400 font-normal italic">
            {new Date(item.processed_at).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        ) : (
          <span className="text-[9px] text-gray-300 italic">-</span>
        )}
      </div>
    </td>

    <td className="p-3 text-center font-bold text-gray-400 uppercase text-[9px]">
      Admin_System
    </td>
  </tr>
                  ))
                )}
              </tbody>
            </table>

{/* --- FOOTER PAGINATION --- */}
    <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between shadow-inner">
      <div className="text-[11px] text-gray-500 font-medium italic">
        Menampilkan <span className="text-blue-600 font-bold">{indexOfFirstItem + 1}</span> sampai <span className="text-blue-600 font-bold">{Math.min(indexOfLastItem, data.length)}</span> dari <span className="text-gray-800 font-bold">{data.length}</span> data
      </div>
      
      <div className="flex gap-1">
        <button 
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-blue-600 hover:text-white'}`}
        >
          PREV
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white border text-gray-700 hover:bg-blue-100'}`}
          >
            {i + 1}
          </button>
        ))}

        <button 
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-blue-600 hover:text-white'}`}
        >
          NEXT
        </button>
      </div>
    </div>


          </div>
        </div>
      </div>
    </div>
  );
}











// --- KOMPONEN KECIL ---

function FilterBox() {
  return (
    <div className="bg-[#fcfcfc] border rounded shadow-sm overflow-hidden border-gray-200">
      <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600">
        <span className="text-[10px]">▼</span> Filter
      </div>
      <div className="p-4">
        <label className="text-[11px] font-bold text-gray-600 block mb-1">Ke Bank</label>
        <select className="border rounded px-2 py-1.5 text-xs outline-none min-w-[180px] bg-white text-gray-700">
          <option>Pilih</option>
        </select>
        <div className="flex gap-1 mt-4">
          <button className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:brightness-95 transition-all shadow-sm"><RotateCcw size={12}/> Reset</button>
          <button className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:brightness-95 transition-all shadow-sm"><Search size={12}/> Cari</button>
        </div>
      </div>
    </div>
  );
}

function SummaryBox({ title, icon, children }) {
  return (
    <div className="bg-[#f9f9f9] border border-gray-200 rounded shadow-sm overflow-hidden">
      <div className="p-2 border-b bg-gray-50 flex items-center gap-2 font-bold text-gray-600 text-[12px] uppercase">
        <span className="text-[14px]">{icon}</span> {title}
      </div>
      <div className="p-3 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function SummaryItem({ label, count, amount, color, bg, icon, isHighlight }) {
  return (
    <div className="bg-white border border-gray-100 rounded overflow-hidden">
      <div className={`p-1.5 px-3 flex items-center justify-between text-[11px] font-bold ${color} ${bg} border-b border-gray-50`}>
        <div className="flex items-center gap-2 italic">
          <span className="w-4 h-4 rounded-full flex items-center justify-center border border-current opacity-70">{icon}</span>
          {label} <span className={isHighlight ? "text-red-600 border border-red-200 px-1 bg-white" : ""}>[{count}]</span>
        </div>
      </div>
      <div className={`p-2 px-3 font-mono font-bold text-sm text-gray-800 ${isHighlight && amount !== "0" ? "border-2 border-red-500" : ""}`}>
        Rp. {amount}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, hasChild, children, isOpen, onClick, active }) {
  return (
    <div className="flex flex-col">
      <div onClick={onClick} className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all border-l-4 ${active ? 'bg-zinc-800 text-white border-blue-500' : 'hover:bg-zinc-800 text-gray-400 hover:text-white border-transparent'}`}>
        <div className="flex items-center gap-2.5">{icon}<span className="font-medium">{label}</span></div>
        {hasChild && <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />}
      </div>
      {hasChild && isOpen && <div className="bg-[#1e2225] py-1 border-b border-zinc-800/50">{children}</div>}
    </div>
  );
}

function SubMenuItem({ label, onClick, active }) {
  return (
    <div onClick={onClick} className={`pl-10 py-2 text-[12px] cursor-pointer flex items-center gap-2 transition-all ${active ? 'text-white font-bold bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <span className="opacity-40 text-[10px]">›</span> {label}
    </div>
  );
}




function MemberRow({ idMember, no, user, rek, upline, ref, saldo, total, onEditPassword }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-2 border-r text-center">{no}</td>
      
      {/* USERNAME BISA DIKLIK KE HALAMAN DETAIL */}
      <td className="p-2 border-r text-blue-600 font-medium cursor-pointer hover:underline">
        <Link href={`/admin/member/${idMember}`}>
          {user}
        </Link>
      </td>
      
      <td className="p-2 border-r text-[10px] uppercase">{rek}</td>
      <td className="p-2 border-r text-gray-500 italic">{upline || ""}</td>
      <td className="p-2 border-r">{ref}</td>
      <td className="p-2 border-r text-center">
        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 w-fit mx-auto border border-emerald-200">
          <CheckCircle2 size={10}/> Aktif
        </span>
      </td>
      <td className="p-2 border-r text-right font-mono">{saldo}</td>
      <td className="p-2 border-r text-right font-mono">{total}</td>
      <td className="p-2 flex gap-1 justify-center">
        {/* TOMBOL GANTI PASSWORD */}
        <button 
          onClick={onEditPassword} 
          className="bg-[#ffc107] text-black p-1 rounded shadow-sm hover:brightness-90"
        >
          <Key size={14} />
        </button>
        <button className="bg-[#28a745] text-white p-1 rounded shadow-sm hover:brightness-90">
          <Landmark size={14}/>
        </button>
      </td>
    </tr>
  );
}







function MemberPage({ initialUser, clearInitialUser }) {
  // --- 1. STATE UTAMA (WAJIB LENGKAP) ---
  const [view, setView] = useState("table"); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Member Data"); // <--- INI BIAR GAK ERROR PAS KLIK USER

  // State untuk Modal Password
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // --- FUNGSI UPDATE PASSWORD ---
  const handleUpdatePassword = async () => {
    if (!newPassword) return alert("Password tidak boleh kosong!");
    alert("Password berhasil diperbarui!");
    setNewPassword("");
    setIsModalOpen(false);
  };

  // --- JURUS SAKTI PENGALIH ---
  useEffect(() => {
    if (initialUser) {
      setSelectedUser(initialUser);
      setView("edit");
      if (clearInitialUser) clearInitialUser();
    }
  }, [initialUser, clearInitialUser]);

  // --- AMBIL DATA ---
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin?target=members'); 
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  // --- 1. PASTIKAN STATE INI ADA DI PALING ATAS FUNGSI MEMBERPAGE ---
  // const [activeTab, setActiveTab] = useState("Member Data");

  if (view === "edit" && selectedUser) {
    return (
      <div className="p-6 text-gray-800 bg-[#f4f6f9] min-h-screen font-sans">
        {/* Breadcrumb & Judul */}
        <h1 className="text-[26px] font-normal mb-1">Ubah Member</h1>
        <div className="text-[11px] text-blue-500 mb-6 font-medium flex gap-1">
          Dashboard / Member / <span className="text-gray-400 font-normal">Ubah Member</span>
        </div>

        <div className="bg-white border rounded shadow-sm overflow-hidden border-gray-300">
          {/* Header Panel */}
          <div className="bg-gray-50 px-4 py-2 border-b font-bold text-gray-600 text-[13px] flex items-center gap-2">
            <span className="text-sm">田</span> Ubah Member
          </div>

          {/* Tab Menu - Persis Gambar */}
          <div className="flex bg-gray-50 border-b text-[11px] font-bold uppercase text-gray-500 overflow-x-auto">
            {["Member Data", "Deposit", "Deposit Auto", "Withdrawal", "Penyesuaian Saldo", "Laporan Transaksi", "Laporan Permainan", "Referral"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-3 px-5 border-r border-gray-200 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-white text-blue-600 border-t-2 border-t-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Konten Utama: Kiri (Form) & Kanan (Note) */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-10">
            {/* SISI KIRI: FORM DATA */}
            <div className="space-y-4">
              {/* Username - Abu-abu */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Username</label>
                <input type="text" value={selectedUser?.username || ""} disabled className="w-full border border-gray-300 rounded p-2 bg-[#eceff1] text-[12px] font-medium outline-none" />
              </div>

              {/* Group - Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nama Group</label>
                <select className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white">
                  <option>Member Baru</option>
                  <option>Regular</option>
                </select>
              </div>

              {/* Baris Bank - Rekening */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nama Bank</label>
                  <select className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white">
                    <option>{selectedUser?.nama_bank || "DANA"}</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Atas Nama</label>
                  <input type="text" defaultValue={selectedUser?.nama_rekening || ""} className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Nomor Rekening</label>
                  <input type="text" defaultValue={selectedUser?.nomor_rekening || ""} className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white" />
                </div>
              </div>

              {/* Status - Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Status</label>
                <select className="w-full border border-gray-300 rounded p-2 text-[12px] outline-none bg-white font-bold">
                  <option>Aktif</option>
                  <option className="text-red-500">Suspended</option>
                </select>
              </div>

              {/* Info Detail - Background Abu-abu panjang persis gambar */}
              <div className="space-y-4">
                {[
                  { label: "Waktu Register", value: "21 February 2026, 08:24:45" },
                  { label: "Saldo", value: `Rp. ${new Intl.NumberFormat('id-ID').format(selectedUser?.saldo || 0)}` },
                  { label: "Total Deposit", value: "Rp. 0" },
                  { label: "Total Withdrawal", value: "Rp. 0" },
                  { label: "Total TO Sekarang Saat Deposit Pengambilan Promo", value: "Rp. 0" },
                  { label: "IP", value: "2400:9800:680:2a7e:1" },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{item.label}</label>
                    <div className="p-2 bg-[#eceff1] border border-gray-300 rounded text-[12px] font-bold text-gray-800">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-2 pt-2">
                <button className="bg-[#007bff] text-white px-4 py-2 rounded text-[12px] font-bold shadow-sm uppercase hover:bg-blue-700 transition-all">Simpan</button>
                <button 
                  onClick={() => setView("table")} 
                  className="bg-[#ffc107] text-black px-4 py-2 rounded text-[12px] font-bold shadow-sm uppercase hover:bg-yellow-500 transition-all"
                >
                  Kembali
                </button>
              </div>
            </div>

            {/* SISI KANAN: NOTE AREA */}
            <div className="mt-4 lg:mt-0">
              <label className="text-[11px] font-normal text-gray-700 block mb-1">Note</label>
              <textarea 
                className="w-full border border-gray-300 rounded p-3 h-[300px] lg:h-[400px] text-[12px] outline-none focus:border-blue-400 shadow-inner resize-none"
                placeholder=""
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. TAMPILAN DEFAULT (TABEL MEMBER) ---
  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-normal mb-1">Member</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">Dashboard <span className="text-gray-400 font-normal">/ Member</span></p>
      
      {/* FILTER (Sama seperti kodemu sebelumnya) */}
      <div className="bg-[#fcfcfc] border rounded shadow-sm overflow-hidden border-gray-200 mb-6 text-[11px]">
        <div className="bg-gray-100 px-4 py-2 border-b font-bold text-gray-600">▼ Filter</div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
           <FilterInput label="Username" placeholder="Username" />
           <FilterSelect label="Status" />
           {/* ... tambahkan filter lainnya ... */}
        </div>
        <div className="px-4 pb-4 flex gap-1">
          <button className="bg-[#00c0ef] text-white px-3 py-1.5 rounded font-bold shadow-sm">Reset</button>
          <button className="bg-[#007bff] text-white px-3 py-1.5 rounded font-bold shadow-sm">Cari</button>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
<thead>
  <tr className="border-b bg-gray-50 text-gray-800 font-bold uppercase tracking-tighter text-[11px]">
    <th className="p-2 border-r text-center w-10">No.</th>
    <th className="p-2 border-r">Username</th>
    <th className="p-2 border-r text-center"> Rekening</th>
    <th className="p-2 border-r text-right">Saldo</th>
    <th className="p-2 border-r text-center">Status</th>
    <th className="p-2 text-center text-center">Action</th>
  </tr>
</thead>
         <tbody>
  {loading ? (
    <tr><td colSpan="6" className="p-4 text-center">Loading Data...</td></tr>
  ) : members.map((m, index) => (
    <tr key={m.id} className="border-b hover:bg-gray-50 text-black">
      {/* 1. Nomor */}
      <td className="p-2 border-r text-center">{index + 1}.</td>
      
      {/* 2. Username */}
      <td 
        className="p-2 border-r text-blue-600 font-bold cursor-pointer hover:underline"
        onClick={() => {
            setSelectedUser(m);
            setView("edit");
        }}
      >
        {m.username}
      </td>

      {/* 3. Kolom Gabungan: BANK - NOREK - NAMA (GABUNG DISINI) */}
      <td className="p-2 border-r text-[10px] font-bold uppercase">
        <div className="flex gap-1.5 items-center">
          <span className="text-blue-700">{m.nama_bank || "-"}</span>
          <span className="text-gray-400">-</span>
          <span className="font-mono tracking-tighter">{m.nomor_rekening || "-"}</span>
          <span className="text-gray-400">-</span>
          <span className="text-gray-600 italic">{m.nama_rekening || "-"}</span>
        </div>
      </td>

      {/* 4. Kolom Saldo */}
      <td className="p-2 border-r text-right font-mono font-bold text-emerald-600">
        {new Intl.NumberFormat('id-ID').format(m.saldo)}
      </td>

      {/* 5. Kolom Status */}
      <td className="p-2 border-r text-center">
        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-200">
          Aktif
        </span>
      </td>

      {/* 6. Kolom Action */}
      <td className="p-2 flex gap-1 justify-center">
        <button 
          onClick={() => { setSelectedUser(m); setIsModalOpen(true); }}
          className="bg-[#ffc107] p-1.5 rounded shadow-sm"
          title="Ganti Password"
        >
          <Key size={14} />
        </button>
        <button className="bg-[#28a745] text-white p-1.5 rounded shadow-sm">
          <Landmark size={14}/>
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>

{/* --- MODAL HARUS DI DALAM SINI (Sebelum penutup div utama MemberPage) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-gray-800 text-white p-4 font-bold flex justify-between">
              <span>Ganti Password: {selectedUser?.username}</span>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="p-6">
              <label className="text-xs font-bold text-gray-600 uppercase">Password Baru</label>
              <input 
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded mt-1 p-2 outline-none focus:border-blue-500 text-sm"
                placeholder="Masukkan password baru..."
                autoFocus
              />
              <div className="mt-6 flex gap-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded text-xs"
                >
                  BATAL
                </button>
                <button 
                  onClick={handleUpdatePassword}
                  className="flex-1 py-2 bg-blue-600 text-white font-bold rounded text-xs shadow-lg hover:bg-blue-700"
                >
                  SIMPAN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





// --- halaman promo ---
function PromosiDepositPage() {
  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-normal mb-1">Promosi Deposit</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Promosi Deposit</span>
      </p>

      {/* TABEL PROMOSI DEPOSIT */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600">
          <FileBarChart size={16}/> Promosi Deposit
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b bg-white text-gray-800 font-bold uppercase">
                <th className="p-2 border-r text-center w-10">No.</th>
                <th className="p-2 border-r">Nama</th>
                <th className="p-2 border-r">Tipe Durasi</th>
                <th className="p-2 border-r">Pembagian Bonus</th>
                <th className="p-2 border-r">Tipe Nilai</th>
                <th className="p-2 border-r">Nilai</th>
                <th className="p-2 border-r">Bonus Maksimal</th>
                <th className="p-2 border-r">Perkalian Total TO</th>
                <th className="p-2 border-r text-center">Status</th>
                <th className="p-2 border-r text-center">Urutan</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Data dari gambar Bos */}
              <PromoRow no="1." nama="BONUS CUAN PAGI & MALAM" durasi="Setiap hari" bagi="Otomatis diawal" tipe="Persen" nilai="50" max="100.000" to="X5" status={false} urutan="7" />
              <PromoRow no="2." nama="BONUS CLAIM KEKALAHAN 100%" durasi="Sekali" bagi="Otomatis diakhir" tipe="Persen" nilai="100" max="15.000" to="X5" status={true} urutan="6" />
              <PromoRow no="3." nama="BONUS SLOT 100%" durasi="Sekali" bagi="Otomatis diawal" tipe="Persen" nilai="100" max="25.000" to="X8" status={false} urutan="5" />
              <PromoRow no="4." nama="BONUS NEW MEMBER 20%" durasi="Sekali" bagi="Otomatis diawal" tipe="Persen" nilai="20" max="15.000" to="X2" status={true} urutan="4" />
              <PromoRow no="5." nama="BONUS HARIAN TOGEL 5%" durasi="Setiap hari" bagi="Otomatis diawal" tipe="Persen" nilai="5" max="5.000" to="X1" status={true} urutan="3" />
              <PromoRow no="6." nama="BONUS HARIAN ALL GAME 5%" durasi="Sekali" bagi="Otomatis diawal" tipe="Persen" nilai="5" max="5.000" to="X1" status={true} urutan="2" />
              <PromoRow no="7." nama="BONUS HARIAN 5%" durasi="Setiap hari" bagi="Otomatis diawal" tipe="Persen" nilai="5" max="5.000" to="X1" status={true} urutan="1" />
            </tbody>
          </table>
        </div>
        <div className="p-3 text-[11px] text-gray-500 text-right border-t">
          Menampilkan 1 sampai 7 dari total 7 baris
        </div>
      </div>
    </div>
  );
}

function PromoRow({ no, nama, durasi, bagi, tipe, nilai, max, to, status, urutan }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-2 border-r text-center">{no}</td>
      <td className="p-2 border-r font-medium">{nama}</td>
      <td className="p-2 border-r">{durasi}</td>
      <td className="p-2 border-r">{bagi}</td>
      <td className="p-2 border-r">{tipe}</td>
      <td className="p-2 border-r">{nilai}</td>
      <td className="p-2 border-r">{max}</td>
      <td className="p-2 border-r font-bold">{to}</td>
      <td className="p-2 border-r text-center">
        {status ? (
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 w-fit mx-auto border border-emerald-200">
            <CheckCircle2 size={10}/> Aktif
          </span>
        ) : (
          <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 w-fit mx-auto border border-rose-200">
            <XCircle size={10}/> Tidak Aktif
          </span>
        )}
      </td>
      <td className="p-2 border-r text-center">{urutan}</td>
      <td className="p-2"></td>
    </tr>
  );
}


function PromosiCashbackPage() {
  return (
    <div className="p-6 text-gray-800 relative">
      {/* Notifikasi Melayang Pojok Kanan Atas */}
      <div className="fixed top-4 right-4 z-50 bg-[#5bc0de] text-white p-3 rounded shadow-lg flex items-start gap-3 max-w-[250px] animate-bounce">
        <div className="bg-white/20 p-1 rounded-full"><Mail size={16}/></div>
        <div className="text-[11px]">
          <p className="font-bold border-b border-white/20 mb-1 pb-1 uppercase">Result Market</p>
          <p className="leading-tight">Sudah Waktunya Result Market OREGON 03 !</p>
        </div>
      </div>

      <h1 className="text-3xl font-normal mb-1">Promosi Cashback</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Promosi Cashback</span>
      </p>

      {/* TABEL PROMOSI CASHBACK */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <FileBarChart size={16}/> Promosi Cashback
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b bg-white text-gray-800 font-bold">
                <th className="p-2 border-r text-center w-10">No.</th>
                <th className="p-2 border-r">Keterangan</th>
                <th className="p-2 border-r">Permainan</th>
                <th className="p-2 border-r text-center">Tipe Durasi</th>
                <th className="p-2 border-r text-center">Nilai</th>
                <th className="p-2 border-r text-right">Minimal Kekalahan</th>
                <th className="p-2 border-r text-right">Bonus Maksimal</th>
                <th className="p-2 border-r text-center">Status</th>
                <th className="p-2 border-r text-center">Waktu Dibuat</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <CashbackRow no="1." ket="CB LIVE CASINO > 500jt" game="Live Casino" durasi="Sekali seminggu" nilai="3%" min="500.000.001" max="" status={false} tgl="26 May 2025" />
              <CashbackRow no="2." ket="CB LIVE CASINO > 300jt" game="Live Casino" durasi="Sekali seminggu" nilai="2%" min="300.000.001" max="" status={false} tgl="26 May 2025" />
              <CashbackRow no="3." ket="CASHBACK ALL SPORT 5%" game="Tembak Ikan, Sport, Virtual, Sabung Ayam" durasi="Sekali seminggu" nilai="5%" min="200.000" max="" status={true} tgl="13 March 2025" />
              <CashbackRow no="4." ket="CASHBACK LIVECASINO 5%" game="Live Casino" durasi="Sekali seminggu" nilai="5%" min="200.000" max="" status={true} tgl="13 March 2025" />
              <CashbackRow no="5." ket="CASHBACK SLOT 5%" game="Slot" durasi="Sekali seminggu" nilai="5%" min="200.000" max="" status={true} tgl="15 February 2025" />
            </tbody>
          </table>
        </div>
        <div className="p-3 text-[11px] text-gray-500 text-right border-t">
          Menampilkan 1 sampai 5 dari total 5 baris
        </div>
      </div>
    </div>
  );
}

function CashbackRow({ no, ket, game, durasi, nilai, min, max, status, tgl }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2 border-r text-center">{no}</td>
      <td className="p-2 border-r font-medium uppercase">{ket}</td>
      <td className="p-2 border-r italic text-gray-600">{game}</td>
      <td className="p-2 border-r text-center">{durasi}</td>
      <td className="p-2 border-r text-center font-bold text-blue-600">{nilai}</td>
      <td className="p-2 border-r text-right font-mono">{min}</td>
      <td className="p-2 border-r text-right font-mono">{max || "-"}</td>
      <td className="p-2 border-r text-center">
        {status ? (
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 w-fit mx-auto border border-emerald-200">
            <CheckCircle2 size={10}/> Aktif
          </span>
        ) : (
          <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 w-fit mx-auto border border-rose-200">
            <XCircle size={10}/> Tidak Aktif
          </span>
        )}
      </td>
      <td className="p-2 border-r text-center text-[10px]">{tgl}</td>
      <td className="p-2"></td>
    </tr>
  );
}


function PromosiReferralPage() {
  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-normal mb-1">Promosi Referral</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Promosi Referral</span>
      </p>

      {/* TABEL PROMOSI REFERRAL */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <FileBarChart size={16}/> Promosi Referral
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b bg-white text-gray-800 font-bold">
                <th className="p-2 border-r text-center w-10">No.</th>
                <th className="p-2 border-r">Keterangan</th>
                <th className="p-2 border-r">Kalkulasi Berdasarkan</th>
                <th className="p-2 border-r">Permainan</th>
                <th className="p-2 border-r text-center">Tipe Durasi</th>
                <th className="p-2 border-r text-center">Nilai</th>
                <th className="p-2 border-r text-right">Bonus Maksimal</th>
                <th className="p-2 border-r text-center">Status</th>
                <th className="p-2 border-r text-center">Waktu Dibuat</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-2 border-r text-center">1.</td>
                <td className="p-2 border-r font-medium uppercase text-gray-700">Bonus Referral 1%</td>
                <td className="p-2 border-r font-mono text-blue-600">(TO Lose - TO Win) x %</td>
                <td className="p-2 border-r italic text-gray-600">Slot, Live Casino</td>
                <td className="p-2 border-r text-center">Setiap hari</td>
                <td className="p-2 border-r text-center font-bold">0.05%</td>
                <td className="p-2 border-r text-right font-mono">-</td>
                <td className="p-2 border-r text-center">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 w-fit mx-auto border border-emerald-200">
                    <CheckCircle2 size={10}/> Aktif
                  </span>
                </td>
                <td className="p-2 border-r text-center text-[10px]">14 March 2025</td>
                <td className="p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-3 text-[11px] text-gray-500 text-right border-t">
          Menampilkan 1 sampai 1 dari total 1 baris
        </div>
      </div>
    </div>
  );
}


function ProsesBonusPage() {
  return (
    <div className="p-6 text-gray-800 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-normal mb-1">Proses Bonus</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Proses Bonus</span>
      </p>

      {/* FILTER SECTION (Sama seperti sebelumnya) */}
      {/* ... */}

      {/* TABEL PROSES BONUS */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <span className="text-lg">⊞</span> Proses Bonus
        </div>
        
        <div className="p-4">
          {/* Box Total Bonus */}
          <div className="bg-[#f4f4f4] border border-gray-300 rounded p-3 mb-5 w-fit min-w-[200px]">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Total Bonus</p>
            <p className="text-xl font-bold">Rp. 29.750,00</p>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-white text-gray-800 font-bold border-b-2 border-gray-300">
                  <th className="p-2 border-r text-center w-10">No.</th>
                  <th className="p-2 border-r">Username</th>
                  <th className="p-2 border-r">Promo</th>
                  <th className="p-2 border-r">Pembagian Bonus</th>
                  <th className="p-2 border-r text-right">Nilai Deposit</th>
                  <th className="p-2 border-r text-right">Saldo Member Sekarang</th>
                  <th className="p-2 border-r text-right">Bonus</th>
                  <th className="p-2 border-r text-right">Total TO Saat Ini</th>
                  <th className="p-2 border-r text-right">Total TO</th>
                  <th className="p-2 border-r">Waktu Mulai</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <BonusRow no="1" user="maelani" promo="BONUS HARIAN TOGEL 5%" bagi="Otomatis diawal" dep="20.000" saldo="290,00" bonus="1.000,00" toNow="0,00" toTarget="21.000,00" waktu="17 February 2026 00:49:16" />
                <BonusRow no="2" user="Buburkacang76" promo="BONUS HARIAN TOGEL 5%" bagi="Otomatis diawal" dep="25.000" saldo="448,96" bonus="1.250,00" toNow="0,00" toTarget="26.250,00" waktu="17 February 2026 00:21:42" />
                <BonusRow no="3" user="seabank0301" promo="BONUS HARIAN TOGEL 5%" bagi="Otomatis diawal" dep="25.000" saldo="599.960,00" bonus="1.250,00" toNow="0,00" toTarget="26.250,00" waktu="16 February 2026 22:56:35" />
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-[11px] text-gray-500">
             Menampilkan 1 sampai 3 dari total 3 baris
          </div>
        </div>
      </div>
    </div>
  );
}

function BonusRow({ no, user, promo, bagi, dep, saldo, bonus, toNow, toTarget, waktu }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-2 border-r text-center">{no}.</td>
      <td className="p-2 border-r text-blue-600 font-medium cursor-pointer hover:underline">{user}</td>
      <td className="p-2 border-r font-bold text-[10px]">{promo}</td>
      <td className="p-2 border-r">{bagi}</td>
      <td className="p-2 border-r text-right font-mono">{dep}</td>
      <td className="p-2 border-r text-right font-mono">{saldo}</td>
      <td className="p-2 border-r text-right font-mono font-bold">{bonus}</td>
      <td className="p-2 border-r text-right font-mono">{toNow}</td>
      <td className="p-2 border-r text-right font-mono font-bold">{toTarget}</td>
      <td className="p-2 border-r text-[10px]">{waktu}</td>
      <td className="p-2 text-center">
        <button className="bg-[#dc3545] text-white px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1 mx-auto hover:bg-red-700 shadow-sm uppercase">
          <XCircle size={10}/> Batal
        </button>
      </td>
    </tr>
  );
}




// --- KOMPONEN ATOM (Definisikan Sekali di Luar) ---

function LaporanRow({ no, user, promo, bagi, jumlah, waktu }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-all text-[11px]">
      <td className="p-2 border-r text-center font-medium">{no}.</td>
      <td className="p-2 border-r text-blue-600 font-semibold hover:underline cursor-pointer">{user}</td>
      <td className="p-2 border-r font-bold text-[10px] text-gray-700">{promo}</td>
      <td className="p-2 border-r">{bagi}</td>
      <td className="p-2 border-r text-right font-mono font-bold">{jumlah}</td>
      <td className="p-2 border-r text-center">
        <span className="bg-[#5cb85c] text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 w-fit mx-auto border border-green-600">
          <CheckCircle2 size={10}/> Selesai
        </span>
      </td>
      <td className="p-2 border-r"></td>
      <td className="p-2 border-r text-[10px] text-gray-500">{waktu}</td>
      <td className="p-2 text-[10px] text-gray-500">{waktu}</td>
    </tr>
  );
}

// --- HALAMAN KONTEN ---

function LaporanBonusPage() {
  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-3xl font-normal mb-1">Laporan Bonus</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Laporan Bonus</span>
      </p>

      {/* FILTER AREA */}
      <div className="bg-[#fcfcfc] border rounded shadow-sm overflow-hidden border-gray-200 mb-6">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <span className="text-[10px]">▼</span> Filter
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <FilterInput label="Username" placeholder="Username" />
          <FilterDate label="Dari Tanggal Respon" value="2026-02-01" />
          <FilterDate label="Sampai Tanggal Respon" value="2026-02-17" />
          <FilterSelect label="Status" />
          <FilterSelect label="Pembagian Bonus" />
          <FilterSelect label="Munculkan" placeholder="15 Data" />
        </div>
        <div className="px-4 pb-4 flex gap-1">
          <button className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-cyan-600">
            <RotateCcw size={12}/> Reset
          </button>
          <button className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-blue-700">
            <Search size={12}/> Cari
          </button>
        </div>
      </div>

      {/* DATA AREA */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <FileBarChart size={16}/> Laporan Bonus
        </div>
        <div className="p-4">
          <div className="bg-[#e9ecef] border border-gray-300 rounded p-4 mb-4 w-64">
            <p className="text-[11px] text-gray-500 font-bold uppercase mb-1">Total</p>
            <p className="text-lg font-bold">Rp. 4.785.642,00</p>
          </div>
          <div className="flex justify-end mb-3">
            <button className="bg-[#28a745] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-green-700 transition-all">
              <FileDown size={14}/> Export
            </button>
          </div>
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-800 font-bold uppercase text-[11px]">
                  <th className="p-2 border-r text-center w-10">No.</th>
                  <th className="p-2 border-r">Username</th>
                  <th className="p-2 border-r">Promosi</th>
                  <th className="p-2 border-r">Pembagian Bonus</th>
                  <th className="p-2 border-r text-right">Jumlah Bonus</th>
                  <th className="p-2 border-r text-center">Status</th>
                  <th className="p-2 border-r">Admin Respon</th>
                  <th className="p-2 border-r">Waktu Admin Respon</th>
                  <th className="p-2">Tanggal Dibuat</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <LaporanRow no="1" user="Hsbaobson" promo="BONUS HARIAN 5%" bagi="Otomatis diawal" jumlah="500,00" waktu="17 February 2026 02:43:33" />
                <LaporanRow no="2" user="Konci04" promo="BONUS HARIAN 5%" bagi="Otomatis diawal" jumlah="3.472,00" waktu="17 February 2026 01:27:41" />
                <LaporanRow no="3" user="Boykopral" promo="BONUS HARIAN 5%" bagi="Otomatis diawal" jumlah="2.400,00" waktu="17 February 2026 01:28:34" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


const LaporanCashbackPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Laporan Cashback</h1>
      <p className="text-sm text-blue-500 mb-4">Dashboard / Laporan Cashback</p>

      {/* SECTION FILTER */}
      <div className="bg-white rounded-t-lg border border-b-0 p-3 flex items-center gap-2">
        <span className="font-bold text-sm">▼ Filter</span>
      </div>
      <div className="bg-white border p-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <FilterInput label="Username" placeholder="Username" />
        <FilterDate label="Dari Tanggal" value="2026-02-01" />
        <FilterDate label="Sampai Tanggal" value="2026-02-17" />
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-600 uppercase">Munculkan</label>
          <select className="border rounded px-2 py-1 text-sm">
            <option>15 Data</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="bg-cyan-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
            <RotateCcw size={14} /> Reset
          </button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
            <Search size={14} /> Cari
          </button>
        </div>
      </div>

      {/* SECTION TABLE */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 border-b flex items-center gap-2">
          <span className="font-bold text-sm">⊞ Laporan Cashback</span>
        </div>
        
        <div className="p-4">
          <div className="bg-gray-100 p-3 rounded mb-4 w-fit">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Total</p>
            <p className="text-lg font-bold">Rp. 27.261.511,17</p>
          </div>

          <div className="flex justify-end mb-2">
             <button className="bg-[#28a745] text-white px-3 py-1 rounded text-[10px] font-bold flex items-center gap-1">
               <FileDown size={14}/> Export
             </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-2 w-10">No.</th>
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Keterangan</th>
                  <th className="border p-2 text-right">Jumlah Bonus</th>
                  <th className="border p-2">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: "Haphapbca", desc: "CASHBACK ALL SPORT 5%", bonus: "22.989,50", date: "16 February 2026" },
                  { user: "Maxwin77", desc: "CASHBACK ALL SPORT 5%", bonus: "22.300,00", date: "16 February 2026" },
                  // Tambahkan data lainnya sesuai gambar...
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2 text-center">{index + 1}.</td>
                    <td className="border p-2 text-blue-600 cursor-pointer">{item.user}</td>
                    <td className="border p-2">{item.desc}</td>
                    <td className="border p-2 text-right font-mono text-blue-500">{item.bonus}</td>
                    <td className="border p-2">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};



const LaporanReferralPage = () => {
  return (
    <div className="p-6 text-gray-800 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-normal mb-1">Laporan Referral</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Laporan Referral</span>
      </p>

      {/* SECTION FILTER */}
      <div className="bg-white rounded-t-lg border border-b-0 p-3 flex items-center gap-2">
        <span className="font-bold text-[13px] text-gray-600">▼ FILTER</span>
      </div>
      <div className="bg-white border p-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shadow-sm">
        <FilterInput label="Username" placeholder="Username" />
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-600 uppercase">Dari Tanggal</label>
          <input type="date" className="border rounded px-2 py-1.5 text-xs outline-none bg-white" defaultValue="2026-02-01" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-600 uppercase">Sampai Tanggal</label>
          <input type="date" className="border rounded px-2 py-1.5 text-xs outline-none bg-white" defaultValue="2026-02-17" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-600 uppercase">Munculkan</label>
          <select className="border rounded px-2 py-1.5 text-xs outline-none bg-white">
            <option>15 Data</option>
          </select>
        </div>
        <div className="flex gap-2 items-end">
          <button className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 shadow-sm hover:bg-cyan-600 transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
          <button className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 shadow-sm hover:bg-blue-700 transition-colors">
            <Search size={12} /> Cari
          </button>
        </div>
      </div>

      {/* SECTION TABLE */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <span className="text-sm">⊞</span> Laporan Referral
        </div>
        
        <div className="p-4">
          {/* Box Total */}
          <div className="bg-[#f4f4f4] border border-gray-300 rounded p-3 mb-4 w-fit min-w-[200px]">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Total</p>
            <p className="text-xl font-bold font-mono">Rp. 194.065,00</p>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-white text-gray-800 font-bold border-b-2 border-gray-300 uppercase">
                  <th className="p-2 border-r text-center w-10">No.</th>
                  <th className="p-2 border-r">Username</th>
                  <th className="p-2 border-r">Keterangan</th>
                  <th className="p-2 border-r text-right">Jumlah Bonus</th>
                  <th className="p-2">Tanggal</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {[
                  { user: "JITO73", desc: "Bonus Harian Referral 0.05%", bonus: "15,05", date: "16 February 2026" },
                  { user: "oppakorea", desc: "Bonus Harian Referral 0.05%", bonus: "25,83", date: "16 February 2026" },
                  { user: "supercina", desc: "Bonus Harian Referral 0.05%", bonus: "0,86", date: "16 February 2026" },
                  { user: "superdanaa", desc: "Bonus Harian Referral 0.05%", bonus: "23,68", date: "16 February 2026" },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-b last:border-b-0">
                    <td className="p-2 border-r text-center">{index + 1}.</td>
                    <td className="p-2 border-r text-blue-600 font-medium cursor-pointer">{item.user}</td>
                    <td className="p-2 border-r">{item.desc}</td>
                    <td className="p-2 border-r text-right font-mono font-bold text-gray-700">{item.bonus}</td>
                    <td className="p-2">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-[11px] text-gray-500 italic">
             Menampilkan 1 sampai 4 dari total 4 baris
          </div>
        </div>
      </div>
    </div>
  );
};


const LaporanRollingPage = () => {
  return (
    <div className="p-6 text-gray-800 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-normal mb-1">Laporan Rolling</h1>
      <p className="text-xs text-blue-500 mb-6 font-medium">
        Dashboard <span className="text-gray-400 font-normal">/ Laporan Rolling</span>
      </p>

      {/* SECTION FILTER */}
      <div className="bg-white rounded-t-lg border border-b-0 p-3 flex items-center gap-2">
        <span className="font-bold text-[13px] text-gray-600 uppercase">▼ Filter</span>
      </div>
      <div className="bg-white border p-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shadow-sm">
        <FilterInput label="Username" placeholder="Username" />
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-600 uppercase">Dari Tanggal</label>
          <input type="date" className="border rounded px-2 py-1.5 text-xs outline-none bg-white" defaultValue="2026-02-01" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-600 uppercase">Sampai Tanggal</label>
          <input type="date" className="border rounded px-2 py-1.5 text-xs outline-none bg-white" defaultValue="2026-02-17" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-600 uppercase">Munculkan</label>
          <select className="border rounded px-2 py-1.5 text-xs outline-none bg-white">
            <option>15 Data</option>
          </select>
        </div>
        <div className="flex gap-2 items-end">
          <button className="bg-[#00c0ef] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 shadow-sm hover:bg-cyan-600 transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
          <button className="bg-[#007bff] text-white px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 shadow-sm hover:bg-blue-700 transition-colors">
            <Search size={12} /> Cari
          </button>
        </div>
      </div>

      {/* SECTION TABLE */}
      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2 text-[13px] font-bold text-gray-600 uppercase">
          <span className="text-sm">⊞</span> Laporan Rolling
        </div>
        
        <div className="p-4">
          {/* Box Total */}
          <div className="bg-[#f4f4f4] border border-gray-300 rounded p-3 mb-4 w-fit min-w-[200px]">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Total</p>
            <p className="text-xl font-bold font-mono text-gray-800">Rp. 14.887.269,62</p>
          </div>

          <div className="flex justify-end mb-2">
             <button className="bg-[#28a745] hover:bg-green-700 text-white px-3 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors">
               <FileDown size={14}/> Export
             </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-white text-gray-800 font-bold border-b-2 border-gray-300 uppercase">
                  <th className="p-2 border-r text-center w-10">No.</th>
                  <th className="p-2 border-r">Username</th>
                  <th className="p-2 border-r">Keterangan</th>
                  <th className="p-2 border-r text-right">Jumlah Bonus</th>
                  <th className="p-2">Tanggal</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {[
                  { user: "Difat1", desc: "ROLLINGAN HARIAN 1%", bonus: "573,00", date: "16 February 2026" },
                  { user: "monyettembem", desc: "ROLLINGAN HARIAN 1%", bonus: "4.407,00", date: "16 February 2026" },
                  { user: "Rodaroda", desc: "ROLLINGAN HARIAN 1%", bonus: "459,60", date: "16 February 2026" },
                  { user: "Sedapdana", desc: "ROLLINGAN HARIAN 1%", bonus: "330,60", date: "16 February 2026" },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-b last:border-b-0">
                    <td className="p-2 border-r text-center">{index + 1}.</td>
                    <td className="p-2 border-r text-blue-600 font-medium cursor-pointer">{item.user}</td>
                    <td className="p-2 border-r">{item.desc}</td>
                    <td className="p-2 border-r text-right font-mono font-bold text-blue-600">{item.bonus}</td>
                    <td className="p-2">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-[11px] text-gray-500 italic">
             Menampilkan 1 sampai 4 dari total 4 baris
          </div>
        </div>
      </div>
    </div>
  );
};







function InputResultPage({ setActiveMenu }) {
  const [form, setForm] = useState({
    pasaran: "SINGAPORE",
    periode: "",
    nomor: "",
    tanggal: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("/api/save-keluaran", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Data Berhasil Disimpan!");
      
      // PENTING: Pindahkan menu ke Togel Result
      setActiveMenu("togel-result"); 
      
      // Simpan juga ke localStorage agar tidak balik ke input saat refresh
      localStorage.setItem("activeAdminMenu", "togel-result");
    } else {
      alert("❌ Gagal: " + data.error);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <RotateCcw size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Input Result Togel</h2>
            <p className="text-gray-500 text-sm">Update angka keluaran terbaru tiap pasaran</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
  <label className="text-sm font-semibold text-gray-600">Nama Pasaran</label>
  <input 
  list="pasaran-list"
  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
  value={form.pasaran}
  onChange={(e) => setForm({...form, pasaran: e.target.value.toUpperCase()})}
  placeholder="Ketik atau pilih pasaran..."
/>
<datalist id="pasaran-list">
  <option value="SINGAPORE" />
  <option value="HONGKONG" />
  <option value="SYDNEY" />
  <option value="TEXAS EVE" />
</datalist>
</div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Periode</label>
            <input 
              type="text" placeholder="Misal: SGP-001"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              value={form.periode}
              onChange={(e) => setForm({...form, periode: e.target.value.toUpperCase()})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Nomor Keluar (4 Digit)</label>
            <input 
              type="number" placeholder="0000"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-3xl font-black tracking-[10px] text-center text-blue-700"
              value={form.nomor}
              onChange={(e) => setForm({...form, nomor: e.target.value.slice(0, 4)})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Tanggal Result</label>
            <input 
              type="date"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={form.tanggal}
              onChange={(e) => setForm({...form, tanggal: e.target.value})}
              required
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Memproses..." : <><CheckCircle2 size={20}/> SIMPAN DATA RESULT</>}
            </button>
            
            {status.msg && (
              <div className={`mt-4 p-4 rounded-lg text-center font-medium ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {status.msg}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}


function TogelResultPage() {
  const [results, setResults] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [filterPasaran, setFilterPasaran] = useState("");
  const itemsPerPage = 15; // Mau tampil berapa baris per halaman?

  const [currentPage, setCurrentPage] = useState(1);
  
  const [form, setForm] = useState({
    pasaran: "", 
    periode: "", 
    nomor: "", 
    tanggal: new Date().toISOString().split("T")[0]
  });

  // --- 1. FUNGSI LOAD DATA (NARIK DARI DB) ---
 const loadData = async () => {
  try {
    console.log("Memulai tarik data dari API..."); 
    const res = await fetch("/api/riwayat-keluaran");
    const json = await res.json();
    
    console.log("Data dari Database:", json); // CEK DI CONSOLE (F12)

    if (json.success && json.data) {
      setResults(json.data); // Paksa simpan ke tabel
      console.log("Tabel harusnya terisi sekarang!");
    } else {
      console.error("API Jalan tapi data kosong/error:", json.message);
    }
  } catch (err) {
    console.error("Koneksi ke API Putus Boss:", err);
  }
};
  useEffect(() => { loadData(); }, []);

const handleSimpan = async (e) => {
  e.preventDefault();
  
  // Bungkus data supaya sesuai dengan kolom di Database (result)
  const dataInput = {
    pasaran: form.pasaran,
    periode: form.periode,
    result: form.nomor, // <-- KUNCINYA: 'nomor' dari form diubah jadi 'result' buat kirim ke API
    tanggal: form.tanggal
  };

  try {
    const res = await fetch("/api/save-keluaran", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataInput), // Kirim dataInput yang sudah disesuaikan
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Berhasil! Data tersimpan di Riwayat.");
      setForm({ ...form, pasaran: "", periode: "", nomor: "" });
      setShowInput(false);
      
      // Ambil data terbaru supaya langsung muncul di tabel bawah
      await loadData(); 
    }
  } catch (err) {
    alert("Gagal koneksi!");
  }
};

  // --- 3. FUNGSI HAPUS (ACTION TOMBOL MERAH) ---
  const handleDelete = async (id) => {
    if (confirm("Apakah Boss yakin ingin menghapus data ini?")) {
      try {
        const res = await fetch(`/api/delete-keluaran?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          loadData(); // Refresh tabel setelah hapus
        }
      } catch (err) {
        alert("Gagal menghapus data");
      }
    }
  };




// Filter data berdasarkan input
  const filteredData = results.filter((item) =>
    item.pasaran.toUpperCase().includes(filterPasaran.toUpperCase())
  );

  // Hitung index data untuk halaman aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Hitung total halaman
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);





  return (
    <div className="p-4 bg-[#f4f6f9] min-h-screen font-sans">
      <h1 className="text-3xl font-semibold text-gray-800">Togel Result</h1>
      <p className="text-blue-500 text-sm mb-6">Dashboard / Togel Result</p>

      {/* --- FILTER --- */}
      <div className="bg-white rounded shadow-sm border mb-6">
  <div className="p-3 border-b bg-gray-50 flex items-center gap-2 font-bold text-gray-700 text-sm">
    <span>▼</span> Filter
  </div>
  <div className="p-5">
    <div className="max-w-xs">
      <label className="text-[11px] text-gray-500 block mb-1 uppercase font-bold">Pasaran</label>
      
      {/* Input Manual Nama Pasaran */}
      <input 
        type="text"
        placeholder="Ketik Nama Pasaran..."
        className="w-full p-2 border rounded bg-white text-sm outline-none border-gray-300 font-bold"
        value={filterPasaran}
        onChange={(e) => setFilterPasaran(e.target.value.toUpperCase())} // Otomatis huruf besar
      />
    </div>

    <div className="flex gap-2 mt-4 text-white">
      {/* Tombol Reset - Mengosongkan Filter */}
      <button 
        onClick={() => setFilterPasaran("")} 
        className="bg-[#00c0ef] px-4 py-1.5 rounded text-sm font-bold active:scale-95"
      >
        🔄 Reset
      </button>

      {/* Tombol Cari - Sebenarnya Filter React otomatis jalan karena state filterPasaran berubah */}
      <button 
        className="bg-[#3c8dbc] px-4 py-1.5 rounded text-sm font-bold active:scale-95"
      >
        🔍 Cari
      </button>
    </div>
  </div>
</div>

      {/* --- FORM INPUT --- */}
      {showInput && (
        <div className="bg-white rounded shadow-md border-t-4 border-green-500 mb-6 p-6">
          <h2 className="font-bold mb-4 text-gray-700">Input Result Baru</h2>
          <form onSubmit={handleSimpan} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="NAMA PASARAN" className="p-2 border rounded uppercase outline-none" required
              value={form.pasaran} onChange={(e) => setForm({...form, pasaran: e.target.value.toUpperCase()})} />
            <input type="text" placeholder="PERIODE" className="p-2 border rounded outline-none" required
              value={form.periode} onChange={(e) => setForm({...form, periode: e.target.value})} />
            <input type="number" placeholder="ANGKA RESULT" className="p-2 border rounded font-bold outline-none" required
              value={form.nomor} onChange={(e) => setForm({...form, nomor: e.target.value.slice(0,4)})} />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white flex-1 rounded font-bold uppercase text-xs">Simpan Ke Riwayat</button>
              <button type="button" onClick={() => setShowInput(false)} className="bg-gray-400 text-white px-4 rounded text-xs">Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* --- TABEL RIWAYAT --- */}
      <div className="bg-white rounded shadow-sm border overflow-hidden">
        <div className="p-3 border-b bg-gray-50 flex justify-between items-center text-gray-700 font-bold">
          <div className="flex items-center gap-2 text-sm">▦ Togel Result</div>
          <button 
            onClick={() => setShowInput(!showInput)}
            className="bg-[#00a65a] text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-[#008d4c] transition font-bold"
          >
            + Tambah
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-white text-gray-700 border-b">
                <th className="p-3 border-r w-12 text-center">No.</th>
                <th className="p-3 border-r">Pasaran</th>
                <th className="p-3 border-r">Periode</th>
                <th className="p-3 border-r">Tanggal</th>
                <th className="p-3 border-r text-blue-600">Result</th>
                <th className="p-3 border-r">Status</th>
                <th className="p-3 border-r">Waktu Dibuat</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
          <tbody>
  {(() => {
    const itemsPerPage = 15;
    const filteredData = results.filter((item) => 
      item.pasaran.toUpperCase().includes(filterPasaran.toUpperCase())
    );
    // 2. TAMBAHKAN LOGIKA SORTING DI SINI (Urutkan dari Waktu Terbaru)
    filteredData.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA; // DateB - DateA membuat yang terbaru ada di ATAS
    });
    // 3. Baru kemudian lakukan Pagination (Slice)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return currentItems.length > 0 ? currentItems.map((item, index) => (
      <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-3 border-r text-center text-gray-400">{indexOfFirstItem + index + 1}.</td>
        <td className="p-3 border-r uppercase font-bold">{item.pasaran}</td>
        <td className="p-3 border-r">{item.periode}</td>
        <td className="p-3 border-r font-bold text-gray-700 uppercase">
  {new Date(item.tanggal).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })}
</td>
        
        <td className="p-3 border-r font-bold text-blue-600">
          {item.result} 
        </td>
        <td className="p-3 border-r text-center">
          <span className="bg-[#d1f5ea] text-[#1a8a6d] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#a3e4d7]">
            ✔ Sudah Dicairkan
          </span>
        </td>

{/* 2. KOLOM WAKTU DIBUAT (Kodingan yang Boss kirim tadi) */}
<td className="p-3 border-r text-center">
  {item.created_at ? (
    (() => {
      const d = new Date(item.created_at);
      const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      const jam = d.getHours().toString().padStart(2, '0');
      const menit = d.getMinutes().toString().padStart(2, '0');
      
      return (
        <div className="flex flex-col items-center leading-tight">
          {/* Baris Tanggal (Kecil saja karena sudah ada di kolom sebelah) */}
          <span className="text-black-400 font-bold text-[12px] mb-0.5">{tgl}</span>
          
          {/* Baris Jam (Fokus utama di sini) */}
          {jam === '00' && menit === '00' ? (
             <span className="text-gray-300 tracking-widest">-- : --</span>
          ) : (
            <span className="text-blue-600 font-bold text-[12px]">
              {jam}:{menit} <span className="text-[9px] text-gray-400 font-bold">WIB</span>
            </span>
          )}
        </div>
      );
    })()
  ) : "-"}
</td>
        {/* ----------------------------------------------- */}.

        <td className="p-3 text-center">
          <button 
            onClick={() => handleDelete(item.id)}
            className="bg-[#dd4b39] text-white p-1.5 rounded hover:bg-[#d73925] transition"
          >
            <span className="text-[10px]">✖</span>
          </button>
        </td>
      </tr>
    )) : (
      <tr>
        <td colSpan="8" className="p-10 text-center text-gray-400 italic border-b">
          Belum ada data riwayat yang tersimpan.
        </td>
      </tr>
    );
  })()}
</tbody>
          </table>

{/* --- KONTROL HALAMAN (PAGINATION) --- */}
<div className="p-4 flex flex-col md:flex-row justify-between items-center bg-white border-t gap-4">
  <div className="text-[13px] text-gray-600">
    Menampilkan {results.length > 0 ? ((currentPage - 1) * 15) + 1 : 0} sampai {Math.min(currentPage * 15, results.length)} dari {results.length} baris
  </div>

  <div className="flex items-center border rounded overflow-hidden text-[13px] font-bold">
    <button 
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="px-3 py-1.5 hover:bg-gray-100 disabled:bg-gray-50 text-blue-600 border-r"
    >
      Previous
    </button>
    
    <span className="px-4 py-1.5 bg-gray-50 text-gray-700">
      Halaman {currentPage}
    </span>

    <button 
      disabled={currentPage >= Math.ceil(results.length / 15)}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="px-3 py-1.5 hover:bg-gray-100 disabled:bg-gray-50 text-blue-600 border-l"
    >
      Next
    </button>
  </div>
</div>

        </div>
      </div>
    </div>
  );

}





