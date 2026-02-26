"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";



// Taruh komponen ini di atas (atau di file terpisah)
const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1a0033]/90 backdrop-blur-md">
    <div className="relative flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-[#d4c33d]/20 border-t-[#d4c33d] rounded-full animate-spin"></div>
      <div className="absolute text-[#d4c33d] font-black text-[10px]">ABONGSLOT</div>
    </div>
    <p className="mt-4 text-[#d4c33d] font-black text-[10px] uppercase tracking-[4px] animate-pulse">
      Memverifikasi Akun...
    </p>
  </div>
);

function GameSlotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const headerRef = useRef(null);

  // --- 1. STATE ---
  const [halamanAktif, setHalamanAktif] = useState('utama');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showLainnya, setShowLainnya] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Menangani error search
  const [username, setUsername] = useState("MEMBER"); // Menangani error username
  const providerName = searchParams.get("provider") || "PRAGMATIC";

  // --- 2. DATA MENU & GAME ---
  const menuLainnya = [
    { name: "RTP 99%", icon: "🎰", link: "#" },
    { name: "PREDIKSI TOGEL", icon: "🔮", link: "#" },
    { name: "BUKTI PEMBAYARAN", icon: "💰", link: "#" },
    { name: "JALAWIN", icon: "🏆", link: "#" },
  ];

  const databaseGame = {
    "PRAGMATIC": [
      { name: "Gates of Olympus 1000", 
      img: "https://i.postimg.cc/6QQ0S7ZK/Gates-of-Olympus-1000.png",
      linkDemo: "https://demogamesfree.pragmaticplay.net/hub-demo/openGame.do?lang=id&cur=USD&gameSymbol=vs15zeushadseq&jurisdiction=99" },
      { name: "Starlight Princess", img: "https://i.postimg.cc/NM3k5pzm/Starlight-Princess.png" },
      { name: "Sweet Bonanza", img: "https://i.postimg.cc/WbP7VYrs/Sweet-Bonanza.png" },
      { name: "5 Lions Megaways 2", img: "https://i.postimg.cc/vZYLg137/5-Lions-Megaways-2.png" },
      { name: "5 lions megaways", img: "https://i.postimg.cc/02x7FMRx/5-lions-megaways.png" },
            { name: "5 Rabbits Megaways", img: "https://i.postimg.cc/6Q7ZnCR8/5-Rabbits-Megaways.png" },
            { name: "Bingo Mania", img: "https://i.postimg.cc/W4JDhTLG/Bingo-Mania.png" },
            { name: "Buffalo King Megaways", img: "https://i.postimg.cc/cHyv32dL/Buffalo-King-Megaways.png" },
            { name: "fotune of oliympus", img: "https://i.postimg.cc/2yTyP5hp/fotune-of-oliympus.jpg" },
            { name: "Frightening Frankie", img: "https://i.postimg.cc/CKD1w7bT/Frightening-Frankie.png" },
                { name: "Gates of Gatot Kaca 1000", img: "https://i.postimg.cc/ZRx5dqfr/Gates-of-Gatot-Kaca-1000.png" },
                { name: "Gates of Olympus", img: "https://i.postimg.cc/7Y6Z5wSn/Gates-of-Olympus.png" },
                { name: "gates of olympus super", img: "https://i.postimg.cc/SRZQgvbm/gates-of-olympus-super.png" },
                { name: "Lucky Panda", img: "https://i.postimg.cc/CKjF31VT/Lucky-Panda.png" },
                { name: "Mahjong Wins 2", img: "https://i.postimg.cc/QCnsQKcH/Mahjong-Wins-2.png" },
                { name: "Mahjong Wins 3 Black Scatter", img: "https://i.postimg.cc/fRFpz19b/Mahjong-Wins-3-Black-Scatter.png" },{ name: "Panda s Fortune", img: "https://i.postimg.cc/7hFmzJgm/Panda-s-Fortune.png" },{ name: "Pandemic Rising", img: "https://i.postimg.cc/HW8Grwmh/Pandemic-Rising.png" },{ name: "Pompeii Megareels Megaways", img: "https://i.postimg.cc/pLZ4wkQN/Pompeii-Megareels-Megaways.png" }, { name: "Power of Merlin Megaways", img: "https://i.postimg.cc/JhYgnn2C/Power-of-Merlin-Megaways.png" }, { name: "Starlight Princess 1000", img: "https://i.postimg.cc/rFbKSCRq/Starlight-Princess-1000.png" }, { name: "Starlight Princess Super Scatter", img: "https://i.postimg.cc/nLxRhmk4/Starlight-Princess-Super-Scatter.png" }, { name: "Sugar Rush", img: "https://i.postimg.cc/br4LcSrC/Sugar-Rush.png" }, { name: "sugar rush1000", img: "https://i.postimg.cc/52BgT0V3/sugar-rush1000.png" }, { name: "Sweet Bonanza 1000", img: "https://i.postimg.cc/ht1wxMhZ/Sweet-Bonanza-Super-Scatter.png" }, { name: "Sweet Bonanza Super Scatter", img: "https://i.postimg.cc/ht1wxMhZ/Sweet-Bonanza-Super-Scatter.png" },{ name: "sweet rush bonanza", img: "https://i.postimg.cc/sfGNK3vT/sweet-rush-bonanza.png" },{ name: "The Dog House Megaways", img: "https://i.postimg.cc/DfGxL5Mr/The-Dog-House-Megaways.png" }, { name: "The Tweety House", img: "https://i.postimg.cc/rwZ1vtHS/The-Tweety-House.png" }, { name: "Vampy Party", img: "https://i.postimg.cc/T2jrTssq/Vampy-Party.png" }, { name: "Wild West Gold", img: "https://i.postimg.cc/FHzcgHHB/Wild-West-Gold.png" }, { name: "Wisdom of Athena 1000", img: "https://i.postimg.cc/G2wyCPxB/Wisdom-of-Athena-1000.png" }, { name: "Wrath of Nezha", img: "https://i.postimg.cc/cCTgwpyJ/Wrath-of-Nezha.png" },{ name: "Zeus vs Hades Gods of War", img: "https://i.postimg.cc/wBKvyqR8/Zeus-vs-Hades-Gods-of-War.png" },{ name: "Zombie School Megaways", img: "https://i.postimg.cc/bvjyYmWL/Zombie-School-Megaways.png"},
                  { name: "Anime Mecha Megaways", img: "https://i.postimg.cc/Fz5437K2/Anime-Mecha-Megaways.png" },
                  { name: "Aztec Gems", img: "https://i.postimg.cc/gjVPDmXX/Aztec-Gems.png" },
                  { name: "Big Bass Bonanza 1000", img: "https://i.postimg.cc/5NJJtYTb/Big-Bass-Bonanza-1000.png" },
                  { name: "Big Bass Splash", img: "https://i.postimg.cc/VkLcqyYN/Big-Bass-Splash.png" },
                  { name: "Bigger Bass Bonanza", img: "https://i.postimg.cc/RhRDhFJC/Bigger-Bass-Bonanza.png" },
                  { name: "Bonanza Gold", img: "https://i.postimg.cc/MZb4ds3w/Bonanza-Gold.png" },
                  { name: "Chests of Cai Shen 2", img: "https://i.postimg.cc/5N4rGwDk/Chests-of-Cai-Shen-2.png" },
                  { name: "Christmas Carol Megaways", img: "https://i.postimg.cc/nhMPVnFc/Christmas-Carol-Megaways.png" },
                  {name: "Fire Portals", 
  img: "https://i.postimg.cc/mD3m9XyV/Fire-Portals.png", // Pastikan link gambar sudah benar
  linkDemo: "https://demogamesfree.pragmaticplay.net/hub-demo/openGame.do?lang=id&cur=USD&gameSymbol=vswaysfirest3&jurisdiction=99" },
                  { name: "Fortune Ace Super Scatter", img: "https://i.postimg.cc/hvS2kBZj/Fortune-Ace-Super-Scatter.png" },
                  { name: "Fortune of Giza", img: "https://i.postimg.cc/sfc6pM12/Fortune-of-Giza.png" },
                  { name: "Gates of Gatot Kaca 1000", img: "https://i.postimg.cc/MKpstzj5/Gates-of-Gatot-Kaca-1000.png" },
                  { name: "Gates of Hades", img: "https://i.postimg.cc/NjWpgTCx/Gates-of-Hades.png" },
                  { name: "Gates of Olympus Xmas 1000", img: "https://i.postimg.cc/DZh6GhT0/Gates-of-Olympus-Xmas-1000.png" },
                  { name: "Great Rhino Megaways", img: "https://i.postimg.cc/hj0rbYDs/Great-Rhino-Megaways.png" },
                  { name: "Joker s Jewelsr", img: "https://i.postimg.cc/zvtF4RRx/Joker-s-Jewelsr.png" },
                  { name: "Madame Destiny Megaways", img: "https://i.postimg.cc/8PcHMwqM/Madame-Destiny-Megaways.png" },
                  { name: "Mahjong Wins Gong Xi Fa Cai", img: "https://i.postimg.cc/GhtQGzZj/Mahjong-Wins-Gong-Xi-Fa-Cai.png " },
                  { name: "Panda Fortune 2", img: "https://i.postimg.cc/pXrZzkgZ/Panda-Fortune-2.png" },
                  { name: "Power of Thor Megaways", img: "https://i.postimg.cc/KvjNBQdf/Power-of-Thor-Megaways.png " },
                  { name: "Pyramid Bonanza", img: "https://i.postimg.cc/fTyKm565/Pyramid-Bonanza.png" },
                  { name: "Rock Vegas", img: "https://i.postimg.cc/9zHQmLTj/Rock-Vegas.png" },
                  { name: "Rocket Blast Megaways", img: " https://i.postimg.cc/mhWgLmMW/Rocket-Blast-Megaways.png" },
                  { name: "Rujak Bonanza", img: "https://i.postimg.cc/kDPgJT8n/Rujak-Bonanza.png" },
                  { name: "Sweet Bonanza 1000 Dice", img: "https://i.postimg.cc/dDcVs5dQ/Sweet-Bonanza-1000-Dice.png" },
                  { name: "Sweet Bonanza Xmas", img: "https://i.postimg.cc/CdpxhcDd/Sweet-Bonanza-Xmas.png " },
                  { name: "Triple Pot Gold", img: "https://i.postimg.cc/BtfnSmD6/Triple-Pot-Gold.png" },
                  { name: "Wild West Gold Blazing Bounty", img: "https://i.postimg.cc/RqxZSgfW/Wild-West-Gold-Blazing-Bounty.png " },
                  { name: "Wild Wild Riches Megaways", img: "https://i.postimg.cc/nMfhF37s/Wild-Wild-Riches-Megaways.png" },
                  { name: "Zombie Train", img: "https://i.postimg.cc/z3YGzxWW/Zombie-Train.png " },
                  { name: "Big Bass Bonanza 1000", img: "https://i.postimg.cc/5NJJtYTb/Big-Bass-Bonanza-1000.png " },
                  { name: "Chests of Cai Shen 2", img: "https://i.postimg.cc/5N4rGwDk/Chests-of-Cai-Shen-2.png" },
                  { name: "Fortune Ace Super Scatter", img: "https://i.postimg.cc/hvS2kBZj/Fortune-Ace-Super-Scatter.png " },
                  { name: "Gates of Hades", img: "https://i.postimg.cc/NjWpgTCx/Gates-of-Hades.png" },
                  { name: "Madame Destiny Megaways", img: "https://i.postimg.cc/8PcHMwqM/Madame-Destiny-Megaways.png " },
                  { name: "Power of Thor Megaways", img: "https://i.postimg.cc/KvjNBQdf/Power-of-Thor-Megaways.png" },
                  { name: "Rocket Blast Megaways", img: "https://i.postimg.cc/mhWgLmMW/Rocket-Blast-Megaways.png " },
                  { name: "Triple Pot Gold", img: "https://i.postimg.cc/BtfnSmD6/Triple-Pot-Gold.png" },
                  { name: "Aztec King Megaways", img: "https://i.postimg.cc/GpVctKTX/Aztec-King-Megaways.png " },
                  { name: "Aztec King Megaways", img: "https://i.postimg.cc/N0SgFD2b/Barn-Festivalt.png" },
                  { name: "Barn Festivalt", img: "https://i.postimg.cc/N0SgFD2b/Barn-Festivalt.png" },
                  { name: "Bigger Bass Blizzard Christmas Catch", img: "https://i.postimg.cc/8C91c4ft/Bigger-Bass-Blizzard-Christmas-Catch.png " },
                  { name: "Buffalo King", img: "https://i.postimg.cc/d1CJyCGG/Buffalo-King.png" },
                  { name: "Cleocatra", img: "https://i.postimg.cc/pTjPFjKD/Cleocatra.png" },
                  { name: "Clover Gold", img: "https://i.postimg.cc/ZRNJdN6p/Clover-Gold.png" },
                  { name: "Club Tropicana", img: "https://i.postimg.cc/NMXQHXR6/Club-Tropicana.png" },
                  { name: "Fire Stampede Ultimate", img: "https://i.postimg.cc/ydR7ZR0y/Fire-Stampede-Ultimate.png" },
                  { name: "Fish Eye", img: "https://i.postimg.cc/W3ZskZ0m/Fish-Eye.png" },
                  { name: "Floating Dragon", img: "https://i.postimg.cc/RFtvHtwT/Floating-Dragon.png" },
                  { name: "Floating Dragon Dragon Boat Festival", img: "https://i.postimg.cc/rm4qr45C/Floating-Dragon-Dragon-Boat-Festival.png " },
                  { name: "Fruit Party", img: "https://i.postimg.cc/ydR7ZR0n/Fruit-Party.png" },
                  { name: "Fruits of the Amazon", img: "https://i.postimg.cc/W3ZskZ0X/Fruits-of-the-Amazon.png" },
                  { name: "Gold Party", img: " https://i.postimg.cc/JnXRkXjp/Gold-Party.png" },
                  { name: "Holiday Ride", img: "https://i.postimg.cc/G2DbyDv7/Holiday-Ride.png" },
                  { name: "Hot Fiesta", img: "https://i.postimg.cc/NMXQHXRP/Hot-Fiesta.png" },
                  { name: "Mahjong Wins Bonus", img: "https://i.postimg.cc/fLdM9dYr/Mahjong-Wins-Bonus.png " },
                  { name: "Muertos Multiplier Megaways", img: "https://i.postimg.cc/Qt7jT7pG/Muertos-Multiplier-Megaways.png" },
                  { name: "PIZZA PIZZA PIZZA", img: "https://i.postimg.cc/gJhGZh3C/PIZZA-PIZZA-PIZZA.png " },
                  { name: "Sugar Rush Xmas", img: "https://i.postimg.cc/HxMTyMQC/Sugar-Rush-Xmas.png" },
                  { name: "Wisdom of Athena", img: "https://i.postimg.cc/3RG3vGgT/Wisdom-of-Athena.png " },
                  
                

    ],


    "PGSOFT": [
      { name: "Mahjong Ways 2", img: "https://i.postimg.cc/Fzc5LCFC/Mahjong-Ways-2.png" },
      { name: "Lucky Neko", img: "https://i.postimg.cc/9XqjK0P7/Lucky-Neko.png" },
      { name: "Wild Bandito", img: "https://i.postimg.cc/k550cgX5/Wild-Bandito.png" },
      { name: "Caishen Wins", img: "https://i.postimg.cc/6qCg37zm/Caishen-Wins.png" },
      { name: "Mahjong Ways", img: "https://i.postimg.cc/1tkbs00c/Mahjong-Ways.png" },
        { name: "Captain s Bounty", img: "https://i.postimg.cc/fbkPdqBY/Captain-s-Bounty.png" },
        { name: "Double Fortune", img: "https://i.postimg.cc/V6CHGry6/Double-Fortune.png" },
        { name: "Dreams of Macau", img: "https://i.postimg.cc/Xq61Tj3L/Dreams-of-Macau.png" },
        { name: "Fortune Ox", img: "https://i.postimg.cc/x11prFDn/Fortune-Ox.png" },
        { name: "Ganesha Fortune", img: "https://i.postimg.cc/mrcdkzgn/Ganesha-Fortune.png" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
        { name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },{ name: "PG", img: "#" },
    ],


    "SPADEGAMING": [
      { name: "Hallo Win Party", img: "https://i.postimg.cc/W3Nx3pxV/Hallo-Win-Party.jpg" },
      { name: "Legacy Of Kong Maxways", img: "https://i.postimg.cc/4yM0B6y2/Legacy-Of-Kong-Maxways.jpg" },
      { name: "Legacy Of Kong Maxways", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "Legacy Of Kong Maxways", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "Legacy Of Kong Maxways", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "Legacy Of Kong Maxways", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },
      { name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },{ name: "SPADEGAMING", img: "#" },

    ],
    

    
    "MICROGAMING": [
      { name: "Hallo Win Party", img: "https://i.postimg.cc/W3Nx3pxV/Hallo-Win-Party.jpg" },
      { name: "Legacy Of Kong Maxways", img: "https://i.postimg.cc/4yM0B6y2/Legacy-Of-Kong-Maxways.jpg" },
      { name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },
      { name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },
      { name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },
      { name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },
      { name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },
      { name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },
      { name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },
      { name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },
      { name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },
      { name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },{ name: "MICROGAMING", img: "#" },
      
    
    ],


    
    "JILI": [
      { name: "Legacy of Kong", img: "https://i.postimg.cc/yYR4fZ02/d9c0b71a9d91fb4b2ed1d2d0882b7465.jpg" },
      { name: "Sugar Party", img: "https://i.postimg.cc/yYR4fZ02/d9c0b71a9d91fb4b2ed1d2d0882b7465.jpg" },
      { name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },
      { name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },
      { name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },
      { name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },
      { name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },
      { name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },
      { name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },
      { name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },{ name: "JILI", img: "#" },
    ],

  "BESOFT" : [
    { name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },
    { name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },
    { name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },
    { name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },
    { name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },
    { name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },
    { name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },
    { name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },{ name: "BESOFT", img: "#" },
  ],

  "FASTSPIN" : [
   { name: "FASTPIN", img: "#" }, { name: "FASTPIN", img: "#" },
   { name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },
   { name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },
   { name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },{ name: "FASTPIN", img: "#" },
  ]


    
  };

  const listGameTampil = databaseGame[providerName.toUpperCase()] || databaseGame["PRAGMATIC"];

  const allGames = listGameTampil.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 3. LOGIC ---
  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    const savedUser = localStorage.getItem("username");
    if (status === "true") setIsLoggedIn(true);
    if (savedUser) setUsername(savedUser);
  }, []);

