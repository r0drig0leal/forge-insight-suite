# Address Autocomplete Feature

## Overview

This feature provides intelligent address autocomplete functionality with real-time API integration for property searches.

## Features

- ✅ **Real-time Address Search**: Integrates with backend API for live address suggestions
- ✅ **Debounced Requests**: Optimized to prevent API spam with configurable debouncing
- ✅ **Keyboard Navigation**: Full keyboard support (Arrow keys, Enter, Escape)
- ✅ **Voice Input Integration**: Compatible with existing voice input functionality
- ✅ **Error Handling**: Graceful error handling with user-friendly messages
- ✅ **Loading States**: Visual feedback during API requests
- ✅ **Accessibility**: ARIA attributes for screen readers
- ✅ **Responsive Design**: Works on all device sizes

## API Integration

### Endpoint
```
GET /api/address?search={query}
```

### Configuration
- **Base URL**: `http://192.168.0.105:3000`
- **Authentication**: Bearer Token + API Key
- **Timeout**: 5 seconds

### Headers
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer 7f2e1c9a-auctions-2025',
  'x-api-key': '7f2e1c9a-auctions-2025'
}
```

## Implementation

### Files Created/Modified

1. **`/src/lib/api.ts`** - API client and configuration
2. **`/src/lib/env.ts`** - Environment configuration
3. **`/src/hooks/useAddressAutocomplete.ts`** - Custom hook for autocomplete logic
4. **`/src/components/AddressAutocomplete.tsx`** - Reusable autocomplete component
5. **`/src/components/PropertyInput.tsx`** - Updated to use autocomplete
6. **`.env.example`** - Environment variables template

### Usage Example

```tsx
import { AddressAutocomplete } from '@/components/AddressAutocomplete';

function MyComponent() {
  const [address, setAddress] = useState('');
  
  const handleAddressSelect = (selectedAddress) => {
    console.log('Selected:', selectedAddress);
  };

  return (
    <AddressAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleAddressSelect}
      placeholder="Enter address..."
    />
  );
}
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# API Settings
VITE_API_BASE_URL=http://192.168.0.105:3000
VITE_API_BEARER_TOKEN=your-bearer-token
VITE_API_KEY=your-api-key

# Autocomplete Settings
VITE_AUTOCOMPLETE_MIN_SEARCH_LENGTH=2
VITE_AUTOCOMPLETE_DEBOUNCE_DELAY=300
VITE_AUTOCOMPLETE_MAX_RESULTS=8
```

### Customization Options

```typescript
// Hook options
const autocomplete = useAddressAutocomplete({
  minSearchLength: 2,     // Minimum characters before search
  debounceDelay: 300,     // Delay between API calls (ms)
  maxResults: 8,          // Maximum suggestions to show
});
```

## API Response Format

Expected response format from `/api/address?search={query}`:

```typescript
{
  success: boolean;
  data: Array<{
    id: string;
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    formattedAddress?: string;
  }>;
  message?: string;
  error?: string;
}
```

## Error Handling

The system handles various error scenarios:

- **Network Errors**: Connection timeouts, server unavailable
- **API Errors**: Invalid responses, authentication failures
- **User Errors**: Empty queries, cancelled requests

## Performance Optimizations

- **Debouncing**: Prevents excessive API calls
- **Request Cancellation**: Cancels previous requests when new ones are made
- **Memory Management**: Proper cleanup on component unmount
- **Efficient Rendering**: Optimized React rendering with proper keys

## Accessibility

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling
- **High Contrast**: Works with high contrast themes

## Browser Support

- Modern browsers with Fetch API support
- Graceful degradation for older browsers
- Mobile browser optimization

## Future Enhancements

- [ ] Caching mechanism for repeated searches
- [ ] Geolocation-based suggestions
- [ ] Recent searches history
- [ ] Offline support with cached data
- [ ] Analytics integration
- [ ] A/B testing for different UX approaches