/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  // Ensure environment variables are available to middleware
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  webpack: (config, { isServer }) => {
    // Fix for tree-sitter native bindings
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "tree-sitter": "commonjs tree-sitter",
        "tree-sitter-typescript": "commonjs tree-sitter-typescript",
        "tree-sitter-javascript": "commonjs tree-sitter-javascript",
      });

      // Ignore .node files
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /\.node$/,
        use: "node-loader",
      });
    }

    return config;
  },
};
