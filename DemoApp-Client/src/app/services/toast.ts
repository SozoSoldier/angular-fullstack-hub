import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /**
   * Angular Signal storing the active toast message state or null if no active toast.
   */
  readonly toast = signal<ToastMessage | null>(null);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Displays a toast message and automatically dismisses it after 3 seconds (or specified duration).
   */
  show(message: string, type: ToastType = 'info', duration: number = 3000): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    const id = Date.now().toString();
    this.toast.set({ id, message, type });

    if (duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.dismiss();
      }, duration);
    }
  }

  success(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration: number = 3000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration: number = 3000): void {
    this.show(message, 'warning', duration);
  }

  dismiss(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.toast.set(null);
  }
}
