import { Component, ViewChild } from '@angular/core';
import { UserResponse } from '../../responses/user/user.response';
import { UserDataResponse } from '../../responses/user/user.data.response';
import { UserService } from '../../service/user.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { HomeComponent } from "../home/home.component";
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, RouterModule,
    RouterLink, HomeComponent, ToastModule, RippleModule, ButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [MessageService]
})
export class UserComponent {
  users: UserDataResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  name: string = "";
  phoneNumber: string = "";
  email: string = "";
  roleId: number = 0;
  isActive: boolean = true;
  visiblePages: number[] = [];
  userDelete: number = 0;
  isCreate: boolean = false;

  @ViewChild('registerForm') registerForm!: NgForm;
  phoneNumberRegister: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  emailRegister: string;
  dateOfBirth: Date;


  constructor(
    private userService: UserService,
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

  ngOnInit(): void {
    debugger
    this.getAllUsers(this.name, this.phoneNumber, this.email, this.roleId, this.isActive, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllUsers(this.name, this.phoneNumber, this.email, this.roleId, this.isActive, this.currentPage, this.itemsPerPage);
  }

  getAllUsers(name: string, phoneNumber: string, email: string, roleId: number, isAcive: boolean, page: number, limit: number) {
    this.userService.getAllUsers(name, phoneNumber, email, roleId, isAcive, page, limit).subscribe({
      next: (response: any) => {
        this.users = response.data.users;
        this.totalPages = response.data.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }

  searchUsers() {
    debugger
    this.getAllUsers(this.name, this.phoneNumber, this.email, this.roleId, this.isActive, this.currentPage, this.itemsPerPage);
  }

  openModal(userDelete: number) {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
      this.userDelete = userDelete;
    }
  }

  deleteUser() {
    this.userService.deleteUser(this.userDelete).subscribe({
      next: (response: any) => {
        this.showSuccess(response.message);
        setTimeout(() => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, 5000);

      },
      complete: () => {
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    });
  }

  closeModal() {
    const modalDiv = document.getElementById('myModal');
    if (modalDiv != null) modalDiv.style.display = 'none';
  }

  openCreateUser() {
    const modalDiv = document.getElementById('modalCreateUser');
    if (modalDiv != null) {
      this.isCreate = true;
      modalDiv.style.display = 'block';
    }
  }

  closeCreateUser() {
    const modalDiv = document.getElementById('modalCreateUser');
    if (modalDiv != null) {
      this.isCreate = false;
      modalDiv.style.display = 'none';
    }
  }

  register() {
    const registerDTO: RegisterDTO = {
      "fullname": this.fullName,
      "phone_number": this.phoneNumberRegister,
      "address": this.address,
      "password": this.password,
      "email": this.emailRegister,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "role_id": 2
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
        for (let i = 0; i < errors.length; i++) {
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
