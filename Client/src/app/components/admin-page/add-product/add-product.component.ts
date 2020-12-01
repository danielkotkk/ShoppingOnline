import swal from 'sweetalert2';
import { ProductModel } from '../../../models/product.model';
import { ShopsService } from '../../../services/shops.service';
import { Component, Input } from '@angular/core';
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {

  constructor(public shopsService: ShopsService) { }

  addedPicture: string
  public productName: string;
  @Input() categories: [];
  public chosenCategory;
  public price: number;
  public picture: any;
  public productAdd;
  async ngOnInit() {
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const extension = file.name.substr(file.name.lastIndexOf("."));
      const lowerCaseExtension = extension.toLowerCase();
      if (lowerCaseExtension !== ".jpg" && lowerCaseExtension !== ".png" && lowerCaseExtension !== ".jpeg") {
        swal.fire({
          icon: 'error',
          title: 'Format is not allowed',
          text: 'Allowed format is: jpg,jpeg,png',
          width: "26em"
        })
        return;
      }
      this.addedPicture = event.target.files[0].name;
      Object.defineProperties(file, {
        name: {
          writable: true,
          value: uuidv4() + extension
        }
      })
      this.picture = file;
    }
  }




  public async addProduct() {
    const data = new FormData();
    data.append("picture", this.picture);

    // If admin filled all the fields.
    if (this.productName && this.productName.trim() !== "" && this.chosenCategory && this.price && this.picture) {
      const product = new ProductModel(null, this.productName, this.chosenCategory._id, this.price, this.picture.name);
      await this.shopsService.addProduct(product);
      swal.fire({
        icon: 'success',
        title: 'Product added successfully',
        width: "26em"
      })
      await axios.post("http://localhost:3000/api/image/upload-image/" + this.picture.name, data);
      // To let the admin page know that the "add product container" is done.
      this.shopsService.addPageState(false);
    }
    else {
      swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Please make sure all parameters are filled',
        width: "26em"
      })
    }
  }
  // To let the admin page know that the "add product container" is done.
  public close() {
    this.shopsService.addPageState(false);
  }
}
