import { AddProductComponent } from './components/admin-page/add-product/add-product.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { AboutComponent } from './components/about/about.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { RegisterComponent } from './components/auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ProductsComponent } from './components/products/products.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/products/dialog/dialog.component'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { OrderComponent } from './components/order/order.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HighLightSearchPipe } from './pipes/high-light-search.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HighlightedDatesComponent } from "./components/order/date-picker/date-picker.component"
import { MatNativeDateModule } from '@angular/material/core';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { UpdateProductComponent } from './components/admin-page/update-product/update-product.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ContactComponent } from './components/contact/contact.component'
@NgModule({
  declarations: [
    LayoutComponent,
    AboutComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    DialogComponent,
    OrderComponent,
    HighlightedDatesComponent,
    HighLightSearchPipe,
    AdminPageComponent,
    AddProductComponent,
    UpdateProductComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FlexLayoutModule,
    MatStepperModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [MatDatepickerModule],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
