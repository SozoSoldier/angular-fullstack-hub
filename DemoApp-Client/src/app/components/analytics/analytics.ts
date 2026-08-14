import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AnalyticsService, InventorySummary } from '../../services/analytics';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Live Analytics Hub</h2>
      <p class="text-sm text-slate-500 mt-1">
        Real-time inventory calculation and key performance metrics dashboard.
      </p>

      @if (isLoading()) {
        <!-- Simple inner-component loading placeholder -->
        <div class="mt-8 text-sm font-medium text-indigo-600 animate-pulse flex items-center">
          <svg class="animate-spin h-5 w-5 mr-3 text-indigo-600" viewBox="0 0 24 24" fill="none">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Aggregating live SQL database valuation metrics...
        </div>
      } @else {
        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Metric Card 1: Dynamic Total Asset Valuation -->
          <div
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden min-w-0"
          >
            <p class="text-sm font-medium text-slate-500 truncate">Total Asset Valuation</p>
            <p
              class="mt-2 text-2xl sm:text-3xl font-semibold text-indigo-600 tracking-tight break-all truncate"
              [title]="summary().totalValuation | currency"
            >
              {{ summary().totalValuation | currency }}
            </p>
          </div>

          <!-- Metric Card 2: Dynamic Total Unique Stock Records -->
          <div
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden min-w-0"
          >
            <p class="text-sm font-medium text-slate-500 truncate">Unique Items Tracked</p>
            <p
              class="mt-2 text-2xl sm:text-3xl font-semibold text-amber-600 tracking-tight break-all truncate"
            >
              {{ summary().uniqueItemCount }}
              {{ summary().uniqueItemCount === 1 ? 'Product' : 'Products' }}
            </p>
          </div>

          <!-- Metric Card 3: Dynamic Database Infrastructure Status -->
          <div
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden min-w-0"
          >
            <p class="text-sm font-medium text-slate-500 truncate">Database Connectivity</p>
            <p
              class="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight break-all truncate flex items-center"
              [ngClass]="summary().databaseStatus ? 'text-emerald-600' : 'text-rose-600'"
            >
              @if (summary().databaseStatus) {
                <span
                  class="h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2 inline-block animate-ping"
                ></span>
              }

              {{ summary().databaseStatus ? '100% Online' : 'Offline' }}
            </p>
          </div>
        </div>
      }
    </main>
  `,
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  isLoading = signal<boolean>(true);

  // Initialize signal with safe fallback properties matching interface DTO signatures
  summary = signal<InventorySummary>({
    totalValuation: 0,
    uniqueItemCount: 0,
    databaseStatus: false,
  });

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.isLoading.set(true);
    this.analyticsService.getSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to pull live analytics calculation payload', err);
        this.isLoading.set(false);
      },
    });
  }
}
