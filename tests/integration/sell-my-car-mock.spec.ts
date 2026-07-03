import { test, expect, Page } from '@playwright/test';
import { SellMyCarPage } from '../../src/pages/sell-my-car.page';

test.describe('Mcar 내차팔기 - 메인 화면 및 모달 제어 검증', () => {
  let sellMyCarPage: SellMyCarPage;

  test.beforeEach(async ({ page }) => {
    sellMyCarPage = new SellMyCarPage(page);
    await sellMyCarPage.navigate();
  });

  test('메인 버튼 클릭 시 모달창 노출 및 견적 조회 성공 검증', async ({ page }) => {
    const popupWindow: Page = await sellMyCarPage.openSellCarModal();

    const carNumberInput = popupWindow.getByPlaceholder('123가4567');
    await carNumberInput.fill('12가3456');

    const searchButton = popupWindow.getByRole('button', { name: '조회' });
    
    await popupWindow.route('**/api/v1/vehicles/estimate', async route => {
      await route.fulfill({ status: 200, json: { success: true } });
    });

    await searchButton.click();

    await expect(popupWindow).toHaveURL(/.*result.html/);
    
    await expect(popupWindow.locator('.title')).toHaveText('차량 견적이 완료되었습니다!');
    await expect(popupWindow.locator('.quote-amount')).toHaveText('1,850만 원');
  });
});
