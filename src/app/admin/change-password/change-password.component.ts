import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordDTO } from '../../dtos/user/change-password.dto';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, ToastModule, RippleModule, ButtonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  providers: [MessageService]
})
export class ChangePasswordComponent implements OnInit {

  userChangePassword: FormGroup;
  token:string | null = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
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
    debugger
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
            this.router.navigate(['/admin']).then(() => {
              window.location.reload();
            });
            this.showSuccess(response.message);
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
