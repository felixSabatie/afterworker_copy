import { browser, logging } from 'protractor';
import { LoginPage } from './login.po';

describe('Login', () => {
  let login: LoginPage;

  beforeEach(() => {
    login = new LoginPage();
  });

  it('should display log in message', () => {
    login.navigateTo();
    expect(login.getTitle()).toEqual('Log in');
  });

  it('should display an error when wrong email', () => {
    login.navigateTo();
    login.fillFormWrongEmail();
    login.postForm();
    expect(login.getInputErrors().count()).toEqual(1);
  });

  it('should display an error when wrong password', () => {
    login.navigateTo();
    login.fillFormWrongEmail();
    login.postForm();
    expect(login.getInputErrors().count()).toEqual(1);
  });

  it('should display two errors when wrong password and email', () => {
    login.navigateTo();
    login.fillFormAllWrong();
    login.postForm();
    expect(login.getInputErrors().count()).toEqual(2);
  });
});
