import { iDSPage } from './app.po';

describe('abp-zero-template App', function() {
  let page: iDSPage;

  beforeEach(() => {
    page = new iDSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
