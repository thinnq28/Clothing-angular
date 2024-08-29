import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PromotionDataResponse } from '../../responses/promotion/promotion.data.response';
import { PromotionService } from '../../service/promotion.service';
import { PromotionDTO } from '../../dtos/promotion/promotion.dto';
@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, AutoCompleteModule],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.scss',
  providers: [MessageService]
})
export class PromotionComponent implements OnInit {

  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  name: string = "";
  isActive: boolean = true;
  visiblePages: number[] = [];
  startDateFilter: Date = new Date;
  endDateFilter: Date = new Date;

  promotionName: string = "";
  discountPercentage: number = 0;
  startDate: Date = new Date;
  endDate: Date = new Date;

  promotions: PromotionDataResponse[] = [];
  promotion?: PromotionDataResponse;
  promotionId: number = 0;

  ngOnInit(): void {
      this.getAllPromotions(this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  constructor(
    private promotionService: PromotionService,
    private router: Router,
    private messageService: MessageService
  ) {
  }


  getAllPromotions(name: string, isAcive: boolean, page: number, limit: number) {
    debugger
    this.promotionService.getAllPromotions(name, isAcive, page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.promotions = response.data.promotions;
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
    debugger;
    this.currentPage = page;
    this.getAllPromotions(this.name, this.isActive, this.currentPage, this.itemsPerPage);
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

  searchPromotions() {
    debugger
    this.getAllPromotions(this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  openCreatePromotion() {
    const modalDiv = document.getElementById('modalCreatePromotion');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  save() {
    const promotionDTO: PromotionDTO = {
        name: this.promotionName,
        discountPercentage: this.discountPercentage,
        startDate: this.startDate,
        endDate: this.endDate
    }

    this.promotionService.insert(promotionDTO).subscribe({
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
        this.showErrors(error.error.data);
      }
    });
  }

  closeCreatePromotion() {
    const modalDiv = document.getElementById('modalCreatePromotion');
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  closeUpdatePromotion(){
    const modalDiv = document.getElementById('modalUpdatePromotion');
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  update() {
    const promotionDTO: PromotionDTO = {
        name: this.promotionName,
        discountPercentage: this.discountPercentage,
        startDate: this.startDate,
        endDate: this.endDate
    }

    this.promotionService.update(this.promotionId, promotionDTO).subscribe({
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
        this.showErrors(error.error.data);
      }
    });
  }

  openUpdatePromotion(id: number) {
    const modalDiv = document.getElementById('modalUpdatePromotion');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
      this.promotionId = id;
      this.getPromotionById(id);
    }
  }

  getPromotionById(id: number){
    debugger
    this.promotionService.getPromotionById(id).subscribe({
      next: (response: any) => {
        debugger
        this.promotion = response.data;
        if(this.promotion){
          this.promotionName = this.promotion.name;
          this.discountPercentage = this.promotion.discountPercentage;
          this.startDate = this.promotion.startDate;
          this.endDate = this.promotion.endDate;
        }
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        this.showError(error.error.message);
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
      this.promotionId = id;
    }
  }

  delete() {
    debugger
    this.promotionService.delete(this.promotionId).subscribe({
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

  addForVariant(id: number){
    this.router.navigate([`/admin/promotions/add-for-variant/${id}`]);
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
