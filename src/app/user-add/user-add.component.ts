import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

interface Put {
  add: boolean;
}

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  private url = 'http://localhost:3000/api/add-user';
  private username: string;
  private password: string;
  private email: string;
  private type: string;

  private loginError = {
    main: false,
    username: false,
    password: false,
    email: false,
    type: false
  };

  constructor(private router: Router,
              private http: HttpClient,
              private userService: UserService) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user === null) {
      this.router.navigateByUrl('/');
    }
   }

  ngOnInit() {
  }

  // add user to backend list
  add_user() {
    if (this.username === undefined ||
        this.password === undefined ||
        this.email === undefined ||
        this.type === undefined) {
        this.formError();
        return;
    }

    // standardised
    this.type = this.type.toLowerCase();
    const user = {
      username: this.username,
      password: this.password,
      email: this.email,
      type: this.type
    };

    this.userService.addUser(user).subscribe(
      res => {
        if (res.add) {
          this.go_back();
        } else {
          alert(res.error);
        }
      },
      (err: HttpErrorResponse) => {
        alert(err.error);
      }
    );
  }

  // goes back when user
  go_back() {
    this.router.navigateByUrl('/user-list');
  }

  // used to prompt user for appropriate fields
  formError() {
    this.loginError.main = true;

    if (this.username === undefined) { this.loginError.username = true; }
    else { this.loginError.username = false; }

    if (this.password === undefined) { this.loginError.password = true; }
    else { this.loginError.password = false; }

    if (this.email === undefined) { this.loginError.email = true; }
    else { this.loginError.email = false; }

    if (this.type === undefined) { this.loginError.type = true; }
    else { this.loginError.type = false; }
  }
}
