import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { PurchaseOrderDTO } from '../dtos/purchase-order/purchase.order.dto';

@Injectable({
    providedIn: 'root'
})
export class PurchaseOrderService {
    private apiProducts = `${environment.apiBaseUrl}/purchase-orders`;
    private apiConfig: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) {
        this.apiConfig = {
            headers: this.httpUtilService.createHeaders()
        };
    }
    
    uploadFile(file: File): Observable<any> {
        debugger
        const formData = new FormData();
        formData.append('file', file)
        // Upload images for the specified product id
        return this.http.post(`${this.apiProducts}/upload`, formData);
    }

    save(purchaseOrderDTO: PurchaseOrderDTO): Observable<any> {
        return this.http.post(this.apiProducts, purchaseOrderDTO, this.apiConfig);
    }

    getAllOrders(supplierName: string, orderDate: string, page: number, limit: number): Observable<any> {
        const params = new HttpParams()
        .set('supplierName', supplierName)      
        .set('orderDate', orderDate)
        .set('page', page.toString())
        .set('limit', limit.toString());            
        return this.http.get<any>(this.apiProducts, { params });
    }
}
