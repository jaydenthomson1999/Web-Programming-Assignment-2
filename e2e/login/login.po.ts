import {browser, by, element } from 'protractor';

export class LoginPage {
    private crediential = {
        username: 'super',
        password: 'super'
    };

    navigateTo() {
        return browser.get('/');
    }

    fillCredentials(crediential: any = this.crediential) {
        element(by.css('[name="username"]')).sendKeys(crediential.username);
        element(by.css('[name="password"]')).sendKeys(crediential.password);
        element(by.css('.btn-primary')).click();
    }

    getPageTitleText() {
        return element(by.tagName('h1')).getText();
    }

    getErrorMessage() {
        return element(by.css('.alert-danger')).getText();
    }

}
