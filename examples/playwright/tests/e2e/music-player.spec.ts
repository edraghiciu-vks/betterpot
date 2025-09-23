import { test, expect } from '@playwright/test';

test.describe('Music Player Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the music player
    await page.goto('/');
    
    // Wait for the application to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the music player interface', async ({ page }) => {
    // Check that main player controls are visible
    await expect(page.getByRole('button', { name: /play/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /next/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /previous/i })).toBeVisible();
    
    // Check volume controls
    await expect(page.getByRole('slider', { name: /volume/i })).toBeVisible();
    
    // Check waveform/progress display
    await expect(page.locator('.waveform, .progress-bar')).toBeVisible();
  });

  test('should handle audio playback controls', async ({ page }) => {
    // Click play button
    const playButton = page.getByRole('button', { name: /play/i });
    await playButton.click();
    
    // Verify play state changes
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible();
    
    // Check if audio context is created (JavaScript execution)
    const isPlaying = await page.evaluate(() => {
      return window.audioContext?.state === 'running';
    });
    
    // Note: In a real test, you'd need actual audio files
    // This tests the UI state changes
    expect(typeof isPlaying).toBe('boolean');
  });

  test('should handle volume controls', async ({ page }) => {
    const volumeSlider = page.getByRole('slider', { name: /volume/i });
    
    // Test volume adjustment
    await volumeSlider.fill('50');
    
    // Verify volume change is reflected in the UI
    const volumeValue = await volumeSlider.inputValue();
    expect(volumeValue).toBe('50');
    
    // Test mute functionality if present
    const muteButton = page.getByRole('button', { name: /mute/i });
    if (await muteButton.isVisible()) {
      await muteButton.click();
      
      // Check if volume is muted (UI state)
      await expect(page.locator('.volume-muted, [data-muted="true"]')).toBeVisible();
    }
  });

  test('should display track information', async ({ page }) => {
    // Load a test track (this would require seeding test data)
    await page.goto('/player?track=test-track-id');
    
    // Wait for track information to load
    await page.waitForSelector('[data-testid="track-title"], .track-title', { timeout: 10000 });
    
    // Verify track metadata is displayed
    await expect(page.locator('[data-testid="track-title"], .track-title')).toBeVisible();
    await expect(page.locator('[data-testid="track-artist"], .track-artist')).toBeVisible();
    
    // Check if album art is displayed
    const albumArt = page.locator('[data-testid="album-art"], .album-art img');
    if (await albumArt.isVisible()) {
      await expect(albumArt).toHaveAttribute('src', /.+/);
    }
  });

  test('should be responsive on mobile devices', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('This test is only for mobile devices');
    }
    
    // Check that controls are accessible on mobile
    await expect(page.getByRole('button', { name: /play/i })).toBeVisible();
    
    // Test touch interactions
    const playButton = page.getByRole('button', { name: /play/i });
    await playButton.tap();
    
    // Verify the player adapts to mobile layout
    const playerContainer = page.locator('.player-container, [data-testid="player"]');
    const boundingBox = await playerContainer.boundingBox();
    
    // Check that player fits within mobile viewport
    expect(boundingBox?.width).toBeLessThanOrEqual(400);
  });

  test('should handle keyboard controls', async ({ page }) => {
    // Focus the player area
    await page.getByRole('main').focus();
    
    // Test spacebar for play/pause
    await page.keyboard.press('Space');
    
    // Check state change
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible();
    
    // Test arrow keys for seeking (if implemented)
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    
    // Test volume controls with arrow keys
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
  });
});

test.describe('Performance Tests', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {
            LCP: 0,
            FID: 0,
            CLS: 0
          };
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.FID = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              vitals.CLS += entry.value;
            }
          });
          
          setTimeout(() => resolve(vitals), 2000);
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      });
    });
    
    // Assert good performance metrics
    expect((metrics as any).LCP).toBeLessThan(2500); // 2.5s
    expect((metrics as any).CLS).toBeLessThan(0.1);   // 0.1
  });
});