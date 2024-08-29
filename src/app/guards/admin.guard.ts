import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { Router } from '@angular/router'; // Đảm bảo bạn đã import Router ở đây.
import { inject } from '@angular/core';
import { of,Observable } from 'rxjs';


import { TokenService } from '../service/token.service';
import { UserResponse } from '../responses/user/user.response';
import { UserService } from '../service/user.service';
import { UserDataResponse } from '../responses/user/user.data.response';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  userResponse?:UserResponse | null;
  userDataResponse?: UserDataResponse;
  constructor(
    private tokenService: TokenService, 
    private router: Router,
    private userService:UserService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    debugger
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() != null && this.tokenService.getUserId() > 0;
    this.userDataResponse = this.userService.getUserResponseFromLocalStorage();
    const isAdminOrUser = this.userDataResponse?.roles?.some(role =>
      role.name === 'ADMIN' || role.name === 'USER'
    );
    debugger
    if (!isTokenExpired && isUserIdValid && isAdminOrUser) {
      return true;
    } else {
      // Nếu không authenticated, bạn có thể redirect hoặc trả về một UrlTree khác.
      // Ví dụ trả về trang login:
      this.router.navigate(['/admin/login']);
      return false;
    }
  }  
}

export const AdminGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
): boolean => {
  debugger
  return inject(AdminGuard).canActivate(next, state);
}
