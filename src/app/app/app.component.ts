import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../admin/login/login.component';
import { AdminAppRoutes } from '../admin/app.routes';
import { TeamMembersComponent } from '../admin/team-members/team-members.component';
import { UserComponent } from '../admin/user/user.component';
import { HomeComponent } from '../admin/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HomeComponent, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'shop-app-angular';
}


