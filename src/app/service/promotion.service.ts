import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { UserResponse } from '../responses/user/user.response';
import { PromotionDTO } from '../dtos/promotion/promotion.dto';
import { PromotionVariantDTO } from '../dtos/promotion/promotion.variant.dto';



@Injectable({
    providedIn: 'root'
})
export class PromotionService {
    private api = `${environment.apiBaseUrl}/promotions`;
    private apiConfig: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) {
        this.apiConfig = {
            headers: this.httpUtilService.createHeaders()
        };
    }

    getAllPromotions(name: string, isAcive: boolean, page: number, limit: number): Observable<UserResponse[]> {
        const params = new HttpParams()
            .set('name', name)
            .set('active', isAcive.toString())
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<any>(this.api, { params });
    }

    insert(promotionDTO: PromotionDTO): Observable<any> {
        return this.http.post(this.api, promotionDTO, this.apiConfig);
    }

    update(id: number, promotionDTO: PromotionDTO): Observable<any> {
        return this.http.put(`${this.api}/${id}`, promotionDTO, this.apiConfig);
    }

    getPromotionById(id: number){
        return this.http.get<any>(`${this.api}/details/${id}`);
    }

    delete(id: number) {
        const url = `${environment.apiBaseUrl}/promotions/${id}`;
        return this.http.delete(url);
    }

    addForVariant(promotionVariantDTO: PromotionVariantDTO) : Observable<any>{
        return this.http.post(`${environment.apiBaseUrl}/promotion-variants`, promotionVariantDTO, this.apiConfig);
    }

    deletePromotionVariant(variantId: number, promotionId : number) {
        return this.http.delete(`${environment.apiBaseUrl}/promotion-variants?variant_id=${variantId}&promotion_id=${promotionId}`);
    }
}