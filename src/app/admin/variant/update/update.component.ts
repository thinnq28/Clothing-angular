import { Component, OnInit } from '@angular/core';
import { ProductDataResponse } from '../../../responses/product/product.data.response';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProductService } from '../../../service/product.service';
import { VariantService } from '../../../service/variant.service';
import { InsertVariantDTO } from '../../../dtos/variant/insert.variant.dto';
import { environment } from '../../../environments/environment';
import { OptionDataResponse } from '../../../responses/option/option.data.response';
import { VariantDataResponse } from '../../../responses/variant/variant.data.response';
import { ImageDataResponse } from '../../../responses/image/image.data.response';
import { UpdateVariantDTO } from '../../../dtos/variant/update.variant.dto';


@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, AutoCompleteModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
  providers: [MessageService]
})
export class UpdateVariantComponent {
  products: ProductDataResponse[] = [];
  product?: ProductDataResponse;
  options: OptionDataResponse[] = [];
  variant?: VariantDataResponse;
  imageResponses: ImageDataResponse[] = []

  baseUrl: string = `${environment.apiBaseUrl}/variants/images/`;

  id: number = 0;

  productId: number = 0;
  quantity: number = 0;
  price: number = 0;
  images: File[] = [];

  constructor(
    private variantService: VariantService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getVariantById(this.id);

  }

  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;

    if (files == null || files == undefined) {
      this.showError("You must choose Image");
      return;
    } else if (files.length > 5) {
      this.showError('Please select a maximum of 5 images');
      return;
    } else {
      this.images = files;
      const newImage = document.getElementById("result");
      if (newImage) {
        newImage.innerHTML = "New Image Added: ";
      }
      for (let i = 0; i < files.length; i++) {
        let img = document.createElement('img');
        img.src = URL.createObjectURL(files[i])
        img.className = "rounded-square";
        img.style.width = "100px";
        img.style.height = "100px";
        img.style.marginRight = "5px";
        newImage?.appendChild(img);
      }
    }
  }

  update() {
    let properties = document.getElementsByClassName('property');
    let values = [];
    for (let i = 0; i < properties.length; i++) {
      let isChecked = (properties[i] as HTMLInputElement).checked;
      let value = (properties[i] as HTMLInputElement).value;
      if (isChecked) values.push(value)
    }

    debugger
    const updateVariantDTO: UpdateVariantDTO = {
      productId: this.productId,
      quantity: this.quantity,
      price: this.price,
      properties: values,
      imageIds: this.imageResponses.map(e => e.id)
    };
    this.variantService.update(this.id, updateVariantDTO).subscribe({
      next: (response) => {
        debugger
        const variantId = response.data.id;
        if (this.images) {
          debugger
          this.variantService.uploadImages(variantId, this.images).subscribe({
            next: (imageResponse) => {
              debugger
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
              let errors = [];
              errors = error.error.data;
              for (let i = 0; i < errors.length; i++) {
                this.showError(errors[i]);
              }
            }
          })
        }

      },
      error: (error) => {
        this.showError(error.error.message);
        this.showErrors(error.error.data);
      }
    })
  }

  getVariantById(id: number) {
    this.variantService.getVariantById(id).subscribe({
      next: (response: any) => {
        this.variant = response.data;
        if (this.variant) {
          this.product = this.variant.product;
          this.options = this.product.options;
          this.price = this.variant.price;
          this.productId = this.variant.product.id;
          this.quantity = this.variant.quantity;
          this.imageResponses = this.variant.images;
        }
      },
      complete: () => {
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    })
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

  removeImage(index: number): void {
    this.imageResponses.splice(index, 1);
  }

}
