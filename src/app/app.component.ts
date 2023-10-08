import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from './services/cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dropbox-clone';

  isAuthenticated: boolean;
  user: any;

  constructor(private router: Router,
              private cognitoService: CognitoService) {
    this.isAuthenticated = false;
  }

  public ngOnInit(): void {
    this.cognitoService.isAuthenticated()
    .then((success: boolean) => {
      this.isAuthenticated = success;
    });
    this.cognitoService.loggedIn.subscribe({
      next:(result)=>{
        this.user = result;
      },
      error:(error)=>{

      }
    })
    this.user = localStorage.getItem('username')
  }

  public signOut(): void {
    this.cognitoService.signOut()
    .then(() => {
      this.router.navigate(['/signIn']);
    });
  }

}
