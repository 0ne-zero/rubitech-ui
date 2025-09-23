/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_ANALYTICS_KEY?: string;
  readonly VITE_API_BASE_URL: string
  readonly VITE_PROFILE_PICTURE_BASE_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
