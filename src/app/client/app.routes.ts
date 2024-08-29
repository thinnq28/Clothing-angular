import { Routes } from '@angular/router';
import { Component, NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeClientComponent } from './home/home.component';
import { ProductClientComponent } from './product/product.component';

export const routes: Routes = [
  { path: '', component: HomeClientComponent, children: [
      
  ] }
//   { path: 'register', component: RegisterComponent },
//   { path: 'products/:id', component: DetailProductComponent },
//   { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
//   { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
//   //canActivate:[AuthGuardFn] bảo vệ đường dẫn, nếu chưa đăng nhập thì không vào được
//   { path: 'orders/:id', component: OrderDetailComponent },
//   //admin
//   { path: 'admin', component: AdminComponent,canActivate: [AdminGuardFn] },
//   { path: 'admin/orders', component: OrderAdminComponent,canActivate: [AdminGuardFn] },
//   { path: 'admin/orders/:id', component: DetailOrderAdminComponent,canActivate: [AdminGuardFn] },
//   { path: 'admin/products', component: ProductAdminComponent,canActivate: [AdminGuardFn] },
//   { path: 'admin/categories', component: CategoryAdminComponent,canActivate: [AdminGuardFn] },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientAppRoutes { }
