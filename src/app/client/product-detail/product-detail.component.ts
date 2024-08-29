import { Component } from '@angular/core';
import { HeaderClientComponent } from "../header/header.component";
import { FooterClientComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.service';
import { MessageService } from 'primeng/api';
import { ProductDataResponse } from '../../responses/product/product.data.response';
import { VariantService } from '../../service/variant.service';
import { VariantDataResponse } from '../../responses/variant/variant.data.response';
import { ImageDataResponse } from '../../responses/image/image.data.response';
import { environment } from '../../environments/environment';
import { OptionDataResponse } from '../../responses/option/option.data.response';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, HeaderClientComponent,
    FooterClientComponent, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  providers: [MessageService]
})
export class ProductDetailComponent {
  product?: ProductDataResponse;
  variants: VariantDataResponse[] = [];
  variant?: VariantDataResponse;
  options: OptionDataResponse[] = [];
  images: ImageDataResponse[] = [];
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;

  constructor(
    private productService: ProductService,
    private variantService: VariantService,
    private cartService: CartService,
    // private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
  ) {

  }
  ngOnInit() {
    // Lấy productId từ URL      
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    debugger
    //this.cartService.clearCart();
    //const idParam = 9 //fake tạm 1 giá trị
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getProductById(this.productId).subscribe({
        next: (response: any) => {
          this.product = response.data
          if (this.product && this.product?.options.length > 0) {
            this.options = this.product?.options;
          }
        },
        error(error) {

        },
      });

      this.variantService.getVariantByProductId(this.productId).subscribe({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          this.variants = response.data
          if (this.variants && this.variants.length > 0) {
            this.variant = this.variants[0];
            for (let i = 0; i < this.variants.length; i++) {
              if (this.variants[i].images && this.variants[i].images.length > 0) {
                this.variants[i].images.forEach((image: ImageDataResponse) => {
                  image.url = `${environment.apiBaseUrl}/variants/images/${image.url}`;
                });
              }

            }
            this.images = this.variants[0].images;
          }
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        error: (error: any) => {
          console.error('Error fetching detail:', error);
        }
      });

    } else {
      console.error('Invalid productId:', idParam);
    }
  }

  showImage(index: number): void {
    debugger
    if (this.images &&
      this.images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.images.length) {
        index = this.images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }

  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }
  addToCart(): void {
    debugger
    this.isPressedAddToCart = true;
    if (this.variant) {
      this.cartService.addToCart(this.variant.id, this.quantity);
      this.showSuccess("Thêm sản phẩm thành công");
    } else {
      // Xử lý khi product là null
      this.showError("Không thể thêm sản phẩm vào giỏ hàng vì variant là null.")
    }
  }

  increaseQuantity(): void {
    debugger
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  getTotalPrice(): number {
    if (this.variant) {
      return this.variant.price * this.quantity;
    }
    return 0;
  }
  buyNow(): void {
    if (this.isPressedAddToCart == false) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
  }

  chooseVariant(variantId: number) {
    this.variant = this.variants.find(e => e.id == variantId)
    if(this.variant) this.images = this.variant.images;
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
