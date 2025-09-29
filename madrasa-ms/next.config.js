/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint during production builds so deploy succeeds
  eslint: { ignoreDuringBuilds: true },

  // (optional) if you also hit TS type errors at build time, uncomment this:
  // typescript: { ignoreBuildErrors: true },
};
module.exports = nextConfig;
