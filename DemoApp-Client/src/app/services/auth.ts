import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // A global signal tracking whether the user is logged in
  isAuthenticated = signal<boolean>(this.hasToken());

  private hasToken(): boolean {
    return sessionStorage.getItem('app_auth_token') === 'true';
  }

  login(username: string, password: string): boolean {
    // Hardcoded credentials requested by the user
    if (username === 'admin' && password === 'test123$') {
      sessionStorage.setItem('app_auth_token', 'true');
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem('app_auth_token');
    this.isAuthenticated.set(false);
  }
}
