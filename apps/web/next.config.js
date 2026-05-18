// apps/web/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Memastikan library ikon lucide terproses dengan benar di Next.js 15
  transpilePackages: ["lucide-react"],
  // Melewati pengecekan ESLint saat proses build di Vercel untuk menghindari error path monorepo
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;