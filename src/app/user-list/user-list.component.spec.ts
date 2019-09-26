import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserListComponent } from './user-list.component';
import { NgxLoadingModule } from 'ngx-loading';

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

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async(() => {
    spyOn(window.sessionStorage, 'getItem').and.callFake(fakeStorage.getItem);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLoadingModule.forRoot({})],
      declarations: [ UserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should have rendered dummy user', () => {
    component.users = [superUser.user];
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('li');
    expect(el.innerText).toContain('super');
  });
});
