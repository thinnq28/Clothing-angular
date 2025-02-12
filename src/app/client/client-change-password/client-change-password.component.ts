import { Component } from '@angular/core';
import { HeaderClientComponent } from "../header/header.component";
import { FooterClientComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TokenService } from '../../service/token.service';
import { MessageService } from 'primeng/api';
import { UserService } from '../../service/user.service';
import { ChangePasswordDTO } from '../../dtos/user/change-password.dto';
import { ClientService } from '../../service/client.service';

@Component({
  selector: 'app-client-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, HeaderClientComponent,
    FooterClientComponent, RouterModule],
  templateUrl: './client-change-password.component.html',
  styleUrl: './client-change-password.component.scss',
  providers: [MessageService]
})
export class ClientChangePasswordComponent {
  userChangePassword: FormGroup;
  token:string | null = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: ClientService,
    private tokenService: TokenService,
    private messageService: MessageService
  ){
    this.userChangePassword = this.formBuilder.group({
      current_password: ['', [Validators.minLength(6)]], 
      password: ['', [Validators.minLength(6)]], 
      retype_password: ['', [Validators.minLength(6)]], 
    }, {
      validators: this.passwordMatchValidator// Custom validator function for password match
    });
  }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const retypedPassword = formGroup.get('retype_password')?.value;
      if (password !== retypedPassword) {
        return { passwordMismatch: true };
      }
  
      return null;
    };
  }
  ngOnInit(): void {
    debugger
    this.token = this.tokenService.getToken();
    
    if(this.token == null)  {
      this.router.navigate(['/login']);
      return;
    }
  }

  change() {
      if(this.token == null)  {
        this.router.navigate(['/login']);
        return;
      }
      const changePasswordDTO: ChangePasswordDTO = {
        current_password: this.userChangePassword.get('current_password')?.value,
        new_password: this.userChangePassword.get('password')?.value,
        confirm_password: this.userChangePassword.get('retype_password')?.value,
      };

      this.userService.changePassword(this.token, changePasswordDTO)
        .subscribe({
          next: (response: any) => {
            this.userService.removeUserFromLocalStorage();
            this.tokenService.removeToken();
            this.router.navigate(['/profile']).then(() => {
              window.location.reload();
            });

            this.showSuccess(response.message);
          },

          complete: () => {
            
          },

          error: (error: any) => {
            let errors = [];
            errors = error.error.data;
            for(let i = 0; i < errors.length; i++) {
              this.showError(errors[i]);
            }
          }
        });
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
