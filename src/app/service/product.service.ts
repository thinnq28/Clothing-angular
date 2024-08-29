import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { ProductResponse } from '../responses/product/product.response';
import { InsertProductDTO } from '../dtos/product/insert.product.dto';
import { UpdateProductDTO } from '../dtos/product/update.product.dto';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiProducts = `${environment.apiBaseUrl}/products`;
    private apiConfig: { headers: HttpHeaders };


    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) {
        this.apiConfig = {
            headers: this.httpUtilService.createHeaders()
        };
    }

    getAllProduct(name: string, supplierName: string, commodityName: string, isAcive: boolean, page: number, limit: number): Observable<ProductResponse[]> {
        const params = new HttpParams()
            .set('name', name)
            .set('supplier_name', supplierName)
            .set('commodity_name', commodityName)
            .set('active', isAcive.toString())
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<any>(this.apiProducts, { params });
    }

    getProducts(name: string): Observable<ProductResponse[]> {        
        const params = new HttpParams()
        .set('product_name', name)      
        return this.http.get<any>(this.apiProducts + "/by-name", {params});
    }

    insertProduct(insertProductDTO: InsertProductDTO): Observable<any> {
        // Add a new product
        return this.http.post(this.apiProducts, insertProductDTO, this.apiConfig);
    }

    updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<any> {
        return this.http.put(`${this.apiProducts}/${productId}`, updatedProduct, this.apiConfig);
      }

    uploadImages(productId: number, file: File): Observable<any> {
        debugger
        const formData = new FormData();
        formData.append('file', file)
        // Upload images for the specified product id
        return this.http.post(`${this.apiProducts}/uploads/${productId}`, formData);
    }

    delete(id: number){
        const url = `${environment.apiBaseUrl}/products/${id}`;
        return this.http.delete(url);
    }

    getProductById(id: number){
        return this.http.get<any>(`${this.apiProducts}/details/${id}`);
    }

}
