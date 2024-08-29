import { Component, OnInit } from '@angular/core';
import { HeaderClientComponent } from "../header/header.component";
import { FooterClientComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { OrderDTO } from '../../dtos/order/order.dto';
import { CartService } from '../../service/cart.service';
import { TokenService } from '../../service/token.service';
import { OrderService } from '../../service/order.service';
import { MessageService } from 'primeng/api';
import { VariantService } from '../../service/variant.service';
import { VariantDataResponse } from '../../responses/variant/variant.data.response';
import { ImageDataResponse } from '../../responses/image/image.data.response';
import { environment } from '../../environments/environment';
import { VoucherService } from '../../service/voucher.service';
import { VoucherDataResponse } from '../../responses/voucher/voucher.data.response';
import { ClientService } from '../../service/client.service';
import { UserDataResponse } from '../../responses/user/user.data.response';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, HeaderClientComponent,
    FooterClientComponent, RouterModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  providers: [MessageService]
})
export class OrderComponent implements OnInit {
  code: string = ""; // Mã giảm giá

  orderForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: { variant: VariantDataResponse, quantity: number }[] = [];
  
  totalAmount: number = 0; // Tổng tiền
  cart: Map<number, number> = new Map();
  variants: VariantDataResponse[] = [];
  voucher?: VoucherDataResponse;
  voucherValue: number = 0;
  userDataResponse?: UserDataResponse
  token: string = "";

  orderData: OrderDTO = {
    userId: 0, // Thay bằng user_id thích hợp
    fullName: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form    
    phoneNumber: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    status: 'pending',
    note: '', // Có thể thêm trường ghi chú nếu cần
    totalMoney: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    paymentMethod: 'cod', // Mặc định là thanh toán khi nhận hàng (COD)
    // shipping_method: 'express', // Mặc định là vận chuyển nhanh (Express)
    voucherCode: '', // Sẽ được điền từ form khi áp dụng mã giảm giá
    cart_items: []
  };

  constructor(
    private cartService: CartService,
    private userService: ClientService,
    private variantService: VariantService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private voucherService: VoucherService,
    private router: Router,
    private messageService: MessageService,
  ) {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc      
      email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: [''],
      payment_method: ['cod']
    });
  }

  ngOnInit(): void {
    debugger
    //this.cartService.clearCart();

    if (this.tokenService.getToken() != null) {
      this.getUserDetail(this.tokenService.getToken()!);
      let isGuest = false;

      this.userDataResponse?.roles.forEach(e => {
        if (e.name == "GUEST") isGuest = true;
      })

      if (isGuest) {
        this.orderData.userId = this.userDataResponse?.id!;
      } else {
        this.orderData.userId = 0;
      }
    }

    // Lấy danh sách sản phẩm từ giỏ hàng
    debugger
    this.cart = this.cartService.getCart();
    const variantIds = Array.from(this.cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng    
    console.log(variantIds);
    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    debugger
    if (variantIds.length === 0) {
      return;
    }
    this.variantService.getVariantByIds(variantIds).subscribe({
      next: (response) => {
        debugger
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.variants = response.data;
        this.cartItems = variantIds.map((variantId) => {
          debugger
          const variant = this.variants.find(v => v.id == variantId);
          if (variant && variant.images && variant.images.length > 0) {
            variant.images.forEach((image: ImageDataResponse) => {
              image.url = `${environment.apiBaseUrl}/variants/images/${image.url}`;
            });
          }
          return {
            variant: variant!,
            quantity: this.cart.get(variantId)!
          };
        });
      },
      complete: () => {
        debugger;
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });
  }
  placeOrder() {
    debugger
    if (this.orderForm.errors == null) {
      // Sử dụng toán tử spread (...) để sao chép giá trị từ form vào orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };
      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        variantId: cartItem.variant.id,
        quantity: cartItem.quantity
      }));
      this.orderData.totalMoney = this.totalAmount;
      // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response) => {
          debugger;
          alert('Đặt hàng thành công');
          this.cartService.clearCart();
          this.router.navigate(['/']);
        },
        complete: () => {
          debugger;
          this.calculateTotal();
        },
        error: (error: any) => {
          debugger;
          alert(`Lỗi khi đặt hàng: ${error}`);
        },
      });
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    // Cập nhật lại this.cart từ this.cartItems
    this.updateCartFromCartItems();
    this.calculateTotal();
  }

  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.variant.price * item.quantity,
      0
    );

    if (this.voucher) {
      let discountAmount = 0;
      if (this.voucher.discountType == "percentage") {
        discountAmount = (this.totalAmount * this.voucher.discount / 100);
        if(discountAmount > this.voucher.maxDiscountAmount) discountAmount = this.voucher.maxDiscountAmount
        this.totalAmount = this.totalAmount - discountAmount;
      } else {
        this.totalAmount = this.totalAmount - this.voucher.discount;
      }
    }

    if(this.totalAmount < 0 ) this.totalAmount = 0;
  }
  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      // Xóa sản phẩm khỏi danh sách cartItems
      this.cartItems.splice(index, 1);
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      // Tính toán lại tổng tiền
      this.calculateTotal();
    }
  }
  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon(): void {
    debugger
    let userId = 0;
    if (this.tokenService.getToken() != null) {
      this.getUserDetail(this.tokenService.getToken()!);
      let isGuest = false;

      this.userDataResponse?.roles.forEach(e => {
        if (e.name == "GUEST") isGuest = true;
      })

      if (isGuest) {
        userId = this.userDataResponse?.id!;
      } else {
        userId = 0;
      }
    }

    // Viết mã xử lý áp dụng mã giảm giá ở đây
    this.voucherService.getVoucherByCode(this.code, userId).subscribe({
      next: (response) => {
        this.voucher = response.data;
        this.showSuccess("Áp dụng mã giảm giá thành công")
      },
      complete: () => {
        debugger;
        this.calculateTotal();
      },
      error: (error: any) => {
        console.log(error);
        this.showError(error.error.message);
        this.showErrors(error.error.data);
      },
    })
    // Cập nhật giá trị totalAmount dựa trên mã giảm giá nếu áp dụng
  }
  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.variant.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }

  getUserDetail(token: string) {
    this.userService.getUserDetail(token).subscribe({
      next: (response: any) => {
        debugger
        this.userDataResponse = response.data
      },
      complete: () => {
        debugger;
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
}
