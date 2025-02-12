import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HeaderClientComponent } from "../header/header.component";
import { FooterClientComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { OrderDTO } from '../../dtos/order/order.dto';
import { CartService } from '../../service/cart.service';
import { TokenService } from '../../service/token.service';
import { OrderService } from '../../service/order.service';
import { MessageService } from 'primeng/api';
import { VariantService } from '../../service/variant.service';
import { VariantDataResponse } from '../../responses/variant/variant.data.response';
import { ImageDataResponse } from '../../responses/image/image.data.response';
import { environment } from '../../environments/environment';
import { VoucherService } from '../../service/voucher.service';
import { VoucherDataResponse } from '../../responses/voucher/voucher.data.response';
import { ClientService } from '../../service/client.service';
import { UserDataResponse } from '../../responses/user/user.data.response';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../service/user.service';
import { UpdateUserDTO } from '../../dtos/user/update.user.dto';
@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule, RouterLink, ToastModule, ButtonModule, RippleModule, HeaderClientComponent,
    FooterClientComponent, RouterModule],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.scss',
  providers: [MessageService]
})
export class ClientProfileComponent {
  userDataResponse?: UserDataResponse;
  userProfileForm: FormGroup;
  token: string | null = '';
  userResponse?: UserResponse;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: ClientService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: [''],
      phone_number: ['', [Validators.pattern('^[- +()0-9]+$'), Validators.min(10), Validators.max(10)]],
      address: [''],
      email: [''],
      date_of_birth: [''],
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
        let errors = [];
        errors = error.error.data;
        for(let i = 0; i < errors.length; i++) {
          this.showError(errors[i]);
        }
      }
    })
  }

  save(): void {
    if (!this.userProfileForm.valid) {
      let fullNameVal = this.userProfileForm.get('fullname')?.value;
      let addressVal = this.userProfileForm.get('address')?.value;
      let emailVal = this.userProfileForm.get('email')?.value;
      let date_of_birthval = this.userProfileForm.get('date_of_birth')?.value;

      if (!fullNameVal) {
        fullNameVal = this.userDataResponse?.fullname;
      }

      if (!addressVal) {
        addressVal = this.userDataResponse?.address;
      }

      if (!emailVal) {
        emailVal = this.userDataResponse?.email;
      } else if (!this.isValidEmail(emailVal)) {
        this.showError('Định dạng email không hợp lệ')
      }

      if (!date_of_birthval) {
        date_of_birthval = this.userDataResponse?.date_of_birth;
      } else if(!this.isValidDateFormat(date_of_birthval)) {
          this.showError('Ngày tháng năm sinh không hợp lệ')
      }

      const updateUserDTO: UpdateUserDTO = {
        fullname: fullNameVal,
        address: addressVal,
        email: emailVal,
        date_of_birth: date_of_birthval
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
              this.router.navigate(['/profile']).then(() => {
                window.location.reload();
              });
            }, 3000);

          },
          error: (error: any) => {
            this.showError(error.error.message);
            let errors = [];
            errors = error.error.data;
            for(let i = 0; i < errors.length; i++) {
              this.showError(errors[i]);
            }
          }
        });
    }
  }

  isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  isValidDateFormat(control: string) {
    const date = new Date(control);
    const today = new Date();
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }
    if (date >= today) {
      return { futureDate: true };
    }
    return true;
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

}
