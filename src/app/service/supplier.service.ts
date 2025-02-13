import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { UserResponse } from '../responses/user/user.response';
import { SupplierDTO } from '../dtos/supplier/supplier.dto';


@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    private api = `${environment.apiBaseUrl}/suppliers`;
    private apiConfig: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) {
        this.apiConfig = {
            headers: this.httpUtilService.createHeaders()
        };
    }

  
    getAllSuppliers(name: string, phoneNumber: string, email:string, 
        isAcive: boolean, page: number, limit: number): Observable<UserResponse[]> {
        const params = new HttpParams()
        .set('name', name)      
        .set('active', isAcive.toString())
        .set('phone_number', phoneNumber)
        .set('email', email)
        .set('page', page.toString())
        .set('limit', limit.toString());            
        return this.http.get<any>(this.api, { params });
    }

    getSuppliers(name: string): Observable<UserResponse[]> {        
        const params = new HttpParams()
        .set('supplier_name', name)      
        return this.http.get<any>(this.api + "/by-name", {params});
    }
    
    register(supplierDTO: SupplierDTO): Observable<any> {
        return this.http.post(this.api, supplierDTO, this.apiConfig);
    }

    update(supplierDTO: SupplierDTO, id: number): Observable<any> {
        return this.http.put(`${this.api}/${id}`, supplierDTO, this.apiConfig);
    }


    getSupplierById(id: number){
        return this.http.get<any>(`${this.api}/details/${id}`);
    }

    delete(id: number) {
        const url = `${environment.apiBaseUrl}/suppliers/${id}`;
        return this.http.delete(url);
    }


}