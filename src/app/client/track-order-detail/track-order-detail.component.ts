import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HeaderClientComponent } from '../header/header.component';
import { FooterClientComponent } from '../footer/footer.component';
import { environment } from '../../environments/environment';
import { OrderResponse } from '../../responses/order/order.response';
import { OrderService } from '../../service/order.service';
import { TokenService } from '../../service/token.service';
import { ImageDataResponse } from '../../responses/image/image.data.response';
import { OrderDetailResponse } from '../../responses/order/order-detail.response';


@Component({
  selector: 'app-track-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, HeaderClientComponent, 
    FooterClientComponent, RouterModule],
  templateUrl: './track-order-detail.component.html',
  styleUrl: './track-order-detail.component.scss',
  providers: [MessageService]
})
export class TrackOrderDetailComponent {
  orderDetails: OrderDetailResponse[] = [];
  order?: OrderResponse;
  orderId: number = 0;

  token: string | null = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private tokenService: TokenService,
  ) {
    
  }

  ngOnInit(): void {
    this.token = this.tokenService.getToken();

    const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    if(idParam !== null) {
      this.orderId = +idParam;
    }

    if (this.token == null) {
      this.router.navigate(['/login']);
      return;
    }

    if (!isNaN(this.orderId)) {
      debugger
      this.getAllProducts(this.orderId, this.token);
      this.getOrderById(this.orderId);
      console.log(this.order)
    }
  }

  getAllProducts(orderId: number, token: string) {
    debugger
    this.orderService.getOrderDetailWithToken(orderId, token).subscribe({
      next: (response: any) => {
        this.orderDetails = response.data;

        for(let i = 0; i < this.orderDetails.length; i++){
          const variant = this.orderDetails[i].variant;
          if (variant && variant.images && variant.images.length > 0) {
            variant.images.forEach((image: ImageDataResponse) => {
              image.url = `${environment.apiBaseUrl}/variants/images/${image.url}`;
            });
          }
        }

        this.showSuccess(response.message);
      },
      complete: () => {

      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });
  }

  getOrderById(orderId: number) {
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        this.order = response.data;
      },
      error(error) {

      },
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
