import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service/login-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private username = '';
  private password = '';
  private loginError = false;
  public loading = false;

  constructor(private loginService: LoginServiceService,
              private router: Router
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem('user') != null) {
      // redirect
      this.router.navigateByUrl('/chat-room');
    }
  }

  // fires when user confirms login form
  private loginAttempt() {
    this.loading = true;
    const login = this.loginService.login(this.username, this.password);
    login.then(data => {
      this.loading = false;
      if (sessionStorage.getItem('user') != null) {
        // redirect
        this.router.navigateByUrl('/chat-room');
      } else {
        this.loginError = true;
      }
    });
  }
}
