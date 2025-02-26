import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'shwqwrdsym.ufs.sh'
      }
    ]
  }
};

export default nextConfig;
