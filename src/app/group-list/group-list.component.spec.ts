import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupListComponent } from './group-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
  }
};

describe('GroupListComponent', () => {
  let component: GroupListComponent;
  let fixture: ComponentFixture<GroupListComponent>;

  beforeEach(async(() => {
    spyOn(window.sessionStorage, 'getItem').and.callFake(fakeStorage.getItem);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, NgxLoadingModule.forRoot({})],
      declarations: [ GroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not send request to server for unknown operation', () => {
    spyOn(window, 'alert');
    component.modalConfirm();
    expect(window.alert).toHaveBeenCalledWith('Unrecognised operation');
  });
});
