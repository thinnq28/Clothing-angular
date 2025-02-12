import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { VariantDataResponse } from '../../../responses/variant/variant.data.response';
import { VariantService } from '../../../service/variant.service';
import { PromotionDataResponse } from '../../../responses/promotion/promotion.data.response';
import { PromotionService } from '../../../service/promotion.service';
import { PromotionVariantDTO } from '../../../dtos/promotion/promotion.variant.dto';

@Component({
  selector: 'app-add-promotion-variant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    ButtonModule,
    RippleModule,
  ],
  templateUrl: './add-promotion-variant.component.html',
  styleUrl: './add-promotion-variant.component.scss',
  providers: [MessageService],
})
export class AddPromotionVariantComponent {
  promotion?: PromotionDataResponse;
  variants: VariantDataResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;

  name: string = '';
  productName: string = '';
  minQuantity: number = 0;
  maxQuantity: number = 0;
  minPrice: number = 0;
  maxPrice: number = 0;
  isActive: boolean = false;

  visiblePages: number[] = [];

  promotionId: number = 0;
  promotionName: string = "";
  discountPercentage: number = 0;
  startDate: Date = new Date;
  endDate: Date = new Date;

  constructor(
    private variantService: VariantService,
    private router: Router,
    private promotionService: PromotionService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.promotionId = Number(this.route.snapshot.paramMap.get('id'));
    this.getAllVariants(
      this.name,
      this.productName,
      this.minQuantity,
      this.maxQuantity,
      this.minPrice,
      this.maxPrice,
      this.isActive,
      this.currentPage,
      this.itemsPerPage
    );
    this.getPromotionById(this.promotionId);
  }

  isCheck(): boolean {
    const checkBoxs = document.getElementsByClassName('checkBoxPromotion');
    let isChecked = false;
    for (let i = 0; i < checkBoxs.length; i++) {
      let element = checkBoxs[i] as HTMLInputElement;
      if (!element.checked) {
        isChecked = false;
        break;
      } else {
        isChecked = true;
      }
    }

    return isChecked;
  }

  getPromotionById(id: number) {
    this.promotionService.getPromotionById(id).subscribe({
      next: (response: any) => {
        this.promotion = response.data;
        if (this.promotion) {
          this.promotionName = this.promotion.name;
          this.discountPercentage = this.promotion.discountPercentage;
          this.startDate = this.promotion.startDate;
          this.endDate = this.promotion.endDate;
        }
      },
      complete: () => {
      },
      error: (error: any) => {
        this.showError(error.error.message);
      },
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getAllVariants(
      this.name,
      this.productName,
      this.minQuantity,
      this.maxQuantity,
      this.minPrice,
      this.maxPrice,
      this.isActive,
      this.currentPage,
      this.itemsPerPage
    );
  }

  getAllVariants(
    name: string,
    productName: string,
    minQuantity: number,
    maxQuantity: number,
    minPrice: number,
    maxPrice: number,
    isAcive: boolean,
    page: number,
    limit: number
  ) {
    this.variantService
      .getVariants(
        name,
        productName,
        minQuantity,
        maxQuantity,
        minPrice,
        maxPrice,
        isAcive,
        page,
        limit
      )
      .subscribe({
        next: (response: any) => {
          debugger;
          this.variants = response.data.variants;
          this.totalPages = response.data.totalPages;
          this.visiblePages = this.generateVisiblePageArray(
            this.currentPage,
            this.totalPages
          );
          this.showSuccess(response.message);
        },
        complete: () => {
        },
        error: (error: any) => {
          this.showError(error.error.message);
        },
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

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }

  searchVariant() {
    debugger;
    this.getAllVariants(
      this.name,
      this.productName,
      this.minQuantity,
      this.maxQuantity,
      this.minPrice,
      this.maxPrice,
      this.isActive,
      this.currentPage,
      this.itemsPerPage
    );
  }

  checkAllCheckBox() {
    const checkBox = document.getElementById('checkboxNoLabel');
    const checkBoxs = document.getElementsByClassName('checkBoxPromotion');
    const isChecked = (checkBox as HTMLInputElement).checked;
    for (let i = 0; i < checkBoxs.length; i++) {
      let element = checkBoxs[i] as HTMLInputElement;
      let variantId = element.value;
      if (isChecked) {
        this.add(Number(variantId));
      } else {
        this.delete(Number(variantId))
      }
    }
  }

  add(variantId: number) {
    const promotionVariantDTO: PromotionVariantDTO = {
      variantId: variantId,
      promotionId: this.promotionId,
    };

    this.promotionService.addForVariant(promotionVariantDTO).subscribe({
      next: (response: any) => {
        const currentUrl = this.router.url;
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
      },
      complete: () => { },
      error: (error: any) => {
        this.showError(error.error.message);
        let errors = [];
        errors = error.error.data;
        for (let i = 0; i < errors.length; i++) {
          this.showError(errors[i]);
        }
      },
    });
  }

  delete(variantId: number) {
    this.promotionService
      .deletePromotionVariant(variantId, this.promotionId)
      .subscribe({
        next: (response: any) => {
          const currentUrl = this.router.url;
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate([currentUrl]);
            });
        },
        error: (error: any) => {
          this.showError(error.error.message);
        },
      });
  }

  addorDeletPromotion(variantId: number, index: number) {
    let element = document.getElementById('checkedPromotion' + index);

    if ((element as HTMLInputElement).checked) {
      this.add(variantId);
    } else {
      this.delete(variantId);
    }
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  showErrors(errors: string[]) {
    for (let i = 0; i < errors.length; i++) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errors[i],
        life: 10000,
      });
    }
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}
