import { Component, NgModule, OnInit } from '@angular/core';
import { RoleDataResponse } from '../../responses/role/role.data.response';
import { RoleResponse } from '../../responses/role/role.response';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { RoleService } from '../../service/role.service';
import { UserDataResponse } from '../../responses/user/user.data.response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRoleDTO } from '../../dtos/user-role/UserRoleDTO';
import { UserRoleService } from '../../service/userRole.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RippleModule, ButtonModule, ToastModule],
  templateUrl: './team-members.component.html',
  styleUrl: './team-members.component.scss',
  providers: [MessageService]
})
export class TeamMembersComponent implements OnInit {

  roles: RoleDataResponse[] = [];
  roleResponse?: RoleResponse;

  users: UserDataResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  name: string = "";
  phoneNumber: string = "";
  email: string = "";
  roleId: number = 0;
  isAcive: boolean = true;
  visiblePages: number[] = [];

  isDelete: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private roleService: RoleService,
    private userRoleService: UserRoleService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.roleService.getRoles().subscribe({
      next: (response: RoleResponse) => { // Sử dụng kiểu Role[]
        this.roles = response.data;
      },
      error: (error: any) => {
        console.error('Error getting roles:', error);
      }
    });

    this.getAllUsers(this.name, this.phoneNumber, this.email, this.roleId, this.isAcive, this.currentPage, this.itemsPerPage);
  }

  getAllUsers(name: string, phoneNumber: string, email: string, roleId: number, isAcive: boolean, page: number, limit: number) {

    this.userService.getAllUsers(name, phoneNumber, email, roleId, isAcive, page, limit).subscribe({
      next: (response: any) => {
        this.users = response.data.users;
        this.totalPages = response.data.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
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

  hasRole(user: UserDataResponse, roleId: number): boolean {
    let result = user.roles.some(e => e.id === roleId);
    this.isDelete = result;
    return result;
  }

  searchUsers() {
    this.roleService.getRoles().subscribe({
      next: (response: RoleResponse) => { // Sử dụng kiểu Role[]
        this.roles = response.data;
      },
      error: (error: any) => {
        console.error('Error getting roles:', error);
      }
    });
    this.getAllUsers(this.name, this.phoneNumber, this.email, this.roleId, this.isAcive, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.roleService.getRoles().subscribe({
      next: (response: RoleResponse) => { // Sử dụng kiểu Role[]
        this.roles = response.data;
      },
      error: (error: any) => {
        console.error('Error getting roles:', error);
      }
    });

    this.currentPage = page;
    this.getAllUsers(this.name, this.phoneNumber, this.email, this.roleId, this.isAcive, this.currentPage, this.itemsPerPage);
  }

  addUserRole(userId: number, roleId: number) {
    const userRoleDTO: UserRoleDTO = {
      userId: userId,
      roleId: roleId
    };

    debugger

    this.userRoleService.addUserRole(userRoleDTO).subscribe({
      next: (response: any) => {
        this.showSuccess(response.message);
        setTimeout(() => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, 3000);
      },
      complete: () => {
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    })
  }

  deleteUserRole(userId: number, roleId: number) {
    this.userRoleService.deleteUserRole(userId, roleId).subscribe({
      next: (response: any) => {
        this.showSuccess(response.message);
        setTimeout(() => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, 3000);  
      },
      error: (error: any) => {
        this.showError(error.error.message);
      }
    })
  }

  createOrDeleteUserRole(user: UserDataResponse, roleId: number) {
    let isDelete = this.hasRole(user, roleId);
    if (isDelete) {
      this.deleteUserRole(user.id, roleId);
    } else {
      this.addUserRole(user.id, roleId);
    }
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail:  message });
  }

  showInfo() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Message Content' });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
