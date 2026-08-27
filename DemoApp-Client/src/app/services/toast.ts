// src/app/services/toast.ts
import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error';
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  // 1. Reactive master array tracking active toast notification bubbles
  toasts = signal<ToastMessage[]>([]);
  private nextId = 0;

  success(message: string): void {
    this.addToast('success', message);
  }

  error(message: string): void {
    this.addToast('error', message);
  }

  private addToast(type: 'success' | 'error', text: string): void {
    const id = this.nextId++;
    const newToast: ToastMessage = { id, type, text };

    // Push into writeable signal array structure
    this.toasts.update((current) => [...current, newToast]);

    // 2. DISMISSAL TIMER: Automatically clear out individual toasts after 3.5 seconds
    setTimeout(() => {
      this.removeToast(id);
    }, 3500);
  }

  removeToast(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
