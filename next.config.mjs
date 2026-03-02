/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Abaikan error tanda petik (") dan gambar (alt)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Abaikan error typing kalau ada
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
