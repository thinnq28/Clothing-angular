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
import { OrderResponse } from '../../responses/order/order.response';
import { OrderService } from '../../service/order.service';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, HeaderClientComponent, 
    FooterClientComponent, RouterModule],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss',
  providers: [MessageService]
})
export class TrackOrderComponent {
  orders: OrderResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;

  isActive: boolean = true;
  visiblePages: number[] = [];
  fullName: string = "";
  phoneNumber: string = "";
  email: string = "";
  orderDate: string = "";
  status: string = "";

  variantId: number = 0;

  token: string | null = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private messageService: MessageService,
    private tokenService: TokenService,
  ) {
    
  }

  ngOnInit(): void {
    this.token = this.tokenService.getToken();

    if(this.token)
      this.getAllOrders(this.token, this.fullName, this.phoneNumber, this.email, this.orderDate, this.status, this.isActive,  this.currentPage, this.itemsPerPage);

    if (this.token == null) {
      this.router.navigate(['/login']);
      return;
    }
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    if(this.token)
      this.getAllOrders(this.token, this.fullName, this.phoneNumber, this.email, this.orderDate, this.status, this.isActive,  this.currentPage, this.itemsPerPage);
  }

  getAllOrders(token: string, fullName:string, phoneNumber: string, email: string, orderDate: string, status: string, isAcive: boolean, page: number, limit: number) {
    
    this.orderService.getOrderByUser(token, fullName, phoneNumber, email, orderDate, status, isAcive, page, limit).subscribe({
      next: (response: any) => {
        this.orders = response.data.orders;
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

  searchOrders() {
    if(this.token)
    this.getAllOrders(this.token, this.fullName, this.phoneNumber, this.email, this.orderDate, this.status, this.isActive,  this.currentPage, this.itemsPerPage);
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
