import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Villa photography is served from /public for now. When photos move to a
    // CDN or Booking.com-hosted URLs, add the hostnames here.
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
