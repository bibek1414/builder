import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.nepdora.baliyoventures.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'nepdora.baliyoventures.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com',
                pathname: '/**',
            }
        ],
    },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        source: '/webcontainer/connect/:token*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  reactStrictMode: false,
};

export default nextConfig;
