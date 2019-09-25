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
  private adminGroupList: string[];
  private operation: string;
  private modalList = [];
  private selectedUser: any;
  private selectedGroup;

  constructor(private http: HttpClient, private userService: UserService) {
    this.getGroups();
  }

  ngOnInit() {
  }

  presentModal(operation: string, groupName: string) {
    this.operation = operation;
    this.modalList = [];

    this.userService.getUser().subscribe(
      res => {
        const id = JSON.parse(sessionStorage.getItem('user'))._id;
        const adminIndex = res.findIndex((user) => user._id === id);
        res.splice(adminIndex, 1);

        if (res.length) {
          res.forEach(user => {
            let isMember = false;
            for (const group of user.groupList) {
              if (group.groupName === groupName) {
                isMember = true;
                break;
              }
            }

            if ((!isMember && operation === 'Add') ||
                (isMember && operation === 'Delete')) {
                this.modalList.push(user);
            }
          });
        }

        if (this.modalList.length === 0) {
          alert(`No Users to ${operation}`);
        }
      },
      (err: HttpErrorResponse) => {
        alert(err.error);
      }
    );
  }

  selectUser(user: string) {
    this.selectedUser = user;
  }

  selectGroup(groupName: string) {
    this.selectedGroup = groupName;
  }

  modalConfirm() {
    if (this.operation === 'Add') {
      this.addUserGroup(JSON.parse( sessionStorage.getItem('user')),
                        this.selectedUser,
                        this.selectedGroup);

    } else if (this.operation === 'Delete') {
      this.delUserGroup(JSON.parse( sessionStorage.getItem('user')),
                        this.selectedUser,
                        this.selectedGroup);

    } else {
      alert('Unrecognised operation');
    }
  }

  // performs get groups request
  getGroups() {
    this.userService.getGroup(JSON.parse(sessionStorage.getItem('user'))._id)
    .subscribe(
      res => {
        if (res.ok) {
          this.adminGroupList = res.adminGroupList;
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

  // adds user to group in backend
  private addUserGroup(adminUser, addUser, groupName) {
    this.userService.addUserToGroup(adminUser._id, addUser._id, groupName)
    .subscribe(
      res => {
        if (res.add) {
          this.getGroups();
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

