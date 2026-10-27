import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  async redirects() {
    // Home was 404ing client-side; About is the landing page.
    return [{ source: "/", destination: "/about", permanent: false }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "substackcdn.com", pathname: "/**" },
      { protocol: "https", hostname: "substack-post-media.s3.amazonaws.com", pathname: "/**" },
      { protocol: "https", hostname: "www.soundromeda.com", pathname: "/**" },
      { protocol: "https", hostname: "tdengine.com", pathname: "/**" },
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" },
    ],
  },
};

export default withMDX(nextConfig);
