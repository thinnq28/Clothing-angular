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


@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  providers: [MessageService]
})
export class OrderComponent {
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


  constructor(
    private orderService: OrderService,
    private router: Router,
    private messageService: MessageService
  ) {
    
  }

  ngOnInit(): void {
    this.getAllOrders(this.fullName, this.phoneNumber, this.email, this.orderDate, this.status, this.isActive,  this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllOrders(this.fullName, this.phoneNumber, this.email, this.orderDate, this.status, this.isActive,  this.currentPage, this.itemsPerPage);
  }

  getAllOrders(fullName:string, phoneNumber: string, email: string, orderDate: string, status: string, isAcive: boolean, page: number, limit: number) {
    debugger
    this.orderService.getAllOrders(fullName, phoneNumber, email, orderDate, status, isAcive, page, limit).subscribe({
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
    this.getAllOrders(this.fullName, this.phoneNumber, this.email, this.orderDate, this.status, this.isActive,  this.currentPage, this.itemsPerPage);
  }

  openModal(id: number) {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      this.variantId = id;
      modalDiv.style.display = 'block';
    }
  }

  closeModal() {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) modalDiv.style.display = 'none';
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

  updateStatus(value: any, orderId: number){
    
    const updateStatus : UpdateStatusOrderDTO = {
      status: value.target.value
    }

    this.orderService.updateStatus(orderId, updateStatus).subscribe({
      next: (response: any) => {
        this.showSuccess(response.message);
              setTimeout(() => {
                const currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              }, 3000);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        this.showError(error.error.message);
        this.showErrors(error.error.data);
      }
    })

  }
}
