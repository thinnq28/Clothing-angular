import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { UserResponse } from '../responses/user/user.response';
import { VoucherDTO } from '../dtos/voucher/voucher.dto';



@Injectable({
    providedIn: 'root'
})
export class VoucherService {
    private api = `${environment.apiBaseUrl}/vouchers`;
    private apiConfig: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) {
        this.apiConfig = {
            headers: this.httpUtilService.createHeaders()
        };
    }

    getAllVouchers(code: string, startDate: string, endDate: string,  isAcive: boolean, page: number, limit: number): Observable<UserResponse[]> {
        const params = new HttpParams()
            .set('code', code)
            .set('startDate', startDate.toString())
            .set('endDate', endDate.toString())
            .set('active', isAcive.toString())
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<any>(this.api, { params });
    }

    insert(voucherDTO: VoucherDTO): Observable<any> {
        return this.http.post(this.api, voucherDTO, this.apiConfig);
    }

    update(id: number, voucherDTO: VoucherDTO): Observable<any> {
        return this.http.put(`${this.api}/${id}`, voucherDTO, this.apiConfig);
    }

    getVoucherById(id: number){
        return this.http.get<any>(`${this.api}/details/${id}`);
    }

    delete(id: number) {
        const url = `${environment.apiBaseUrl}/vouchers/${id}`;
        return this.http.delete(url);
    }

    getVoucherByCode(voucherCode: string, userId: number){
        const params = new HttpParams()
            .set('code', voucherCode)
            .set('userId', userId)
        return this.http.get<any>(`${this.api}/by-code`, {params});
    }
}