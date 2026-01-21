export const siteConfig = {
  name: "Web Container Builder",
  description: "Build your next project with ease.",
  apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  apiBuildUrl: process.env.NEXT_PUBLIC_API_BUILD_URL,
};

export type SiteConfig = typeof siteConfig;
