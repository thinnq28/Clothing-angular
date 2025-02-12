import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { VoucherService } from '../../service/voucher.service';
import { VoucherDataResponse } from '../../responses/voucher/voucher.data.response';
import { VoucherDTO } from '../../dtos/voucher/voucher.dto';

@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, AutoCompleteModule],
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.scss',
  providers: [MessageService]
})
export class VoucherComponent {
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  code: string = "";
  startDateFilter: string = '';
  endDateFilter: string = '';

  isActive: boolean = true;
  visiblePages: number[] = [];

  vouchers: VoucherDataResponse[] = [];
  voucher?: VoucherDataResponse;
  voucherId: number = 0;

  codeName: string = '';
  description: string = '';
  discount: number = 0;
  discountType: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  minPurchaseAmount: number = 0;
  maxDiscountAmount: number = 0;
  maxUsage: string = '';


  constructor(
    private voucherService: VoucherService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getAllVouchers(this.code, this.startDateFilter, this.endDateFilter, this.isActive, this.currentPage, this.itemsPerPage);
  }

  getAllVouchers(code: string, startDate: string, endDate: string, isAcive: boolean, page: number, limit: number) {
    // const sDate = document.getElementById("startDateFilter");
    // const eDate = document.getElementById("endDateFilter")

    // let start = (sDate as HTMLDataElement).value;
    // let end = (eDate as HTMLDataElement).value;
    this.voucherService.getAllVouchers(code, startDate, endDate, isAcive, page, limit).subscribe({
      next: (response: any) => {
        this.vouchers = response.data.vouchers;
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


  onPageChange(page: number) {
    this.currentPage = page;
    this.getAllVouchers(this.code, this.startDateFilter, this.endDateFilter, this.isActive, this.currentPage, this.itemsPerPage);
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

  searchVouchers() {
    debugger
    this.getAllVouchers(this.code, this.startDateFilter, this.endDateFilter, this.isActive, this.currentPage, this.itemsPerPage);
  }

  openCreateVoucher() {
    const modalDiv = document.getElementById('modalCreateVoucher');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  save() {
    const voucherDTO: VoucherDTO = {
      code: this.codeName,
      discount: this.discount,
      discountType: this.discountType,
      description: this.description,
      minPurchaseAmount: this.minPurchaseAmount,
      maxDiscountAmount: this.maxDiscountAmount,
      maxUsage: this.maxUsage,
      startDate: this.startDate,
      endDate: this.endDate
    }

    this.voucherService.insert(voucherDTO).subscribe({
      next: (response: any) => {
        this.showSuccess(response.message);
        setTimeout(() => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, 3000);
      },
      complete: () => { },
      error: (error: any) => {
        this.showError(error.error.message);
        let errors = [];
        errors = error.error.data;
        for (let i = 0; i < errors.length; i++) {
          this.showError(errors[i]);
        }
      }
    });
  }

  closeCreateVoucher() {
    const modalDiv = document.getElementById('modalCreateVoucher');
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  closeUpdateVoucher() {
    const modalDiv = document.getElementById('modalUpdateVoucher');
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  openUpdateVoucher(id: number) {
    const modalDiv = document.getElementById('modalUpdateVoucher');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
      this.voucherId = id;
      this.getVoucherById(id);
    }
  }

  getVoucherById(id: number) {
    this.voucherService.getVoucherById(id).subscribe({
      next: (response: any) => {
        debugger
        this.voucher = response.data;
        if (this.voucher) {
          this.codeName = this.voucher.code;
          this.discount = this.voucher.discount;
          this.discountType = this.voucher.discountType;
          this.minPurchaseAmount = this.voucher.minPurchaseAmount;
          this.maxDiscountAmount = this.voucher.maxDiscountAmount;
          this.maxUsage = this.voucher.maxUsage == null ? '' : this.voucher.maxUsage.toString();
          this.startDate = this.voucher.startDate;
          this.endDate = this.voucher.endDate;
          this.description = this.voucher.description
        }
      },
      complete: () => {
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });
  }

  update() {
    const voucherDTO: VoucherDTO = {
      code: this.codeName,
      discount: this.discount,
      discountType: this.discountType,
      description: this.description,
      minPurchaseAmount: this.minPurchaseAmount,
      maxDiscountAmount: this.maxDiscountAmount,
      maxUsage: this.maxUsage,
      startDate: this.startDate,
      endDate: this.endDate
    }

    this.voucherService.update(this.voucherId, voucherDTO).subscribe({
      next: (response: any) => {
        this.showSuccess(response.message);
        setTimeout(() => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, 3000);
      },
      complete: () => { },
      error: (error: any) => {
        this.showError(error.error.message);
        let errors = [];
        errors = error.error.data;
        for (let i = 0; i < errors.length; i++) {
          this.showError(errors[i]);
        }
      }
    });
  }

  closeModal() {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) modalDiv.style.display = 'none';
  }

  openModal(id: number) {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
      this.voucherId = id;
    }
  }

  delete() {
    this.voucherService.delete(this.voucherId).subscribe({
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
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });
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
