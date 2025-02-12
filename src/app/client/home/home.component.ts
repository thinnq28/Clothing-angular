import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
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
import { CommodityService } from '../../service/commodity.service';
import { CommodityDataResponse } from '../../responses/commodity/Commodity.data.response';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, HeaderClientComponent, 
    FooterClientComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeClientComponent implements OnInit, AfterViewInit {

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
  maxPriceProduct: number = 0;
  step: number = 10;

  constructor(
    private productService: ProductService,
    private commodityService: CommodityService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllProducts(this.name, this.supplierName, this.commodityName, this.isActive, this.currentPage, this.itemsPerPage);
  }

  ngAfterViewInit() {
    // Price range label update
    const priceRange = document.getElementById("priceRange") as HTMLInputElement;
    const priceLabel = document.getElementById("priceLabel");
    priceRange?.addEventListener("input", function () {
      if (priceLabel) {
        priceLabel.textContent = "Lên đến ₫" + priceRange.value;
      }
    });

    // Rating range label update
    const ratingRange = document.getElementById("ratingRange") as HTMLInputElement;
    const ratingLabel = document.getElementById("ratingLabel");
    ratingRange?.addEventListener("input", function () {
      if (ratingLabel) {
        ratingLabel.textContent = ratingRange.value + " Stars";
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getAllProducts(this.name, this.supplierName, this.commodityName, this.isActive, this.currentPage, this.itemsPerPage);
  }

  getAllProducts(name: string, supplierName: string, commodityName: string, isAcive: boolean, page: number, limit: number) {
    this.productService.getAllProduct(name, supplierName, commodityName, isAcive, page, limit).subscribe({
      next: (response: any) => {
        response.data.products.forEach((product: ProductDataResponse) => {
          product.imageUrl = `${environment.apiBaseUrl}/products/images/${product.imageUrl}`;
        });
        this.products = response.data.products;
        this.products = this.products.filter(e => e.variant != null);
        this.totalPages = response.data.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        this.maxPriceProduct = Math.round(Math.max(...this.products.map(product => product.variant.price)));
        this.step = this.maxPriceProduct/10
        this.showSuccess(response.message);
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
    this.getAllProducts(this.name, this.supplierName, this.commodityName, this.isActive, this.currentPage, this.itemsPerPage);
  }

  rediectProductDetail(id: number){
    this.router.navigate(['/product-detail/' + id]);
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
