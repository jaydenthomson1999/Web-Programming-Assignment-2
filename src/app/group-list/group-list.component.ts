import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Delete {
  delete: boolean;
}

interface Put {
  add: boolean;
}

interface GetGroups {
  ok: boolean;
  groupList: any[];
  adminGroupList: any[];
}

interface GetUsers {
  ok: boolean;
  users: any;
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  private delUrl = 'http://localhost:3000/api/del-group';
  private getGroupUrl = 'http://localhost:3000/api/get-groups';
  private getUsersUrl = 'http://localhost:3000/api/get-users';

  private addUserGroupUrl = 'http://localhost:3000/api/add-user-to-group';
  private addUserChannelUrl = 'http://localhost:3000/api/add-user-to-channel';
  private delUserGroupUrl = 'http://localhost:3000/api/del-user-from-group';
  private delUserChannelUrl = 'http://localhost:3000/api/del-user-from-channel';

  private user;

  private channelList;

  private selectedGroup;
  private selectedChannel;
  private selectedUser;

  private adminGroupList;
  private groupList;

  private operation;
  private type;
  private modalList = [];

  constructor(private http: HttpClient) {
    this.user = JSON.parse(sessionStorage.getItem('user')).username;
    this.getGroups();
  }

  ngOnInit() {
  }

  // changes selected group
  selectGroup(groupName: string) {
    for( let i = 0; i < this.groupList.length; i++) {
      if (this.groupList[i].groupName === groupName) {
        this.selectedGroup = this.groupList[i].groupName;
        this.channelList = this.groupList[i].channels;
        break;
      }
    }
  }

  // performs get groups request
  getGroups() {
    const data = new Promise<any>((resolve, reject) => {
      this.http.post<GetGroups>(this.getGroupUrl, {
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

  // performs delete groups request
  deleteGroup(groupName: string) {
    // delete group
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: {username: this.user.username, groupName}
    };

    const del = new Promise((resolve, reject) => {
      this.http.delete<Delete>(this.delUrl, httpOptions).subscribe(
        res => {
          if (res.delete) {
            resolve(res.delete);
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

    del.then(bool => {
      if (bool) {
        this.getGroups();
      } else {
        alert('Couldn\'t delete user');
      }
    });
  }

  // presents modal
  apiModal(operation: string, type: string, name: string) {
    this.modalList = [];
    this.operation = operation;
    this.type = type;

    const users = new Promise<any>((resolve, reject) => {
      this.http.get<GetUsers>(this.getUsersUrl).subscribe(
        res => {
          if (res.ok) {
            resolve(res.users.users);
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

    users.then(data => {
      if (data) {
        data.forEach(user => {
          let isaMember = false;

          for (const group of user.groupList) {
            if (type === 'group' && group.groupName === name) {
              this.selectedGroup = name;
              isaMember = true;
              break;
            } else if (type === 'channel'
              && group.groupName === this.selectedGroup) {
                for (const channel of group.channels) {
                  if (channel === name) {
                    this.selectedChannel = name;
                    isaMember = true;
                  }
                }
            }
          }

          if ((!isaMember && operation === 'Add') ||
              (isaMember && operation === 'Delete')) {
              this.modalList.push(user.username);
          }

        });
      }
    });
  }

  // changes the selected user
  selectUser(username) {
    this.selectedUser = username;
  }

  // trigers modal operation
  modalConfirm() {
    let bool: Promise<any>;

    if (this.operation === 'Add') {
      if (this.type === 'group') {
        bool = this.addUserGroup(this.user, this.selectedUser,
          this.selectedGroup);

      } else if (this.type === 'channel') {
        bool = this.addUserChannel(this.user, this.selectedUser,
          this.selectedGroup, this.selectedChannel);

      }
    } else if (this.operation === 'Delete') {
      if (this.type === 'group') {
        bool = this.delUserGroup(this.user, this.selectedUser,
          this.selectedGroup);

      } else if (this.type === 'channel') {
        bool = this.delUserChannel(this.user, this.selectedUser,
          this.selectedGroup, this.selectedChannel);
      }
    }

    bool.then(ok => {
      if (ok) {
        this.getGroups();
        this.channelList = [];
      } else {
        alert('Could not perform modal operation');
      }
    });

  }

  // adds user to group in backend
  private addUserGroup(adminUser, addUser, groupName) {
    return new Promise((resolve, reject) => {
      this.http.put<Put>(this.addUserGroupUrl,
        { adminUser, addUser, groupName }).subscribe(
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
  }

  // adds user to channel in back end
  private addUserChannel(adminUser, addUser, groupName, channelName) {
    return new Promise((resolve, reject) => {
      this.http.put<Put>(this.addUserChannelUrl,
        { adminUser, addUser, groupName, channelName }).subscribe(
          res => {
            console.log(res);
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
  }

  // deletes user from a group in backend
  private delUserGroup(adminUser, delUser, groupName) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: { adminUser, delUser, groupName }
    };

    return new Promise((resolve, reject) => {
      this.http.delete<Delete>(this.delUserGroupUrl, httpOptions).subscribe(
        res => {
          console.log(res);
          if (res.delete) {
            resolve(res.delete);
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
  }

  // deletes user from channel in backend
  private delUserChannel(adminUser, delUser, groupName, channelName) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: { adminUser, delUser, groupName, channelName }
    };

    return new Promise((resolve, reject) => {
      this.http.delete<Delete>(this.delUserChannelUrl, httpOptions).subscribe(
        res => {
          if (res.delete) {
            resolve(res.delete);
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
  }

}

