/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Noroff API key, created once https://docs.noroff.dev/docs/v2/auth/api-key */
  readonly VITE_NOROFF_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
