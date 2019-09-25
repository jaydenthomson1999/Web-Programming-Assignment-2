import { LoginPage } from './login.po';
import { PublicPage } from '../public/public.po';

describe('Login page and Chatroom page protractor', () => {
    let page: LoginPage;
    let publicPage: PublicPage;

    const wrongCredentials = {
        username: 'wrongname',
        password: 'wrongpassword'
    };

    beforeEach(() => {
        page = new LoginPage();
        publicPage = new PublicPage();
    });

    it('when user trying to login with wrong credentials they will stay on login page', () => {
        page.navigateTo();
        page.fillCredentials(wrongCredentials);
        expect(page.getPageTitleText()).toEqual('Login');
        expect(page.getErrorMessage()).toEqual('Warning! Username or password was incorrect.');
    });

    it('when user tries to get to chatroom without logging in, they should be redirected to login', () => {
        publicPage.navigateTo();
        expect(page.getPageTitleText()).toEqual('Login');
    });

    it('when login uses correct credentials they should go to the chatroom page', () => {
        page.navigateTo();
        page.fillCredentials();
        expect(publicPage.getPageTitleText()).toEqual('Chatroom');
    });

    it('when user goes back to login and they have already logged in during the session, they should be redirected to chatroom page', ()=> {
        page.navigateTo();
        expect(publicPage.getPageTitleText()).toEqual('Chatroom');
    });

    it('when user logs out they should be redirected to login page', () => {
        publicPage.navigateTo();
        publicPage.logout();
        expect(page.getPageTitleText()).toEqual('Login');
    });
});
