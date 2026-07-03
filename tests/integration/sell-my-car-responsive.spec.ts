import { test, expect, Page } from '@playwright/test';
import { SellMyCarPage } from '../../src/pages/sell-my-car.page';

test.describe('내차팔기 - 다변화 환경 및 반응형 UI 검증', () => {
  let sellMyCarPage: SellMyCarPage;

  test.beforeEach(async ({ page }) => {
    sellMyCarPage = new SellMyCarPage(page);
    await sellMyCarPage.navigate();
  });

  test('모바일 환경에서 모달창 레이아웃 및 입력 포커스 검증', async ({ page, isMobile }) => {
    test.skip(!isMobile, '모바일 환경 전용 테스트입니다.');

    const popupWindow: Page = await sellMyCarPage.openSellCarModal();

    const closeButton = popupWindow.getByRole('button', { name: '닫기' });
    await expect(closeButton).toBeInViewport();
    
    const carNumberInput = popupWindow.getByPlaceholder('123가4567');
    await carNumberInput.focus();
    await expect(carNumberInput).toBeFocused();

    await closeButton.click();
    await expect(popupWindow.locator('#sellCarModal')).toBeHidden();
  });
});
