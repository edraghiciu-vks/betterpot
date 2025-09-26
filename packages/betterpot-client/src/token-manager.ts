// Token management for Beatport API authentication
// Simplified cross-platform implementation

// Add global type declarations for cross-platform compatibility
declare global {
  var process: any;
  var require: any;
  var Bun: any;
}

export interface StoredToken {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  token_type: string;
  scope: string;
}

// Simplified file operations that work across platforms
const safeFileOps = {
  writeFile: (path: string, data: string): void => {
    try {
      if (typeof Bun !== 'undefined' && Bun.write) {
        Bun.write(path, data);
      } else if (typeof require !== 'undefined') {
        const fs = require('fs');
        fs.writeFileSync(path, data);
      }
    } catch (error) {
      console.log(`⚠️ Failed to write file: ${error}`);
    }
  },
  
  readFile: (path: string): string => {
    try {
      if (typeof require !== 'undefined') {
        const fs = require('fs');
        return fs.readFileSync(path, 'utf8');
      }
    } catch (error) {
      // File doesn't exist or can't be read
    }
    return '{}';
  },
  
  fileExists: (path: string): boolean => {
    try {
      if (typeof require !== 'undefined') {
        const fs = require('fs');
        return fs.existsSync(path);
      }
    } catch (error) {
      // Can't check file existence
    }
    return false;
  },
  
  deleteFile: (path: string): void => {
    try {
      if (typeof require !== 'undefined') {
        const fs = require('fs');
        fs.unlinkSync(path);
      }
    } catch (error) {
      console.log(`⚠️ Failed to delete file: ${error}`);
    }
  },
  
  resolvePath: (...paths: string[]): string => {
    try {
      if (typeof require !== 'undefined') {
        const path = require('path');
        return path.resolve(...paths);
      }
    } catch (error) {
      // Fallback to simple join
    }
    return paths.join('/');
  }
};

export class TokenManager {
  private tokenFile: string;

  constructor(tokenFile = 'beatport_token.json') {
    this.tokenFile = tokenFile;
  }

  saveToken(tokenData: { access_token: string; refresh_token?: string; expires_in: number; token_type: string; scope?: string }): void {
    try {
      const storedToken: StoredToken = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: Date.now() + tokenData.expires_in * 1000,
        token_type: tokenData.token_type,
        scope: tokenData.scope || ''
      };

      const tokenPath = safeFileOps.resolvePath(this.tokenFile);
      safeFileOps.writeFile(tokenPath, JSON.stringify(storedToken, null, 2));
      console.log(`💾 Token saved to ${this.tokenFile}`);
    } catch (error) {
      console.log(`⚠️ Failed to save token: ${error}`);
    }
  }

  loadToken(): StoredToken | null {
    try {
      const tokenPath = safeFileOps.resolvePath(this.tokenFile);
      if (!safeFileOps.fileExists(tokenPath)) {
        return null;
      }

      const tokenData = safeFileOps.readFile(tokenPath);
      return JSON.parse(tokenData) as StoredToken;
    } catch (error) {
      console.log(`⚠️ Failed to load token: ${error}`);
      return null;
    }
  }

  isTokenExpired(token: StoredToken): boolean {
    // Add 5 minute buffer to avoid using tokens that expire soon
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Date.now() + bufferTime >= token.expires_at;
  }

  getValidToken(): StoredToken | null {
    const token = this.loadToken();
    if (!token) {
      return null;
    }

    if (this.isTokenExpired(token)) {
      console.log('⏰ Stored token has expired');
      return null;
    }

    console.log('✅ Using stored token');
    return token;
  }

  clearToken(): void {
    try {
      const tokenPath = safeFileOps.resolvePath(this.tokenFile);
      if (safeFileOps.fileExists(tokenPath)) {
        safeFileOps.deleteFile(tokenPath);
        console.log('🗑️ Token file deleted');
      }
    } catch (error) {
      console.log(`⚠️ Failed to delete token: ${error}`);
    }
  }
}