import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.EDGE PORTFOLIO.app",
  appName: "Edge Portfolio",
  webDir: "public",
  server: {
    url: "https://xn--thsoros-cya.com",
    cleartext: false,
  },
};

export default config;