useEffect(() => {
  // Cek apakah ada data login di memori browser
  const savedLogin = localStorage.getItem("isLoggedIn");
  const savedUser = localStorage.getItem("username");

  if (savedLogin === "true") {
    setIsLoggedIn(true);
    setUsername(savedUser || "MEMBER");
  }
}, []);


const handleLogin = async () => {
  // --- 1. VALIDASI KOSONG ---
  if (!loginData.username.trim() || !loginData.password.trim()) {
    setErrorNotif("Username dan Password jangan kosong.");
    setTimeout(() => setErrorNotif(""), 3000);
    return;
  }

setLoading(true);

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (data.success) {
      // --- SIMPAN DATA KE STORAGE ---
      localStorage.setItem("username", data.username);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userBalance", data.balance || 0); // Ambil saldo dari API

      // Update State agar langsung berubah di layar
      setIsLoggedIn(true);
      setUsername(data.username);
      setBalance(data.balance || 0);

      setTimeout(() => {
        router.push("/terms");
      }, 1000);
    } else {
      // --- 2. VALIDASI SALAH USERNAME/PASSWORD ---
      setLoading(false); 
      // Ambil pesan error dari API (misal: "Password Salah" atau "User Tidak Ditemukan")
      setErrorNotif(data.message || "Username/Password salah, Bos!");
      
      // Hilangkan otomatis setelah 3 detik
      setTimeout(() => setErrorNotif(""), 3000);
    }
  } catch (err) {
    setLoading(false);
    setErrorNotif("Waduh, koneksi internet Bos lagi bermasalah nih.");
    setTimeout(() => setErrorNotif(""), 3000);
  }
};


