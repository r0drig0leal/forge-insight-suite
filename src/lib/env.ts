/**
 * Environment Configuration
 * 
 * This file contains environment-specific configuration.
 * In a production app, these would typically come from environment variables.
 */

export const ENV_CONFIG = {
  // API Configuration
  API: {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://api.propertyforgeai.com:3000',
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '5000'),
    
    // Authentication
    AUTH: {
      BEARER_TOKEN: import.meta.env.VITE_API_BEARER_TOKEN || '7f2e1c9a-auctions-2025',
      API_KEY: import.meta.env.VITE_API_KEY || '7f2e1c9a-auctions-2025',
    },
  },

  // Feature Flags
  FEATURES: {
    VOICE_INPUT: import.meta.env.VITE_ENABLE_VOICE_INPUT !== 'false',
    ADDRESS_AUTOCOMPLETE: import.meta.env.VITE_ENABLE_ADDRESS_AUTOCOMPLETE !== 'false',
    DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV,
  },

  // Application Settings
  APP: {
    NAME: 'PropertyForge AI',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  },

  // Autocomplete Settings
  AUTOCOMPLETE: {
    MIN_SEARCH_LENGTH: parseInt(import.meta.env.VITE_AUTOCOMPLETE_MIN_SEARCH_LENGTH || '2'),
    DEBOUNCE_DELAY: parseInt(import.meta.env.VITE_AUTOCOMPLETE_DEBOUNCE_DELAY || '300'),
    MAX_RESULTS: parseInt(import.meta.env.VITE_AUTOCOMPLETE_MAX_RESULTS || '8'),
  },
} as const;

// Type-safe environment checker
export const isProduction = () => ENV_CONFIG.APP.ENVIRONMENT === 'production';
export const isDevelopment = () => ENV_CONFIG.APP.ENVIRONMENT === 'development';
export const isDebugMode = () => ENV_CONFIG.FEATURES.DEBUG_MODE;

// Validation helper
export const validateEnvironment = () => {
  const required = [
    { key: 'API_BEARER_TOKEN', value: ENV_CONFIG.API.AUTH.BEARER_TOKEN },
    { key: 'API_KEY', value: ENV_CONFIG.API.AUTH.API_KEY },
  ];

  const missing = required.filter(({ value }) => !value);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing.map(({ key }) => key));
  }

  return missing.length === 0;
};