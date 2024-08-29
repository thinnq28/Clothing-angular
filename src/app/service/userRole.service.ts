import { Observable } from "rxjs"
import { UserRoleDTO } from "../dtos/user-role/UserRoleDTO"
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HttpUtilService } from "./http.util.service";


@Injectable({
    providedIn: 'root'
})

export class UserRoleService {
    private apiAddUserRole = `${environment.apiBaseUrl}/user_roles`;
    private apiConfig: { headers: HttpHeaders };

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) {
        this.apiConfig = {
            headers: this.httpUtilService.createHeaders()
        };
    }

    addUserRole(userRoleDTO: UserRoleDTO): Observable<any> {
        return this.http.post(this.apiAddUserRole, userRoleDTO, this.apiConfig);
    }

    deleteUserRole(userId: number, roleId : number) {
        return this.http.delete(`${this.apiAddUserRole}?user_id=${userId}&role_id=${roleId}`);
    }
}

