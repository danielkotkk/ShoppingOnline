import swal from 'sweetalert2';
import { ProductModel } from './../../models/product.model';
import { CategoryModel } from './../../models/category.model';
import { ShopsService } from './../../services/shops.service';
import { Component, OnInit, ElementRef } from '@angular/core';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  public products: ProductModel[];
  public categories: CategoryModel[];
  public searchInput: string;
  public showAddForm: boolean = false;
  public productToUpdate: ProductModel;
  public currentCategory;

  constructor(public shopsService: ShopsService, private elemRef: ElementRef) { }

  async ngOnInit() {
    this.categories = await this.shopsService.getCategories();
    this.products = await this.shopsService.getProductsByCategory(this.categories[0]._id);
    const currentCategoryId = this.categories[0]._id.toString();
    // Initialize the current category with the first category
    this.currentCategory = { "categoryId": currentCategoryId, "index": 0 };
    this.shopsService.isUpdatePageOpen.subscribe(async state => {
      // To close the update container "productToUpdate" has to be undefined.
      if (!state)
        this.productToUpdate = undefined;
    })
    this.shopsService.isAddingPageOpen.subscribe(async state => {
      this.showAddForm = state;
    })
  }

  async showProducts(categoryId, index) {
    // Moving the bar slider depends on the category
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
    this.currentCategory = { "categoryId": categoryId, "index": index }; // Current category to make sure the admin gets the last category he was before the search
    this.products = await this.shopsService.getProductsByCategory(categoryId);
  }

  async showSearchResults(event) {
    // Turning off slider bar and categories light when searching
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

  updateProduct(product) {
    this.productToUpdate = product;
    this.shopsService.emitConfig(product);
    this.showAddForm = undefined;
  }

  // Example of cart is not changeable.
  cartClickedNotification() {
    swal.fire({
      icon: 'error',
      title: 'The cart is an example of customer cart',
      text: 'You can not change cart example data',
      width: "26em"
    }
    )
  }
}
