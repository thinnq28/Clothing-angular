import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { OrderDTO } from '../dtos/order/order.dto';
import { OrderResponse } from '../responses/order/order.response';
import { UpdateStatusOrderDTO } from '../dtos/order/update.status.order.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;
  private apiGetAllOrders = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: OrderDTO): Observable<any> {    
    // Gửi yêu cầu đặt hàng
    debugger
    return this.http.post(this.apiUrl, orderData);
  }
  getOrderById(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.get(url);
  }

  getAllOrders(fullName:string, phoneNumber: string, email: string, orderDate: string, status: string, active: boolean, page: number, limit: number): Observable<OrderResponse[]> {
      const params = new HttpParams()
      .set('fullName', fullName)      
      .set('phoneNumber', phoneNumber)      
      .set('email', email)      
      .set('orderDate', orderDate)
      .set('status', status)    
      .set('active', active)      
      .set('page', page.toString())
      .set('limit', limit.toString());            
      return this.http.get<any>(this.apiGetAllOrders, { params });
  }

  updateOrder(orderId: number, orderData: OrderDTO): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.put(url, orderData);
  }

  updateStatus(orderId: number, orderData: UpdateStatusOrderDTO): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/update-status/${orderId}`;
    return this.http.put(url, orderData);
  }
  deleteOrder(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.delete(url, { responseType: 'text' });
  }
}
