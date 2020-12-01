import swal from 'sweetalert2';
import { ProductModel } from './../../../models/product.model';
import { CartProduct } from './../../../models/cart-product.model';
import { ShopsService } from './../../../services/shops.service';
import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  constructor(public shopsService: ShopsService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }
  public units: number;
  public async addProductToCart(units) {
    if (units <= 0) {
      swal.fire({
        icon: 'error',
        title: 'Error occurred',
        text: 'Units must be higher than 0',
        width: "26em"
      })
      this.dialog.closeAll();
      return;
    }
    if (!units) {
      swal.fire({
        icon: 'error',
        title: 'Error occurred',
        text: 'You must enter units value',
        width: "26em"
      })
      this.dialog.closeAll();
      return;
    }
    const cart = await this.shopsService.getCart(sessionStorage.getItem("user"));
    // The data sent from products component
    const productSent: ProductModel = this.data.productSent;
    const addCartProduct = new CartProduct(null, productSent._id, null, null, this.units, +this.units * +productSent.price, cart._id);
    await this.shopsService.addProductToCart(addCartProduct);
    this.dialog.closeAll();
  }
}
