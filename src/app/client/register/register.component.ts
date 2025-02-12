
import { HeaderClientComponent } from "../header/header.component";
import { FooterClientComponent } from "../footer/footer.component";
import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ClientService } from "../../service/client.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, RouterModule,
  RouterLink, ToastModule, RippleModule, ButtonModule, FooterClientComponent, HeaderClientComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService]
})
export class RegisterComponent {


  @ViewChild('registerForm') registerForm!: NgForm;
  phoneNumberRegister: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  emailRegister: string;
  dateOfBirth: Date;


  constructor(
    private userService: ClientService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.phoneNumberRegister = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.emailRegister = '';
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }

  register() {
    debugger
    const registerDTO: RegisterDTO = {
      "fullname": this.fullName,
      "phone_number": this.phoneNumberRegister,
      "address": this.address,
      "password": this.password,
      "email": this.emailRegister,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "role_id": 3
    }

    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        this.showSuccess(response.message);
        setTimeout(() => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, 3000);
      },
      complete: () => { },
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
