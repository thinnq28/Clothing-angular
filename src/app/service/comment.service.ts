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
import { CommentRateDTO } from '../dtos/comment-rate/comment-rate.dto';


@Injectable({
    providedIn: 'root'
})
export class CommentRateService {
    private api = `${environment.apiBaseUrl}/comment-rate`;
    private apiConfig: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) {
        this.apiConfig = {
            headers: this.httpUtilService.createHeaders()
        };
    }

    insert(CommentRateDTO: CommentRateDTO): Observable<any> {
        return this.http.post(this.api, CommentRateDTO, this.apiConfig);
    }

    getCommentsByProductId(productId: number): Observable<any> {
        return this.http.get(`${environment.apiBaseUrl}/products/${productId}/comments`);
      }
    


}