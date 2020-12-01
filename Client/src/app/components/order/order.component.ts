import { Router } from '@angular/router';
import { OrderModel } from './../../models/order.model';
import { AuthService } from './../../services/auth.service';
import { ShopsService } from './../../services/shops.service';
import { CartProduct } from './../../models/cart-product.model';
import { Component, OnInit } from '@angular/core';
import swal from "sweetalert2";
import axios from "axios";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private shopsService: ShopsService, private authService: AuthService, private router: Router) { }
  public cartProducts: CartProduct[];
  public allCitiesNames = ["Jerusalem", "Tel Aviv", "Haifa", "Rishon Le Ziyon", "Petah Tikva", "Ashdod", "Netanya", "Beer Sheva", "Bnei Brak", "Holon"];
  public cartProductsTotalPrice: number = 0;
  public orderDate: Date;
  public chosenCity: string = "";
  public savedCustomerCity: string;
  public dblClicked: boolean = false;
  public creditCard: string = "";
  public street: string = "";
  public searchInput: string;
  public creditCardType = ["VISA", "MasterCard", "American Express", "Diners Club", "Discover", "JCB"];
  public chosenCreditType: string;
  public cartId: string;
  public userId: string = sessionStorage.getItem("user");

  public shippingDate: Date;
  today = new Date();
  redDatesArray = [this.today];
  async fillForm() {
    const customer = await this.authService.getUserAddress();
    this.street = customer.street;
    this.savedCustomerCity = customer.city;
    this.chosenCity = customer.city;
    this.dblClicked = true;
    const indexOfCity = this.allCitiesNames.findIndex(city => city.trim() === this.savedCustomerCity.toString());
    this.allCitiesNames.splice(indexOfCity, 1); // To prevent from showing same cities at the select
  }
  // The date sent
  receiveDate($event) {
    this.shippingDate = $event
  }
  async confirmOrder() {
    const date = new Date();
    if (date > this.shippingDate) {
      swal.fire({
        icon: 'error',
        title: 'Shipping date already passed',
        text: 'Please choose date from tomorrow and so on',
        width: "26em"
      }
      )
      return;
    }
    let errors = "";
    // Adding to variable 'errors' the input that is missing
    if (this.chosenCity.trim() === "") errors += "city, "
    if (this.street.trim() === "") errors += "street, "
    if (!this.shippingDate) errors += "shipping date, "
    if (this.creditCard.trim() === "") errors += "credit Card"
    // if comma exists in the end, delete it
    if (errors.trim().slice(-1) === ",")
      errors = errors.trim().slice(0, -1);

    if (errors !== "") {
      swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Please insert value to ' + errors,
        width: "26em"
      })
    }
    // if there are no errors
    else if (this.cartProducts.length > 0) {
      const newOrder = new OrderModel(null, this.userId, this.cartId, this.cartProductsTotalPrice, this.chosenCity, this.street, this.shippingDate, new Date(), this.creditCard)
      await this.shopsService.addOrder(newOrder);
      swal.fire({
        icon: 'success',
        title: 'Order successfully placed!',
        text: 'Do you want to download the receipt?',
        showDenyButton: true,
        confirmButtonText: `Download`,
        denyButtonText: `Finish`,
        width: '26em'
      }).then(async (result) => {
        // After the order, the cart will be deleted.
        await this.shopsService.deleteCart(this.userId);
        this.router.navigateByUrl("/products");
        if (result.isConfirmed) {
          axios({
            url: `http://localhost:3000/api/shopping-online/get-receipt/${this.cartId}`,
            method: 'GET',
            responseType: 'blob',
          }).then((response) => {
            // Creating Blob 
            const url = window.URL.createObjectURL(new Blob([response.data]));
            // Adding anchor tag with download attribute to download the receipt
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'receipt');
            document.body.appendChild(link);
            link.click();
          });
        }
      })
    } else {
      swal.fire({
        icon: 'error',
        title: 'Your cart is empty',
        text: 'Add products to your cart to finish your order!',
        width: "26em"
      })
    }
  }
  async ngOnInit() {
    this.cartId = this.shopsService.cartId ?
      this.shopsService.cartId :
      (await this.shopsService.getCart(this.userId))._id;
    const cart = await this.shopsService.getCart(sessionStorage.getItem("user"))
    this.cartProducts = await this.shopsService.getCartItems(cart._id);

    this.cartProducts.forEach(cartProduct => {
      this.cartProductsTotalPrice += +cartProduct.calculatedPrice;
    })
  }
}
