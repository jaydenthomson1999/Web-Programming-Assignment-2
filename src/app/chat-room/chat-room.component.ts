import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Put {
  add: boolean;
}

interface Get {
  ok: boolean;
  groupList: any[];
  adminGroupList: any[];
}

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

  private addGroupUrl = 'http://localhost:3000/api/add-group';
  private getGroupUrl = 'http://localhost:3000/api/get-groups';
  private addChannelUrl = 'http://localhost:3000/api/add-channel';

  private selectedGroup: string;
  private selectedChannel: string;

  constructor(private router: Router, private http: HttpClient) {
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
      // add group api
      const data = new Promise((resolve, reject) => {
        this.http.put<Put>(this.addGroupUrl,
          { groupName: this.modalInput,
            username: (JSON.parse(sessionStorage.getItem('user')).username)
          }).subscribe(
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
          // get user groups
          this.get_groups();
        } else {
          alert('Couldn\'t add group');
        }
      });
    } else {
      // add channel api
      const data = new Promise((resolve, reject) => {
        this.http.put<Put>(this.addChannelUrl, {
          username: this.user.username,
          groupName: this.selectedGroup,
          channelName: this.modalInput
        }).subscribe(
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
          this.get_groups();
        } else {
          alert('Couldn\'t add channel');
        }
      });
    }
  }

  // uses get request to update groupList and adminGroup list
  get_groups() {
    const data = new Promise<any>((resolve, reject) => {
      this.http.post<Get>(this.getGroupUrl, {
        username: (JSON.parse(sessionStorage.getItem('user')).username)
      }).subscribe(
        res => {
          if (res.ok) {
            resolve(res);
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

    data.then(json => {
      this.adminGroupList = json.adminGroupList;
      this.groupList = json.groupList;
    });
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
