const nextConfig = {
  images: {
    remotePatterns: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'], // Add domains you load images from
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};

export default nextConfig;
