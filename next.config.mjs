/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backend =
      process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:4000"
        : "https://4u-backend-production.up.railway.app";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
}

export default nextConfig
