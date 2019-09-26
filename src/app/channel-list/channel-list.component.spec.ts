import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { ChannelListComponent } from './channel-list.component';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

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

describe('ChannelListComponent', () => {
  let component: ChannelListComponent;
  let fixture: ComponentFixture<ChannelListComponent>;

  beforeEach(async(() => {
    spyOn(window.sessionStorage, 'getItem').and.callFake(fakeStorage.getItem);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      declarations: [ ChannelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelListComponent);
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
