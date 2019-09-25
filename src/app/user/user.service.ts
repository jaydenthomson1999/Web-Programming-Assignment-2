import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface User {
  username: string;
  password: string;
  email: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private domain = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  addUser(newUser: User) {
    return this.http.put<any>(this.domain + '/api/add-user', newUser);
  }

  getUser() {
    return this.http.get<any>(this.domain + '/api/get-users');
  }

  delUser(userid: string) {
    const httpOptions = this.getHttpOptions({ userid });
    return this.http.delete<any>(this.domain + '/api/del-user', httpOptions);
  }

  addGroup(userid: string, groupName: string) {
    return this.http.put<any>(
      this.domain + '/api/add-group',
      { userid, groupName }
    );
  }

  getGroup(userid: string) {
    return this.http.post<any>(this.domain + '/api/get-groups', { userid });
  }

  addChannel(userid: string, groupName: string, channelName: string) {
    return this.http.put<any>(
      this.domain + '/api/add-channel',
      { userid, groupName, channelName }
    );
  }

  delGroup(userid: string, groupName: string) {
    const httpOptions = this.getHttpOptions({ userid, groupName });
    return this.http.delete<any>(this.domain + '/api/del-group', httpOptions);
  }

  addUserToGroup(adminid: string, userid: string, groupName: string) {
    return this.http.put<any>(
      this.domain + '/api/add-user-to-group',
      { adminid, userid, groupName }
    );
  }

  addUserToChannel(adminid: string, userid: string, groupName: string,
                   channelName: string) {
    return this.http.put<any>(
      this.domain + '/api/add-user-to-channel',
      { adminid, userid, groupName, channelName }
    );
  }

  delUserFromGroup(adminid: string, userid: string, groupName: string) {
    const httpOptions = this.getHttpOptions({ adminid, userid, groupName });
    return this.http.delete<any>(
      this.domain + '/api/del-user-from-group',
      httpOptions
    );
  }

  delUserFromChannel(adminid: string, userid: string, groupName: string,
                     channelName: string) {
    const httpOptions = this.getHttpOptions({
      adminid, userid, groupName, channelName
    });

    return this.http.delete<any>(
      this.domain + '/api/del-user-from-channel',
      httpOptions
    );
  }

  getHttpOptions(bodyJson) {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: bodyJson
    };
  }
}
