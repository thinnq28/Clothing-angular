import { Component, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'
import { UserDataResponse } from '../../responses/user/user.data.response';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../responses/user/login.response';
import { UserResponse } from '../../responses/user/user.response';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ToastModule, ButtonModule, RippleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '0961651072';
  password: string = '123456';

  rememberMe: boolean = true;
  userResponse?: UserResponse;
  userDataResponse?: UserDataResponse;
  isAdminOrUSer: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private messageService: MessageService,
  ) {

  }

  login() {

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password
    };

    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger;
        const token = response.data.token
        if (this.rememberMe) {
          this.tokenService.setToken(token);

          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              this.userResponse = {
                ...response
              };

              debugger
              this.userDataResponse = this.userResponse?.data;
              if (this.userDataResponse != null) {
                for (let i = 0; i < this.userDataResponse.roles.length; i++) {
                  let role = this.userDataResponse.roles[i];
                  if (role.name == "ADMIN" || role.name == "USER") {
                    this.isAdminOrUSer = true;
                  }
                }
              }

              if (this.isAdminOrUSer) {
                this.userService.saveUserResponseToLocalStorage(this.userDataResponse);
                this.router.navigate(['/admin']);
              } else {
                this.showError("Login is failed!!!");
              }
              this.userService.saveUserResponseToLocalStorage(this.userDataResponse);
            },
            complete: () => {
              debugger;
              this.router.navigate(['/admin']);
            },
            error: (error: any) => {
              if (error.status == 401) {
                this.showError("Đăng nhập thất bại");
              } else {
                this.showError(error.error.message);
                let errors = [];
                errors = error.error.data;
                for (let i = 0; i < errors.length; i++) {
                  this.showError(errors[i]);
                }
              }
            }
          })
        }
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        this.showError(error.error.message);
        let errors = [];
        errors = error.error.data;
        for (let i = 0; i < errors.length; i++) {
          this.showError(errors[i]);
        }
      }
    })
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
