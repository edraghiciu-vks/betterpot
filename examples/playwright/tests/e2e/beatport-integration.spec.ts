import { test, expect } from '@playwright/test';

test.describe('Beatport API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load search interface', async ({ page }) => {
    // Navigate to search page
    await page.goto('/search');
    
    // Check search form elements
    await expect(page.getByRole('textbox', { name: /search/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /search/i })).toBeVisible();
    
    // Check filter options
    await expect(page.getByRole('combobox', { name: /genre/i })).toBeVisible();
    await expect(page.getByRole('combobox', { name: /key/i })).toBeVisible();
  });

  test('should perform track search', async ({ page }) => {
    await page.goto('/search');
    
    // Fill in search term
    const searchInput = page.getByRole('textbox', { name: /search/i });
    await searchInput.fill('house music');
    
    // Submit search
    await page.getByRole('button', { name: /search/i }).click();
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"], .search-results', { timeout: 10000 });
    
    // Verify results are displayed
    const resultItems = page.locator('[data-testid="track-item"], .track-item');
    await expect(resultItems.first()).toBeVisible();
    
    // Check that each result has required fields
    const firstResult = resultItems.first();
    await expect(firstResult.locator('[data-testid="track-title"], .track-title')).toBeVisible();
    await expect(firstResult.locator('[data-testid="track-artist"], .track-artist')).toBeVisible();
    await expect(firstResult.locator('[data-testid="track-label"], .track-label')).toBeVisible();
  });

  test('should handle search filters', async ({ page }) => {
    await page.goto('/search');
    
    // Apply genre filter
    const genreSelect = page.getByRole('combobox', { name: /genre/i });
    await genreSelect.selectOption('House');
    
    // Apply key filter
    const keySelect = page.getByRole('combobox', { name: /key/i });
    await keySelect.selectOption('A minor');
    
    // Perform search with filters
    await page.getByRole('textbox', { name: /search/i }).fill('deep');
    await page.getByRole('button', { name: /search/i }).click();
    
    // Wait for filtered results
    await page.waitForSelector('[data-testid="search-results"], .search-results', { timeout: 10000 });
    
    // Verify filters are applied (check URL params or result indicators)
    const url = page.url();
    expect(url).toContain('genre=House');
    expect(url).toContain('key=A%20minor');
  });

  test('should handle pagination', async ({ page }) => {
    await page.goto('/search');
    
    // Perform search to get multiple pages
    await page.getByRole('textbox', { name: /search/i }).fill('techno');
    await page.getByRole('button', { name: /search/i }).click();
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"], .search-results', { timeout: 10000 });
    
    // Check if pagination is available
    const nextButton = page.getByRole('button', { name: /next/i });
    const pageNumbers = page.locator('[data-testid="pagination"] button, .pagination button');
    
    if (await nextButton.isVisible()) {
      // Test next page
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      
      // Verify we're on a different page
      const url = page.url();
      expect(url).toContain('page=2');
      
      // Verify results updated
      await expect(page.locator('[data-testid="search-results"], .search-results')).toBeVisible();
    }
  });

  test('should handle preview playback', async ({ page }) => {
    await page.goto('/search');
    
    // Search for tracks
    await page.getByRole('textbox', { name: /search/i }).fill('electronic');
    await page.getByRole('button', { name: /search/i }).click();
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"], .search-results', { timeout: 10000 });
    
    // Find and click preview button
    const previewButton = page.getByRole('button', { name: /preview|play/i }).first();
    
    if (await previewButton.isVisible()) {
      await previewButton.click();
      
      // Check that audio player state changes
      await expect(page.getByRole('button', { name: /pause|stop/i })).toBeVisible();
      
      // Verify waveform or progress indicator appears
      const audioIndicator = page.locator('.waveform, .audio-progress, [data-testid="audio-playing"]');
      await expect(audioIndicator).toBeVisible();
    }
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API calls to simulate errors
    await page.route('/api/search/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    await page.goto('/search');
    
    // Perform search that will fail
    await page.getByRole('textbox', { name: /search/i }).fill('test');
    await page.getByRole('button', { name: /search/i }).click();
    
    // Check error message is displayed
    await expect(page.locator('[data-testid="error-message"], .error-message')).toBeVisible();
    await expect(page.getByText(/error|failed|unavailable/i)).toBeVisible();
  });

  test('should handle network connectivity issues', async ({ page }) => {
    await page.goto('/search');
    
    // Simulate offline state
    await page.context().setOffline(true);
    
    // Try to perform search
    await page.getByRole('textbox', { name: /search/i }).fill('offline test');
    await page.getByRole('button', { name: /search/i }).click();
    
    // Check offline message or retry mechanism
    await expect(page.getByText(/offline|connection|retry/i)).toBeVisible();
    
    // Restore connection
    await page.context().setOffline(false);
    
    // Test retry functionality if available
    const retryButton = page.getByRole('button', { name: /retry/i });
    if (await retryButton.isVisible()) {
      await retryButton.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should maintain search state during navigation', async ({ page }) => {
    await page.goto('/search');
    
    // Perform search
    await page.getByRole('textbox', { name: /search/i }).fill('minimal techno');
    await page.getByRole('button', { name: /search/i }).click();
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"], .search-results', { timeout: 10000 });
    
    // Navigate to a track detail page (if available)
    const firstTrack = page.locator('[data-testid="track-item"], .track-item').first();
    if (await firstTrack.isVisible()) {
      await firstTrack.click();
      
      // Go back to search
      await page.goBack();
      
      // Verify search state is preserved
      const searchInput = page.getByRole('textbox', { name: /search/i });
      await expect(searchInput).toHaveValue('minimal techno');
      await expect(page.locator('[data-testid="search-results"], .search-results')).toBeVisible();
    }
  });
});

test.describe('Authentication Flow', () => {
  test('should handle Beatport login flow', async ({ page }) => {
    // This test would require setting up OAuth mock or test environment
    await page.goto('/login');
    
    // Check login interface
    const loginButton = page.getByRole('button', { name: /login|connect/i });
    if (await loginButton.isVisible()) {
      await expect(loginButton).toBeVisible();
      
      // In a real implementation, you'd test OAuth flow
      // This might involve opening popups or redirects
      await loginButton.click();
      
      // Check for loading state
      await expect(page.getByText(/connecting|logging in/i)).toBeVisible();
    }
  });

  test('should handle authentication errors', async ({ page }) => {
    // Mock authentication failure
    await page.route('/api/auth/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Authentication failed' })
      });
    });
    
    await page.goto('/search');
    
    // Try to access protected feature
    await page.getByRole('textbox', { name: /search/i }).fill('test');
    await page.getByRole('button', { name: /search/i }).click();
    
    // Check authentication error handling
    await expect(page.getByText(/login|authenticate|unauthorized/i)).toBeVisible();
  });
});