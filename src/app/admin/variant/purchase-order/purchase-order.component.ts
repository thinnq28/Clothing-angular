import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { environment } from '../../../environments/environment';
import { VariantDataResponse } from '../../../responses/variant/variant.data.response';
import { VariantService } from '../../../service/variant.service';
import { ProductService } from '../../../service/product.service';
import { PurchaseOrderService } from '../../../service/purchase.order.service';
import { PurchaseOrderDataResponse } from '../../../responses/purchase-order/purchase.order.response';
import { QuantityVariantDTO } from '../../../dtos/variant/quantity.variant.dto';
import { SupplierDataResponse } from '../../../responses/supplier/supplier.data.response';
import { SupplierService } from '../../../service/supplier.service';
import { PurchaseOrderDTO } from '../../../dtos/purchase-order/purchase.order.dto';
import { PurchaseOrderDetailDTO } from '../../../dtos/purchase-order/purchase.order.detail';


@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss',
  providers: [MessageService]
})
export class UploadExcelVariantComponent implements OnInit {

  suppliers: SupplierDataResponse[] = [];
  excel?: File
  purchaseOrders: PurchaseOrderDataResponse[] = [];
  paginatedPurchaseOrders: PurchaseOrderDataResponse[] = [];
  currentPage: number = 0;
  totalPages: number = 1;
  visiblePages: number[] = [];
  rowsPerPage: number = 10; // Number of rows per page

  supplierId: number = 0;
  totalAmount: number = 0;

  name: string = "";

  errors: string[] = [];

  ngOnInit(): void {
    this.getSuppliers('');
    this.updatePagination();
  }

  constructor(
    private variantService: VariantService,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private supplierService: SupplierService,
    private messageService: MessageService
  ) {
  }

  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;

    if (files == null || files == undefined) {
      this.showError("You must choose Image");
      return;
    } else if (files.length > 1) {
      this.showError('Please select a maximum of 1 excel');
      return;
    } else {
      this.excel = files[0];
      if (this.excel) {
        this.purchaseOrderService.uploadFile(this.excel).subscribe({
          next: (response) => {
            debugger
            this.purchaseOrders = response.data;
            this.totalPages = Math.ceil(this.purchaseOrders.length / this.rowsPerPage);
            this.totalPages = Math.ceil(this.purchaseOrders.length / this.rowsPerPage);
            this.updatePagination();
            this.calculateTotalAmount();
            this.showSuccess(response.message);
          },
          error: (error) => {
            this.showError(error.error.message);
          }
        });
      }
    }
  }

  save(){
    let variants : QuantityVariantDTO[] = [];
    if(this.purchaseOrders){
      for (let index = 0; index < this.purchaseOrders.length; index++) {
        const element = this.purchaseOrders[index];
        const variant : QuantityVariantDTO = {
          "quantity" : element.quantity,
          "skuId": element.skuId
        }
        variants.push(variant);
      }

      this.variantService.updateQuantity(variants).subscribe({
        next: (response) => {
          this.showSuccess(response.message);          

          const purchaseOrderDTO: PurchaseOrderDTO = {
            "supplierId": this.supplierId,
            "totalAmount": this.totalAmount,
            "purchaseOrderModels": this.purchaseOrders
          }
          this.purchaseOrderService.save(purchaseOrderDTO).subscribe({
            next: (response2) => {
              this.showSuccess(response2.message);
              setTimeout(() => {
                const currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              }, 3000);
            },
            error: (error) => {
              this.showError(error.error.message);
              this.showErrors(error.error.data);
            }
          });
        },
        error: (error) => {
          this.showError(error.error.message);
          this.errors = error.error.data
        }
      }) 
    }
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = this.currentPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedPurchaseOrders = this.purchaseOrders.slice(start, end);
    this.totalPages = Math.ceil(this.purchaseOrders.length / this.rowsPerPage);

    // Update visible pages
    this.visiblePages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.visiblePages.push(i);
    }
  }

  delete(ordinalNumber: number): void {
    // Tính toán chỉ số thật trong mảng purchaseOrders
    const index = (this.currentPage * this.rowsPerPage) + (ordinalNumber);
    console.log(index);
  
    // Kiểm tra nếu chỉ số hợp lệ
    if (index >= 0 && index < this.purchaseOrders.length) {
      this.purchaseOrders.splice(index, 1);
      this.totalPages = Math.ceil(this.purchaseOrders.length / this.rowsPerPage);
      this.updatePagination();
      this.calculateTotalAmount();
      this.showSuccess("Item deleted successfully.");
    } else {
      this.showError("Invalid ordinal number.");
    }
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.purchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  closeAllMessage(){
    this.errors = [];
  }


  getSuppliersByName() {
    this.getSuppliers(this.name);
  }

  getSuppliers(name: string) {
    debugger
    this.supplierService.getSuppliers(name).subscribe({
      next: (response: any) => {
        debugger
        this.suppliers = response.data;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
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
