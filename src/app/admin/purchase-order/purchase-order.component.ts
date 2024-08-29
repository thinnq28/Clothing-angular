import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { OrderService } from '../../service/order.service';
import e from 'express';
import { OrderResponse } from '../../responses/order/order.response';
import { UpdateStatusOrderDTO } from '../../dtos/order/update.status.order.dto';
import { PurchaseOrderService } from '../../service/purchase.order.service';
import { PurchaseOrderDataResponse } from '../../responses/purchase-order/purchase.order.response';
import { PurchaseOrder } from '../../responses/purchase-order/purchase.response';
import { SupplierService } from '../../service/supplier.service';
import { SupplierDataResponse } from '../../responses/supplier/supplier.data.response';


@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss',
  providers: [MessageService]
})
export class PurchaseOrderComponent {
  orders: PurchaseOrder[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];

  suppliers: SupplierDataResponse[] = [];

  orderDate: string = "";
  supplierName: string = "";


  constructor(
    private orderService: PurchaseOrderService,
    private router: Router,
    private messageService: MessageService,
  ) {
    
  }

  ngOnInit(): void {
    this.getAllOrders(this.supplierName, this.orderDate, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllOrders(this.supplierName, this.orderDate, this.currentPage, this.itemsPerPage);
  }

  getAllOrders(supplierName: string, orderDate: string, page: number, limit: number) {
    debugger
    this.orderService.getAllOrders(supplierName, orderDate, page, limit).subscribe({
      next: (response: any) => {
        debugger
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

  searchOrders() {
    this.getAllOrders(this.supplierName, this.orderDate, this.currentPage, this.itemsPerPage);
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
