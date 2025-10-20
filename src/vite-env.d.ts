/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_API_BEARER_TOKEN: string
  readonly VITE_API_KEY: string
  readonly VITE_ENABLE_VOICE_INPUT: string
  readonly VITE_ENABLE_ADDRESS_AUTOCOMPLETE: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_AUTOCOMPLETE_MIN_SEARCH_LENGTH: string
  readonly VITE_AUTOCOMPLETE_DEBOUNCE_DELAY: string
  readonly VITE_AUTOCOMPLETE_MAX_RESULTS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