useEffect(() => {
  const savedLogin = localStorage.getItem("isLoggedIn");
  const savedUser = localStorage.getItem("username");
  const savedBalance = localStorage.getItem("userBalance");

  if (savedLogin === "true") {
    setIsLoggedIn(true);
    setUsername(savedUser);
    setBalance(Number(savedBalance) || 0); // Pastikan jadi angka
  }
}, []);


  // --- STATE TAMBAHAN UNTUK MODAL ---
// --- 1. STATE (Pastikan namanya demoUrl) ---
const [showModal, setShowModal] = useState(false);
const [selectedGame, setSelectedGame] = useState("");
const [demoUrl, setDemoUrl] = useState(""); // Pakai demoUrl
const [errorNotif, setErrorNotif] = useState("");
const [balance, setBalance] = useState(0); // Default 0

// --- 2. FUNGSI (Ganti setDemoLink jadi setDemoUrl) ---
const handlePlayGame = (gameName) => {
  // Ambil list game sesuai provider (PRAGMATIC / PGSOFT dll)
  const currentProvider = providerName.toUpperCase();
  const listGame = databaseGame[currentProvider] || [];

  // CARI GAME (Abaikan spasi berlebih dan huruf besar/kecil)
  const gameData = listGame.find(g => 
    g.name.toLowerCase().trim() === gameName.toLowerCase().trim()
  );

  console.log("Mencoba memuat game:", gameName); // Cek di console log

  setSelectedGame(gameName);

  if (gameData && gameData.linkDemo) {
    console.log("Link ditemukan:", gameData.linkDemo);
    setDemoUrl(gameData.linkDemo); // Pakai link dari database
  } else {
    // JIKA TIDAK KETEMU, JANGAN LANGSUNG ZEUS! 
    // Kita kasih link Fire Portals yang Boss minta tadi sebagai cadangan
    console.warn("Link tidak ada di database, menggunakan link cadangan.");
    setDemoUrl("https://demogamesfree.pragmaticplay.net/hub-demo/openGame.do?lang=id&cur=USD&gameSymbol=vswaysfirest3&jurisdiction=99");
  }

  setShowModal(true);
};
  return (
    <main 
      className="relative min-h-screen text-white font-sans flex flex-col items-center bg-fixed bg-cover bg-center pb-10"
      style={{ 
        backgroundImage: "url('https://i.postimg.cc/T1tLmHT3/c34add4d8367768901b200e5fcaa1108.jpg')",
        backgroundColor: "#1a0033" 
      }}
    >
         {loading && <LoadingOverlay />}
      {/* --- HEADER START --- */}

      {/* --- HEADER UTAMA --- */}
      <header ref={headerRef} className="w-full max-w-5xl bg-[#1a0033] shadow-2xl sticky top-0 z-[100] border-b border-[#D4AF37]/20 mx-auto">
        <div className="px-5 py-3 md:py-0 flex items-center md:items-stretch justify-between min-h-[60px] md:min-h-[120px]"> 
          {!isLoggedIn ? (
            <>
              <div className="flex md:hidden w-full justify-center items-center">
                <img src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" alt="Logo" className="h-12 w-auto drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] object-contain" />
              </div>

              <div className="hidden md:flex flex-1 items-center justify-start">
                <img src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" alt="Logo" className="h-28 md:h-32 w-auto drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] object-contain" />
              </div>

                     {/* --- PANEL LOGIN DESKTOP --- */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-end py-2">
          <div className="w-full max-w-[450px] flex flex-col gap-1.5">
            {/* INPUT LOGIN */}
            <div className="flex items-center gap-1 w-full">
              <input 
    type="text" 
    name="username" // Tambahkan identitas
    value={loginData.username} // Hubungkan ke state
    onChange={(e) => setLoginData({...loginData, username: e.target.value})} // Simpan ketikan user
    placeholder="Username" 
    className="bg-white text-black px-4 py-2 rounded text-[11px] flex-1 min-w-0 outline-none border border-zinc-300" 
  />
  <input 
  type="password" 
  name="password"
  value={loginData.password}
  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
  // --- TAMBAHAN BIAR BISA ENTER ---
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }}
  placeholder="Password" 
  className="bg-white text-black px-4 py-2 rounded text-[11px] flex-1 min-w-0 outline-none border border-zinc-300" 
