import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@react-pdf/renderer",
    "@mastra/core",
    "thread-stream",
    "pino",
  ],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
