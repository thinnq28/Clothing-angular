import { PreloadAllModules, Routes } from '@angular/router';
import { Component, NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './admin/home/home.component';
import { LoginComponent } from './admin/login/login.component';
import { UserProfileComponent } from './admin/user-profile/user-profile.component';
import { AdminGuardFn } from './guards/admin.guard';
import { AppComponent } from './app/app.component';
import { ChangePasswordComponent } from './admin/change-password/change-password.component';
import { UserComponent } from './admin/user/user.component';
import { TeamMembersComponent } from './admin/team-members/team-members.component';
import { AdminAppRoutes } from './admin/app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthGuardFn } from './guards/auth.guard';
import { ProductClientComponent } from './client/product/product.component';
import { SearchComponent } from './client/search/search.component';
import { LoginClientComponent } from './client/login/login.component';
import { RegisterComponent } from './client/register/register.component';
import { OrderComponent } from './client/order/order.component';
import { ProductDetailComponent } from './client/product-detail/product-detail.component';

export const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/app.routes').then(m => m.AdminAppRoutes), canActivate: [AdminGuardFn] },
  { path: '', loadChildren: () => import('./client/app.routes').then(m => m.ClientAppRoutes) },
  { path: 'commodity/:name', component: ProductClientComponent },
  { path: 'search/:name', component: SearchComponent },
  { path: 'admin/login', component: LoginComponent},
  { path: 'login', component: LoginClientComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'order', component: OrderComponent},
  { path: 'product-detail/:id', component: ProductDetailComponent},
//   { path: 'register', component: RegisterComponent },
//   { path: 'products/:id', component: DetailProductComponent },
//   { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
//   { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
//   //canActivate:[AuthGuardFn] bảo vệ đường dẫn, nếu chưa đăng nhập thì không vào được
//   { path: 'orders/:id', component: OrderDetailComponent },
//   //admin
//   { path: 'admin', component: AdminComponent,canActivate: [AdminGuardFn] },
//   { path: 'admin/orders', component: OrderAdminComponeqnt,canActivate: [AdminGuardFn] },
//   { path: 'admin/orders/:id', component: DetailOrderAdminComponent,canActivate: [AdminGuardFn] },
//   { path: 'admin/products', component: ProductAdminComponent,canActivate: [AdminGuardFn] },
//   { path: 'admin/categories', component: CategoryAdminComponent,canActivate: [AdminGuardFn] },

];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes,  { onSameUrlNavigation: 'reload' }), CommonModule, ],
  exports: [RouterModule]
})
export class AppRoutes { }
