import { Router } from '@angular/router';
import { Cart } from './../../models/cart.model';
import { CartProduct } from '../../models/cart-product.model';
import { CategoryModel } from './../../models/category.model';
import { ProductModel } from './../../models/product.model';
import { ShopsService } from '../../services/shops.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [
    trigger('toggleCartAnimation', [
      state('close', style({
        "opacity": '0',
        "flex": '0',
        "width": '0',
      }),
      ),
      state('makeContainerBigger', style({
        "max-width": "",
        "margin-right": "0"
      })),
      state('makeContainerNormal', style({
        "position": "relative",
        "max-width": "100%",
        "margin-right": "1%"
      })),
      state('open', style({
        "margin-left": "1%",
        "opacity": '1',
        "flex": '1 1 100%',
      })),
      transition('close <=> open', animate(1000)),
      transition('makeContainerBigger <=> makeContainerNormal', animate(1000)),
    ]),
    trigger('moveCartAside', [
      state('close', style({
        "margin-left": '0'
      })),
      state('open', style({
        "margin-left": '1%'
      })),
      transition('close <=> open', animate(1000)),
    ])
  ]
})
export class ProductsComponent implements OnInit {
  isMenuOpen = true;
  public products: ProductModel[];
  public cartProducts: CartProduct[];
  public totalToPay: number = 0;
  public categories: CategoryModel[];
  public isCartAtLeft: boolean = false;
  public currentCategory;

  constructor(public shopsService: ShopsService, private router: Router, private dialog: MatDialog, private elemRef: ElementRef) { }

  public searchInput: string;
  public userId: string = sessionStorage.getItem("user");
  async ngOnInit() {
    this.categories = await this.shopsService.getCategories();
    this.products = await this.shopsService.getProductsByCategory(this.categories[0]._id);
    const currentCategoryId = this.categories[0]._id.toString();
    // Initialize the current category with the first category
    this.currentCategory = { "categoryId": currentCategoryId, "index": 0 };
    const cart = await this.shopsService.getCart(this.userId);
    if (cart) {
      this.cartProducts = await this.shopsService.getCartItems(cart._id);
    }
    else {
      // if there is no cart, create new one
      const newCart = new Cart(null, this.userId, null); // Date will be saved by server side to prevent bugs/hackers
      const addCart = await this.shopsService.addCart(newCart);
      this.cartProducts = await this.shopsService.getCartItems(addCart._id);

    }
    // listen to updates to the cart
    this.shopsService.socket.on("updateCartProducts", data => {
      this.cartProducts = data;
      this.totalToPay = 0;
      this.cartProducts.forEach(cartProduct => this.totalToPay += cartProduct.calculatedPrice);
    })
    this.cartProducts.forEach(cartProduct => this.totalToPay += cartProduct.calculatedPrice);
  }

  // When the animation is over styles
  animationDone(event) {
    const cartContainer = document.getElementsByClassName('cartContainer') as HTMLCollectionOf<HTMLElement>;
    const productsContainer = document.getElementsByClassName('containerBackground') as HTMLCollectionOf<HTMLElement>;
    // When the button to close the cart is clicked
    if (event.toState === "close") {
      cartContainer[0].style.position = "absolute";
      productsContainer[0].style.position = "absolute";
      productsContainer[0].style.left = "0";
      productsContainer[0].style.width = "100%";

    }
  }

  // When the animation starts styles
  animationStarts(event) {
    // When the button to open the button is clicked
    if (event.toState === "open") {
      const cartContainer = document.getElementsByClassName('cartContainer') as HTMLCollectionOf<HTMLElement>;
      const productsContainer = document.getElementsByClassName('containerBackground') as HTMLCollectionOf<HTMLElement>;
      cartContainer[0].style.position = "relative";
      productsContainer[0].style.position = "";
    }
  }

  // Toggle cart
  toggleMenu(): void {
    this.isCartAtLeft = false;
    this.isMenuOpen = !this.isMenuOpen;

  }
  // When the checkout button on the cart is clicked
  checkout() {
    if (this.cartProducts.length > 0)
      this.router.navigateByUrl("/order");
    else {
      swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Your cart is empty, You have nothing to checkout!',
        width: "26em"
      }
      )
    }
  }
  // Deletes all the products that exists at the cart.
  deleteAllCartProducts() {
    if (this.cartProducts.length > 0) {
      swal.fire({
        title: 'Are you sure you want to delete all cart products?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.shopsService.deleteAllCartProducts(this.cartProducts[0].cartId);
          swal.fire({
            icon: 'success',
            title: 'All cart products successfully deleted',
            showConfirmButton: false,
            timer: 1500
          })
          // Reset cart products and total to pay.
          this.cartProducts = undefined;
          this.totalToPay = 0;
        }
      })
    }
    else {
      swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Your cart is empty, You have nothing to delete!',
        width: "26em"
      }
      )
    }

  }

  async showProducts(categoryId, index) {
    // Moves the bar slider depends on the category
    switch (index) {
      case 0: document.getElementById("bar").style.marginLeft = "0";
        break;
      case 1: document.getElementById("bar").style.marginLeft = "25%";
        break;
      case 2: document.getElementById("bar").style.marginLeft = "50%";
        break;
      case 3: document.getElementById("bar").style.marginLeft = "75%";
        break;
    }

    // Returning all the slide default style with their opacity. 
    let inputsWithSlideToggle = this.elemRef.nativeElement.querySelectorAll('.slide-toggle') as HTMLCollectionOf<HTMLElement>;
    if (document.getElementById("bar").style.opacity = "0") {
      document.getElementById("bar").style.opacity = "1";
      for (let i = 0; i < inputsWithSlideToggle.length; i++) {
        const label = inputsWithSlideToggle[i].nextSibling as HTMLInputElement;
        label.style.opacity = "0.2";
      }
    }

    const label = inputsWithSlideToggle[index].nextSibling as HTMLInputElement;
    label.style.opacity = "1";
    this.searchInput = ""; // Remove text from the search input
    // Current category to make sure the customer gets the last category he was before the search
    this.currentCategory = { "categoryId": categoryId, "index": index };
    this.products = await this.shopsService.getProductsByCategory(categoryId);
  }

  // Show the products depends on the search input and apply styles
  async showSearchResults(event) {

    document.getElementById("bar").style.opacity = "0";

    let inputsWithSlideToggle = this.elemRef.nativeElement.querySelectorAll('.slide-toggle') as HTMLCollectionOf<HTMLElement>;
    const label = inputsWithSlideToggle[this.currentCategory.index].nextSibling as HTMLInputElement;
    label.style.opacity = "0.2";

    if (event.target.value === "") {
      document.getElementById("bar").style.opacity = "1";
      label.style.opacity = "1";
      this.products = await this.shopsService.getProductsByCategory(this.currentCategory.categoryId);
      return;
    }
    this.products = await this.shopsService.getProductsByName(event.target.value);
  }
  // Function to push the cart to the left
  pushCartToLeft() {
    if (!this.isMenuOpen) {
      swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'You can not push the cart while the cart is minimized',
        width: "26em"
      })
      return;
    }
    this.isCartAtLeft = !this.isCartAtLeft;
  }

  async deleteFromCart(cartProductId) {
    await this.shopsService.deleteProductFromCart(cartProductId);
  }

  async updateUnits(cartProduct) {
    await this.shopsService.updateUnits(cartProduct);
    this.totalToPay = 0;
    this.cartProducts.forEach(cartProduct => this.totalToPay += cartProduct.calculatedPrice);
  }
  // Open dialog to choose how many units and send the chosen product
  openDialog(product): void {
    this.dialog.open(DialogComponent, {
      width: '250px',
      data: { productSent: product }
    });
  }
}
