"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// --- KOMPONEN KARTU GAME ---
const GameCard = ({ game }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="bg-[#1a0033] border-2 border-yellow-600 rounded-xl overflow-hidden flex flex-col md:flex-row relative transition-all hover:scale-[1.02] shadow-lg min-h-[320px] md:min-h-[180px]">
      
      {/* Label HOT/NEW */}
      <span className="absolute top-0 left-0 bg-red-600 text-white text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded-br-lg z-10 shadow-md border-r border-b border-yellow-500">
        {game.isNew ? "NEW" : "HOT"}
      </span>

      {/* --- AREA GAMBAR --- */}
      <div className="w-full md:w-[45%] p-2 md:p-3">
        <div className="relative aspect-square rounded-lg overflow-hidden border border-black/20 bg-black/40 shadow-inner">
          <img 
            src={game.img} 
            alt={game.title} 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => { e.target.src = "https://placehold.co/200x200/800000/fff?text=SLOT"; setIsLoaded(true); }}
          />
        </div>
        <div className="flex items-center justify-center gap-1 text-yellow-400 text-[9px] md:text-[10px] font-black mt-2">
          <span className="text-green-500">⏰</span> {game.jam}
        </div>
      </div>

      {/* --- AREA POLA & RTP --- */}
      <div className="w-full md:w-[55%] p-2 md:p-3 flex flex-col justify-between">
        <div className="bg-black/95 rounded-lg p-2 h-full flex flex-col justify-between border border-white/5 shadow-2xl">
          <div className="text-center border-b border-gray-800 pb-1 mb-1">
            <span className="text-green-400 text-[9px] md:text-[11px] font-black uppercase flex items-center justify-center gap-1">
               📊 POLA SLOT:
            </span>
          </div>
          <div className="flex flex-col gap-1.5 md:gap-2">
            {game.pola.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9px] md:text-[11px] font-bold">
                <span className="text-gray-200 truncate pr-1">{p}</span>
                <span className="flex gap-0.5 shrink-0 scale-90 md:scale-100">
                  <span className="text-red-500 text-[10px]">ⓧ</span>
                  <span className="text-red-500 text-[10px]">ⓧ</span>
                  <span className="text-green-500 text-[10px]">✅</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <div className="w-full h-5 md:h-6 bg-zinc-800 rounded-md relative overflow-hidden border border-white/10 shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ${game.rtp > 80 ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-yellow-600 to-orange-500'}`}
                style={{ width: `${game.rtp}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[12px] font-black text-white drop-shadow-md">
                {game.rtp}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HALAMAN UTAMA ---
const RTPPage = () => {
  const [provider, setProvider] = useState('Pragmatic Play');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Logic Jam Live 1 Detik
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateString = currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeString = currentTime.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const getAutoData = (title, baseRtp) => {
    const hour = currentTime.getHours();
    const seed = title.length + hour;
    return {
      rtp: Math.min(99, Math.max(40, baseRtp + (seed % 15))),
      jam: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 3) % 24}:00`,
      pola: [`Auto ${10 + (seed % 40)}X`, `Manual ${5 + (seed % 15)}X`, `Turbo ${20 + (seed % 50)}X`]
    };
  };

  const games = [
    { title: "Gates of Olympus 1000", provider: "Pragmatic Play", img: "/images/Pragmatic/Gates of Olympus.png", baseRtp: 85, isNew: true },
    { title: "Gates of Gatot Kaca 1000", provider: "Pragmatic Play", img: "/images/Pragmatic/Gates of Gatot Kaca 1000.png", baseRtp: 80 },
    { title: "Starlight Princess 1000", provider: "Pragmatic Play", img: "/images/Pragmatic/Starlight Princess 1000.png", baseRtp: 80 },
    { title: "Sugar Rush", provider: "Pragmatic Play", img: "/images/Pragmatic/Sugar Rush.png", baseRtp: 82 },



    { title: "Mahjong Ways 2", provider: "PG Soft", img: "/images/mahjong2.png", baseRtp: 82, isNew: true }
  ];

  const filteredGames = games.filter(g => g.provider === provider).map(g => ({ ...g, ...getAutoData(g.title, g.baseRtp) }));

  return (
    <div className="min-h-screen bg-[#1a0033] text-white font-sans pb-20 bg-fixed bg-cover" style={{ backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')" }}>
      
      <div className="flex justify-center py-6">
        <img src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" alt="Logo" className="h-20 object-contain drop-shadow-xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Banner & Marquee */}
        <div className="mb-1 border-2 border-yellow-600 rounded-xl overflow-hidden shadow-2xl bg-black">
          <div className="bg-black/60 border-b border-yellow-600/50 p-2 flex items-center gap-3">
            <div className="bg-red-700 p-1 rounded text-[10px] animate-pulse">📢</div>
            <marquee className="text-xs font-bold text-yellow-500 uppercase">Selamat Datang di RTP LIVE ABONGSLOT - Update Tercepat Setiap Hari!</marquee>
          </div>
         {/* Swiper Slide Samping */}
  <Swiper 
    modules={[Autoplay, Pagination]} // Buang EffectFade dari sini
    spaceBetween={0}                // Gak ada jarak antar gambar
    slidesPerView={1}               // Satu layar satu gambar
    loop={true}                     // Biar muter terus gak abis-abis
    autoplay={{ 
      delay: 3000, 
      disableOnInteraction: false 
    }} 
    pagination={{ clickable: true }} 
    className="w-full aspect-[21/9] md:aspect-[25/7]"
  >
    <SwiperSlide>
      <img 
        src="https://i.postimg.cc/h4yc5SNJ/banner1.png" 
        className="w-full h-full object-cover" 
        alt="Banner 1"
      />
    </SwiperSlide>
    <SwiperSlide>
      <img 
        src="https://i.postimg.cc/VvdQ8C2k/banner2.png" 
        className="w-full h-full object-cover" 
        alt="Banner 2"
      />
    </SwiperSlide>
  </Swiper>
        </div>

        {/* Info Bar */}
        <div className="bg-[#0c0c0c] border border-yellow-600/40 rounded-2xl p-4 shadow-2xl mb-4 mt-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-md border border-white/5">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">RTP LIVE</span>
            </div>
            <div className="text-[10px] md:text-xs font-bold text-gray-300">
              {dateString} | {timeString} WIB
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <div className="bg-[#0f1414] p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="text-yellow-500 font-black text-[9px] uppercase">Situs: <br/><span className="text-white text-[12px]">ABONGSLOT</span></div>
            </div>
            <button className="bg-gradient-to-b from-red-600 to-red-800 p-3 rounded-xl font-black text-[10px] uppercase border border-white/10">DAFTAR / LOGIN</button>
            <div className="bg-[#0f1414] p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="text-yellow-500 font-black text-[9px] uppercase">Min Depo: <br/><span className="text-white text-[12px]">Rp 10.000</span></div>
            </div>
            <div className="bg-[#0f1414] p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="text-yellow-500 font-black text-[9px] uppercase">Min Bet: <br/><span className="text-white text-[12px]">400 Perak</span></div>
            </div>
          </div>

          <div className="flex justify-between items-center px-2 border-t border-yellow-600/20 pt-4">
            <div className="text-[12px] font-black text-yellow-500 italic">PROVIDER :</div>
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className="bg-[#0a0a0a] border border-yellow-500 text-white text-[11px] font-black rounded-lg px-4 py-2 outline-none">
              <option value="Pragmatic Play">Pragmatic Play</option>
              <option value="PG Soft">PG Soft</option>
            </select>
          </div>
        </div>

        {/* Grid Game - Mobile 2 Col, Desktop 3 Col */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {filteredGames.map((game, i) => <GameCard key={i} game={game} />)}
        </div>
      </div>
    </div>
  );
};

export default RTPPage;