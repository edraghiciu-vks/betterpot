import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import { 
  generateDefaultUserAgent, 
  getRandomUserAgent, 
  validateConfig, 
  mergeConfig, 
  DEFAULT_CONFIG,
  type BeatportAPIConfig 
} from '../src/config';
import { platform, arch, release } from 'node:os';

describe('Config utilities', () => {
  describe('generateDefaultUserAgent', () => {
    it('should generate a user agent with correct format', () => {
      const userAgent = generateDefaultUserAgent();
      
      expect(userAgent).toMatch(/Mozilla\/5\.0 \(.+\) BetterpotClient\/1\.0 Bun\//);
      expect(userAgent).toContain('BetterpotClient/1.0');
      expect(userAgent).toContain('Bun/');
    });

    it('should include system information', () => {
      const userAgent = generateDefaultUserAgent();
      const osName = platform();
      const osVersion = release();
      const architecture = arch();
      
      expect(userAgent).toContain(osVersion);
      expect(userAgent).toContain(architecture);
    });

    it('should map platform names correctly', () => {
      const userAgent = generateDefaultUserAgent();
      const osName = platform();
      
      if (osName === 'darwin') {
        expect(userAgent).toContain('macOS');
      } else if (osName === 'win32') {
        expect(userAgent).toContain('Windows');
      } else if (osName === 'linux') {
        expect(userAgent).toContain('Linux');
      }
    });
  });

  describe('getRandomUserAgent', () => {
    it('should return a valid user agent string', () => {
      const userAgent = getRandomUserAgent();
      
      expect(userAgent).toBeDefined();
      expect(userAgent.length).toBeGreaterThan(0);
      expect(userAgent).toMatch(/Mozilla\/5\.0/);
    });

    it('should return different user agents on multiple calls', () => {
      const userAgents = new Set();
      
      // Generate multiple user agents
      for (let i = 0; i < 20; i++) {
        userAgents.add(getRandomUserAgent());
      }
      
      // Should have at least some variation (not all the same)
      expect(userAgents.size).toBeGreaterThan(1);
    });

    it('should include system-specific user agent in pool', () => {
      const systemUA = generateDefaultUserAgent();
      const randomUserAgents = [];
      
      // Get multiple random user agents
      for (let i = 0; i < 50; i++) {
        randomUserAgents.push(getRandomUserAgent());
      }
      
      // System UA should appear in the random pool
      expect(randomUserAgents).toContain(systemUA);
    });
  });

  describe('validateConfig', () => {
    it('should accept valid configuration', () => {
      const validConfig: Partial<BeatportAPIConfig> = {
        timeout: 30000,
        maxRetries: 3,
        cacheTTL: 300000,
        rateLimit: 10
      };

      expect(() => validateConfig(validConfig)).not.toThrow();
    });

    it('should reject invalid timeout values', () => {
      expect(() => validateConfig({ timeout: 500 })).toThrow('Timeout must be between');
      expect(() => validateConfig({ timeout: 400000 })).toThrow('Timeout must be between');
    });

    it('should reject invalid maxRetries values', () => {
      expect(() => validateConfig({ maxRetries: -1 })).toThrow('Max retries must be between');
      expect(() => validateConfig({ maxRetries: 15 })).toThrow('Max retries must be between');
    });

    it('should reject invalid cacheTTL values', () => {
      expect(() => validateConfig({ cacheTTL: 500 })).toThrow('Cache TTL must be between');
      expect(() => validateConfig({ cacheTTL: 25 * 60 * 60 * 1000 })).toThrow('Cache TTL must be between');
    });

    it('should reject invalid rateLimit values', () => {
      expect(() => validateConfig({ rateLimit: 0 })).toThrow('Rate limit must be between');
      expect(() => validateConfig({ rateLimit: 150 })).toThrow('Rate limit must be between');
    });

    it('should accept edge case valid values', () => {
      const edgeCaseConfig: Partial<BeatportAPIConfig> = {
        timeout: 1000,      // minimum
        maxRetries: 0,      // minimum
        cacheTTL: 1000,     // minimum
        rateLimit: 1        // minimum
      };

      expect(() => validateConfig(edgeCaseConfig)).not.toThrow();
    });
  });

  describe('mergeConfig', () => {
    it('should return default config when no user config provided', () => {
      const config = mergeConfig();
      
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it('should return default config when empty object provided', () => {
      const config = mergeConfig({});
      
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it('should merge user config with defaults', () => {
      const userConfig: Partial<BeatportAPIConfig> = {
        timeout: 60000,
        maxRetries: 5
      };

      const config = mergeConfig(userConfig);

      expect(config.timeout).toBe(60000);
      expect(config.maxRetries).toBe(5);
      expect(config.enableCache).toBe(DEFAULT_CONFIG.enableCache);
      expect(config.cacheTTL).toBe(DEFAULT_CONFIG.cacheTTL);
      expect(config.rateLimit).toBe(DEFAULT_CONFIG.rateLimit);
    });

    it('should override all default values when provided', () => {
      const userConfig: BeatportAPIConfig = {
        userAgent: 'Custom User Agent',
        timeout: 45000,
        maxRetries: 2,
        enableCache: false,
        cacheTTL: 120000,
        enableRateLimit: false,
        rateLimit: 5
      };

      const config = mergeConfig(userConfig);

      expect(config).toEqual(userConfig);
    });

    it('should validate config during merge', () => {
      const invalidConfig = {
        timeout: 100 // too low
      };

      expect(() => mergeConfig(invalidConfig)).toThrow('Timeout must be between');
    });

    it('should handle partial custom user agent', () => {
      const userConfig = {
        userAgent: 'MyCustom/1.0'
      };

      const config = mergeConfig(userConfig);

      expect(config.userAgent).toBe('MyCustom/1.0');
      expect(config.timeout).toBe(DEFAULT_CONFIG.timeout);
    });
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have all required properties', () => {
      expect(DEFAULT_CONFIG).toHaveProperty('userAgent');
      expect(DEFAULT_CONFIG).toHaveProperty('timeout');
      expect(DEFAULT_CONFIG).toHaveProperty('maxRetries');
      expect(DEFAULT_CONFIG).toHaveProperty('enableCache');
      expect(DEFAULT_CONFIG).toHaveProperty('cacheTTL');
      expect(DEFAULT_CONFIG).toHaveProperty('enableRateLimit');
      expect(DEFAULT_CONFIG).toHaveProperty('rateLimit');
    });

    it('should have reasonable default values', () => {
      expect(DEFAULT_CONFIG.timeout).toBe(30000); // 30 seconds
      expect(DEFAULT_CONFIG.maxRetries).toBe(3);
      expect(DEFAULT_CONFIG.enableCache).toBe(true);
      expect(DEFAULT_CONFIG.cacheTTL).toBe(5 * 60 * 1000); // 5 minutes
      expect(DEFAULT_CONFIG.enableRateLimit).toBe(true);
      expect(DEFAULT_CONFIG.rateLimit).toBe(10); // 10 req/s
      expect(DEFAULT_CONFIG.userAgent).toContain('BetterpotClient');
    });

    it('should pass its own validation', () => {
      expect(() => validateConfig(DEFAULT_CONFIG)).not.toThrow();
    });
  });
});