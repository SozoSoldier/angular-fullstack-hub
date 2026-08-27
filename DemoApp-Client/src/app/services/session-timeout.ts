// src/app/services/session-timeout.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from './toast';

@Injectable({
  providedIn: 'root',
})
export class SessionTimeoutService {
  private router = inject(Router);
  private toastService = inject(ToastService);

  // Core signals to drive our global security overlay layout
  showWarningPanel = signal<boolean>(false);
  secondsRemaining = signal<number>(60);

  // Configurations (in seconds)
  private readonly INACTIVITY_THRESHOLD = 300; // 5 minutes of total idle allowance
  private readonly COUNTDOWN_DURATION = 60; // 1 minute warning countdown box

  private idleTimer: any;
  private countdownInterval: any;
  private isUserAuthenticated = false;

  /**
   * Initializes the event hooks to watch for genuine user input.
   * If the user moves, types, or clicks, we reset their idle counter.
   */
  startMonitoring(isAuthenticated: boolean): void {
    this.isUserAuthenticated = isAuthenticated;
    this.stopMonitoring(); // Clear any existing tracking loops safely

    if (!this.isUserAuthenticated) return;

    this.resetIdleTimer();

    // Attach local host window tracking listeners for desktop/mobile interaction vectors
    window.addEventListener('mousemove', this.boundReset);
    window.addEventListener('click', this.boundReset);
    window.addEventListener('keydown', this.boundReset);
    window.addEventListener('touchstart', this.boundReset);
  }

  stopMonitoring(): void {
    this.clearTimers();
    window.removeEventListener('mousemove', this.boundReset);
    window.removeEventListener('click', this.boundReset);
    window.removeEventListener('keydown', this.boundReset);
    window.removeEventListener('touchstart', this.boundReset);
    this.showWarningPanel.set(false);
  }

  extendSession(): void {
    this.toastService.success('Authenticated session token renewed successfully.');
    this.showWarningPanel.set(false);
    this.startMonitoring(true);
  }

  private boundReset = () => this.resetIdleTimer();

  private resetIdleTimer(): void {
    if (this.showWarningPanel()) return; // Don't reset if they are already looking at the warning box

    clearTimeout(this.idleTimer);

    // After 4 minutes of dead silence, trigger the warning countdown state
    this.idleTimer = setTimeout(
      () => {
        this.triggerWarningSequence();
      },
      (this.INACTIVITY_THRESHOLD - this.COUNTDOWN_DURATION) * 1000,
    );
  }

  private triggerWarningSequence(): void {
    this.secondsRemaining.set(this.COUNTDOWN_DURATION);
    this.showWarningPanel.set(true);
    this.toastService.warning('Security Alert: Idle session threshold reached.');

    // Run a high-precision 1-second interval subtraction engine loop
    this.countdownInterval = setInterval(() => {
      this.secondsRemaining.update((current) => current - 1);

      if (this.secondsRemaining() <= 0) {
        this.executeForcedLogout();
      }
    }, 1000);
  }

  private executeForcedLogout(): void {
    this.stopMonitoring();
    this.toastService.error('Session expired due to inactivity. Access revoked.');

    // Clear credentials and route back to login card shell gate
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  private clearTimers(): void {
    clearTimeout(this.idleTimer);
    clearInterval(this.countdownInterval);
  }
}
