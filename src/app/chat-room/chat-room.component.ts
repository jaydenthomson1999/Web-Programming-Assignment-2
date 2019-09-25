import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  private messages: string[] = [];
  private user: any;
  private privilege = false;
  private modalTitle;
  private modalInput;

  private groupList: any[];
  private channelList: any[];
  private adminGroupList: any[];

  private selectedGroup: string;
  private selectedChannel: string;

  private ioConnection: any;
  private messageIn: string;

  constructor(private router: Router,
              private http: HttpClient,
              private userService: UserService) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (this.user === null) {
      this.router.navigateByUrl('/');
    }

    if (this.user.type === 'super' || this.user.type === 'group admin') {
      this.privilege = true;
    }

    this.get_groups();
  }

  ngOnInit() {
  }

  // changes modal header
  addGroupModal() {
    this.modalTitle = 'Add Group';
  }

  // changes modal header
  addChannelModal() {
    this.modalTitle = 'Add Channel';
  }

  // adds group or channel
  modalAdd() {
    if (this.modalTitle === 'Add Group') {
      this.userService.addGroup(
        JSON.parse(sessionStorage.getItem('user'))._id, this.modalInput)
        .subscribe(
          res => {
            if (res.add) {
              this.get_groups();
            } else {
              alert(res.comment);
            }
          },
          (err: HttpErrorResponse) => {
            alert(err.error);
          }
        );
    } else {
      this.userService.addChannel(
        JSON.parse(sessionStorage.getItem('user'))._id,
        this.selectedGroup,
        this.modalInput
      ).subscribe(
        res => {
          if (res.add) {
            this.get_groups();
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

  // uses get request to update groupList and adminGroup list
  get_groups() {
    this.userService.getGroup(JSON.parse(sessionStorage.getItem('user'))._id)
    .subscribe(
      res => {
        if (res.ok) {
          this.adminGroupList = res.adminGroupList;
          this.groupList = res.groupList;
        } else {
          alert(res.comment);
        }
      },
      (err: HttpErrorResponse) => {
        alert(err.error);
      }
    );
  }

  // changes which group is selected
  groupSelected() {
    for (let i = 0; i < this.groupList.length; i++) {
      if (this.groupList[i].groupName === this.selectedGroup) {
        this.channelList = this.groupList[i].channels;
        break;
      }
    }
  }

  // logs user out
  logout() {
    sessionStorage.removeItem('user');
    this.router.navigateByUrl('/');
  }

  // goes to user list page
  goto_users() {
    this.router.navigate(['/user-list']);
  }

  // goes to groupList page
  gotoGroups() {
    this.router.navigate(['/group-list']);
  }
}
