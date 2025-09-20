import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { TokenManager, type StoredToken } from './token-manager';

describe('TokenManager', () => {
  let tokenManager: TokenManager;
  let writeFileSyncSpy: any;
  let readFileSyncSpy: any;
  let existsSyncSpy: any;
  let unlinkSyncSpy: any;
  let consoleLogSpy: any;

  const testTokenFile = 'test_token.json';
  
  // Sample token data for testing
  const validTokenData = {
    access_token: 'test_access_token_123',
    refresh_token: 'test_refresh_token_456',
    expires_in: 3600,
    token_type: 'Bearer',
    scope: 'app:docs user:dj'
  };

  const storedTokenData: StoredToken = {
    access_token: 'test_access_token_123',
    refresh_token: 'test_refresh_token_456',
    expires_at: Date.now() + 3600000, // 1 hour from now
    token_type: 'Bearer',
    scope: 'app:docs user:dj'
  };

  const expiredTokenData: StoredToken = {
    access_token: 'expired_token',
    refresh_token: 'expired_refresh',
    expires_at: Date.now() - 1000, // 1 second ago (expired)
    token_type: 'Bearer',
    scope: 'app:docs user:dj'
  };

  beforeEach(() => {
    tokenManager = new TokenManager(testTokenFile);
    
    // Set up spies for fs methods
    writeFileSyncSpy = spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    readFileSyncSpy = spyOn(fs, 'readFileSync').mockImplementation(() => '{}' as any);
    existsSyncSpy = spyOn(fs, 'existsSync').mockImplementation(() => false);
    unlinkSyncSpy = spyOn(fs, 'unlinkSync').mockImplementation(() => {});
    
    // Set up console.log spy
    consoleLogSpy = spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore all spies
    writeFileSyncSpy.mockRestore();
    readFileSyncSpy.mockRestore();
    existsSyncSpy.mockRestore();
    unlinkSyncSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('constructor', () => {
    it('should use default token file name when none provided', () => {
      const defaultTokenManager = new TokenManager();
      expect(defaultTokenManager).toBeDefined();
    });

    it('should use custom token file name when provided', () => {
      const customTokenManager = new TokenManager('custom_token.json');
      expect(customTokenManager).toBeDefined();
    });
  });

  describe('saveToken', () => {
    it('should save token data to file with correct format', () => {
      tokenManager.saveToken(validTokenData);

      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
      
      const calls = writeFileSyncSpy.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      
      const [filePath, content] = calls[0];
      expect(filePath).toBe(path.resolve(testTokenFile));
      
      const savedData = JSON.parse(content);
      expect(savedData.access_token).toBe(validTokenData.access_token);
      expect(savedData.refresh_token).toBe(validTokenData.refresh_token);
      expect(savedData.token_type).toBe(validTokenData.token_type);
      expect(savedData.scope).toBe(validTokenData.scope);
      expect(savedData.expires_at).toBeGreaterThan(Date.now());
      
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Token saved'));
    });

    it('should handle missing refresh_token gracefully', () => {
      const tokenWithoutRefresh = {
        access_token: 'test_token',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'test'
      };

      tokenManager.saveToken(tokenWithoutRefresh);

      const calls = writeFileSyncSpy.mock.calls;
      const [, content] = calls[0];
      const savedData = JSON.parse(content);
      expect(savedData.refresh_token).toBeUndefined();
    });

    it('should handle missing scope gracefully', () => {
      const tokenWithoutScope = {
        access_token: 'test_token',
        expires_in: 3600,
        token_type: 'Bearer'
      };

      tokenManager.saveToken(tokenWithoutScope);

      const calls = writeFileSyncSpy.mock.calls;
      const [, content] = calls[0];
      const savedData = JSON.parse(content);
      expect(savedData.scope).toBe('');
    });

    it('should handle file write errors gracefully', () => {
      writeFileSyncSpy.mockImplementationOnce(() => {
        throw new Error('Permission denied');
      });

      expect(() => tokenManager.saveToken(validTokenData)).not.toThrow();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to save token'));
    });
  });

  describe('loadToken', () => {
    it('should return null when token file does not exist', () => {
      existsSyncSpy.mockReturnValue(false);

      const result = tokenManager.loadToken();

      expect(result).toBeNull();
      expect(existsSyncSpy).toHaveBeenCalledWith(path.resolve(testTokenFile));
    });

    it('should load and parse valid token data', () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy.mockReturnValue(JSON.stringify(storedTokenData));

      const result = tokenManager.loadToken();

      expect(result).toEqual(storedTokenData);
      expect(readFileSyncSpy).toHaveBeenCalledWith(path.resolve(testTokenFile), 'utf8');
    });

    it('should handle JSON parse errors gracefully', () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy.mockReturnValue('invalid json');

      const result = tokenManager.loadToken();

      expect(result).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load token'));
    });

    it('should handle file read errors gracefully', () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy.mockImplementationOnce(() => {
        throw new Error('File read error');
      });

      const result = tokenManager.loadToken();

      expect(result).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load token'));
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token with buffer time', () => {
      const validToken: StoredToken = {
        ...storedTokenData,
        expires_at: Date.now() + 10 * 60 * 1000 // 10 minutes from now
      };

      const result = tokenManager.isTokenExpired(validToken);

      expect(result).toBe(false);
    });

    it('should return true for expired token', () => {
      const result = tokenManager.isTokenExpired(expiredTokenData);

      expect(result).toBe(true);
    });

    it('should return true for token expiring within buffer time (5 minutes)', () => {
      const soonExpiringToken: StoredToken = {
        ...storedTokenData,
        expires_at: Date.now() + 2 * 60 * 1000 // 2 minutes from now (within 5-minute buffer)
      };

      const result = tokenManager.isTokenExpired(soonExpiringToken);

      expect(result).toBe(true);
    });

    it('should return false for token expiring just outside buffer time', () => {
      const validToken: StoredToken = {
        ...storedTokenData,
        expires_at: Date.now() + 6 * 60 * 1000 // 6 minutes from now (outside 5-minute buffer)
      };

      const result = tokenManager.isTokenExpired(validToken);

      expect(result).toBe(false);
    });
  });

  describe('getValidToken', () => {
    it('should return null when no token file exists', () => {
      existsSyncSpy.mockReturnValue(false);

      const result = tokenManager.getValidToken();

      expect(result).toBeNull();
    });

    it('should return valid token when token is not expired', () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy.mockReturnValue(JSON.stringify(storedTokenData));

      const result = tokenManager.getValidToken();

      expect(result).toEqual(storedTokenData);
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Using stored token');
    });

    it('should return null for expired token', () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy.mockReturnValue(JSON.stringify(expiredTokenData));

      const result = tokenManager.getValidToken();

      expect(result).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith('⏰ Stored token has expired');
    });

    it('should return null when token file is corrupted', () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy.mockReturnValue('corrupted json');

      const result = tokenManager.getValidToken();

      expect(result).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load token'));
    });
  });

  describe('clearToken', () => {
    it('should delete token file when it exists', () => {
      existsSyncSpy.mockReturnValue(true);

      tokenManager.clearToken();

      expect(unlinkSyncSpy).toHaveBeenCalledWith(path.resolve(testTokenFile));
      expect(consoleLogSpy).toHaveBeenCalledWith('🗑️ Token file deleted');
    });

    it('should not attempt to delete when file does not exist', () => {
      existsSyncSpy.mockReturnValue(false);

      tokenManager.clearToken();

      expect(unlinkSyncSpy).not.toHaveBeenCalled();
    });

    it('should handle file deletion errors gracefully', () => {
      existsSyncSpy.mockReturnValue(true);
      unlinkSyncSpy.mockImplementationOnce(() => {
        throw new Error('Permission denied');
      });

      expect(() => tokenManager.clearToken()).not.toThrow();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to delete token'));
    });
  });

  describe('integration scenarios', () => {
    it('should complete save and load cycle correctly', () => {
      // Save token
      tokenManager.saveToken(validTokenData);
      
      // Get the saved content
      const calls = writeFileSyncSpy.mock.calls;
      const savedContent = calls[0][1];
      
      // Mock the file system to return what we just saved
      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy.mockReturnValue(savedContent);

      // Load token
      const loadedToken = tokenManager.loadToken();

      expect(loadedToken).toBeDefined();
      expect(loadedToken!.access_token).toBe(validTokenData.access_token);
      expect(loadedToken!.refresh_token).toBe(validTokenData.refresh_token);
      expect(loadedToken!.token_type).toBe(validTokenData.token_type);
      expect(loadedToken!.scope).toBe(validTokenData.scope);
    });

    it('should handle token expiration workflow', () => {
      // Mock an expired token in file
      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy.mockReturnValue(JSON.stringify(expiredTokenData));

      // Should return null for expired token
      const validToken = tokenManager.getValidToken();
      expect(validToken).toBeNull();

      // Clear the expired token
      tokenManager.clearToken();
      expect(unlinkSyncSpy).toHaveBeenCalled();
    });
  });
});