import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';
import { FooterComponent } from './footer/footer.component';
import { ToastService } from './services/toast';
import { SessionTimeoutService } from './services/session-timeout';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FooterComponent],
  template: `
    <!-- 1. Check if the user is logged in using our authentication signal -->
    @if (authService.isAuthenticated()) {
      <div class="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        <!-- Mobile navigation header -->
        <header
          class="flex h-16 items-center justify-between bg-slate-900 px-4 text-white lg:hidden"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold"
            >
              F
            </div>
            <span class="text-base font-bold tracking-tight">Full-Stack Hub</span>
          </div>
          <button
            type="button"
            (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            class="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Toggle navigation menu"
          >
            @if (mobileMenuOpen()) {
              <span class="text-2xl leading-none">&times;</span>
            } @else {
              <span class="text-2xl leading-none">&#9776;</span>
            }
          </button>
        </header>

        @if (mobileMenuOpen()) {
          <div
            class="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
            (click)="mobileMenuOpen.set(false)"
          ></div>
          <nav
            class="absolute left-0 right-0 top-16 z-50 bg-slate-900 px-4 pb-4 shadow-xl lg:hidden"
          >
            <a
              routerLink="/dashboard"
              (click)="closeMobileMenu()"
              class="flex items-center rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
              >Inventory System</a
            >
            <a
              routerLink="/products"
              (click)="closeMobileMenu()"
              class="flex items-center rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
              >Product Catalogue</a
            >
            <a
              routerLink="/analytics"
              (click)="closeMobileMenu()"
              class="flex items-center rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
              >Live Analytics Hub</a
            >
            <a
              routerLink="/logs"
              (click)="closeMobileMenu()"
              class="flex items-center rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
              >Audit Security Logs</a
            >
            <button
              type="button"
              (click)="onLogout()"
              class="mt-2 w-full rounded-lg border-t border-slate-800 px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Sign out
            </button>
          </nav>
        }

        <!-- SIDEBAR NAVIGATION CONTAINER -->
        <aside
          class="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-900 text-slate-300 lg:flex"
        >
          <div>
            <!-- Sidebar Header Title / Brand Logo -->
            <div class="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
              <div
                class="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm"
              >
                F
              </div>
              <span class="text-lg font-bold text-white tracking-tight">Full-Stack Hub</span>
            </div>

            <!-- NAVIGATION INTERACTIVE LINK MODULES -->
            <nav class="mt-6 px-4 space-y-1">
              <a
                routerLink="/dashboard"
                routerLinkActive="bg-slate-800 text-white font-semibold border-l-4 border-indigo-500"
                [routerLinkActiveOptions]="{ exact: true }"
                class="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer"
              >
                <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Inventory System
              </a>

              <a
                routerLink="/products"
                routerLinkActive="bg-slate-800 text-white font-semibold border-l-4 border-indigo-500"
                class="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer"
              >
                <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Product Catalogue
              </a>

              <a
                routerLink="/analytics"
                routerLinkActive="bg-slate-800 text-white font-semibold border-l-4 border-indigo-500"
                class="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer"
              >
                <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
                  />
                </svg>
                Live Analytics Hub
              </a>

              <a
                routerLink="/logs"
                routerLinkActive="bg-slate-800 text-white font-semibold border-l-4 border-indigo-500"
                class="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer"
              >
                <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Audit Security Logs
              </a>
            </nav>
          </div>

          <!-- Bottom Session Logged In User Block Layout -->
          <div class="p-4 border-t border-slate-800 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div
                class="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white uppercase"
              >
                AD
              </div>
              <div class="text-xs">
                <p class="font-semibold text-white leading-none">System Admin</p>
                <p class="text-slate-500 mt-0.5">Role: Developer</p>
              </div>
            </div>
            <button
              (click)="onLogout()"
              class="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
              title="Sign Out"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </aside>

        <!-- NEW FEATURE: Authenticated Session Expiration Warning Layout Panel -->
        <!-- Slides down beautifully from the top of viewport with smooth glassmorphic blur effects -->
        @if (sessionTimeout.showWarningPanel()) {
          <div
            class="fixed top-0 inset-x-0 z-50 p-4 bg-amber-50/95 border-b border-amber-500/30 backdrop-blur-md shadow-xl text-amber-900 animate-fade transition-all duration-300"
          >
            <div
              class="mx-auto max-w-4xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="text-2xl animate-pulse">🔒</span>
                <div>
                  <h4 class="text-sm font-bold tracking-wide">Security Inactivity Warning</h4>
                  <p class="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    Your session is expiring due to inactivity. For your protection, you will be
                    automatically logged out in
                    <span
                      class="font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-600 text-sm"
                    >
                      {{ sessionTimeout.secondsRemaining() }}
                    </span>
                    seconds.
                  </p>
                </div>
              </div>

              <div class="flex items-center space-x-2 shrink-0">
                <button
                  (click)="sessionTimeout.extendSession()"
                  class="rounded-xl bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
                >
                  Extend Session ⚡
                </button>
              </div>
            </div>
          </div>
        }

        <!-- MAIN DYNAMIC CONTENT ROUTER INJECTOR VIEWPORT -->
        <div class="flex min-h-screen min-w-0 flex-1 flex-col overflow-y-auto">
          <div class="flex-1">
            <router-outlet></router-outlet>

            <!-- Global Floating Toast Notification Container Stack -->
            <div
              class="fixed z-50 bottom-4 right-4 left-4 sm:left-auto flex flex-col gap-3 max-w-sm w-auto select-none pointer-events-none"
            >
              @for (msg of toastService.toasts(); track msg.id) {
                <div
                  [ngClass]="{
                    'border-emerald-500/30 bg-emerald-50/80 text-emerald-900 shadow-emerald-500/5':
                      msg.type === 'success',
                    'border-amber-500/30 bg-amber-50/80 text-amber-900 shadow-amber-500/5':
                      msg.type === 'warning',
                    'border-rose-500/30 bg-rose-50/80 text-rose-900 shadow-rose-500/5':
                      msg.type === 'error',
                  }"
                  class="pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-xl animate-fade transition-all duration-300"
                >
                  <div class="flex items-center space-x-3">
                    <!-- Icon badges customized per message type signature -->
                    <div
                      [ngClass]="{
                        'bg-emerald-500/10 text-emerald-600': msg.type === 'success',
                        'bg-amber-500/10 text-amber-600': msg.type === 'warning',
                        'bg-rose-500/10 text-rose-600': msg.type === 'error',
                      }"
                      class="h-6 w-6 rounded-lg inline-flex items-center justify-center text-xs shrink-0 font-bold"
                    >
                      @if (msg.type === 'success') {
                        ✓
                      } @else if (msg.type === 'warning') {
                        ⚠
                      } @else {
                        ✕
                      }
                    </div>

                    <p class="text-sm font-semibold tracking-wide leading-snug">{{ msg.text }}</p>
                  </div>

                  <!-- Manual Close Button Control Handle -->
                  <button
                    (click)="toastService.removeToast(msg.id)"
                    class="text-slate-400 hover:text-slate-600 transition-colors font-bold text-base cursor-pointer px-1 focus:outline-none shrink-0"
                  >
                    &times;
                  </button>
                </div>
              }
            </div>
          </div>
          <app-footer></app-footer>
        </div>
      </div>
    } @else {
      <!-- Unauthenticated State -->
      <div class="min-h-screen flex flex-col">
        <div class="flex-1">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
    }
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private router = inject(Router);
  protected toastService = inject(ToastService);
  protected sessionTimeout = inject(SessionTimeoutService);
  mobileMenuOpen = signal(false);

  ngOnInit(): void {
    // Automatically trigger telemetry tracking when navigating onto secured dashboards
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const isLoginPage = event.urlAfterRedirects.includes('/login');
        // If user has advanced past login card, begin tracking metrics immediately
        this.sessionTimeout.startMonitoring(!isLoginPage);
      });
  }

  ngOnDestroy(): void {
    this.sessionTimeout.stopMonitoring();
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onLogout(): void {
    this.closeMobileMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
