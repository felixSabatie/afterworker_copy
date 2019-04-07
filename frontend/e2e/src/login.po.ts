import { browser, by, element, ElementFinder, ElementArrayFinder } from 'protractor';
import { ElementRef } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';

export class LoginPage {
  navigateTo() {
    return browser.get('/login') as Promise<any>;
  }

  fillForm() {
    this.getEmailInput().sendKeys('aze@aze.fr');
    this.getPasswordInput().sendKeys('azeaze');
  }

  fillFormWrongEmail() {
    this.getEmailInput().sendKeys('aze@aze');
    this.getPasswordInput().sendKeys('azeaze');
  }

  fillFormWrongPassword() {
    this.getEmailInput().sendKeys('aze@aze.fr');
  }

  fillFormAllWrong() {
    this.getEmailInput().sendKeys('aze@aze');
  }

  postForm() {
    this.getFormButton().click();
  }

  getEmailInput(): ElementFinder {
    return element(by.css('input[type=email]'));
  }

  getPasswordInput(): ElementFinder {
    return element(by.css('input[type=password]'));
  }

  getFormButton(): ElementFinder {
    return element(by.css('.actions .submit-button'));
  }

  getTitle(): Promise<string> {
    return element(by.css('h1')).getText() as Promise<string>;
  }

  getInputErrors(): ElementArrayFinder {
    return element.all(by.css('.input-error'));
  }
}
