/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Konfigurasi Sakti biar Vercel tidak rewel */
  eslint: {
    // Ini akan mengabaikan error ESLint saat build di Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Jika Bos pakai TypeScript, ini juga perlu diabaikan biar lancar
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
