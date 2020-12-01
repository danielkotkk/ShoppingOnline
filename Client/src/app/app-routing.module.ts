import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { PreventLoginOrRegisterGuard } from './guards/prevent-login-or-register.guard';
import { IsAdminGuard } from './guards/is-admin.guard';
import { PreventUnauthorizedAccess } from './guards/prevent-unauthorized-access.guard';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProductsComponent } from './components/products/products.component';


const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "register", component: RegisterComponent, canActivate: [PreventLoginOrRegisterGuard] },
  { path: "products", component: ProductsComponent, canActivate: [PreventUnauthorizedAccess] },
  { path: "order", component: OrderComponent, canActivate: [PreventUnauthorizedAccess] },
  { path: "contact", component: ContactComponent },
  { path: "about", component: AboutComponent },
  { path: "admin-page", component: AdminPageComponent, canActivate: [IsAdminGuard] },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
