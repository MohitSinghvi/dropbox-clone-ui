import { Component } from '@angular/core';
import { IUser, CognitoService } from '../services/cognito.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading: boolean;
  user: IUser;

  constructor(private router: Router,
              private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService.signIn(this.user)
    .then((result) => {
      console.log(result);
      // this.cognitoService.setUserInLocalStorage(result?.username)
      this.router.navigate(['/home']);
    }).catch(() => {
      this.loading = false;
    });
  }
}
