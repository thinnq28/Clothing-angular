import { Component, OnInit } from '@angular/core';
import { InsertProductDTO } from '../../../dtos/product/insert.product.dto';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OptionService } from '../../../service/option.service';
import { OptionDataResponse } from '../../../responses/option/option.data.response';
import { SupplierService } from '../../../service/supplier.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SupplierDataResponse } from '../../../responses/supplier/supplier.data.response';
import { ProductService } from '../../../service/product.service';
import { ProductDataResponse } from '../../../responses/product/product.data.response';
import { environment } from '../../../environments/environment';
import { CommodityService } from '../../../service/commodity.service';
import { CommodityDataResponse } from '../../../responses/commodity/Commodity.data.response';


@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, AutoCompleteModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
  providers: [MessageService]
})
export class UpdateComponent {
  suppliers: SupplierDataResponse[] = [];
  options: OptionDataResponse[] = [];
  commodities: CommodityDataResponse[] = [];
  product?: ProductDataResponse;
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  name: string = "";
  nameCommodity: string = "";
  optionName: string = "";
  isActive: boolean = true;
  visiblePages: number[] = [];

  optionsCounter = 0;

  productName: string = "";
  supplierId: number = 0;
  commodityId: number = 0;
  description: string = "";

  image: File | undefined;

  id: number = 0;

  constructor(
    private optionService: OptionService,
    private supplierService: SupplierService,
    private productService: ProductService,
    private router: Router,
    private commodityService: CommodityService,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
      this.getSuppliers('');
      this.getOptions('');
      this.getCommodities('');
      this.id = Number(this.route.snapshot.paramMap.get('id'));
      this.getProductById(this.id);
  }

  getProductById(id: number){
    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
        debugger
        this.product = response.data;
        if(this.product){
          this.product.imageUrl = `${environment.apiBaseUrl}/products/images/${this.product.imageUrl}`;
          this.productName = this.product.productName;
          this.description = this.product.description;
          this.supplierId = this.product.supplierId;
          this.commodityId = this.product.commodityId;
          this.optionsCounter = this.product.options.length - 1;
        }
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    })
  }

  getOptions(name: string) {
    debugger
    this.optionService.getOptions(name).subscribe({
      next: (response: any) => {
        debugger
        this.options = response.data;
      },
      complete: () => {
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });
  }

  getSuppliersByName(){
    this.getSuppliers(this.name);
  }

  getCommoditiesByName() {
    this.getCommodities(this.nameCommodity);
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

  getCommodities(name: string) {
    debugger
    this.commodityService.getCommodities(name).subscribe({
      next: (response: any) => {
        debugger
        this.commodities = response.data;
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
  insertSelection(){
    debugger
    const container = document.getElementById('options');

    const div = document.createElement('div');
    div.className = "row";
    div.style.paddingLeft = "12px"
    div.id = "options" + (this.optionsCounter + 1);
    
    console.log(container)
    
    const newFormGroup = document.createElement('select');
    newFormGroup.className = 'form-select col-md-6';
    newFormGroup.name = "optionId";

    for(let i = 0; i < this.options.length; i++){
      const newInput = document.createElement('option');
      newInput.value = this.options[i].id.toString();
      newInput.text = this.options[i].name;
      newFormGroup.appendChild(newInput);
    }

    const btn = document.createElement('button')
    btn.type = 'button';
    btn.id = 'btn-remove' + (this.optionsCounter + 1);
    btn.textContent = "-";
    btn.className = "btn btn-outline-danger col-md-1"
    btn.style.marginLeft = "5px";
    btn.style.marginTop = "5px";
    btn.style.padding = '5px 10px'; // Điều chỉnh padding
    btn.style.fontSize = '12px'; // Điều chỉnh kích thước chữ
    btn.style.height = '36px'; // Điều chỉnh chiều cao
    btn.style.width = '60px'; // Điều chỉnh chiều rộng
    
    const counter = (this.optionsCounter + 1);
    btn.onclick = function(){
      const e1 = document.getElementById("options" + counter);
      const e2 = document.getElementById("btn-remove" + counter);
      if(e1 != null) {
        e1.remove();
      }
      if(e2){
        e2.remove();
      }
    }

    newFormGroup.style.marginTop = "5px";
    newFormGroup.style.width = "90%"

    div.appendChild(newFormGroup);
    div.appendChild(btn);
    this.optionsCounter++;
    
    if (container != null && container.parentNode != null) {
      container.parentNode.insertBefore(div, container.nextSibling);
    }
  }

  removeOption(index : number){
    const e1 = document.getElementById("options" + index);
      const e2 = document.getElementById("btn-remove" + index);
      if(e1 != null) {
        e1.remove();
      }
      if(e2){
        e2.remove();
      }
  }

  updateProduct(){
    debugger
    let optionIds = document.getElementsByName('optionId');
    let values = [];
    for (let i = 0; i < optionIds.length; i++) {
      let value = Number((optionIds[i] as HTMLInputElement).value);
      values.push(value)
    }

    const insertProductDTO : InsertProductDTO = {
      name: this.productName,
      supplierId: this.supplierId,
      commodityId: this.commodityId,
      description: this.description,
      optionId: values
    };
    this.productService.updateProduct(this.id, insertProductDTO).subscribe({
      next: (response) => {
        debugger
        const productId = response.data.id;
        if(this.image){
          this.productService.uploadImages(productId, this.image).subscribe({
            next: (imageResponse)  =>{
              this.showSuccess(response.message);
              setTimeout(() => {
                const currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              }, 3000);
            },
            error: (error) => {
              this.showError(error.error.message);
              this.showErrors(error.error.data)
            }
          })
        }else{
          this.showSuccess(response.message);
              setTimeout(() => {
                const currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate([currentUrl]);
                });
              }, 3000);
        }
        
      },
      error: (error) => {
        this.showError(error.error.message);
        this.showErrors(error.error.data);
      }
    })

  }

  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;
    
    if (files == null || files == undefined) {
      this.showError("You must choose Image");
      return;
    }else{
      this.image = files[0];
      const newImage = document.getElementById("result");
      let img = document.createElement('img');
      img.src = URL.createObjectURL(files[0])
      img.className = "rounded-square";
      img.style.width= "100px";
      img.style.height= "100px";

      if(newImage){
        newImage.innerHTML = "New Image Added: ";
        newImage.appendChild(img);
      }
    }
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

  imageSource(url : string){
    if(url) window.open(url);
  }
}
