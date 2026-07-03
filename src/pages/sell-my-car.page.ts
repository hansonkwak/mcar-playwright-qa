import { Page, Locator } from '@playwright/test';

export class SellMyCarPage {
  private readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('http://localhost:5173');
  }

  async openSellCarModal() {
    await this.page.locator('#openModalBtn').click();
    
    const modal = this.page.locator('#sellCarModal');
    await modal.waitFor({ state: 'visible' });
    
    return this.page;
  }
}
