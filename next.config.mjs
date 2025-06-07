/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    images: {
        unoptimized: true, // Important for static export if you use <Image />
        domains: ['lh3.googleusercontent.com'], // Allow Google profile pics
    },
};

export default nextConfig;
