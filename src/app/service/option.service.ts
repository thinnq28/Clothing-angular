import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { LoginDTO } from '../dtos/user/login.dto';
import { UserResponse } from '../responses/user/user.response';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';
import { UserDataResponse } from '../responses/user/user.data.response';
import { ChangePasswordDTO } from '../dtos/user/change-password.dto';
import { OptionDTO } from '../dtos/option/option.dto';
import { OptionUpdateDTO } from '../dtos/option/option.update.dto';
import { OptionValueUpdateDTO } from '../dtos/option-value/optionValue.dto';


@Injectable({
    providedIn: 'root'
})
export class OptionService {
    private api = `${environment.apiBaseUrl}/options`;
    private apiGetOptionValues = `${environment.apiBaseUrl}/option-values`;
    private apiConfig: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) {
        this.apiConfig = {
            headers: this.httpUtilService.createHeaders()
        };
    }

    getAllOptions(name: string, isAcive: boolean, page: number, limit: number): Observable<UserResponse[]> {
        const params = new HttpParams()
            .set('name', name)
            .set('active', isAcive.toString())
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<any>(this.api, { params });
    }

    getOptions(name: string): Observable<UserResponse[]> {
        const params = new HttpParams()
            .set('option_name', name)
        return this.http.get<any>(this.api + "/by-name", { params });
    }


    register(optionDTO: OptionDTO): Observable<any> {
        return this.http.post(this.api, optionDTO, this.apiConfig);
    }


    update(optionDTO: OptionUpdateDTO): Observable<any> {
        return this.http.put(`${this.api}/${optionDTO.optionId}`, optionDTO, this.apiConfig);
    }

    updateOptionValue(optionDTO: OptionValueUpdateDTO): Observable<any> {
        return this.http.put(`${this.apiGetOptionValues}/${optionDTO.optionValueId}`, optionDTO, this.apiConfig);
    }

    deleteOption(id: number) {
        const url = `${environment.apiBaseUrl}/options/${id}`;
        return this.http.delete(url);
    }

    getOptionById(id: number){
        return this.http.get<any>(`${this.api}/details/${id}`);
    }

    getAllOptionValueByOptionId(optionId: number, name: string, isAcive: boolean, page: number, limit: number): Observable<any> {
        const params = new HttpParams()
            .set('option_id', optionId.toString())
            .set('name', name)
            .set('active', isAcive.toString())
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<any>(this.apiGetOptionValues, { params });
    }

    deleteOptionValue(id: number) {
        const url = `${environment.apiBaseUrl}/option-values/${id}`;
        return this.http.delete(url);
    }
}