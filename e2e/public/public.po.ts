import {browser, by, element } from 'protractor';
import { elementEventFullName } from '@angular/core/src/view';

export class PublicPage {
    private crediential = {
        username: 'super',
        password: 'super'
    };
    
    navigateTo() {
        return browser.get('/chat-room');
    }

    getPageTitleText() {
        return element(by.id('title')).getText();
    }

    logout() {
        return element(by.id('logout')).click();
    }

}
