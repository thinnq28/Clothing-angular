import { Component } from '@angular/core';
import { ActivatedRoute, RouteReuseStrategy, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HeaderClientComponent } from '../header/header.component';
import { FooterClientComponent } from '../footer/footer.component';
import { ProductDataResponse } from '../../responses/product/product.data.response';
import { ProductService } from '../../service/product.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, HeaderClientComponent, 
    FooterClientComponent, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  providers: [MessageService]
})
export class SearchComponent {
  products: ProductDataResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  name: string = "";
  supplierName: string = "";
  commodityName: string = "";
  isActive: boolean = true;
  visiblePages: number[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private routeReuseStrategy: RouteReuseStrategy,
  ) {
    this.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.route.params.subscribe(params => {
      const productName = params['name'];
      if (productName) {
        this.name = productName;
      }
    });
    this.getAllProducts(this.name, this.supplierName, this.commodityName, this.isActive, this.currentPage, this.itemsPerPage);
  }
  
  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllProducts(this.name, this.supplierName, this.commodityName, this.isActive, this.currentPage, this.itemsPerPage);
  }

  getAllProducts(name: string, supplierName: string, commodityName: string, isAcive: boolean, page: number, limit: number) {
    debugger
    this.productService.getAllProduct(name, supplierName, commodityName, isAcive, page, limit).subscribe({
      next: (response: any) => {
        debugger
        response.data.products.forEach((product: ProductDataResponse) => {          
          product.imageUrl = `${environment.apiBaseUrl}/products/images/${product.imageUrl}`;
        });
        this.products = response.data.products;
        this.products = this.products.filter( e => e.variant != null);
        this.totalPages = response.data.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        this.showSuccess(response.message);
      },
      complete: () => {

      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }



  searchProducts() {
    debugger
    this.getAllProducts(this.name, this.supplierName, this.commodityName, this.isActive, this.currentPage, this.itemsPerPage);
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showErrors(errors: string[]) {
    for (let i = 0; i < errors.length; i++) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: errors[i], life: 10000 });
    }
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
