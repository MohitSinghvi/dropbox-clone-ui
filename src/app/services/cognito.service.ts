import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {Amplify, Auth } from 'aws-amplify';

import { environment } from '../../environments/environment';

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<any>;
  loggedIn: Subject<any> =new Subject();

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn(user.email, user.password)
    .then((result) => {
      console.log(result);
      localStorage.setItem('userId', result.username);
      localStorage.setItem('username', result.attributes.name);
      this.loggedIn.next(result.attributes.name);
      this.authenticationSubject.next(result);
    });
  }

  public signOut(): Promise<any> {
    
    return Auth.signOut()
    .then(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      this.authenticationSubject.next(false);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
      .then((user: any) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      }).catch(() => {
        return false;
      });
    }
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
    .then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }

  setUserInLocalStorage(userId: any){
    localStorage.setItem('userId', userId);

  }

}