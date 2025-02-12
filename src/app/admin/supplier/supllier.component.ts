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


@Component({
  selector: 'app-supllier',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule],
  templateUrl: './supllier.component.html',
  styleUrl: './supllier.component.scss',
  providers: [MessageService]
})
export class SupplierComponent implements OnInit {
  suppliers: SupplierDataResponse[] = [];
  supplier?: SupplierDataResponse;
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  name: string = "";
  phoneNumber: string = "";
  email: string = "";
  isActive: boolean = true;
  visiblePages: number[] = [];
  supplierDeleteId = 0;

  @ViewChild('registerForm') registerForm!: NgForm;
  supplierId: number;
  supplierName: string;
  phoneNumberCreate: string;
  emailCreate: string;
  address: string;

  constructor(
    private supplierService: SupplierService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.supplierId = 0,
    this.supplierName = '',
    this.phoneNumberCreate = '',
    this.emailCreate = '',
    this.address = ''
  }

  ngOnInit(): void {
    this.getAllSuppliers(this.name, this.phoneNumber, this.email, this.isActive, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllSuppliers(this.name, this.phoneNumber, this.email, this.isActive, this.currentPage, this.itemsPerPage);
  }

  getAllSuppliers(name: string, phoneNumber: string, email: string, 
    isAcive: boolean, page: number, limit: number) {
    this.supplierService.getAllSuppliers(name, phoneNumber, email, isAcive, page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.suppliers = response.data.suppliers;
        this.totalPages = response.data.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
      },
      error: (error: any) => {
        debugger
        console.log(error);
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

  searchSuppliers() {
    debugger
    this.getAllSuppliers(this.name, this.phoneNumber, this.email, this.isActive, this.currentPage, this.itemsPerPage);
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
    this.supplierService.delete(this.supplierDeleteId).subscribe({
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


  closeModal() {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) modalDiv.style.display = 'none';
  }

  openModal(supplierId: number) {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
      this.supplierDeleteId = supplierId;
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
    const supplierDTO: SupplierDTO = {
      "phoneNumber": this.phoneNumberCreate,
      "email": this.emailCreate,
      "address": this.address,
      "supplierName": this.supplierName
    }

    
    this.supplierService.register(supplierDTO).subscribe({
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

  openUpdateSupplier(supplierId: number) {
    const modalDiv = document.getElementById('modalUpdateSupplier');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
      this.getSupplierById(supplierId);
    }
  }

  getSupplierById(id: number) {
    this.supplierService.getSupplierById(id).subscribe({
      next: (response: any) => {
        this.supplier = response.data;
        if(this.supplier != null){
          this.supplierId = this.supplier.id;
          this.supplierName = this.supplier.supplierName;
          this.phoneNumberCreate = this.supplier.phoneNumber;
          this.emailCreate = this.supplier.email;
          this.address = this.supplier.address;
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
    const supplierDTO: SupplierDTO = {
      "phoneNumber": this.phoneNumberCreate,
      "email": this.emailCreate,
      "address": this.address,
      "supplierName": this.supplierName
    }
    
    this.supplierService.update(supplierDTO, this.supplierId).subscribe({
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
        this.phoneNumberCreate = '',
        this.emailCreate = '',
        this.address = '',
        this.supplierName = ''
        this.supplierId = 0
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
