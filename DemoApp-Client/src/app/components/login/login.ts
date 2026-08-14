import { Component, inject, signal, ViewEncapsulation } from '@angular/core'; // 1. Add ViewEncapsulation
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None, // 2. Turn off sandbox encapsulation for global styles
  template: `
    <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div
        class="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-md"
      >
        <div>
          <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white text-2xl shadow-md shadow-indigo-100"
          >
            F
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Sign in to Full-Stack Hub
          </h2>
          <p class="mt-2 text-center text-sm text-slate-500">
            Demo Username/Password: admin / test123$
          </p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="space-y-4 rounded-md">
            <div>
              <label class="block text-sm font-medium text-slate-700">Username</label>
              <input
                type="text"
                formControlName="username"
                class="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                placeholder="admin"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                formControlName="password"
                class="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          @if (errorMessage()) {
            <div
              class="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 border border-rose-200 animate-pulse"
            >
              {{ errorMessage() }}
            </div>
          }

          <div>
            <button
              type="submit"
              class="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    const success = this.authService.login(username, password);

    if (success) {
      this.errorMessage.set(null);
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set('Invalid test username or password combination.');
    }
  }
}
