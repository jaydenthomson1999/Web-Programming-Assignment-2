import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user/user.service';

interface Get {
  ok: boolean;
  users: any;
}

interface Delete {
  delete: boolean;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private getUrl = 'http://localhost:3000/api/get-users';
  private delUrl = 'http://localhost:3000/api/del-user';
  private loggedUser;
  private group;
  private channel;
  private users;

  constructor(private http: HttpClient,
              private router: Router,
              private userService: UserService
              ) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user === null) {
      this.router.navigateByUrl('/');
    }

    if (JSON.parse(sessionStorage.getItem('user')).type !== 'super' &&
        JSON.parse(sessionStorage.getItem('user')).type !== 'group admin') {
      router.navigateByUrl('/chat-room');
    }

    this.loggedUser = JSON.parse(sessionStorage.getItem('user'));

    this.get_users();
   }

  ngOnInit() {

  }

  // get users from backend
  get_users() {
    this.userService.getUser().subscribe(
      res => {
        this.users = res;
      },
      (err: HttpErrorResponse) => {
        alert(err.error);
      }
    );
  }

  // del user from backend
  delUser(userid: string) {
    this.userService.delUser(userid).subscribe(
      res => {
        if (res.delete) {
          this.get_users();
        } else {
          alert(res.comment);
        }
      },
      (err: HttpErrorResponse) => {
        alert(err.error);
      }
    );
  }
}
