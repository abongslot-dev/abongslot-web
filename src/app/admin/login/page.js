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
      <div className="max-w-md w-full text-white text-center">
        <h1 className="text-2xl font-bold mb-4">ADMIN LOGIN</h1>
        <form onSubmit={handleLogin} className="space-y-4 bg-[#222d32] p-6 rounded">
          <input 
            className="w-full p-2 bg-gray-800 border border-gray-700" 
            type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} 
          />
          <input 
            className="w-full p-2 bg-gray-800 border border-gray-700" 
            type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} 
          />
          <button className="w-full bg-blue-600 p-2 rounded">{loading ? "Loading..." : "Login"}</button>
        </form>
      </div>
    </div>
  );
}