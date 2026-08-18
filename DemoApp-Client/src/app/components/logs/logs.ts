import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuditLog } from '../../models/audit-log.model';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Title Header Block -->
      <div class="mb-6 pb-4 border-b border-slate-200">
        <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl">
          System Security Telemetry Audit Logs
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Live, immutable activity tracking records populated via backend intercept markers.
        </p>
      </div>

      <!-- Live Dynamic Log Feed Table Container -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead class="bg-slate-50 font-semibold text-slate-700">
            <tr>
              <th class="px-6 py-3.5">Timestamp</th>
              <th class="px-6 py-3.5">Action Code</th>
              <th class="px-6 py-3.5">Operational Description</th>
              <th class="px-6 py-3.5">Operator ID</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-600 bg-white">
            @for (log of logs(); track log.id) {
              <tr class="hover:bg-slate-50/80 transition-all">
                <td class="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-400">
                  {{ log.timestamp | date: 'yyyy-MM-dd HH:mm:ss' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    [ngClass]="{
                      'bg-emerald-100 text-emerald-800 border-emerald-200':
                        log.action === 'PRODUCT_CREATED',
                      'bg-blue-100 text-blue-800 border-blue-200': log.action === 'PRODUCT_UPDATED',
                      'bg-rose-100 text-rose-800 border-rose-200': log.action === 'PRODUCT_DELETED',
                      'bg-slate-100 text-slate-800 border-slate-200': true,
                    }"
                    class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide font-mono"
                  >
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-700 font-medium max-w-md break-words">
                  {{ log.description }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-500">
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

  // Reactive master signal state for storing server-side logs
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
}
