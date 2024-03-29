import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.css']
})
export class ChannelListComponent implements OnInit {
  private groupName: string;
  private channels: string[];
  private operation: string;
  private modalList: string[] = [];
  private selectedUser: any;
  private selectedChannel;
  public loading = false;

  constructor(public userService: UserService, private route: ActivatedRoute) {
    this.groupName = this.route.snapshot.paramMap.get('groupName');
    this.getChannels();
  }

  ngOnInit() {
  }

  // used to show modal to the user and gets all users that can be added/deleted
  presentModal(operation: string, channelName: string) {
    this.operation = operation;
    this.selectedUser = undefined;
    this.modalList = [];
    this.selectedChannel = channelName;

    this.loading = true;
    this.userService.getUser().subscribe(
      res => {
        this.loading = false;
        // remove admin user
        const id = JSON.parse(sessionStorage.getItem('user'))._id;
        const adminIndex = res.findIndex((user) => user._id === id);
        res.splice(adminIndex, 1);

        // get users that are in group
        const usersInGroup = res.filter(user => {
          let foundGroup = false;

          user.groupList.forEach(group => {
            if (group.groupName === this.groupName) {
              foundGroup = true;
            }
          });

          return foundGroup;
        });

        // check if user in groups are in channel
        if (usersInGroup.length) {
          usersInGroup.forEach(user => {
            let isMember = false;
            const groupIndex = user.groupList.findIndex(
              (group) => group.groupName === this.groupName
            );

            for (const channel of user.groupList[groupIndex].channels) {
              if (channel === channelName) {
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
        this.loading = false;
        alert(err.error);
      }
    );
  }

  // changes the selected user on change event
  selectUser(user) {
    this.selectedUser = user;
  }

  // performs user operation when they press the confirm button
  modalConfirm() {
    if (this.operation === 'Add') {
      this.addUserChannel(JSON.parse( sessionStorage.getItem('user')),
                        this.selectedUser,
                        this.groupName,
                        this.selectedChannel);

    } else if (this.operation === 'Delete') {
      this.delUserChannel(JSON.parse( sessionStorage.getItem('user')),
                        this.selectedUser,
                        this.groupName,
                        this.selectedChannel);

    } else {
      alert('Unrecognised operation');
    }
  }

  // gets channels of the signed in admin
  getChannels() {
    this.loading = true;
    this.userService.getGroup(JSON.parse(sessionStorage.getItem('user'))._id)
    .subscribe(
      res => {
        this.loading = false;
        if (res.ok) {
          // this.adminGroupList = res.adminGroupList;
          const adminIndex = res.adminGroupList.findIndex((group) => group === this.groupName);
          if (adminIndex === -1) {
            return alert('User is not an admin of group');
          }

          const groupIndex = res.groupList.findIndex((group) => group.groupName === this.groupName);
          this.channels = res.groupList[groupIndex].channels.filter((channel) => channel !== 'main');
        } else {
          alert(res.comment);
        }
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        alert(err.error);
      }
    );
  }

  // adds user to channel in back end
  private addUserChannel(adminUser, addUser, groupName, channelName) {
    this.loading = true;
    this.userService.addUserToChannel(adminUser._id, addUser._id, groupName,
                                      channelName)
    .subscribe(
      res => {
        this.loading = false;
        if (res.add) {
          this.getChannels();
        } else {
          alert(res.comment);
        }
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        alert(err);
      }
    );
  }

  // deletes user from channel in backend
  private delUserChannel(adminUser, delUser, groupName, channelName) {
    this.loading = true;
    this.userService.delUserFromChannel(adminUser._id, delUser._id, groupName,
                                      channelName)
    .subscribe(
      res => {
        this.loading = false;
        if (res.delete) {
          this.getChannels();
        } else {
          alert(res.comment);
        }
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        alert(err);
      }
    );
  }
}
