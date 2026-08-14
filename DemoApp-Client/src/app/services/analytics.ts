import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InventorySummary {
  totalValuation: number;
  uniqueItemCount: number;
  databaseStatus: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private http = inject(HttpClient);

  getSummary(): Observable<InventorySummary> {
    // Relative path leverages your secure HTTP token interceptor and proxy config automatically
    return this.http.get<InventorySummary>('/api/analytics/summary');
  }
}
