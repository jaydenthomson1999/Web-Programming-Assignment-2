import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

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

  constructor(private http: HttpClient, private userService: UserService) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
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

  // performs delete groups request
  deleteGroup(groupName: string) {
    this.userService.delGroup(
      JSON.parse(sessionStorage.getItem('user'))._id,
      groupName
    )
    .subscribe(
      res => {
        if (res.delete) {
          this.getGroups();
        } else {
          alert(res.comment);
        }
      },
      (err: HttpErrorResponse) => {
        alert(err.error);
      }
    );
  }

  // presents modal
  apiModal(operation: string, type: string, name: string) {
    this.modalList = [];
    this.operation = operation;
    this.type = type;

    this.userService.getUser().subscribe(
      res => {
        const id = JSON.parse(sessionStorage.getItem('user'))._id;
        const adminIndex = res.findIndex((user) => user._id === id);
        res.splice(adminIndex, 1);

        if (res.length) {
          res.forEach(user => {
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
                this.modalList.push(user);
            }
          });

          if (!this.modalList.length) {
            alert('No Users');
          }
        } else {
          alert('No Users');
        }
      },
      (err: HttpErrorResponse) => {
        alert(err.error);
      }
    );
  }

  // changes the selected user
  selectUser(username) {
    this.selectedUser = username;
  }

  // trigers modal operation
  modalConfirm() {
    if (this.operation === 'Add') {
      if (this.type === 'group') {
        this.addUserGroup(this.user, this.selectedUser, this.selectedGroup);

      } else if (this.type === 'channel') {
        this.addUserChannel(this.user, this.selectedUser,
          this.selectedGroup, this.selectedChannel);

      }
    } else if (this.operation === 'Delete') {
      if (this.type === 'group') {
        this.delUserGroup(this.user, this.selectedUser,
          this.selectedGroup);

      } else if (this.type === 'channel') {
        this.delUserChannel(this.user, this.selectedUser,
          this.selectedGroup, this.selectedChannel);
      }
    }
  }

  // adds user to group in backend
  private addUserGroup(adminUser, addUser, groupName) {
    this.userService.addUserToGroup(adminUser._id, addUser._id, groupName)
    .subscribe(
      res => {
        if (res.add) {
          this.getGroups();
          this.channelList = [];
        } else {
          alert(res.comment);
        }
      },
      (err: HttpErrorResponse) => {
        alert(err);
      }
    );
  }

  // adds user to channel in back end
  private addUserChannel(adminUser, addUser, groupName, channelName) {
    this.userService.addUserToChannel(adminUser._id, addUser._id, groupName,
                                      channelName)
    .subscribe(
      res => {
        if (res.add) {
          this.getGroups();
          this.channelList = [];
        } else {
          alert(res.comment);
        }
      },
      (err: HttpErrorResponse) => {
        alert(err);
      }
    );
  }

  // deletes user from a group in backend
  private delUserGroup(adminUser, delUser, groupName) {
    this.userService.delUserFromGroup(adminUser._id, delUser._id, groupName)
    .subscribe(
      res => {
        if (res.delete) {
          this.getGroups();
          this.channelList = [];
        } else {
          alert(res.comment);
        }
      },
      (err: HttpErrorResponse) => {
        alert(err);
      }
    );
  }

  // deletes user from channel in backend
  private delUserChannel(adminUser, delUser, groupName, channelName) {
    this.userService.delUserFromChannel(adminUser._id, delUser._id, groupName,
                                      channelName)
    .subscribe(
      res => {
        if (res.delete) {
          this.getGroups();
          this.channelList = [];
        } else {
          alert(res.comment);
        }
      },
      (err: HttpErrorResponse) => {
        alert(err);
      }
    );
  }

}

