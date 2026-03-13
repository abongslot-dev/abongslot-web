"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, 
  Users, 
  ArrowRightLeft, 
  Gift, 
  Gamepad2, 
  FileBarChart, 
  Landmark, 
  Mail, 
  ChevronDown,
  Settings,    // <--- TAMBAHKAN INI
  BarChart3    // <--- TAMBAHKAN INI JUGA (Buat Menu Statistik)
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Loading...");
  const [mounted, setMounted] = useState(false); // Tambahan untuk anti-error

  useEffect(() => {
    setMounted(true); // Tandai kalau sudah di browser

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/adm/login");
      } else {
        // Ambil data user jika session ada
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "Admin";
          setAdminName(name);
        }
        setLoading(false);
      }
    };

    checkUser();

    // Pantau jika user logout
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // JIKA BELUM MOUNTED ATAU MASIH LOADING, TAMPILKAN PLACEHOLDER
  if (!mounted || loading) {
    return <aside className={`bg-[#1a0033] h-screen border-r border-white/5 ${isOpen ? 'w-64' : 'w-20'}`}></aside>;
  }

  // --- KOMPONEN SIDEBAR ITEM ---
  const SidebarItem = ({ icon, label, hasChild, menuKey, href, children }) => {
    const isSubOpen = openMenu === menuKey;
    const isActive = pathname === href;

    return (
      <div className="flex flex-col">
        {hasChild ? (
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
          <Link href={href || "#"}>
            <div className={`flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/10 ${isActive ? 'bg-blue-600 text-white' : 'text-[#c2c7d0]'}`}>
              {icon}
              {isOpen && <span className="text-[13px]">{label}</span>}
            </div>
          </Link>
        )}
        
        {hasChild && isSubOpen && isOpen && (
          <div className="bg-black/20 pb-2">
            {children}
          </div>
        )}
      </div>
    );
  };

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
        <SidebarItem icon={<LayoutDashboard size={16}/>} label="Dashboard" href="/admin" />
        
        <SidebarItem icon={<ArrowRightLeft size={16}/>} label="Transaksi" hasChild menuKey="transaksi">
          <SubMenuItem label="Deposit Baru" href="/admin/deposit" />
          <SubMenuItem label="Withdrawal Baru" href="/admin/withdrawal" />
          <SubMenuItem label="Rangkuman Deposit" href="/admin/deposit-history" />
          <SubMenuItem label="Rangkuman Withdrawal" href="/admin/withdrawal-history" />
        </SidebarItem>

        <SidebarItem icon={<Users size={16}/>} label="Member" hasChild menuKey="member">
          <SubMenuItem label="Daftar Member" href="/admin/member" />
          <SubMenuItem label="Member Online" href="/admin/member/online" />
        </SidebarItem>

        <SidebarItem icon={<Gift size={16}/>} label="Promosi" hasChild menuKey="promo">
          <SubMenuItem label="Promosi Deposit" href="/admin/promosi-deposit" />
          <SubMenuItem label="Promosi Cashback" href="/admin/promosi-cashback" />
        </SidebarItem>

        <SidebarItem icon={<Gamepad2 size={16}/>} label="Togel" hasChild menuKey="togel">
            <SubMenuItem label="Togel Result" href="/admin/togel/result" />
            <SubMenuItem label="Togel Pasaran" href="/admin/togel/pasaran" />
        </SidebarItem>

        <SidebarItem icon={<FileBarChart size={16}/>} label="Laporan" hasChild menuKey="laporan">
            <SubMenuItem label="Laporan Game Member" href="/admin/laporan/game-member" />
            <SubMenuItem label="Laporan Jurnal" href="/admin/laporan/jurnal" />
        </SidebarItem>

        <SidebarItem icon={<Landmark size={16}/>} label="Pengaturan Bank" hasChild menuKey="bank">
            <SubMenuItem label="Bank" href="/admin/pengaturan-bank/bank" />
            <SubMenuItem label="Rekening Bank" href="/admin/pengaturan-bank/rekening" />
        </SidebarItem>


        <SidebarItem icon={<Settings size={16}/>} label="Peratan & pengaturan" hasChild menuKey="bank">
            <SubMenuItem label="Pengaturan Promo" href="/admin/peratan&pengaturan/setting-promo" />
            <SubMenuItem label="Pengaturan Banner" href="/admin/peratan&pengaturan/setting-banner" />
            <SubMenuItem label="Hubungi" href="/admin/peratan&pengaturan/hubungi" />
        </SidebarItem>

        <SidebarItem icon={<BarChart3 size={16}/>} label="Statistik" hasChild menuKey="statistik">
           <SubMenuItem label="Member Baru" href="/admin/statistik" />
           <SubMenuItem label="Transaksi" href="/admin/statistik/transaksi" />
        </SidebarItem>
      </nav>

      {/* FOOTER SECTION */}
      <div className="p-4 bg-[#1e2225] text-[11px] border-t border-zinc-800">
        {isOpen ? (
          <>
            <p className="opacity-40 uppercase mb-1 text-[9px]">Login sebagai:</p>
            <p className="text-white font-semibold italic uppercase truncate">
              {adminName}
            </p>
          </>
        ) : (
          <div className="text-center" title={adminName}>👤</div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
      `}</style>
    </aside>
  );
}