# Betterpot Client API Improvements

## Overview

The betterpot-client has been enhanced with significant performance and reliability improvements, addressing the issues with hard-coded headers and adding powerful caching capabilities optimized for Bun.

## Key Improvements

### 🔄 Dynamic User-Agent Generation

**Before:** Hard-coded macOS User-Agent strings
```typescript
'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
```

**After:** Cross-platform, realistic User-Agent rotation
```typescript
import { EnhancedBeatportAPI, getRealisticUserAgent } from '@betterpot/betterpot-client';

// Automatically detects system and rotates between realistic browser strings
const api = new EnhancedBeatportAPI(username, password);
```

### ⚡ High-Performance Caching

**Features:**
- In-memory response caching with configurable TTL
- Automatic cache expiration and cleanup
- Request deduplication for concurrent identical requests
- Cache statistics and management

```typescript
const api = new EnhancedBeatportAPI(username, password, clientId, {
  enableCache: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
});

// Subsequent identical requests use cached responses
const tracks1 = await api.searchTracks({ query: 'techno' });
const tracks2 = await api.searchTracks({ query: 'techno' }); // Uses cache

// Monitor cache performance
console.log(api.getCacheStats()); // { size: 5, pendingRequests: 0 }
```

### 🚦 Smart Rate Limiting

Respects API limits with configurable request rates:

```typescript
const api = new EnhancedBeatportAPI(username, password, clientId, {
  enableRateLimit: true,
  requestsPerSecond: 10, // Automatically spaces requests
});
```

### 🔁 Resilient Error Handling

- Exponential backoff retry logic
- Distinguishes between client (4xx) and server (5xx) errors  
- Configurable timeout and retry attempts
- Request timeout protection

```typescript
const api = new EnhancedBeatportAPI(username, password, clientId, {
  timeout: 30000, // 30 second timeout
  maxRetries: 3,  // Retry server errors 3 times
});
```

### 🔀 Request Deduplication

Prevents duplicate concurrent API calls:

```typescript
// These concurrent requests will be deduplicated into a single API call
const [tracks1, tracks2, tracks3] = await Promise.all([
  api.searchTracks({ query: 'house' }),
  api.searchTracks({ query: 'house' }),
  api.searchTracks({ query: 'house' })
]);
// All return the same result, but only one API request was made
```

## Usage Examples

### Basic Usage (Drop-in Replacement)

```typescript
import { EnhancedBeatportAPI } from '@betterpot/betterpot-client';

const api = new EnhancedBeatportAPI('username', 'password');

// All existing methods work the same way
await api.initialize();
const tracks = await api.searchTracks({ 
  query: 'deadmau5',
  genre: 'progressive house',
  bpm: '128'
});
```

### Advanced Configuration

```typescript
import { EnhancedBeatportAPI } from '@betterpot/betterpot-client';

const api = new EnhancedBeatportAPI('username', 'password', 'client_id', {
  // User-Agent configuration
  useRealisticUserAgent: true,    // Rotate between realistic browser UAs
  
  // Caching configuration
  enableCache: true,              // Enable response caching
  cacheTTL: 10 * 60 * 1000,      // 10 minute cache lifetime
  
  // Rate limiting
  enableRateLimit: true,          // Enable rate limiting
  requestsPerSecond: 5,           // 5 requests per second max
  
  // Error handling
  timeout: 45000,                 // 45 second timeout
  maxRetries: 5,                  // Retry failed requests 5 times
});

// Runtime configuration updates
api.updateConfig({ requestsPerSecond: 15 });
```

### Performance Monitoring

```typescript
// Cache performance monitoring
const stats = api.getCacheStats();
console.log(`Cache size: ${stats.size}, Pending: ${stats.pendingRequests}`);

// Cache management
api.clearCache(); // Clear all cached responses

// Cleanup resources when done
api.destroy();
```

## Compatibility

The enhanced API maintains full backward compatibility with the existing BeatportAPI while adding new capabilities. Both APIs are exported:

```typescript
// Original API (still available)
import { BeatportAPI } from '@betterpot/betterpot-client';

// Enhanced API (recommended)
import { EnhancedBeatportAPI } from '@betterpot/betterpot-client';
```

## Performance Benefits

1. **Reduced API Calls:** Caching eliminates redundant requests
2. **Faster Response Times:** Cache hits return instantly
3. **Better Resource Usage:** Request deduplication prevents waste
4. **Improved Reliability:** Automatic retries handle transient failures
5. **Respectful API Usage:** Rate limiting prevents hitting API limits
6. **Cross-Platform Headers:** Dynamic User-Agent strings work on any system

## Configuration Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `useRealisticUserAgent` | boolean | `true` | Rotate between realistic browser User-Agent strings |
| `enableCache` | boolean | `true` | Enable response caching |
| `cacheTTL` | number | `300000` | Cache lifetime in milliseconds (5 minutes) |
| `enableRateLimit` | boolean | `true` | Enable request rate limiting |
| `requestsPerSecond` | number | `10` | Maximum requests per second |
| `timeout` | number | `30000` | Request timeout in milliseconds |
| `maxRetries` | number | `3` | Maximum retry attempts for failed requests |

## Migration Guide

To migrate from the original BeatportAPI:

1. **Simple Migration:** Just change the import
   ```typescript
   // Before
   import { BeatportAPI } from '@betterpot/betterpot-client';
   const api = new BeatportAPI(username, password);
   
   // After  
   import { EnhancedBeatportAPI } from '@betterpot/betterpot-client';
   const api = new EnhancedBeatportAPI(username, password);
   ```

2. **Full Migration:** Add configuration for optimal performance
   ```typescript
   const api = new EnhancedBeatportAPI(username, password, clientId, {
     cacheTTL: 5 * 60 * 1000,    // 5 minute cache
     requestsPerSecond: 10,       // 10 req/sec limit
     maxRetries: 3               // 3 retry attempts
   });
   ```

The enhanced API provides significant performance improvements while maintaining the same interface, making it an easy upgrade path for existing code.