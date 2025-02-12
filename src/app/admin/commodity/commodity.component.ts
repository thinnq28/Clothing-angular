import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SupplierService } from '../../service/supplier.service';
import { SupplierDataResponse } from '../../responses/supplier/supplier.data.response';
import { SupplierDTO } from '../../dtos/supplier/supplier.dto';
import { CommodityService } from '../../service/commodity.service';
import { CommodityDataResponse } from '../../responses/commodity/Commodity.data.response';
import { CommodityDTO } from '../../dtos/commodity/commodity.dto';


@Component({
  selector: 'app-supllier',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule],
  templateUrl: './commodity.component.html',
  styleUrl: './commodity.component.scss',
  providers: [MessageService]
})
export class CommodityComponent implements OnInit {
  commodities: CommodityDataResponse[] = [];
  commodity?: CommodityDataResponse;
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  name: string = "";
  isActive: boolean = true;
  visiblePages: number[] = [];
  commodityDeleteId = 0;


  commodityName: string = '';
  commodityId: number = 0;


  constructor(
    private commodityService: CommodityService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getAllCommodities(this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getAllCommodities(this.name, this.isActive, this.currentPage, this.itemsPerPage);
  }

  getAllCommodities(name: string, isAcive: boolean, page: number, limit: number) {
    this.commodityService.getAllCommodities(name, isAcive, page, limit).subscribe({
      next: (response: any) => {
        this.commodities = response.data.commodities;
        this.totalPages = response.data.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
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

  searchCommodities() {
    debugger
    this.getAllCommodities(this.name, this.isActive, this.currentPage, this.itemsPerPage);
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
    this.commodityService.delete(this.commodityDeleteId).subscribe({
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


  closeModal() {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) modalDiv.style.display = 'none';
  }

  openModal(id: number) {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
      this.commodityDeleteId = id;
    }
  }



  openCreateSupplier() {
    const modalDiv = document.getElementById('modalCreateSupplier');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  closeCreateSupplier() {
    const modalDiv = document.getElementById('modalCreateSupplier');
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  save() {
    const commodityDTO: CommodityDTO = {
      "commodityName": this.commodityName,
    }
    this.commodityService.register(commodityDTO).subscribe({
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

  openUpdateSupplier(id: number) {
    const modalDiv = document.getElementById('modalUpdateSupplier');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
      this.commodityId = id;
      this.getCommodityById(id);

    }
  }

  getCommodityById(id: number) {
    debugger
    this.commodityService.getCommodityById(id).subscribe({
      next: (response: any) => {
        debugger
        this.commodity = response.data;
        if (this.commodity != null) {
          this.commodityName = this.commodity.commodityName;
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

  update() {
    const commodityDTO: CommodityDTO = {
      "commodityName": this.commodityName,
    }

    this.commodityService.update(commodityDTO, this.commodityId).subscribe({
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
        let errors = [];
        errors = error.error.data;
        for (let i = 0; i < errors.length; i++) {
          this.showError(errors[i]);
        }
      }
    });
  }

  closeUpdateSupplier() {
    const modalDiv = document.getElementById('modalUpdateSupplier');
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

}
