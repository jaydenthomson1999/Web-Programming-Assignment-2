import { PublicPage } from './public.po';

describe('Chat room protractor', () => {
    let page: PublicPage;

    beforeEach(() => {
        page = new PublicPage();
    });

    // it('when user browses to chat room they should see title chatroom', () => {
    //     page.navigateTo();
    //     expect(page.getPageTitleText()).toEqual('Chatroom');
    // });
});
