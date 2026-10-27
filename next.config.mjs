/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  // `STATIC_EXPORT=1 npm run build` produces a fully static site in /out (any static host works).
  ...(process.env.STATIC_EXPORT ? { output: 'export', images: { unoptimized: true }, trailingSlash: true } : {}),
};

export default nextConfig;
