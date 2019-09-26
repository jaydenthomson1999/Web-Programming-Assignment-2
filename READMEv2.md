# Git
In this section I will describe the layout of my git repository and my approach to version control.

## Layout
For my repository, I wanted to keep the Angular front-end and the back-end Node REST API under the same project so I only needed one package.json to handle my dependent node modules. Additionally I could keep track of commits for both the front end and back end in one git repo. 

In hindsight, this was probably a bad decision because if this project was going to go into production these two ends will be hosted on different servers. I could still keep everything under one repo but I would need to initialise two separate package.json files in order to make sure both ends don't install packages that they won't need.

## Version Control
My approach for version control in this assignment was to develop the back-end API route by creating a new file and linking it to my main server code using require, test it using Postman, and if all my tests passed I would add the new file to my repository, committed all my changes and pushed my local repository to my remote repository. 

After this I would develop the UI in my Angular app and develop Typescript code to send requests for API data that would be displayed in the Angular app. I would then test my request code before making changes to my repository. After testing I would add new files, commit all changes and push the local repository to the remote repository. 

Since there was only one developer I decided I wouldn't need to do any branching however reflecting on the project it would have been more helpful to define milestones for myself and create a branch for each milestone. After each milestone was completed I would merge the branch to the master branch. 

My back-end was originally implemented by storing data in a JSON file, however for my second version I needed to port my data to a mongo database. For that I followed the same steps as described early where I developed and tested my API first then developed the front-end. 

# Data Structures
My main data structure was a list of users which has user info, a list of groups they are a part of and a list they are an admin of. 
```json
[
    {
        "username": "USERNAME",
        "password": "PASSWORD",
        "email": "EMAIL",
        "type": "TYPE",
        "groupList": [
            {
                "groupName": "GROUP NAME",
                "channels": [
                    "main",
                    "OTHER CHANNEL NAME"
                ]
            }
        ],
        "adminGroupList": ["GROUP NAME"]
    }
]
```
Each group in a group list has a group name and an array of channel names. Each group must have a main channel which cannot be deleted unless the whole group is deleted. If a user is not a group admin, there adminGroupList will be empty. 

This data structure is kept inside a mongodb database in a collection called 'users'. 

# REST API
| Route | Request Type | Parameters | Return Values | Description |
|-------|--------------|-----------|---------------|-------------|
| /api/login | POST | { username: string, password: string } | { ok: boolean, user: json } | Finds user in mongo database and checks to see if their password matches one on record |
| /api/add-user | PUT | { newUser: json } | { add: boolean, comment: string } | Searches through mongo database to see if newUser.username exists, if it doesn't, they will be added as a new user |
| /api/get-users | GET | No Parameters | users: [] | Returns array of users, including the super user |
| /api/add-group | PUT | { userid: string, groupName: string } | { add: boolean, comment: string } | Checks to see if group exists, if it doesn't, the new group will be added and will be appended to the adminGroupList of the specified admin |
| /api/get-groups | POST | { userid: string } | { ok: boolean, groupList: json[], adminGroupList: string[] } | Returns the list of groups and admin groups of a specified user |
| /api/del-user | DELETE | { userid: string } | { delete: boolean, comment: string } | Finds user in user.json and removes it from the file |
| /api/add-channel | PUT | { userid: string, groupName: string, channelName: string } | { add: boolean, comment: string } | Adds a channel to a users groupList if they are a memeber of a group |
| /api/del-group | DELETE | { userid: string, groupName: string } | { delete: boolean, comment: string } | If username is a group admin of the group name it will be deleted from every users group list if it exists |
| /api/add-user-to-group | PUT | { adminid: string, userid: string, groupName: string } | { add: boolean, comment: string } | Adds user to a group if adminUser is the admin of the group name |
| /api/add-user-to-channel | PUT | { adminid: string, userid: string, groupName: string, channelName: string } | { add: boolean, comment: string } | Adds user to a channel if user is already a memeber of the group and adminUser is an admin of the group |
| /api/del-user-from-group | DELETE | { adminid: string, userid: string, groupName: string } | { delete: boolean, comment: string } | If admin user is the admin of the group name and del user is a memeber of the group they will be deleted from the group |
| /api/del-user-from-channel | DELETE | { adminid: string, userid: string, groupName: string, channelName: string } | { delete: boolean, comment: string } | If admin is the admin of the group and del user is a memeber of the channel they will be deleted from the channel |

# Angular Architecture
## Login Component
First page is the login page, when the user submits there login form the page interacts with the login service which uses the api/login request.

## Chat Room Component
After the user logs in they will be directed to the chat room landing page. If the user has admin privileges they can be able to add groups and channels using api/add-group and api/add-channel. Privilege users can also be able to go to the group list page and the user list page.

## Group List Component
The group list page is where an admin can add users to there group or delete user from there group by using the API routes api/add-user-to-group and api/del-user-from-group . They also have the ability to delete the whole group and to look at the groups channels by being taken to the channel list page.

## Channel List Component
The channel list page is where an admin user can add users to there channel if they are members of their group or delete users that are already members of the channel by using the API routes api/add-user-to-channel and api/del-user-from-channel. 

## User List Component
The user list page is used for the super user to delete users using the api/del-user request. This page can then go to the user add page to add new users.

## User Add Component
The user add page is used for the super to add a new user using the api/add-user request.

## Login Service
The login service is used by the login page to send the api/login request to the server. The service also resolves the asynchronous function and stores the user details in session storage. The service returns a promise to notify components that the function was resolved.

## User Service
The user service is used to send requests to the server for a variety of user and group/channel operations. The service itself returns the Observable used by Angular's HTTP Client module to allow the components to resolve the response in which ever way it would need it.

# State Change
## Server
Any PUT or DELETE request will change the state of the mongo database which is used to record user settings and groups.

## Angular
Most GET or POST request made by the Angular side will change the page html using an ngFor or ngIf. 
- api/get-users is used on the user list page to display all users
- api/get-groups is used to display groups on the group list page as well as the chat page to select channels
- api/login takes users to there chat room home page with there username displayed
