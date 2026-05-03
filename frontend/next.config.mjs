/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Ensure trailing slashes are added for static hosting compatibility
  trailingSlash: true,
  // Disable image optimization API since we are doing a static export
  images: {
    unoptimized: true,
  },
  // Fix workspace root detection
  outputFileTracingRoot: process.cwd(),
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
