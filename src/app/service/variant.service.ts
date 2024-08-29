import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { InsertProductDTO } from '../dtos/product/insert.product.dto';
import { UpdateProductDTO } from '../dtos/product/update.product.dto';
import { VariantResponse } from '../responses/variant/variant.response';
import { InsertVariantDTO } from '../dtos/variant/insert.variant.dto';
import { UpdateVariantDTO } from '../dtos/variant/update.variant.dto';
import { QuantityVariantDTO } from '../dtos/variant/quantity.variant.dto';

@Injectable({
    providedIn: 'root'
})
export class VariantService {
    private apiVariants = `${environment.apiBaseUrl}/variants`;
    private apiConfig: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) {
        this.apiConfig = {
            headers: this.httpUtilService.createHeaders()
        };
    }

    getAllVariant(name: string, isAcive: boolean, page: number, limit: number): Observable<any> {
        const params = new HttpParams()
            .set('name', name)
            .set('active', isAcive.toString())
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<any>(this.apiVariants, { params });
    }

    getVariants(name: string, productName: string, 
        minQuantity: number, maxQuantity: number,
        minPrice: number, maxPrice: number,
        isAcive: boolean, page: number, limit: number): Observable<VariantResponse[]> {
        const params = new HttpParams()
            .set('name', name)
            .set('product_name', productName)
            .set('min_quantity', minQuantity)
            .set('max_quantity', maxQuantity)
            .set('min_price', minPrice)
            .set('max_price', maxPrice)
            .set('active', isAcive.toString())
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<any>(`${this.apiVariants}/for_promotion`, { params });
    }

    insert(insertVariantDTO: InsertVariantDTO): Observable<any> {
        return this.http.post(this.apiVariants, insertVariantDTO, this.apiConfig);
    }

    update(variantId: number, updateVariantDTO: UpdateVariantDTO): Observable<any> {
        return this.http.put(`${this.apiVariants}/${variantId}`, updateVariantDTO, this.apiConfig);
    }

    updateQuantity(variantDTOs: QuantityVariantDTO[]) : Observable<any> {
        return this.http.post(`${this.apiVariants}/update-quantity`, variantDTOs, this.apiConfig);
    }

    uploadImages(vairantId: number, files: File[]): Observable<any> {
        debugger
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        // Upload images for the specified product id
        return this.http.post(`${this.apiVariants}/uploads/${vairantId}`, formData);
    }

    delete(id: number) {
        const url = `${environment.apiBaseUrl}/variants/${id}`;
        return this.http.delete(url);
    }

    getVariantById(id: number) {
        return this.http.get<any>(`${this.apiVariants}/details/${id}`);
    }

    getVariantByIds(ids: number[]) {
        const params = new HttpParams()
        .set('ids', ids.toString())
        return this.http.get<any>(`${this.apiVariants}/by-ids`, {params});
    }

    getVariantByProductId(id: number) {
        return this.http.get<any>(`${this.apiVariants}/by-product/${id}`);
    }
}
