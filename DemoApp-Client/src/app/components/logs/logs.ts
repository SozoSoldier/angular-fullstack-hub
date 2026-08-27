import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuditLog } from '../../models/audit-log.model';
import { ProductService } from '../../services/product';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Title Header Block with Interactive Action Hook -->
      <div class="md:flex md:items-center md:justify-between mb-6 pb-4 border-b border-slate-200">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl">
            System Security Telemetry Audit Logs
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Live, immutable activity tracking records populated via backend intercept markers.
          </p>
        </div>

        <!-- FIXED: Manual Purge Action Trigger with Hover Enhancements -->
        <div class="mt-4 md:mt-0 md:ml-4 shrink-0">
          <button
            (click)="onClearLogs()"
            [disabled]="logs().length === 0"
            class="inline-flex items-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-rose-500 hover:shadow-md disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
          >
            🗑️ Clear Audit Logs
          </button>
        </div>
      </div>

      <!-- Live Dynamic Log Feed Table Container -->
      <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm w-full">
        <table class="w-full min-w-[40rem] divide-y divide-slate-200 text-left text-sm table-fixed">
          <thead class="bg-slate-50 font-semibold text-slate-700">
            <tr>
              <th class="w-1/4 px-6 py-3.5">Timestamp</th>
              <th class="w-1/5 px-6 py-3.5">Action Code</th>
              <th class="w-2/5 px-6 py-3.5">Operational Description</th>
              <th class="w-1/6 px-6 py-3.5">Operator ID</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-600 bg-white">
            @for (log of logs(); track log.id) {
              <tr class="hover:bg-slate-50/80 transition-all">
                <td class="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-400 truncate">
                  {{ log.timestamp | date: 'yyyy-MM-dd HH:mm:ss' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    [ngClass]="{
                      'bg-emerald-100 text-emerald-800 border-emerald-200':
                        log.action === 'PRODUCT_CREATED',
                      'bg-blue-100 text-blue-800 border-blue-200': log.action === 'PRODUCT_UPDATED',
                      'bg-rose-100 text-rose-800 border-rose-200': log.action === 'PRODUCT_DELETED',
                      'bg-red-100 text-red-800 border-red-200': log.action === 'LOGS_CLEARED',
                      'bg-slate-100 text-slate-800 border-slate-200': true,
                    }"
                    class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide font-mono"
                  >
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-700 font-medium break-words">
                  {{ log.description }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-500 truncate">
                  {{ log.performedBy }}
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="p-12 text-center text-slate-400 italic">
                  No telemetry data captured in this current session runtime window.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </main>
  `,
})
export class LogsComponent implements OnInit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  logs = signal<AuditLog[]>([]);

  ngOnInit(): void {
    this.refreshLogs();
  }

  refreshLogs(): void {
    this.productService.getAuditLogs().subscribe({
      next: (data) => this.logs.set(data),
      error: (err) => console.error('Failed to parse active server audit logs:', err),
    });
  }

  /**
   * VERIFICATION AND PURGE HANDLER
   * Confirms administrative intent before sending data destructive actions to the database.
   */
  onClearLogs(): void {
    const confirmationMessage =
      '🔒 CRITICAL WARNING:\n\nYou are about to permanently clear all immutable security telemetry logs.\n\nAre you absolutely sure you want to proceed?';

    if (confirm(confirmationMessage)) {
      this.productService.clearAuditLogs().subscribe({
        next: () => {
          this.toastService.success('Audit telemetry records cleared successfully.');
          this.refreshLogs(); // Instantly displays your single fresh "LOGS_CLEARED" action row
        },
        error: () => {
          this.toastService.error('Administrative access denied or connection failed.');
        },
      });
    }
  }
}
