/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
}

// biome-ignore lint/correctness/noUnusedVariables: type override
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
