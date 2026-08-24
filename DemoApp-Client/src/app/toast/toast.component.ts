import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (toastService.toast(); as currentToast) {
      <div
        class="fixed bottom-5 right-5 z-50 max-w-md w-full sm:w-auto min-w-[320px] p-4 rounded-xl shadow-2xl border flex items-center justify-between gap-4 transition-all duration-300"
        [ngClass]="{
          'bg-emerald-900/95 text-emerald-100 border-emerald-700 shadow-emerald-950/20':
            currentToast.type === 'success',
          'bg-rose-900/95 text-rose-100 border-rose-700 shadow-rose-950/20':
            currentToast.type === 'error',
          'bg-amber-900/95 text-amber-100 border-amber-700 shadow-amber-950/20':
            currentToast.type === 'warning',
          'bg-slate-900/95 text-slate-100 border-slate-700 shadow-slate-950/20':
            currentToast.type === 'info',
        }"
        role="alert"
        aria-live="polite"
      >
        <div class="flex items-center gap-3">
          @if (currentToast.type === 'success') {
            <svg
              class="h-6 w-6 text-emerald-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          } @else if (currentToast.type === 'error') {
            <svg
              class="h-6 w-6 text-rose-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          } @else if (currentToast.type === 'warning') {
            <svg
              class="h-6 w-6 text-amber-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          } @else {
            <svg
              class="h-6 w-6 text-indigo-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }

          <span class="text-sm font-medium leading-snug break-words">
            {{ currentToast.message }}
          </span>
        </div>

        <button
          (click)="toastService.dismiss()"
          type="button"
          class="inline-flex shrink-0 p-1.5 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Close notification"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    }
  `,
})
export class ToastComponent {
  toastService = inject(ToastService);
}
