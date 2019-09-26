import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChatRoomComponent } from './chat-room.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const superUser = {
  user: {
    _id: '5d8bff09ab26f839808fdb8d',
    username: 'super',
    email: 'admin@chat.com',
    password: 'super',
    type: 'super'
  }
};

const fakeStorage = {
  getItem(key) {
      return JSON.stringify(superUser[key]);
  },
  removeItem(key) {
    delete superUser[key];
  }
};

describe('ChatRoomComponent', () => {
  let component: ChatRoomComponent;
  let fixture: ComponentFixture<ChatRoomComponent>;

  beforeEach(async(() => {
    spyOn(window.sessionStorage, 'getItem').and.callFake(fakeStorage.getItem);
    spyOn(window.sessionStorage, 'removeItem').and.callFake(fakeStorage.removeItem);

    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [ ChatRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no user in session storage after login', () => {
    component.logout();
    expect(superUser.user).toBe(undefined);
  });
});
