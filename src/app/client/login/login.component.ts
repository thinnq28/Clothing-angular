import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserResponse } from '../../responses/user/user.response';
import { UserDataResponse } from '../../responses/user/user.data.response';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../responses/user/login.response';
import { HeaderClientComponent } from '../header/header.component';
import { FooterClientComponent } from "../footer/footer.component";
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../service/client.service';

@Component({
  selector: 'app-client-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderClientComponent, FooterClientComponent, ToastModule, ButtonModule, RippleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginClientComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '1122334455';
  password: string = '123456';

  rememberMe: boolean = true;
  userResponse?: UserResponse;
  userDataResponse?: UserDataResponse;
  isGuest: boolean = false;

  constructor(
    private router: Router,
    private userService: ClientService,
    private tokenService: TokenService,
    private messageService: MessageService
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
                  if (role.name == "GUEST") {
                    this.isGuest = true;
                  }
                }
              }

              if (this.isGuest) {
                this.userService.saveUserResponseToLocalStorage(this.userDataResponse);
                this.router.navigate(['/']);
              } else {
                this.showError("Đăng nhập không thành công!!!");
              }

            },
            complete: () => {
            },
            error: (error: any) => {
              if (error.status == 401) {
                this.showError("Đăng nhập thất bại");
              } else {
                this.showError(error.message);
              }

            }
          })
        }
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert(error.error.message);
      }
    })
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showErrors(errors: string[]) {
    for (let i = 0; i < errors.length; i++) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: errors[i], life: 10000 });
    }
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
