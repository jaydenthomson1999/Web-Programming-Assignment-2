import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginServiceService } from './login-service.service';

describe('LoginServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: LoginServiceService = TestBed.get(LoginServiceService);
    expect(service).toBeTruthy();
  });
});
