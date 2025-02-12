import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { UserResponse } from '../responses/user/user.response';
import { CommodityDTO } from '../dtos/commodity/commodity.dto';


@Injectable({
    providedIn: 'root'
})
export class CommodityService {
    private api = `${environment.apiBaseUrl}/commodities`;
    private apiConfig: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) {
        this.apiConfig = {
            headers: this.httpUtilService.createHeaders()
        };
    }

  
    getAllCommodities(name: string, isAcive: boolean, page: number, limit: number): Observable<UserResponse[]> {
        const params = new HttpParams()
        .set('name', name)      
        .set('active', isAcive.toString())
        .set('page', page.toString())
        .set('limit', limit.toString());            
        return this.http.get<any>(this.api, { params });
    }

    getAllCommoditiesWithoutParams(): Observable<UserResponse[]> {      
        return this.http.get<any>(`${environment.apiBaseUrl}/client-commodity`);
    }

    getCommodities(name: string): Observable<UserResponse[]> {        
        const params = new HttpParams()
        .set('commotity_name', name)      
        return this.http.get<any>(this.api + "/by-name", {params});
    }
    
    register(commodityDTO: CommodityDTO): Observable<any> {
        return this.http.post(this.api, commodityDTO, this.apiConfig);
    }

    update(commodityDTO: CommodityDTO, id: number): Observable<any> {
        return this.http.put(`${this.api}/${id}`, commodityDTO, this.apiConfig);
    }


    getCommodityById(id: number){
        return this.http.get<any>(`${this.api}/details/${id}`);
    }

    delete(id: number) {
        const url = `${environment.apiBaseUrl}/commodities/${id}`;
        return this.http.delete(url);
    }
}