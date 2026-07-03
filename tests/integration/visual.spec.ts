import { test, expect } from '@playwright/test';
import { SellMyCarPage } from '../../src/pages/sell-my-car.page';

test.describe('시각적 회귀 테스트 (Visual Regression)', () => {
  let sellMyCarPage: SellMyCarPage;

  test.beforeEach(async ({ page }) => {
    // CI 환경(리눅스 서버)에서는 OS 간 한글 폰트/렌더링 편차로 인한 빌드 깨짐을 방지하기 위해 시각 테스트를 건너뜁니다.
    test.skip(!!process.env.CI, 'CI 환경에서는 로컬 렌더링 편차로 시각 테스트 제외');

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
