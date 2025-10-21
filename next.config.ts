const nextConfig = {
  // images 설정을 추가합니다.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint 오류도 무시하려면 다음을 추가
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
