import { Component, OnInit } from '@angular/core';
import { UserDataResponse } from '../../responses/user/user.data.response';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserResponse } from '../../responses/user/user.response';
import { ToastModule, } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { StyleClassModule } from 'primeng/styleclass';
import { UpdateUserDTO } from '../../dtos/user/update.user.dto';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, RippleModule, StyleClassModule,
    RouterModule, ToastModule, ButtonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  animations: [],
  providers: [MessageService]
})
export class UserProfileComponent implements OnInit {
  userDataResponse?: UserDataResponse;
  userProfileForm: FormGroup;
  token: string | null = '';
  userResponse?: UserResponse;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: ['', [Validators.nullValidator]],
      phone_number: ['', [Validators.required, Validators.pattern('^[- +()0-9]+$'), Validators.min(10), Validators.max(10)]],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      date_of_birth: ['', [Validators.required, this.dateValidator]],
    }, {
      validators: this.passwordMatchValidator// Custom validator function for password match
    });
  }

  ngOnInit(): void {
    debugger
    this.token = this.tokenService.getToken();

    if (this.token == null) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserDetail(this.token).subscribe({
      next: (response: any) => {
        debugger
        this.userResponse = {
          ...response
        };
        this.userDataResponse = this.userResponse?.data

        this.userProfileForm.patchValue({
          fullname: this.userDataResponse?.fullname ?? '',
          address: this.userDataResponse?.address ?? '',
          date_of_birth: this.userDataResponse?.date_of_birth.toString().substring(0, 10),
          email: this.userDataResponse?.email,
          phone_number: this.userDataResponse?.phone_number
        });
        this.userService.saveUserResponseToLocalStorage(this.userDataResponse);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    })
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

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const date = new Date(control.value);
    const today = new Date();
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }
    if (date >= today) {
      return { futureDate: true };
    }
    return null;
  }

  save(): void {
    debugger
    if (!this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        address: this.userProfileForm.get('address')?.value,
        email: this.userProfileForm.get('email')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value
      };

      if (this.token == null) {
        this.router.navigate(['/login']);
        return;
      }

      this.userService.updateUserDetail(this.token, updateUserDTO)
        .subscribe({
          next: (response: any) => {
            this.userService.removeUserFromLocalStorage();
            this.tokenService.removeToken();

            this.showSuccess(response.message);
            setTimeout(() => {
              this.router.navigate(['/admin']).then(() => {
                window.location.reload();
              });
            }, 3000);
            
          },
          error: (error: any) => {
            this.showError(error.error.message);
          }
        });
    }
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
