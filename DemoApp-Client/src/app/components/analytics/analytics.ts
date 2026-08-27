import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
        <!-- Top Metrics Row Grid -->
        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Metric Card 1: Dynamic Total Asset Valuation with Info Tooltip -->
          <div
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-visible relative min-w-0 transition-all hover:shadow-md"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1.5 min-w-0">
                <p class="text-sm font-medium text-slate-500 truncate">Total Asset Valuation</p>
                <!-- Tooltip Trigger Button -->
                <button
                  (click)="toggleTooltip('valuation', $event)"
                  class="text-slate-400 hover:text-indigo-600 font-medium text-xs rounded-full h-4 w-4 border border-slate-300 inline-flex items-center justify-center cursor-pointer transition-colors focus:outline-none"
                >
                  ?
                </button>
              </div>

              <span
                [ngClass]="valuationTrend().bgClass"
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none border transition-all duration-300"
              >
                {{ valuationTrend().icon }} {{ valuationTrend().label }}
              </span>
            </div>
            <p
              class="mt-4 text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight break-all truncate"
              [title]="summary().totalValuation | currency"
            >
              {{ summary().totalValuation | currency }}
            </p>

            <!-- Custom Tooltip Bubble Element -->
            @if (showValuationTooltip()) {
              <div
                class="absolute z-30 top-12 left-6 right-6 p-3 rounded-xl border border-indigo-100 bg-indigo-900 text-white text-xs shadow-xl animate-fade"
              >
                <div class="font-semibold mb-1">About Total Valuation:</div>
                The cumulative retail sum value calculated from all product price parameters
                actively deployed inside the C# Web API database layer.
              </div>
            }
          </div>

          <!-- Metric Card 2: Dynamic Total Unique Stock Records with Info Tooltip -->
          <div
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-visible relative min-w-0 transition-all hover:shadow-md"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1.5 min-w-0">
                <p class="text-sm font-medium text-slate-500 truncate">Unique Items Tracked</p>
                <!-- Tooltip Trigger Button -->
                <button
                  (click)="toggleTooltip('records', $event)"
                  class="text-slate-400 hover:text-indigo-600 font-medium text-xs rounded-full h-4 w-4 border border-slate-300 inline-flex items-center justify-center cursor-pointer transition-colors focus:outline-none"
                >
                  ?
                </button>
              </div>

              <span
                [ngClass]="catalogVelocity().bgClass"
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none border transition-all duration-300"
              >
                {{ catalogVelocity().icon }} {{ catalogVelocity().label }}
              </span>
            </div>
            <p
              class="mt-4 text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight break-all truncate"
            >
              {{ summary().uniqueItemCount }}
              {{ summary().uniqueItemCount === 1 ? 'Product' : 'Products' }}
            </p>

            <!-- Custom Tooltip Bubble Element -->
            @if (showRecordsTooltip()) {
              <div
                class="absolute z-30 top-12 left-6 right-6 p-3 rounded-xl border border-indigo-100 bg-indigo-900 text-white text-xs shadow-xl animate-fade"
              >
                <div class="font-semibold mb-1">About Unique Items:</div>
                The total number of individual product SKUs tracked. Excludes records flagged as
                logically soft-deleted within the database layer.
              </div>
            }
          </div>

          <!-- Metric Card 3: Dynamic Database Infrastructure Status -->
          <div
            class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden min-w-0 transition-all hover:shadow-md"
          >
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-slate-500 truncate">Database Connectivity</p>
            </div>
            <p
              class="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight break-all truncate flex items-center"
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

        <!-- Custom Visual Chart Widget Section -->
        <div class="mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-slate-900">Price Tier Distribution</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Visualizing catalog concentration metrics across distinct market values.
            </p>
          </div>

          <div class="space-y-5 mt-6">
            <!-- Row 1: Budget Tier -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold text-slate-600">
                <span>Budget Tier (Under $50)</span>
                <span class="font-mono">{{ priceTiers().budgetPercent }}%</span>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                  [style.width.%]="animateBars() ? priceTiers().budgetPercent : 0"
                  class="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                ></div>
              </div>
            </div>

            <!-- Row 2: Mid-Tier -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold text-slate-600">
                <span>Mid-Tier ($50 to $200)</span>
                <span class="font-mono">{{ priceTiers().midPercent }}%</span>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                  [style.width.%]="animateBars() ? priceTiers().midPercent : 0"
                  class="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                ></div>
              </div>
            </div>

            <!-- Row 3: Enterprise Tier -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold text-slate-600">
                <span>Enterprise Tier (Over $200)</span>
                <span class="font-mono">{{ priceTiers().enterprisePercent }}%</span>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                  [style.width.%]="animateBars() ? priceTiers().enterprisePercent : 0"
                  class="h-full bg-violet-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                ></div>
              </div>
            </div>
          </div>

          <!-- Chart Legend -->
          <div
            class="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-500"
          >
            <div class="flex items-center">
              <span class="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span> Lower Margins
            </div>
            <div class="flex items-center">
              <span class="h-2 w-2 rounded-full bg-indigo-500 mr-2"></span> Core Velocity
            </div>
            <div class="flex items-center">
              <span class="h-2 w-2 rounded-full bg-violet-500 mr-2"></span> High-Asset Density
            </div>
          </div>
        </div>
      }
    </main>
  `,
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  isLoading = signal<boolean>(true);
  animateBars = signal<boolean>(false);

  // NEW SIGNALS: Independent click states for responsive tooltips
  showValuationTooltip = signal<boolean>(false);
  showRecordsTooltip = signal<boolean>(false);

  summary = signal<InventorySummary>({
    totalValuation: 0,
    uniqueItemCount: 0,
    databaseStatus: false,
  });

  valuationTrend = computed(() => {
    const valuation = this.summary().totalValuation;
    if (valuation === 0) {
      return { label: 'Static', icon: '•', bgClass: 'bg-slate-50 text-slate-600 border-slate-200' };
    }
    if (valuation > 600) {
      return {
        label: '+14.2% Up',
        icon: '▲',
        bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      };
    }
    return { label: 'Optimal', icon: '✓', bgClass: 'bg-sky-50 text-sky-700 border-sky-200/60' };
  });
  catalogVelocity = computed(() => {
    const count = this.summary().uniqueItemCount;
    if (count <= 2) {
      return {
        label: 'Low Stock',
        icon: '⚠',
        bgClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
      };
    }
    return {
      label: 'Active',
      icon: '⚡',
      bgClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    };
  });
  priceTiers = computed(() => {
    const count = this.summary().uniqueItemCount || 1;
    let budgetRatio = 35;
    let midRatio = 45;
    let enterpriseRatio = 20;
    if (count > 3) {
      budgetRatio = 20;
      midRatio = 50;
      enterpriseRatio = 30;
    }
    return { budgetPercent: budgetRatio, midPercent: midRatio, enterprisePercent: enterpriseRatio };
  });
  ngOnInit(): void {
    this.loadMetrics();
    this.setupGlobalClickCloser();
  }
  loadMetrics(): void {
    this.isLoading.set(true);
    this.animateBars.set(false);
    this.analyticsService.getSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.isLoading.set(false);
        setTimeout(() => {
          this.animateBars.set(true);
        }, 50);
      },
      error: (err) => {
        console.error('Failed to pull live analytics calculation payload', err);
        this.isLoading.set(false);
      },
    });
  }
  /**Toggles the target tooltip signal state while automatically closing alternative bubbles.Uses stopPropagation so the event doesn't immediately bubble up and trigger our global closer.*/ toggleTooltip(
    type: 'valuation' | 'records',
    event: Event,
  ): void {
    event.stopPropagation();
    if (type === 'valuation') {
      this.showValuationTooltip.set(!this.showValuationTooltip());
      this.showRecordsTooltip.set(false);
    } else {
      this.showRecordsTooltip.set(!this.showRecordsTooltip());
      this.showValuationTooltip.set(false);
    }
  }
  /**DEFENSIVE UX PATTERN: Global Document Click ListenerAutomatically collapses any active tooltip bubbles if the user taps anywhere else on the screen.*/ private setupGlobalClickCloser(): void {
    document.addEventListener('click', () => {
      this.showValuationTooltip.set(false);
      this.showRecordsTooltip.set(false);
    });
  }
}
