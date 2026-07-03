import { test, expect, Page } from '@playwright/test';
import { SellMyCarPage } from '../../src/pages/sell-my-car.page';

test.describe('내차팔기 - 예외 상황 및 실패 케이스 검증', () => {
  let sellMyCarPage: SellMyCarPage;

  test.beforeEach(async ({ page }) => {
    sellMyCarPage = new SellMyCarPage(page);
    await sellMyCarPage.navigate();
  });

  test('예상치 못한 UI 변경으로 인한 요소 탐색 실패(Timeout) 검증', async ({ page }) => {
    // 요소 미탐색 시의 에러 동작 및 리포트(스크린샷, 비디오) 생성 여부를 검증하기 위한 의도적 실패 케이스
    test.fail(true, '에러 리포트 생성 검증용');

    const popupWindow: Page = await sellMyCarPage.openSellCarModal();

    const carNumberInput = popupWindow.getByPlaceholder('123가4567');
    await carNumberInput.fill('12가3456');

    const nonExistentButton = popupWindow.getByRole('button', { name: '존재하지않는버튼' });
    await nonExistentButton.click({ timeout: 1000 });
  });
});
