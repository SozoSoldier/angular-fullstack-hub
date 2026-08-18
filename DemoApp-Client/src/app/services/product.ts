import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog } from '../models/audit-log.model';

export interface Product {
  id?: number; // Optional because the SQLite database generates this automatically
  name: string;
  price: number;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Use the modern inject dependency token pattern
  private http = inject(HttpClient);
  private apiUrl = '/api/products'; // Base URL for the API endpoints

  /**
   * Fetches the entire collection from the ASP.NET Core API
   * Triggers the /api proxy fallback configuration
   */
  getProducts(
    page: number = 1,
    pageSize: number = 6,
    search: string = '',
  ): Observable<PagedResult<Product>> {
    // Appends safe query strings to the proxy path route automatically
    return this.http.get<PagedResult<Product>>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}&search=${search}`,
    );
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/audit-logs`);
  }

  /**
   * Sends a POST request containing the new item payload
   * @param product The object coming straight from the Reactive Form values
   */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product);
  }
}
