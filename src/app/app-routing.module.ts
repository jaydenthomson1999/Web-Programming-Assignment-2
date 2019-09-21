import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { GroupListComponent } from './group-list/group-list.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chat-room', component: ChatRoomComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'user-add', component: UserAddComponent},
  { path: 'group-list', component: GroupListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
