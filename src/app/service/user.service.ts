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


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/admin/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/admin/login`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/admin/details`;
  private apiUpdateUser = `${environment.apiBaseUrl}/users/admin`;
  private apiChangePassword = `${environment.apiBaseUrl}/users/admin/change-password`;
  private apiGetAllUsers = `${environment.apiBaseUrl}/users/admin`;
  private apiConfig : { headers: HttpHeaders };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {
    this.apiConfig = {
      headers: this.httpUtilService.createHeaders()
    };
  }

  register(registerDTO: RegisterDTO):Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }

  login(loginDTO: LoginDTO): Observable<any> {    
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }

  getUserDetail(token: string) {
    return this.http.post(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  saveUserResponseToLocalStorage(userResponse?: UserDataResponse) {
    try {
      debugger
      if(userResponse == null || !userResponse) {
        return;
      }
      // Convert the userResponse object to a JSON string
      const userResponseJSON = JSON.stringify(userResponse);  
      // Save the JSON string to local storage with a key (e.g., "userResponse")
      localStorage.setItem('user', userResponseJSON);  
      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }
  getUserResponseFromLocalStorage() {
    try {
      debugger
      // Retrieve the JSON string from local storage using the key
      const userResponseJSON = localStorage.getItem('user'); 
      if(userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      // Parse the JSON string back to an object
      const userResponse = JSON.parse(userResponseJSON!);  
      console.log('User response retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage:', error);
      return null; // Return null or handle the error as needed
    }
  }

  updateUserDetail(token: string, updateUserDTO: UpdateUserDTO) {
    debugger
    let userResponse = this.getUserResponseFromLocalStorage();        
    return this.http.put(`${this.apiUpdateUser}/${userResponse?.id}`,updateUserDTO,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }

  changePassword(token: string, changePasswordDTO: ChangePasswordDTO) {
    debugger 
    return this.http.post(`${this.apiChangePassword}`, changePasswordDTO,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }

  removeUserFromLocalStorage():void {
    try {
      // Remove the user data from local storage using the key
      localStorage.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
      // Handle the error as needed
    }
  }
  
  getAllUsers(name: string, phoneNumber: string, email:string, roleId: number, isAcive: boolean, page: number, limit: number): Observable<UserResponse[]> {
      const params = new HttpParams()
      .set('name', name)      
      .set('role_id', roleId.toString())
      .set('active', isAcive.toString())
      .set('phone_number', phoneNumber)
      .set('email', email)
      .set('page', page.toString())
      .set('limit', limit.toString());            
      return this.http.get<any>(this.apiGetAllUsers, { params });
  }

  deleteUser(id: number){
    const url = `${environment.apiBaseUrl}/users/admin/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }

}
