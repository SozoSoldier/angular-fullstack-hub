import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule],
  template: `
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Dashboard Title Block with Action Button -->
      <div
        class="md:flex md:items-center md:justify-between mb-6 pb-4 border-b border-slate-200/60"
      >
        <div class="min-w-0 flex-1">
          <h2
            class="text-2xl font-bold leading-normal pb-1 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight"
          >
            Inventory Management
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Live catalog synced with the enterprise ASP.NET Core Web API database layer.
          </p>
        </div>
        <div class="mt-4 md:mt-0 md:ml-4 shrink-0">
          <button
            (click)="openModal()"
            class="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all cursor-pointer"
          >
            + Add Product
          </button>
        </div>
      </div>

      <!-- NEW FEATURE: Live Keyword Filter Input Bar Section -->
      <div class="mb-6 max-w-md">
        <div class="relative rounded-xl shadow-sm">
          <input
            type="text"
            [value]="searchText()"
            (input)="onSearchChange($event)"
            placeholder="🔍 Search inventory keyword live..."
            class="block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
          />
        </div>
      </div>

      <!-- Live Catalog Grid Container -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
        @if (isLoading()) {
          @for (placeholder of [1, 2, 3]; track placeholder) {
            <div
              class="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse h-40"
            >
              <div class="flex justify-between">
                <div class="h-6 w-16 rounded bg-slate-200"></div>
                <div class="h-6 w-12 rounded bg-slate-200"></div>
              </div>
              <div class="mt-6 flex justify-between">
                <div class="h-5 w-1/2 rounded bg-slate-200"></div>
                <div class="h-7 w-20 rounded bg-slate-200"></div>
              </div>
            </div>
          }
        } @else {
          @for (item of products(); track item.id) {
            @if (editingProductId() === item.id) {
              <form
                [formGroup]="editForm"
                (ngSubmit)="onUpdate()"
                class="relative flex flex-col justify-between rounded-2xl border-2 border-indigo-500 bg-white p-6 shadow-md animate-fade"
              >
                <div class="space-y-3">
                  <span
                    class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                    >Editing ID: #{{ item.id }}</span
                  >
                  <div>
                    <label class="block text-xs font-semibold text-slate-500 uppercase"
                      >Item Name</label
                    >
                    <input
                      type="text"
                      formControlName="name"
                      class="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-500 uppercase"
                      >Price ($)</label
                    >
                    <input
                      type="number"
                      step="0.01"
                      formControlName="price"
                      class="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
                <div class="mt-6 pt-4 flex justify-end space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    (click)="cancelEdit()"
                    class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
                    [disabled]="editForm.invalid || editForm.pristine"
                  >
                    Save
                  </button>
                </div>
              </form>
            } @else {
              <div
                class="relative flex flex-col justify-between rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div class="flex items-center justify-between">
                  <span
                    class="inline-flex items-center rounded-md bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700"
                    >ID: #{{ item.id }}</span
                  >
                  <div class="flex items-center space-x-1">
                    <button
                      (click)="startEdit(item)"
                      class="text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      (click)="onDelete(item.id)"
                      class="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="mt-4 flex justify-between items-baseline">
                  <h3 class="text-lg font-semibold text-slate-900">{{ item.name }}</h3>
                  <span class="text-2xl font-bold text-indigo-700">{{
                    item.price | currency
                  }}</span>
                </div>
              </div>
            }
          } @empty {
            <div
              class="col-span-full rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center bg-white shadow-sm"
            >
              <h3 class="mt-4 text-sm font-semibold text-slate-900">No Inventory Items</h3>
              <p class="mt-1 text-sm text-slate-500">
                No matching search query definitions or entries found.
              </p>
            </div>
          }
        }
      </div>

      <!-- NEW FEATURE: Responsive Footer Pagination Controller Module -->
      <div class="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        <div class="text-sm text-slate-500">
          Showing page <span class="font-semibold text-slate-900">{{ currentPage() }}</span> of
          <span class="font-semibold text-slate-900">{{ totalPages() }}</span>
        </div>
        <div class="flex space-x-2">
          <button
            (click)="goToPage(currentPage() - 1)"
            [disabled]="currentPage() === 1"
            class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            &larr; Previous
          </button>
          <button
            (click)="goToPage(currentPage() + 1)"
            [disabled]="currentPage() >= totalPages()"
            class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </main>

    <!-- Creation Modal Overlay Form -->
    @if (isModalOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-xl">
          <div class="flex justify-between pb-4 border-b border-slate-100">
            <h3 class="text-lg font-bold text-slate-900">Add New Inventory Item</h3>
            <button (click)="closeModal()" class="text-slate-400 text-xl font-bold cursor-pointer">
              &times;
            </button>
          </div>
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="mt-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">Item Name</label>
              <input
                type="text"
                formControlName="name"
                class="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Retail Price ($)</label>
              <input
                type="number"
                step="0.01"
                formControlName="price"
                class="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none"
              />
            </div>
            <div class="mt-6 flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                (click)="closeModal()"
                class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                [disabled]="productForm.invalid || productForm.pristine"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  isModalOpen = signal<boolean>(false);
  editingProductId = signal<number | null>(null);

  // Pagination and search parameters signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(6); // Limits view layout grid to exactly 6 items max per view
  totalPages = signal<number>(1);
  searchText = signal<string>('');

  productForm!: FormGroup;
  editForm!: FormGroup;

  ngOnInit(): void {
    this.loadProducts();
    this.initForms();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService
      .getProducts(this.currentPage(), this.pageSize(), this.searchText())
      .subscribe({
        next: (result) => {
          this.products.set(result.items);
          this.totalPages.set(result.totalPages || 1);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchText.set(inputElement.value);
    this.currentPage.set(1); // Force reset view to page 1 whenever searching
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadProducts();
  }
  // --- Core CRUD synchronization triggers (Refactored to trigger loadProducts on modifications) ---//
  initForms(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
    });
    this.editForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      price: ['', Validators.required],
    });
  }
  startEdit(item: Product): void {
    if (!item.id) return;
    this.editingProductId.set(item.id);
    this.editForm.setValue({ id: item.id, name: item.name, price: item.price });
  }
  cancelEdit(): void {
    this.editingProductId.set(null);
    this.editForm.reset();
  }
  onUpdate(): void {
    if (this.editForm.invalid) return;
    const id = this.editingProductId();
    if (!id) return;
    this.productService.updateProduct(id, this.editForm.value).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadProducts();
      },
    });
  }
  onSubmit(): void {
    if (this.productForm.invalid) return;
    this.productService.createProduct(this.productForm.value).subscribe({
      next: () => {
        this.closeModal();
        this.loadProducts();
      },
    });
  }
  onDelete(id: number | undefined): void {
    if (!id || !confirm('Remove item?')) return;
    this.productService.deleteProduct(id).subscribe({ next: () => this.loadProducts() });
  }
  openModal(): void {
    this.isModalOpen.set(true);
  }
  closeModal(): void {
    this.isModalOpen.set(false);
    this.productForm.reset();
  }
}
