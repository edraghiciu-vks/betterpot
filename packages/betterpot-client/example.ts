#!/usr/bin/env bun
/**
 * Example demonstrating the improved betterpot-client API
 * 
 * Run with: bun run example.ts
 */

import { EnhancedBeatportAPI, getRealisticUserAgent } from './src/index';

async function demonstrateImprovements() {
  console.log('🎵 BetterPot Client API Improvements Demo\n');
  
  // 1. Show User-Agent improvements
  console.log('1. Dynamic User-Agent Generation:');
  console.log('Before: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
  console.log('After:  ', getRealisticUserAgent());
  console.log('After:  ', getRealisticUserAgent()); // Shows rotation
  console.log('After:  ', getRealisticUserAgent());
  console.log();
  
  // 2. Create enhanced API instance
  console.log('2. Creating Enhanced API with configuration:');
  const api = new EnhancedBeatportAPI('demo_user', 'demo_pass', undefined, {
    enableCache: true,
    cacheTTL: 2 * 60 * 1000,    // 2 minute cache
    requestsPerSecond: 5,        // 5 requests per second
    maxRetries: 2,               // 2 retry attempts
    useRealisticUserAgent: true  // Dynamic User-Agent
  });
  
  const config = api.getConfig();
  console.log('✅ Configuration applied:');
  console.log(`   Cache enabled: ${config.enableCache}`);
  console.log(`   Cache TTL: ${config.cacheTTL / 1000}s`);
  console.log(`   Rate limit: ${config.requestsPerSecond} req/s`);
  console.log(`   Max retries: ${config.maxRetries}`);
  console.log(`   Realistic UA: ${config.useRealisticUserAgent}`);
  console.log();
  
  // 3. Demonstrate caching (simulated)
  console.log('3. Caching Demonstration (simulated):');
  console.log('Making first search request...');
  
  // Mock a successful authentication for demo
  (api as any).accessToken = 'demo_token_12345';
  
  try {
    // This would normally make an API call
    console.log('✅ Request would be cached for future use');
    console.log('✅ Identical concurrent requests would be deduplicated');
    console.log('✅ Rate limiting would space requests appropriately');
  } catch (error) {
    // Expected since we don't have real credentials
    console.log('ℹ️  Demo mode - no actual API calls made');
  }
  
  // 4. Show cache stats
  const stats = api.getCacheStats();
  console.log('\n4. Cache Statistics:');
  console.log(`   Cached items: ${stats.size}`);
  console.log(`   Pending requests: ${stats.pendingRequests}`);
  console.log();
  
  // 5. Configuration updates
  console.log('5. Runtime Configuration Updates:');
  console.log('Updating rate limit to 10 req/s...');
  api.updateConfig({ requestsPerSecond: 10 });
  console.log(`✅ New rate limit: ${api.getConfig().requestsPerSecond} req/s`);
  console.log();
  
  // 6. Cleanup
  console.log('6. Resource Cleanup:');
  api.destroy();
  console.log('✅ Resources cleaned up');
  console.log();
  
  console.log('🚀 Demo complete! Key improvements:');
  console.log('   • No more hardcoded macOS User-Agent strings');
  console.log('   • Intelligent response caching with TTL');
  console.log('   • Request deduplication for concurrent calls');
  console.log('   • Exponential backoff retry logic');
  console.log('   • Configurable rate limiting');
  console.log('   • Cross-platform compatibility');
  console.log('   • Backward compatible drop-in replacement');
}

// Run the demo
demonstrateImprovements().catch(console.error);