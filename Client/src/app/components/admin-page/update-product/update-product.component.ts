import swal from 'sweetalert2';
import { ShopsService } from './../../../services/shops.service';
import { CategoryModel } from './../../../models/category.model';
import { ProductModel } from './../../../models/product.model';
import { Component, OnInit, Input } from '@angular/core';
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

  constructor(private shopsService: ShopsService) { }
  @Input() product: ProductModel;
  @Input() categories: CategoryModel[];
  public productName: string;
  public chosenCategory;
  public price: number;
  public addedPicture: string;
  public picture: any;

  async ngOnInit() {
    this.productName = this.product.productName;
    const category = await this.shopsService.getCategoryById(this.product.categoryId);
    this.chosenCategory = category.categoryName;
    this.price = this.product.price;

    this.shopsService.configObservable.subscribe(async product => {
      this.product = product;
      this.productName = this.product.productName;
      const category = await this.shopsService.getCategoryById(this.product.categoryId);
      this.chosenCategory = category.categoryName;
      this.price = this.product.price;
    })


  }
  onFileSelected(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const extension = file.name.substr(file.name.lastIndexOf("."));
      const lowerCaseExtension = extension.toLowerCase();
      // Validating if extension is legal
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
      // Changing file name to uuid
      Object.defineProperties(file, {
        name: {
          writable: true,
          value: uuidv4() + extension
        }
      })
      this.picture = file;
    }
  }

  public close() {
    this.shopsService.updatePageState(false);
  }

  async updateProduct() {
    const data = new FormData();
    data.append("picture", this.picture);
    console.log(this.picture);
    // Gets the id of the category
    const categoryId = this.categories.find(category => category.categoryName === this.chosenCategory)._id.toString();
    if (this.productName !== this.product.productName ||
      categoryId !== this.product.categoryId ||
      this.price !== this.product.price || this.picture.name !== this.product.picturePath) {
      // Make sure productName is not empty and price defined.
      if (this.productName.trim() !== "" && this.price) {
        if (this.picture && this.picture.name !== this.product.picturePath) {
          const product = new ProductModel(this.product._id, this.productName, categoryId, this.price, this.picture.name);
          await this.shopsService.updateProduct(product);
          // Add the picture to server side
          await axios.post("http://localhost:3000/api/image/upload-image/" + this.picture.name, data);
          // Delete the picture that was before
          await axios.delete("http://localhost:3000/api/image/delete-image/" + this.product.picturePath);
        }
        else {
          const product = new ProductModel(this.product._id, this.productName, categoryId, this.price, this.product.picturePath);
          await this.shopsService.updateProduct(product);
        }
        swal.fire({
          icon: 'success',
          title: 'Product updated successfully',
          width: "26em"
        })
        this.shopsService.updatePageState(false);
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
    else {
      swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Please change values to update',
        width: "26em"
      })
    }
  }
}
