import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient, debounce, type AddressSearchResult } from '@/lib/api';
import { ENV_CONFIG } from '@/lib/env';

export interface UseAddressAutocompleteOptions {
  minSearchLength?: number;
  debounceDelay?: number;
  maxResults?: number;
}

export interface UseAddressAutocompleteReturn {
  suggestions: AddressSearchResult[];
  isLoading: boolean;
  error: string | null;
  searchAddresses: (query: string) => void;
  clearSuggestions: () => void;
  selectSuggestion: (suggestion: AddressSearchResult) => void;
}

export const useAddressAutocomplete = (
  options: UseAddressAutocompleteOptions = {}
): UseAddressAutocompleteReturn => {
  const {
    minSearchLength = ENV_CONFIG.AUTOCOMPLETE.MIN_SEARCH_LENGTH,
    debounceDelay = ENV_CONFIG.AUTOCOMPLETE.DEBOUNCE_DELAY,
    maxResults = ENV_CONFIG.AUTOCOMPLETE.MAX_RESULTS,
  } = options;

  const [suggestions, setSuggestions] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (query.length < minSearchLength) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.searchAddresses(query);

      console.log('Hook - Full response:', response);
      console.log('Hook - Response success:', response.success);
      console.log('Hook - Response data:', response.data);
      console.log('Hook - Data length:', response.data?.length);

      if (response.success && response.data) {
        // Apply maxResults limit here if needed
        const limitedResults = maxResults ? response.data.slice(0, maxResults) : response.data;
        console.log('Hook - Limited results:', limitedResults);
        setSuggestions(limitedResults);
      } else {
        console.log('Hook - Error or no data:', response.error);
        setError(response.error || 'Failed to search addresses');
        setSuggestions([]);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [minSearchLength, maxResults]);

  const debouncedSearch = useCallback((query: string) => {
    const debouncedFn = debounce(performSearch, debounceDelay);
    debouncedFn(query);
  }, [performSearch, debounceDelay]);

  const searchAddresses = useCallback((query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    debouncedSearch(query);
  }, [debouncedSearch]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
    
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const selectSuggestion = useCallback((suggestion: AddressSearchResult) => {
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    searchAddresses,
    clearSuggestions,
    selectSuggestion,
  };
};