import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { environment } from '../../environments/environment';
import { VariantDataResponse } from '../../responses/variant/variant.data.response';
import { VariantService } from '../../service/variant.service';

@Component({
  selector: 'app-variant',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule],
  templateUrl: './variant.component.html',
  styleUrl: './variant.component.scss',
  providers: [MessageService]
})
export class VariantComponent {
  variants: VariantDataResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  name: string = "";
  isActive: boolean = true;
  visiblePages: number[] = [];

  variantId: number = 0;


  constructor(
    private variantService: VariantService,
    private router: Router,
    private messageService: MessageService
  ) {
    
  }

  ngOnInit(): void {
    this.getAllVariants(this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllVariants(this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  getAllVariants(name: string, isAcive: boolean, page: number, limit: number) {
    debugger
    this.variantService.getAllVariant(name, isAcive, page, limit).subscribe({
      next: (response: any) => {
        debugger
        console.log(response)
        this.variants = response.data.variants;
        console.log(this.variants)
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

  searchVariant() {
    debugger
    this.getAllVariants(this.name, this.isActive, this.currentPage, this.itemsPerPage);
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

  redirectCreateVariant() {
    this.router.navigate([`/admin/variants/create`]);
  }

  redirectImportVariant(){
    this.router.navigate([`/admin/variants/import`]);
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
  delete() {
    debugger
    this.variantService.delete(this.variantId).subscribe({
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
      }
    });
  }
}
