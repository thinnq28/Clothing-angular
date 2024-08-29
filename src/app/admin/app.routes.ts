import { Routes } from '@angular/router';
import { Component, NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserComponent } from './user/user.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { OptionComponent } from './option/option.component';
import { OptionValueComponent } from './option-value/option-value.component';
import { ProductComponent } from './product/product.component';
import { SupplierComponent } from './supplier/supllier.component';
import { InsertProductComponent } from './product/insert/insert.component';
import { UpdateComponent } from './product/update/update.component';
import { VariantComponent } from './variant/variant.component';
import { InsertVariantComponent } from './variant/insert/insert.component';
import { UpdateVariantComponent } from './variant/update/update.component';
import { PromotionComponent } from './promotion/promotion.component';
import { AddPromotionVariantComponent } from './promotion/add-promotion-variant/add-promotion-variant.component';
import { VoucherComponent } from './voucher/voucher.component';
import { CommodityComponent } from './commodity/commodity.component';
import { AuthGuardFn } from '../guards/auth.guard';
import { AdminGuardFn } from '../guards/admin.guard';
import { OrderComponent } from './order/order.component';
import { UploadExcelVariantComponent } from './variant/purchase-order/purchase-order.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'manage-user', component: UserComponent },
    { path: 'team-members', component: TeamMembersComponent },
    { path: 'options', component: OptionComponent },
    { path: 'options/:id', component: OptionValueComponent },
    { path: 'products', component: ProductComponent, canActivate: [AdminGuardFn]},
    { path: 'suppliers', component: SupplierComponent },
    { path: 'products/create', component: InsertProductComponent },
    { path: 'products/update/:id', component: UpdateComponent },
    { path: 'variants', component: VariantComponent },
    { path: 'variants/create', component: InsertVariantComponent },
    { path: 'variants/update/:id', component: UpdateVariantComponent },
    { path: 'promotions', component: PromotionComponent },
    { path: 'promotions/add-for-variant/:id', component: AddPromotionVariantComponent },
    { path: 'vouchers', component: VoucherComponent },
    { path: 'commodities', component: CommodityComponent },
    { path: 'orders', component: OrderComponent },
    { path: 'variants/import', component: UploadExcelVariantComponent },
    { path: 'purchase-orders', component: PurchaseOrderComponent },
    

  ] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAppRoutes { }
