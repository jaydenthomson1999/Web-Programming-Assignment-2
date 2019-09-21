import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private router: Router, private http: HttpClient) {
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

    const data = new Promise((resolve, reject) => {
      this.http.put<Put>(this.url, user).subscribe(
        res => {
          if (res.add) {
            resolve(res.add);
          } else {
            resolve(false);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
          reject(err.error);
        }
      );
    });

    data.then(bool => {
      if (bool) {
        this.go_back();
      } else {
        this.show_error();
      }
    });
  }

  // goes back when user
  go_back() {
    this.router.navigateByUrl('/user-list');
  }

  // shows error
  show_error() {
    alert('Error Occured');
  }

}
