import * as fs from 'fs';
import * as path from 'path';

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