import swal from 'sweetalert2';
import { ShopsService } from './../../../services/shops.service';
import { BeforeAuthService } from './../../../services/before-auth.service';
import { AuthService } from './../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
// Login page is also main page of the website
export class LoginComponent implements OnInit {

  constructor(private shopsService: ShopsService, private beforeAuthService: BeforeAuthService, private authService: AuthService, private router: Router) { }
  public user = new UserModel();
  public ordersAmount: number;
  public productsAmount: number;
  public isLoggedIn: boolean;
  public cartDateCreated: String;
  public lastOrderDate: string;
  public firstName: string;
  public cartTotalPrice: number = 0;
  public async login() {
    try {
      let errors = ""; // Initialize the errors variable 
      if (!this.user.email || this.user.email.trim() === "") {
        errors = "Username "; // Adding username as error
      }
      if (!this.user.password || this.user.password.trim() === "") {
        if (errors !== "")
          errors += "and password can not be empty."; // Adding password as error if there is a username error already
        else
          errors = "Password can not be empty." // Adding password as error if there are no errors before
      }
      if (errors !== "") {
        // Sweet alert 2 library 
        swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: errors,
          width: "26em"
        }
        )
        return;
      }
      const loggingUser = await this.authService.login(this.user);
      // If user found
      if (loggingUser._id) {
        sessionStorage.setItem("token", loggingUser.token);
        sessionStorage.setItem("user", loggingUser._id.toString());
        if (loggingUser.token2) {
          // Token2 sent from server side when the user is admin
          sessionStorage.setItem("token2", loggingUser.token2);
          this.router.navigateByUrl("/admin-page");
          return;
        }
        this.isLoggedIn = true;
        // Sending to the subject of isLoggedIn the value 'true'
        this.authService.emitUserLogged(true);
        this.firstName = await this.authService.getFirstName();
        swal.fire({
          icon: 'success',
          title: 'Welcome back ' + this.firstName,
          showConfirmButton: false,
          timer: 1500
        })
        const cart = await this.shopsService.getCart(sessionStorage.getItem("user"));
        if (cart) {
          const fixedFormatDate = this.fixDateFormat(cart.dateCreated);
          this.cartDateCreated = fixedFormatDate;
          const cartProducts = await this.shopsService.getCartItems(cart._id);
          cartProducts.forEach(cartProduct => this.cartTotalPrice += cartProduct.calculatedPrice);
          // if there is no cart
        } else {
          const lastOrder = await this.shopsService.getLastOrderDate();
          if (lastOrder) {
            this.lastOrderDate = this.fixDateFormat(lastOrder);
            return;
            // if there is no cart and also no orders at the past
          }
        }
      }
      else {
        swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Incorrect username or password ',
          width: "26em"
        })
      }

    }
    catch (err) {
      alert(err);
    }
  }

  public moveToProductsPage() {
    // Navigates to the products page
    this.router.navigateByUrl("/products");
  }
  // Changing format to DD/MM/YYYY
  public fixDateFormat(date) {
    const splitDate = date.toString().split("T");
    const splitDayMonthYear = splitDate[0].split("-");
    return `${splitDayMonthYear[2]}/${splitDayMonthYear[1]}/${splitDayMonthYear[0]}`
  }

  async ngOnInit() {
    // Listen to user logged in value
    this.authService.userLoggedIn.subscribe(async data => {
      this.isLoggedIn = data;
    })
    await this.authService.isLoggedIn() ? this.authService.emitUserLogged(true) : this.authService.emitUserLogged(false);
    if (this.authService.userLoggedIn.value) {
      const cart = await this.shopsService.getCart(sessionStorage.getItem("user"));
      if (cart) {
        const fixedFormatDate = this.fixDateFormat(cart.dateCreated);
        this.cartDateCreated = fixedFormatDate;
        const cartProducts = await this.shopsService.getCartItems(cart._id);
        cartProducts.forEach(cartProduct => this.cartTotalPrice += cartProduct.calculatedPrice);
        // if there is no cart
      } else {
        const lastOrder = await this.shopsService.getLastOrderDate();
        if (lastOrder) {
          this.lastOrderDate = this.fixDateFormat(lastOrder);
          return;
          // if there is no cart and also no orders at the past
        } else {
          this.firstName = await this.authService.getFirstName();
        }
      }
    }
    this.ordersAmount = await this.beforeAuthService.getOrdersLength();
    this.productsAmount = await this.beforeAuthService.getProductsLength();
  }

}
