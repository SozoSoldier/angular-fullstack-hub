import { TestBed, fakeAsync, tick } from '@angular/core';
import { ToastService } from './toast';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initial state be null', () => {
    expect(service.toast()).toBeNull();
  });

  it('should show toast message and auto dismiss after 3 seconds', fakeAsync(() => {
    service.show('Test notification message', 'success', 3000);
    const toastState = service.toast();
    expect(toastState).not.toBeNull();
    expect(toastState?.message).toBe('Test notification message');
    expect(toastState?.type).toBe('success');

    tick(3000);
    expect(service.toast()).toBeNull();
  }));

  it('should dismiss active toast when dismiss() is called', () => {
    service.info('Info message');
    expect(service.toast()).not.toBeNull();
    service.dismiss();
    expect(service.toast()).toBeNull();
  });
});
