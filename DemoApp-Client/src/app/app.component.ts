import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- 1. Check if the user is logged in using our authentication signal -->
    @if (authService.isAuthenticated()) {
      <div class="min-h-screen bg-slate-50 flex">
        <!-- SIDEBAR NAVIGATION CONTAINER -->
        <aside
          class="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0"
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
            <!-- routerLinkActive automatically applies active CSS classes to the selected route -->
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

        <!-- MAIN DYNAMIC CONTENT ROUTER INJECTOR VIEWPORT -->
        <div class="flex-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </div>
      </div>
    } @else {
      <!-- Unauthenticated State (Login Screen renders purely full-viewport size here) -->
      <router-outlet></router-outlet>
    }
  `,
})
export class AppComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
