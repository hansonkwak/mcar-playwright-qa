import { test, expect, Page } from '@playwright/test';
import { SellMyCarPage } from '../../src/pages/sell-my-car.page';

test.describe('내차팔기 - API 예외 상황 처리', () => {
  let sellMyCarPage: SellMyCarPage;

  test.beforeEach(async ({ page }) => {
    sellMyCarPage = new SellMyCarPage(page);
    await sellMyCarPage.navigate();
  });

  test('백엔드 500 에러 발생 시 에러 메시지 표시 검증', async ({ page }) => {
    const popupWindow: Page = await sellMyCarPage.openSellCarModal();

    await popupWindow.route('**/api/v1/vehicles/estimate', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ errorCode: 'SERVER_ERROR', message: '일시적인 서버 오류' })
      });
    });

    const carNumberInput = popupWindow.getByPlaceholder('123가4567');
    await carNumberInput.fill('12가3456');
    await popupWindow.getByRole('button', { name: '조회' }).click();

    await expect(popupWindow.locator('#errorMessage')).toHaveText('잠시 후 다시 시도해주세요');
    await expect(popupWindow.locator('#errorMessage')).toBeVisible();
  });

  test('API 응답 지연 시 로딩 상태 표시 검증', async ({ page }) => {
    const popupWindow: Page = await sellMyCarPage.openSellCarModal();

    await popupWindow.route('**/api/v1/vehicles/estimate', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    await popupWindow.getByPlaceholder('123가4567').fill('12가3456');
    await popupWindow.getByRole('button', { name: '조회' }).click();

    await expect(popupWindow.locator('#loadingSpinner')).toBeVisible();
  });
});
