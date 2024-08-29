import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UserDataResponse } from '../../responses/user/user.data.response';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoginComponent,
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  userDataResponse?: UserDataResponse;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    debugger
    this.userDataResponse = this.userService.getUserResponseFromLocalStorage();
  }

  showAdminComponent(componentName: string): void {
    this.router.navigate(['/admin/login']);
  }

  redirectToLogin() {
    this.router.navigate(['/admin/login']);
  }

  showProfile() {
    this.router.navigate(['/admin/user-profile']);
  }

  changePassword() {
    this.router.navigate(['/admin/change-password']);
  }

  signOut() {
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.userDataResponse = this.userService.getUserResponseFromLocalStorage();
  }

  toggle() {
    document.body.classList.toggle('sidebar-toggled');

    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.classList.toggle('toggled');

      if (sidebar.classList.contains('toggled')) {
        const collapses = sidebar.querySelectorAll('.collapse');
        collapses.forEach((collapse) => {
          (collapse as any).collapse('hide');
        });
      }
    }
  }

}
