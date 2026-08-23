import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, CategoryFilter } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Product Inventory</h1>
          <p class="text-slate-500 text-sm mt-1">
            Iterating catalogue data using modern Angular Signals & Control Flow syntax
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Total Products: {{ totalProductsCount() }}
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Total Inventory Value: \${{ totalInventoryValue() | number:'1.2-2' }}
          </span>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <!-- Search Input -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search products by name or SKU..."
            class="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors"
          />
        </div>

        <!-- Category Pills Filter -->
        <div class="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          @for (cat of categories; track cat) {
            <button
              type="button"
              (click)="selectedCategory.set(cat)"
              [class.bg-indigo-600]="selectedCategory() === cat"
              [class.text-white]="selectedCategory() === cat"
              [class.bg-slate-100]="selectedCategory() !== cat"
              [class.text-slate-600]="selectedCategory() !== cat"
              [class.hover:bg-slate-200]="selectedCategory() !== cat"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {{ cat }}
            </button>
          }
        </div>
      </div>

      <!-- Products Grid populated with @for -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (product of filteredProducts(); track product.id) {
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group">
            <div class="p-5">
              <!-- Top Header & Category Tag -->
              <div class="flex items-start justify-between gap-2 mb-3">
                <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  {{ product.category }}
                </span>
                <span class="text-xs text-slate-400 font-mono">SKU: {{ product.sku }}</span>
              </div>

              <!-- Title and Description -->
              <h3 class="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">
                {{ product.name }}
              </h3>
              <p class="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Card Footer / Stock & Price Info -->
            <div class="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-400 font-medium">Unit Price</p>
                <p class="text-lg font-extrabold text-slate-900">\${{ product.price | number:'1.2-2' }}</p>
              </div>

              <!-- Control Flow @switch for stock status badge -->
              @switch (product.status) {
                @case ('in-stock') {
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    In Stock ({{ product.stock }})
                  </span>
                }
                @case ('low-stock') {
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Low Stock ({{ product.stock }})
                  </span>
                }
                @case ('out-of-stock') {
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Out of Stock
                  </span>
                }
              }
            </div>
          </div>
        } @empty {
          <!-- Empty State fallback when filtering returns 0 items -->
          <div class="col-span-full py-12 px-6 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 class="mt-3 text-sm font-semibold text-slate-900">No products match your criteria</h3>
            <p class="mt-1 text-xs text-slate-500">Try adjusting your search query or category filter.</p>
            <button
              type="button"
              (click)="resetFilters()"
              class="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  readonly categories: CategoryFilter[] = ['All', 'Electronics', 'Displays', 'Accessories', 'Audio'];

  // Signals for state
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<CategoryFilter>('All');

  // Initial product list signal adhering to Product interface
  readonly products = signal<Product[]>([
    {
      id: 'prod-101',
      sku: 'ELE-WM-001',
      name: 'Wireless Ergonomic Vertical Mouse',
      category: 'Electronics',
      price: 49.99,
      stock: 120,
      rating: 4.8,
      status: 'in-stock',
      description: 'Reduces wrist strain with natural ergonomic angle and precision optical sensor.'
    },
    {
      id: 'prod-102',
      sku: 'ELE-KB-002',
      name: 'Mechanical RGB Gaming Keyboard',
      category: 'Electronics',
      price: 129.99,
      stock: 8,
      rating: 4.9,
      status: 'low-stock',
      description: 'Hot-swappable mechanical switches with custom light customization software.'
    },
    {
      id: 'prod-103',
      sku: 'DSP-4K-003',
      name: '4K UltraHD USB-C Monitor 27"',
      category: 'Displays',
      price: 399.99,
      stock: 18,
      rating: 4.7,
      status: 'in-stock',
      description: 'IPS panel with 99% sRGB color accuracy and integrated 65W power delivery.'
    },
    {
      id: 'prod-104',
      sku: 'AUD-NC-004',
      name: 'Active Noise Cancelling Headphones',
      category: 'Audio',
      price: 249.50,
      stock: 0,
      rating: 4.6,
      status: 'out-of-stock',
      description: 'Premium spatial audio performance with up to 35 hours of battery runtime.'
    },
    {
      id: 'prod-105',
      sku: 'ACC-HUB-005',
      name: 'Thunderbolt 4 Multi-Port Docking Station',
      category: 'Accessories',
      price: 189.00,
      stock: 35,
      rating: 4.8,
      status: 'in-stock',
      description: 'Dual 4K display output, 2.5G Ethernet, and 90W host charging passthrough.'
    },
    {
      id: 'prod-106',
      sku: 'AUD-MIC-006',
      name: 'Studio Condenser USB Cardioid Microphone',
      category: 'Audio',
      price: 89.95,
      stock: 4,
      rating: 4.5,
      status: 'low-stock',
      description: 'Zero-latency monitoring with built-in pop filter and adjustable boom arm.'
    }
  ]);

  // Computed signal for filtered products based on search and category
  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    return this.products().filter((p) => {
      const matchesCategory = cat === 'All' || p.category === cat;
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  });

  // Computed signal for statistics
  readonly totalProductsCount = computed(() => this.filteredProducts().length);
  readonly totalInventoryValue = computed(() =>
    this.filteredProducts().reduce((acc, p) => acc + p.price * p.stock, 0)
  );

  onSearchChange(val: string | null): void {
    this.searchQuery.set(val || '');
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('All');
  }
}
