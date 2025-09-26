// Configuration and utilities for betterpot-client

// Polyfill for os functions in case they're not available
declare global {
  var process: any;
}

// Mock functions if not in Node.js environment
const getPlatform = (): string => {
  try {
    if (typeof process !== 'undefined' && (process as any).platform) {
      return (process as any).platform;
    }
  } catch {
    // Fallback for non-Node environments
  }
  return 'unknown';
};

const getArch = (): string => {
  try {
    if (typeof process !== 'undefined' && (process as any).arch) {
      return (process as any).arch;
    }
  } catch {
    // Fallback for non-Node environments
  }
  return 'unknown';
};

const getBunVersion = (): string => {
  try {
    if (typeof process !== 'undefined' && (process as any).versions?.bun) {
      return (process as any).versions.bun;
    }
  } catch {
    // Fallback for non-Node environments
  }
  return 'unknown';
};

/**
 * Configuration options for the BeatportAPI client
 */
export interface BeatportAPIConfig {
  /** Custom User-Agent string (optional) */
  userAgent?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Enable response caching */
  enableCache?: boolean;
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  /** Enable request rate limiting */
  enableRateLimit?: boolean;
  /** Maximum requests per second */
  rateLimit?: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Required<BeatportAPIConfig> = {
  userAgent: generateDefaultUserAgent(),
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  enableCache: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  enableRateLimit: true,
  rateLimit: 10, // 10 requests per second
};

/**
 * Generate a cross-platform User-Agent string based on the current system
 */
export function generateDefaultUserAgent(): string {
  const osName = getPlatform();
  const osVersion = 'unknown'; // We can't reliably get OS version in all environments
  const architecture = getArch();
  const bunVersion = getBunVersion();
  
  // Map Node.js platform names to more readable versions
  const platformMap: Record<string, string> = {
    'darwin': 'macOS',
    'win32': 'Windows',
    'linux': 'Linux',
    'freebsd': 'FreeBSD',
    'openbsd': 'OpenBSD',
    'sunos': 'SunOS',
    'aix': 'AIX'
  };

  const osDisplayName = platformMap[osName] || osName;
  
  // Create a realistic browser-like user agent that reflects the actual system
  return `Mozilla/5.0 (${osDisplayName} ${osVersion}; ${architecture}) BetterpotClient/1.0 Bun/${bunVersion}`;
}

/**
 * Get a randomized User-Agent from a pool of realistic options
 */
export function getRandomUserAgent(): string {
  const userAgents = [
    generateDefaultUserAgent(),
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0'
  ];
  
  const randomIndex = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomIndex] as string;
}

/**
 * Validate configuration values
 */
export function validateConfig(config: Partial<BeatportAPIConfig>): void {
  if (config.timeout !== undefined && (config.timeout < 1000 || config.timeout > 300000)) {
    throw new Error('Timeout must be between 1000ms and 300000ms (5 minutes)');
  }
  
  if (config.maxRetries !== undefined && (config.maxRetries < 0 || config.maxRetries > 10)) {
    throw new Error('Max retries must be between 0 and 10');
  }
  
  if (config.cacheTTL !== undefined && (config.cacheTTL < 1000 || config.cacheTTL > 24 * 60 * 60 * 1000)) {
    throw new Error('Cache TTL must be between 1000ms and 24 hours');
  }
  
  if (config.rateLimit !== undefined && (config.rateLimit < 1 || config.rateLimit > 100)) {
    throw new Error('Rate limit must be between 1 and 100 requests per second');
  }
}

/**
 * Merge user config with defaults
 */
export function mergeConfig(userConfig: Partial<BeatportAPIConfig> = {}): Required<BeatportAPIConfig> {
  validateConfig(userConfig);
  return { ...DEFAULT_CONFIG, ...userConfig };
}