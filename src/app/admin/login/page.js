"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js"; 
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, Loader2 } from "lucide-react";

// GUNAKAN INI, JANGAN PAKAI 'createClientComponentClient'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push("/admin");
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Akses Ditolak: " + err.message);
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a2226] p-4">
      <div className="max-w-md w-full">
        {/* LOGO AREA */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3c8dbc] rounded-full mb-4 shadow-lg shadow-blue-900/50">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
            Admin<span className="text-[#3c8dbc]">Control</span>Panel
          </h1>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Restricted Access Only</p>
        </div>

        {/* FORM LOGIN */}
        <div className="bg-[#222d32] border-t-4 border-[#3c8dbc] rounded-b-lg shadow-2xl p-8">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-3 rounded mb-6 text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-gray-400 text-[10px] font-bold uppercase mb-1 block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  className="w-full bg-[#1a2226] border border-[#374850] text-white text-sm rounded p-2.5 pl-10 focus:ring-1 focus:ring-[#3c8dbc] outline-none transition-all"
                  placeholder="admin@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-[10px] font-bold uppercase mb-1 block">Security Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  className="w-full bg-[#1a2226] border border-[#374850] text-white text-sm rounded p-2.5 pl-10 focus:ring-1 focus:ring-[#3c8dbc] outline-none transition-all"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold py-3 rounded text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Authorize Login"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-8 uppercase">
          &copy; 2026 AbongSlot Management System <br/>
          Secure Encrypted Connection
        </p>
      </div>
    </div>
  );
}