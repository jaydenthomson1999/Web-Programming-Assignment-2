import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private username = '';
  private password = '';

  constructor(private loginService: LoginServiceService,
              private router: Router
  ) { }

  ngOnInit() {
  }

  // fires when user confirms login form
  private loginAttempt() {
    const login = this.loginService.login(this.username, this.password);
    login.then(data => {
      if (sessionStorage.getItem('user') != null) {
        // redirect
        this.router.navigateByUrl('/chat-room');
      }
    });
  }
}
