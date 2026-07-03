import { test, expect, Page } from '@playwright/test';
import { SellMyCarPage } from '../../src/pages/sell-my-car.page';
import validationData from '../fixtures/validation-data.json';

test.describe('내차팔기 - 입력 유효성 검사', () => {
  let sellMyCarPage: SellMyCarPage;

  test.beforeEach(async ({ page }) => {
    sellMyCarPage = new SellMyCarPage(page);
    await sellMyCarPage.navigate();
  });

  validationData.forEach((data) => {
    test(`${data.tcId} - ${data.description}`, async ({ page }) => {
      const popupWindow: Page = await sellMyCarPage.openSellCarModal();

      const carNumberInput = popupWindow.getByPlaceholder('123가4567');
      const searchButton = popupWindow.getByRole('button', { name: '조회' });

      if (data.carNumber !== '') {
        await carNumberInput.fill(data.carNumber);
      }

      await searchButton.click();

      const errorMessageLocator = popupWindow.locator('#errorMessage');
      await expect(errorMessageLocator).toHaveText(data.expectedError);
      await expect(errorMessageLocator).toBeVisible();
      
      await expect(carNumberInput).toHaveClass(/input-error/);
    });
  });
});