/>
<button 
  onClick={handleLogin} 
  disabled={loading}    
  className="bg-[#c5a021] hover:bg-yellow-500 text-black font-black px-5 py-2 rounded text-[11px] uppercase whitespace-nowrap disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center justify-center min-w-[80px]"
>
  {loading ? (
    <div className="flex items-center gap-1">
      {/* Spinner kecil di dalam tombol */}
      <svg className="animate-spin h-3 w-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  ) : "LOGIN"}
</button>      </div>
                  <div className="bg-[#5D3FD3] rounded-full p-0.5 shadow-lg w-full">
                    <div className="flex justify-between items-center text-white">
                      <button onClick={() => router.push('/promosi')} className="flex-1 py-2.5 rounded-full hover:bg-black/10 text-[9px] font-bold uppercase flex items-center justify-center gap-1">🎁 PROMOSI</button>
                      <button onClick={() => router.push('/hubungi')} className="flex-1 py-2.5 rounded-full hover:bg-black/10 text-[9px] font-bold uppercase flex items-center justify-center gap-1 border-l border-white/10">🎧 HUBUNGI</button>
                      <button onClick={() => router.push('/daftar')} className="flex-1 py-2.5 rounded-full hover:bg-black/10 text-[9px] font-bold uppercase flex items-center justify-center gap-1 border-l border-white/10 text-yellow-300">👤 DAFTAR</button>
                      <div className="flex-1 relative"> 
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowLainnya(!showLainnya); }} 
                          className={`w-full py-2.5 rounded-full transition-all text-[9px] font-bold uppercase flex items-center justify-center gap-1 border-l border-white/10 ${showLainnya ? 'bg-yellow-400 text-black' : 'hover:bg-black/10 text-white'}`}
                        >
                          <span>💬</span><span className="font-black uppercase tracking-tighter">Lainnya</span>
                        </button>
                        {showLainnya && (
                          <div className="absolute top-[130%] right-0 w-60 bg-white rounded-xl shadow-2xl z-[999] border border-gray-200 overflow-hidden text-black text-left">
                            {menuLainnya.map((item, idx) => (
                              <a key={idx} href={item.link} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-0 transition-colors">
                                <span className="text-lg">{item.icon}</span><span className="text-[11px] font-bold">{item.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between py-2">
              <img src="https://i.postimg.cc/BvTrMrkD/logo-abong.png" className="h-10 w-auto md:h-16" alt="Logo" />
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-[10px] text-gray-400">Selamat Datang,</p>
                  <p className="text-sm font-bold text-[#D4AF37]">{username || "MEMBER"}</p>
                </div>
                <button 
                  onClick={() => { localStorage.clear(); window.location.reload(); }}
                  className="bg-red-600 px-2 py-1 rounded text-[9px] font-bold shadow-md"
                >LOGOUT</button>
              </div>
            </div>
          )}
        </div>
      </header>


      {/* --- KONTEN UTAMA (Container Tanpa Transparansi) --- */}
      <div className="w-full max-w-5xl bg-[#1a0033] px-5 pt-6 pb-20 shadow-2xl">
        <button 
          onClick={() => router.back()} 
          className="mb-6 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-lg font-black text-xs uppercase shadow-md active:scale-95 transition-all"
        >
          ❮ Kembali
        </button>
        

{/* SECTION: PALING POPULER - FIX BERANTAKAN & UKURAN SAMA */}
<div className="w-full">
  <section id="populer" className="w-full bg-[#1a0033] py-4 shadow-2xl">
    {/* Judul dengan Border Tipis */}
    <div className="flex items-center gap-2 mb-4 px-4 border-b border-[#D4AF37]/20 pb-3">
      <span className="text-lg">🔥</span>
      <h2 className="text-[13px] font-black uppercase text-white tracking-widest">
        {providerName} Terpopuler
      </h2>
    </div>
    
    {/* Container Scroll */}
    <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x scrollbar-blur">
      {[
        { name: "Gates of Olympus", prov: "PRAGMATIC", img: "https://i.postimg.cc/bYg5N5Bs/vs20olympgate.png" },
        { name: "Starlight Princess 1000", prov: "PRAGMATIC", img: "https://i.postimg.cc/FH5CPQd4/Starlight-Princess-1000.png" },
        { name: "Sweet Rush Bonanza", prov: "PRAGMATIC", img: "https://i.postimg.cc/Kzz0KGV3/Sweet-Rush-Bonanza.png" },
        { name: "Sweet Rush Bonanza", prov: "PRAGMATIC", img: "https://i.postimg.cc/Kzz0KGV3/Sweet-Rush-Bonanza.png" },
        { name: "Sweet Rush Bonanza", prov: "PRAGMATIC", img: "https://i.postimg.cc/Kzz0KGV3/Sweet-Rush-Bonanza.png" },
        { name: "Sweet Rush Bonanza", prov: "PRAGMATIC", img: "https://i.postimg.cc/Kzz0KGV3/Sweet-Rush-Bonanza.png" },
        { name: "Sweet Rush Bonanza", prov: "PRAGMATIC", img: "https://i.postimg.cc/Kzz0KGV3/Sweet-Rush-Bonanza.png" },


        { name: "Mahjong Ways", prov: "PGSOFT", img: "https://i.postimg.cc/DfQTQ5Y0/mahjong-ways.png" },
        { name: "Mahjong Ways 2", prov: "PGSOFT", img: "https://i.postimg.cc/CKfyR4qw/mahjong-ways2.png" },
        { name: "Wild Bounty", prov: "PGSOFT", img: "https://i.postimg.cc/gjm1BFBZ/wilbonty.png" },
        { name: "Wild Bandito", prov: "PGSOFT", img: "https://i.postimg.cc/k4dHBPCN/wild-bandito.png" },
        { name: "Queen Bounty", prov: "PGSOFT", img: "https://i.postimg.cc/pdKGNcjr/queen-bounty.png" },
        { name: "Queen Bounty", prov: "PGSOFT", img: "https://i.postimg.cc/pdKGNcjr/queen-bounty.png" },
        { name: "Queen Bounty", prov: "PGSOFT", img: "https://i.postimg.cc/pdKGNcjr/queen-bounty.png" },
        { name: "Queen Bounty", prov: "PGSOFT", img: "https://i.postimg.cc/pdKGNcjr/queen-bounty.png" },


        { name: "Hallo Win Party", prov: "SPADEGAMING", img: "https://i.postimg.cc/W3Nx3pxV/Hallo-Win-Party.jpg" },
        { name: "Legacy Of Kong Maxways", prov: "SPADEGAMING", img: "https://i.postimg.cc/4yM0B6y2/Legacy-Of-Kong-Maxways.jpg" },
        { name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },
        { name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },
        { name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },
        { name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },{ name: "#", prov: "SPADEGAMING", img: "#" },

        { name: "Queen Bounty", prov: "MICROGAMING", img: "https://i.postimg.cc/pdKGNcjr/queen-bounty.png" },
        { name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },
        { name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },
        { name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },
        { name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },{ name: "#", prov: "MICROGAMING", img: "#" },

        { name: "Queen Bounty", prov: "JILI", img: "https://i.postimg.cc/pdKGNcjr/queen-bounty.png" },
        { name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },
        { name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },
        { name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },{ name: "#", prov: "JILI", img: "#" },
      
      { name: "#", prov: "BESOFT", img: "#" },
      { name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },
      { name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },
      { name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },{ name: "#", prov: "BESOFT", img: "#" },
      
      { name: "#", prov: "FASTSPIN", img: "#" }, { name: "#", prov: "FASTSPIN", img: "#" },{ name: "#", prov: "FASTSPIN", img: "#" }, { name: "#", prov: "FASTSPIN", img: "#" },
      { name: "#", prov: "FASTSPIN", img: "#" }, { name: "#", prov: "FASTSPIN", img: "#" },{ name: "#", prov: "FASTSPIN", img: "#" }, { name: "#", prov: "FASTSPIN", img: "#" },
      { name: "#", prov: "FASTSPIN", img: "#" }, { name: "#", prov: "FASTSPIN", img: "#" },{ name: "#", prov: "FASTSPIN", img: "#" }, { name: "#", prov: "FASTSPIN", img: "#" },
      { name: "#", prov: "FASTSPIN", img: "#" }, { name: "#", prov: "FASTSPIN", img: "#" },{ name: "#", prov: "FASTSPIN", img: "#" }, { name: "#", prov: "FASTSPIN", img: "#" },


      ]
      .filter((game) => game.prov.toUpperCase() === providerName.toUpperCase())
      .map((game, i) => (
        <div 
          key={i} 
          onClick={() => handlePlayGame(game.name)}
          className="w-[140px] min-w-[140px] md:w-[180px] md:min-w-[180px] bg-white border border-[#D4AF37]/30 rounded-xl overflow-hidden shadow-lg snap-start flex-shrink-0"
        >
          {/* Container Gambar: KUNCI UKURAN DI SINI */}
          <div className="aspect-square w-full relative overflow-hidden bg-black">
            <img 
              src={game.img} 
              className="w-full h-full object-cover" 
              alt={game.name} 
            />
            {/* Overlay Play */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full">
                {isLoggedIn ? "PLAY" : "🔒 LOGIN"}
              </span>
            </div>
          </div>

          {/* Info Game: Tinggi dikunci agar tidak naik turun */}
          <div className="p-2 h-[50px] flex flex-col justify-center bg-[#1a0033]/90">
            <p className="text-[10px] md:text-[11px] font-bold text-white uppercase truncate leading-tight">
              {game.name}
            </p>
            <p className="text-[7px] text-yellow-500 font-bold uppercase tracking-tighter mt-0.5">
              {game.prov}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
</div>


<div className="w-full md:max-w-5xl md:mx-auto"> 
  
  {/* SECTION: MAIN GRID DAFTAR GAME */}
  <section className=" rounded-t-[1rem] md:rounded-t-[1rem] p-4 md:p-6 min-h-100px shadow-inner w-full">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-4 px-2">
      <div className="flex items-center gap-3">
        <div className="h-5 w-1.5 bg-red-600 rounded-full"></div>
        <span className="text-white-900 font-white text-[14px] md:text-xs uppercase tracking-tight">
          {providerName} PLAY
        </span>
      </div>
      <div className="relative">
        <input 
          type="text" 
          placeholder="Cari game..." 
          className="bg-gray-100 border border-gray-200 rounded-full px-8 py-2 text-[10px] md:text-[11px] text-black outline-none w-32 md:w-48 focus:ring-2 focus:ring-red-500/20 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute left-3 top-2.5 text-[10px] opacity-40">🔍</span>
      </div>
    </div>

    {/* Grid Game: Full Kiri Kanan di Mobile */}
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
      {allGames.map((game, i) => (
        <div 
          key={i} 
          onClick={() => handlePlayGame(game.name)} 
          className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
        >
          <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-md border border-gray-100 aspect-square w-full relative">
            <img src={game.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={game.name} />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <span className="bg-yellow-500 text-black rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[9px] md:text-[10px] font-black shadow-xl scale-75 group-hover:scale-100 transition-transform">
                {isLoggedIn ? "PLAY" : "🔒 LOGIN"}
              </span>
            </div>
          </div>
          <p className="text-[9px] md:text-[10px] text-white-700 font-white mt-2 text-center leading-tight uppercase px-1 h-8 overflow-hidden">
            {game.name}
          </p>
        </div>
      ))}
    </div>
  </section>
</div>



{/* --- POP-UP MODAL GAME DEMO (GANTI YANG LAMA DENGAN INI) --- */}
{showModal && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md p-2 md:p-6">
    <div className="relative bg-[#1a0033] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-yellow-500/50 animate-in fade-in zoom-in duration-300">
      
      {/* Header Modal: Nama Game & Tombol Close */}
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#1a0033] to-[#330066] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-white font-black text-[11px] md:text-xs uppercase tracking-tighter">
            Mode Demo: {selectedGame}
          </h3>
        </div>
        <button 
          onClick={() => setShowModal(false)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-full text-[10px] transition-all active:scale-90"
        >
          TUTUP [X]
        </button>
      </div>

     {/* Area Game: Tempat Iframe Berada */}
<div className="relative w-full aspect-video bg-black shadow-inner">
  <iframe 
    src={demoUrl}  // <--- GANTI JADI INI BOSS! WAJIB PAKAI KURUNG KURAWAL
    className="w-full h-full border-none"
    allowFullScreen
  ></iframe>
</div>
      {/* Footer Modal: Tombol Daftar/Login */}
      <div className="p-3 flex flex-col md:flex-row items-center justify-between gap-3 bg-[#1a0033]">
        <p className="text-gray-400 text-[9px] md:text-[10px] text-center md:text-left">
          Saldo demo habis? <span className="text-yellow-500 font-bold italic">Refresh halaman</span> untuk isi ulang saldo demo kamu.
        </p>
        <button 
          className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-black py-2 px-8 rounded-full text-[11px] uppercase shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all active:scale-95"
          onClick={() => router.push('/register')} // Arahkan ke daftar
        >
          Main Uang Asli 🎰
        </button>
      </div>

    </div>
  </div>
)}



{/* POP UP NOTIFIKASI ERROR KECIL */}
{errorNotif && (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10001] animate-in fade-in slide-in-from-top-4 duration-300">
    <div className="bg-white/95 backdrop-blur-sm border-l-4 border-red-600 shadow-xl rounded-lg p-3 flex items-center gap-3 min-w-[300px]">
      {/* Ikon Bulat Merah */}
      <div className="bg-red-600 rounded-full p-1">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      
      {/* Pesan Error */}
      <span className="text-red-700 font-bold text-[11px] flex-1">
        {errorNotif}
      </span>

      {/* Tombol Tutup Kecil */}
      <button 
        onClick={() => setErrorNotif("")}
        className="bg-red-600 text-white text-[9px] px-2 py-1 rounded font-black hover:bg-red-700 transition-colors uppercase"
      >
        Tutup
      </button>
    </div>
  </div>
)}








      
{/* --- FLOATING SIDEBAR MENU (ADAPTIVE POSITION) --- */}
<div className="fixed 
  /* Tampilan Mobile: Bawah Kanan */
  bottom-32 right-4 
  /* Tampilan Desktop: Kiri Tengah */
  md:bottom-auto md:right-auto md:left-0 md:top-1/2 md:-translate-y-1/2 
  z-[100] flex flex-col gap-2 items-end md:items-start">
  
<a href="#" className="group flex flex-row-reverse items-center bg-[#1a0033]/95 border border-[#D4AF37] rounded-full md:rounded-l-none md:rounded-r-full p-1.5 transition-all duration-500 shadow-[5px_5px_15px_rgba(0,0,0,0.6)]">
    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
      <img 
        src="https://img-mgscorp.kangpermen13.workers.dev/whatsapp-converter.webp" 
        alt="WA" 
        className="w-full h-full object-contain p-1.5" // Ukuran penuh dengan sedikit jarak aman
      />
    </div>
    <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-500 ease-in-out text-[#D4AF37] font-black text-xs uppercase whitespace-nowrap px-0 group-hover:pl-4 group-hover:pr-2">
      WhatsApp
    </span>
  </a>

  {/* 2. RTP Gacor */}
  <a href="#" className="hidden md:flex group flex-row-reverse items-center bg-[#1a0033]/95 border border-[#D4AF37] rounded-l-none rounded-r-full p-1.5 transition-all duration-500 shadow-[5px_5px_15px_rgba(0,0,0,0.6)]">
    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10 animate-pulse overflow-hidden">
      <img 
        src="https://img-mgscorp.kangpermen13.workers.dev/rtpslot-webp-converter.webp" 
        alt="RTP" 
        className="w-full h-full object-contain p-1" // P-1 supaya lebih mepet ke pinggir (lebih besar)
      />
    </div>
    <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-500 ease-in-out text-[#D4AF37] font-black text-xs uppercase whitespace-nowrap px-0 group-hover:pl-4 group-hover:pr-2">
      RTP Gacor
    </span>
  </a>

  {/* 3. Live Chat */}
  <a href="#" className="group flex flex-row-reverse items-center bg-[#1a0033]/95 border border-[#D4AF37] rounded-full md:rounded-l-none md:rounded-r-full p-1.5 transition-all duration-500 shadow-[5px_5px_15px_rgba(0,0,0,0.6)]">
    <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
      <img 
        src="https://img-mgscorp.kangpermen13.workers.dev/livechat-converter.webp" 
        alt="LIVECHAT" 
        className="w-full h-full object-contain p-1.5" 
      />
    </div>
    <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-500 ease-in-out text-white font-black text-xs uppercase whitespace-nowrap px-0 group-hover:pl-4 group-hover:pr-2">
      Live Chat
    </span>
  </a>
</div>

<nav className="fixed bottom-0 left-0 right-0 z-[130] bg-black border-t border-yellow-500/30 md:hidden flex items-center justify-around py-3 backdrop-blur-lg pointer-events-auto">
        <button 
          onClick={() => { console.log("Beranda klik"); router.push('/'); }} 
          className={`flex flex-col items-center flex-1 ${halamanAktif === 'utama' ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Beranda</span>
        </button>

        <button 
          onClick={() => { 
            console.log("Promo klik"); 
            setHalamanAktif('promosi');
            router.push('/promosi'); 
          }} 
          className={`flex flex-col items-center flex-1 ${halamanAktif === 'promosi' ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          <span className="text-xl">🎁</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Promo</span>
        </button>

        <button 
          onClick={() => router.push('/hubungi')} 
          className="flex flex-col items-center flex-1 text-gray-400"
        >
          <span className="text-xl">🎧</span>
          <span className="text-[9px] font-black uppercase tracking-tighter">Bantuan</span>
        </button>

        <button 
  onClick={() => setShowLainnya(true)} 
  className="flex flex-col items-center flex-1 text-gray-400"
>
  <span className="text-xl">💬</span>
  <span className="text-[9px] font-black uppercase tracking-tighter">Lainnya</span>
</button>


      </nav>
        <div className="h-0 w-full"></div>
      </div>
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a0033] flex items-center justify-center text-white">Memuat Games...</div>}>
      <GameSlotContent />
    </Suspense>
  );
}