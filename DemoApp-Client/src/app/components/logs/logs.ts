import { Component } from '@angular/core';
@Component({
  selector: 'app-logs',
  standalone: true,
  template: `
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Audit Security Logs</h2>
      <p class="text-sm text-slate-500 mt-1">
        Immutable tracking log monitoring the custom C# header token pipeline handshakes.
      </p>

      <div class="mt-6 overflow-hidden bg-white shadow-sm border border-slate-200 rounded-2xl">
        <ul class="divide-y divide-slate-200 text-sm text-slate-700">
          <li class="p-4 flex justify-between bg-slate-50/50">
            <span class="font-mono text-indigo-600">GET /api/products</span>
            <span class="text-emerald-600 font-medium">200 OK (X-API-KEY Verified)</span>
          </li>
          <li class="p-4 flex justify-between">
            <span class="font-mono text-indigo-600">POST /api/products</span>
            <span class="text-emerald-600 font-medium">201 Created</span>
          </li>
          <li class="p-4 flex justify-between">
            <span class="font-mono text-indigo-600">DELETE /api/products/4</span>
            <span class="text-amber-600 font-medium">204 No Content</span>
          </li>
        </ul>
      </div>
    </main>
  `,
})
export class LogsComponent {}
