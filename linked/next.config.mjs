/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'links.papareact.com',
          },
          {
            protocol: 'https',
            hostname: 'limg.clerk.com',
          },
          {
            protocol: 'https',
            hostname: 'getlinked.blob.core.windows.net',
          },
        ],
      },
};

export default nextConfig;