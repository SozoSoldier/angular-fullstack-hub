import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto w-full">
      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand Column -->
          <div class="space-y-4 md:col-span-1">
            <div class="flex items-center space-x-3">
              <div
                class="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md"
              >
                F
              </div>
              <span class="text-xl font-bold text-white tracking-tight">Full-Stack Hub</span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              Empowering real-time analytics, secure auditing, and modern enterprise inventory
              management.
            </p>

            <!-- System Status Indicator (Signal-driven state) -->
            <div
              class="inline-flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full text-xs text-emerald-400 border border-slate-700/60"
            >
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="font-medium text-slate-200">Systems Operational</span>
            </div>
          </div>

          <!-- Dynamic Sections Rendered using modern @for control flow -->
          @for (section of footerSections(); track section.title) {
            <div>
              <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                {{ section.title }}
              </h3>
              <ul class="space-y-2.5">
                @for (link of section.links; track link.label) {
                  <li>
                    <a
                      [href]="link.href"
                      class="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center group"
                    >
                      <span class="group-hover:translate-x-1 transition-transform duration-200">
                        {{ link.label }}
                      </span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Divider line -->
        <div
          class="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <!-- Copyright Info using Angular Signal -->
          <div class="flex items-center space-x-2 text-xs sm:text-sm text-slate-400">
            <svg
              class="h-4 w-4 text-indigo-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              &copy; <span class="font-semibold text-white">{{ currentYear() }}</span> Full-Stack
              Hub, Inc. All rights reserved.
            </span>
          </div>

          <!-- Quick Actions & Links -->
          <div
            class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 sm:justify-end"
          >
            <a href="#privacy" class="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" class="hover:text-white transition-colors">Terms of Service</a>
            <a href="#cookies" class="hover:text-white transition-colors">Cookie Preferences</a>

            <!-- Signal year update status indicator / simulation control -->
            <button
              type="button"
              (click)="refreshDate()"
              class="text-xs text-slate-500 hover:text-indigo-400 underline transition-colors focus:outline-none"
              title="Click to force dynamic date refresh signal"
            >
              Sync Date
            </button>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent implements OnInit, OnDestroy {
  /**
   * Primary date signal holding current Date object.
   * Enables reactive recalculation across date shifts.
   */
  private readonly currentDate = signal<Date>(new Date());

  /**
   * Computed Signal automatically calculating and returning the current copyright year.
   * Re-evaluates automatically whenever currentDate signal updates.
   */
  readonly currentYear = computed<number>(() => this.currentDate().getFullYear());

  /**
   * Footer navigation sections defined as a Signal.
   */
  readonly footerSections = signal<FooterSection[]>([
    {
      title: 'Platform',
      links: [
        { label: 'Inventory System', href: '/dashboard' },
        { label: 'Live Analytics', href: '/analytics' },
        { label: 'Security Logs', href: '/logs' },
        { label: 'System Health', href: '#status' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'API Documentation', href: '#docs' },
        { label: 'Developer SDK', href: '#sdk' },
        { label: 'Architecture Guide', href: '#architecture' },
        { label: 'Release Notes', href: '#changelog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Security & Compliance', href: '#security' },
        { label: 'Careers', href: '#careers' },
        { label: 'Contact Support', href: '#support' },
      ],
    },
  ]);

  private timerId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Check and update date signal every 60 seconds to ensure copyright year is always up to date
    this.timerId = setInterval(() => {
      this.currentDate.set(new Date());
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  /**
   * Manually trigger a date signal update (e.g. on user click or periodic sync)
   */
  refreshDate(): void {
    this.currentDate.set(new Date());
  }
}
