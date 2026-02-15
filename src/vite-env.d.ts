/// <reference types="vite/client" />

declare module "react/jsx-runtime";

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
