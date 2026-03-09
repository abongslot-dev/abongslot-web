"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, ArrowRightLeft, Gift, 
  Gamepad2, FileBarChart, Landmark, Mail, ChevronDown 
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  // State untuk kontrol menu mana yang sedang terbuka dropdown-nya
  const [openMenu, setOpenMenu] = useState("");

  // Komponen Kecil: Item Menu Utama
  const SidebarItem = ({ icon, label, hasChild, menuKey, href, children }) => {
    const isSubOpen = openMenu === menuKey;
    const isActive = pathname === href;

    return (
      <div className="flex flex-col">
        {hasChild ? (
          // Jika punya anak, klik untuk toggle buka/tutup
          <div 
            onClick={() => setOpenMenu(isSubOpen ? "" : menuKey)}
            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all hover:bg-white/10 text-[#c2c7d0]`}
          >
            <div className="flex items-center gap-3">
              {icon}
              {isOpen && <span className="text-[13px]">{label}</span>}
            </div>
            {isOpen && <ChevronDown size={14} className={`transition-transform ${isSubOpen ? "rotate-180" : ""}`} />}
          </div>
        ) : (
          // Jika tidak punya anak, langsung Link ke halaman
          <Link href={href || "#"}>
            <div className={`flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/10 ${isActive ? 'bg-blue-600 text-white' : 'text-[#c2c7d0]'}`}>
              {icon}
              {isOpen && <span className="text-[13px]">{label}</span>}
            </div>
          </Link>
        )}
        
        {/* Render SubMenu jika dropdown terbuka dan sidebar sedang lebar */}
        {hasChild && isSubOpen && isOpen && (
          <div className="bg-black/20 pb-2">
            {children}
          </div>
        )}
      </div>
    );
  };

  // Komponen Kecil: Item Sub Menu
  const SubMenuItem = ({ label, href }) => {
    const isActive = pathname === href;
    return (
      <Link href={href || "#"}>
        <div className={`pl-12 py-2 text-[12px] transition-colors hover:text-white ${isActive ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
          • {label}
        </div>
      </Link>
    );
  };

  return (
    <aside className={`bg-[#1a0033] text-[#c2c7d0] transition-all duration-300 flex-shrink-0 flex flex-col h-screen ${isOpen ? 'w-64' : 'w-20'} border-r border-white/5 shadow-2xl`}>
      {/* LOGO SECTION */}
      <div className="p-4 bg-[#1e2225] border-b border-zinc-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">A</div>
        {isOpen && <span className="font-bold text-white tracking-tight text-sm uppercase whitespace-nowrap">ABONGSLOT</span>}
      </div>
      
      {/* NAVIGATION SECTION */}
      <nav className="mt-2 flex-1 overflow-y-auto custom-scrollbar">
        
        <SidebarItem 
          icon={<LayoutDashboard size={16}/>} 
          label="Dashboard" 
          href="/admin/dashboard" 
        />

        <SidebarItem 
          icon={<ArrowRightLeft size={16}/>} 
          label="Transaksi" 
          hasChild 
          menuKey="transaksi"
        >
          <SubMenuItem label="Deposit Baru" href="/admin/deposit" />
          <SubMenuItem label="Withdrawal Baru" href="/admin/withdrawal" />
          <SubMenuItem label="Rangkuman Deposit" href="/admin/deposit-history" />
          <SubMenuItem label="Rangkuman Withdrawal" href="/admin/withdrawal-history" />
          <SubMenuItem label="Penyesuaian Saldo" href="/admin/penyesuaian-saldo" />
        </SidebarItem>

        <SidebarItem 
          icon={<Users size={16}/>} 
          label="Member" 
          hasChild 
          menuKey="member"
        >
          <SubMenuItem label="Daftar Member" href="/admin/member" />
          <SubMenuItem label="Member Online" href="/admin/member/online" />
          <SubMenuItem label="Lihat Ip" href="/admin/member/ip" />
        </SidebarItem>

        <SidebarItem 
          icon={<Gift size={16}/>} 
          label="Promosi" 
          hasChild 
          menuKey="promo"
        >
          <SubMenuItem label="Promosi Deposit" href="/admin/promosi-deposit" />
          <SubMenuItem label="Promosi Cashback" href="/admin/promosi-cashback" />
        </SidebarItem>

        <SidebarItem icon={<Gamepad2 size={16}/>} label="Togel" hasChild menuKey="togel">
            <SubMenuItem label="Input Result" href="/admin/togel/input" />
            <SubMenuItem label="Pasaran Togel" href="/admin/togel/pasaran" />
        </SidebarItem>

        <SidebarItem icon={<FileBarChart size={16}/>} label="Laporan" hasChild menuKey="laporan">
            <SubMenuItem label="Laporan Game Member" href="/admin/laporan/game-member" />
            <SubMenuItem label="Laporan Jurnal" href="/admin/laporan/jurnal" />
        </SidebarItem>

      </nav>

      {/* FOOTER SECTION */}
      <div className="p-4 bg-[#1e2225] text-[11px] border-t border-zinc-800">
        {isOpen ? (
          <>
            <p className="opacity-40 uppercase mb-1">Login sebagai:</p>
            <p className="text-white font-semibold italic uppercase">Admin Abongslot</p>
          </>
        ) : (
          <div className="text-center">👤</div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
      `}</style>
    </aside>
  );
}