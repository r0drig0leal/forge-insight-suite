import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { AddressSearchResult } from '@/lib/api';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: AddressSearchResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ 
  value, 
  onChange, 
  onSelect,
  placeholder = "Enter property address to search...",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const { suggestions, isLoading, error, searchAddresses } = useAddressAutocomplete();

  console.log('🔍 AddressAutocomplete - Rendering:', {
    value,
    isOpen,
    suggestionsCount: suggestions.length,
    isLoading,
    error
  });

  useEffect(() => {
    if (value.trim().length >= 2) {
      searchAddresses(value);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [value, searchAddresses]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('📝 Input changed:', newValue);
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: AddressSearchResult) => {
    console.log('🎯 Suggestion clicked:', suggestion);
    onChange(suggestion.address_display || suggestion.formattedAddress || suggestion.address);
    setIsOpen(false);
    onSelect?.(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const showDropdown = isOpen && (suggestions.length > 0 || isLoading || error);

  return (
    <div className={`relative w-full ${className}`}>
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value.trim().length >= 2) {
            setIsOpen(true);
          }
        }}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full"
        autoComplete="off"
        disabled={disabled}
      />

      {showDropdown && (
        <Card className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-auto z-50 shadow-lg border bg-white">
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <LoadingSpinner />
              <span className="ml-2 text-sm text-gray-600">Searching addresses...</span>
            </div>
          )}

          {error && (
            <div className="p-4 text-sm text-red-600">
              Error searching addresses: {error}
            </div>
          )}

          {!isLoading && !error && suggestions.length === 0 && value.trim().length >= 2 && (
            <div className="p-4 text-sm text-gray-500">
              No addresses found for "{value}"
            </div>
          )}

          {!isLoading && !error && suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id || index}
              className={`p-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                index === selectedIndex 
                  ? 'bg-blue-50 text-blue-900' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium text-sm">
                {suggestion.address_display || suggestion.formattedAddress || suggestion.address}
              </div>
              {suggestion.city && (
                <div className="text-xs text-gray-600 mt-1">
                  {suggestion.city}, {suggestion.state}
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};