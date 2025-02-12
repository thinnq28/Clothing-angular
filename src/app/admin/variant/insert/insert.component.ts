import { Component, OnInit } from '@angular/core';
import { ProductDataResponse } from '../../../responses/product/product.data.response';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProductService } from '../../../service/product.service';
import { VariantService } from '../../../service/variant.service';
import { InsertVariantDTO } from '../../../dtos/variant/insert.variant.dto';
import { environment } from '../../../environments/environment';
import { OptionDataResponse } from '../../../responses/option/option.data.response';
import { OptionVariantDTO } from '../../../dtos/variant/insert.option.variant';

@Component({
  selector: 'app-insert',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, AutoCompleteModule],
  templateUrl: './insert.component.html',
  styleUrl: './insert.component.scss',
  providers: [MessageService]
})
export class InsertVariantComponent implements OnInit {
  products: ProductDataResponse[] = [];
  product?: ProductDataResponse;
  options: OptionDataResponse[] = [];

  name: string = "";

  variantName: string = "";
  productId: number = 0;
  quantity: number = 0;
  price: number = 0;
  images: File[] = [];

  constructor(
    private variantService: VariantService,
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getProducts('');
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

  getProductsByName() {
    this.getProducts(this.name);
  }

  selectProduct(value: any) {
    this.productService.getProductById(value.target.value).subscribe({
      next: (response: any) => {
        this.product = response.data;
        if (this.product) {
          this.product.imageUrl = `${environment.apiBaseUrl}/products/images/${this.product.imageUrl}`;
          this.options = this.product.options;
          const div = document.getElementById("product");
          if (div != null && div.parentNode != null) {
            const divParent = document.createElement("div");
            divParent.className = "col-md-6";
            for (let i = 0; i < this.product.options.length; i++) {
              const option = this.product.options[i];
              let isMultipleUsage = option.isMultipleUsage;
              const label = document.createElement("label");
              label.textContent = option.name;
              divParent.appendChild(label);

              for (let j = 0; j < option.optionValues.length; j++) {
                if (option.optionValues[j]) {
                  const optionValue = option.optionValues[j];
                  const divChild = document.createElement("div");
                  divChild.className = "form-check form-switch";

                  const input = document.createElement("input");
                  input.className = `form-check-input option-value-${option.id}`;
                  if (isMultipleUsage) {
                    input.type = "checkbox";
                  } else {
                    input.type = "radio";
                  }

                  input.id = "flexSwitchCheckChecked" + i + j;
                  input.name = "option-value" + i;
                  input.value = optionValue.id.toString();

                  input.onclick = function () {
                    let isChecked = false;
                    let elements = document.getElementsByName("option-value" + i);
                    for (let z = 0; z < elements.length; z++) {
                      isChecked = (elements[z] as HTMLInputElement).checked;
                      if (isChecked) break;
                    }

                    if (isChecked) {
                      const inputOption = document.createElement("input");
                      inputOption.className = "form-check-input";
                      inputOption.type = "hidden";
                      inputOption.id = "option-" + option.id;
                      divParent.appendChild(inputOption);
                    } else {
                      const ip = document.getElementById("option-" + option.id);
                      if (ip) ip.remove();
                    }
                  }
                  divChild.appendChild(input);

                  const label = document.createElement("label");
                  label.className = "form-check-label";
                  label.htmlFor = "flexSwitchCheckChecked" + i + j;
                  label.textContent = optionValue.name;
                  label.style.marginLeft = "5px";
                  divChild.appendChild(label);

                  divParent.appendChild(divChild);
                }
              }
            }

            div.parentNode.insertBefore(divParent, div.nextSibling);
          }

        }

      },
      complete: () => {
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    })
  }

  insert() {

    let options: OptionVariantDTO[] = [];

    for (let i = 0; i < this.options.length; i++) {
      let optionElement = document.getElementById('option-' + this.options[i].id);

      if (!optionElement) continue;

      let optionValueElements = document.getElementsByClassName("option-value-" + this.options[i].id);
      let optionValues: number[] = [];

      for (let j = 0; j < optionValueElements.length; j++) {
        let isChecked = (optionValueElements[j] as HTMLInputElement).checked;
        if (isChecked) optionValues.push(Number((optionValueElements[j] as HTMLInputElement).value));
      }

      const opt: OptionVariantDTO = {
        optionId: this.options[i].id,
        optionValueIds: optionValues
      }

      options.push(opt);
    }

    console.log(options);

    const insertVariantDTO: InsertVariantDTO = {
      productId: this.productId,
      quantity: this.quantity,
      price: this.price,
      options: options
    };
    this.variantService.insert(insertVariantDTO).subscribe({
      next: (response) => {
        debugger
        if (this.images) {
          this.insertImage(response.data);
        }
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

  getProducts(name: string) {
    debugger
    this.productService.getProducts(name).subscribe({
      next: (response: any) => {
        debugger
        this.products = response.data;
      },
      complete: () => {
        debugger;
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

  insertImage(ids: number[]) {
    for (let i = 0; i < ids.length; i++) {
      debugger
      this.variantService.uploadImages(ids[i], this.images).subscribe({
        next: (imageResponse) => {
          debugger
          this.showSuccess(imageResponse.message);
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
  }

}
