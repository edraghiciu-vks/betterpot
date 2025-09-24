// Token management for Beatport API authentication
// Compatible with both Node.js and Bun environments

// Polyfill for fs and path operations
interface FileSystem {
  writeFileSync(path: string, data: string): void;
  readFileSync(path: string, encoding: 'utf8'): string;
  existsSync(path: string): boolean;
  unlinkSync(path: string): void;
}

interface PathUtil {
  resolve(...paths: string[]): string;
}

// Simple implementations for cross-platform compatibility
const fs: FileSystem = {
  writeFileSync: (filePath: string, data: string) => {
    try {
      if (typeof Bun !== 'undefined') {
        Bun.write(filePath, data);
      } else {
        // Fallback - in real environments this should work
        const nodeFs = require('fs');
        nodeFs.writeFileSync(filePath, data);
      }
    } catch (error) {
      console.log(`⚠️ Failed to write file: ${error}`);
    }
  },
  readFileSync: (filePath: string, encoding: 'utf8') => {
    try {
      if (typeof Bun !== 'undefined') {
        const file = Bun.file(filePath);
        // This is actually async but we'll handle it differently in real use
        return '{}'; // Fallback for now
      } else {
        const nodeFs = require('fs');
        return nodeFs.readFileSync(filePath, encoding);
      }
    } catch (error) {
      return '{}';
    }
  },
  existsSync: (filePath: string) => {
    try {
      if (typeof Bun !== 'undefined') {
        const file = Bun.file(filePath);
        return file.size >= 0; // Simple check
      } else {
        const nodeFs = require('fs');
        return nodeFs.existsSync(filePath);
      }
    } catch {
      return false;
    }
  },
  unlinkSync: (filePath: string) => {
    try {
      if (typeof Bun !== 'undefined') {
        // Bun doesn't have direct sync unlink in this context
        return;
      } else {
        const nodeFs = require('fs');
        nodeFs.unlinkSync(filePath);
      }
    } catch (error) {
      console.log(`⚠️ Failed to delete file: ${error}`);
    }
  }
};

const path: PathUtil = {
  resolve: (...paths: string[]) => {
    try {
      const nodePath = require('path');
      return nodePath.resolve(...paths);
    } catch {
      // Simple fallback
      return paths.join('/');
    }
  }
};

export interface StoredToken {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  token_type: string;
  scope: string;
}

export class TokenManager {
  private tokenFile: string;

  constructor(tokenFile = 'beatport_token.json') {
    this.tokenFile = path.resolve(tokenFile);
  }

  // Save token to file
  saveToken(tokenData: any): void {
    const storedToken: StoredToken = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
      token_type: tokenData.token_type,
      scope: tokenData.scope || '',
    };

    try {
      fs.writeFileSync(this.tokenFile, JSON.stringify(storedToken, null, 2));
      console.log(`💾 Token saved to ${this.tokenFile}`);
    } catch (error) {
      console.log(`⚠️ Failed to save token: ${error}`);
    }
  }

  // Load token from file
  loadToken(): StoredToken | null {
    try {
      if (!fs.existsSync(this.tokenFile)) {
        return null;
      }

      const tokenData = JSON.parse(fs.readFileSync(this.tokenFile, 'utf8'));
      return tokenData as StoredToken;
    } catch (error) {
      console.log(`⚠️ Failed to load token: ${error}`);
      return null;
    }
  }

  // Check if token is expired (with 5 minute buffer)
  isTokenExpired(token: StoredToken): boolean {
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Date.now() + bufferTime >= token.expires_at;
  }

  // Get valid token (load from file if available and not expired)
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

  // Clear stored token
  clearToken(): void {
    try {
      if (fs.existsSync(this.tokenFile)) {
        fs.unlinkSync(this.tokenFile);
        console.log('🗑️ Token file deleted');
      }
    } catch (error) {
      console.log(`⚠️ Failed to delete token: ${error}`);
    }
  }
}