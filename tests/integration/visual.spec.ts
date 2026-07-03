import { test, expect } from '@playwright/test';
import { SellMyCarPage } from '../../src/pages/sell-my-car.page';

test.describe('시각적 회귀 테스트 (Visual Regression)', () => {
  let sellMyCarPage: SellMyCarPage;

  test.beforeEach(async ({ page }) => {
    sellMyCarPage = new SellMyCarPage(page);
    await sellMyCarPage.navigate();
  });

  test('메인 페이지 UI 레이아웃 스냅샷 검증', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Full page screenshot comparison
    await expect(page).toHaveScreenshot('main-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05, // Allow minor rendering differences across OS environments
    });
  });

  test('내차팔기 신청 모달 영역 시각적 검증', async ({ page }) => {
    await sellMyCarPage.openSellCarModal();
    
    const modalLocator = page.locator('#sellCarModal');
    
    await expect(modalLocator).toHaveScreenshot('sell-car-modal.png', {
      // Mask text inputs to avoid cursor blink differences
      mask: [page.locator('input[type="text"]')],
    });
  });
});
