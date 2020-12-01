import { OrderModel } from './../models/order.model';
import { CartProduct } from './../models/cart-product.model';
import { Cart } from './../models/cart.model';
import { CategoryModel } from './../models/category.model';
import { ProductModel } from './../models/product.model';
import { Injectable } from '@angular/core';
import axios from "axios";
import socketIO from 'socket.io-client';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {
  cartProducts: CartProduct[];
  cartId: string;
  public socket: socketIO = socketIO("http://localhost:3000");
  constructor() { }
  public configObservable = new Subject<ProductModel>();
  public isUpdatePageOpen = new BehaviorSubject<boolean>(false);
  public isAddingPageOpen = new BehaviorSubject<boolean>(false);

  public addPageState(isAdded) {
    this.isAddingPageOpen.next(isAdded);
  }
  public updatePageState(isUpdated) {
    this.isUpdatePageOpen.next(isUpdated);
  }
  public emitConfig(product) {
    this.configObservable.next(product);
  }
  // Depends on category returns the text
  public pricePerUnitOrKg(categoryId, categories) {
    switch (categoryId) {
      case categories[0]._id: return "per unit"
      case categories[1]._id: return "per kg"
      case categories[2]._id: return "per kg"
      case categories[3]._id: return "per unit"
    }
  }

  public async addProduct(product: ProductModel): Promise<ProductModel> {
    const productResponse = await axios.post<ProductModel>("http://localhost:3000/api/shopping-online", product);
    return productResponse.data;
  }

  public async updateProduct(productToUpdate: ProductModel): Promise<ProductModel> {
    const productResponse = await axios.patch<ProductModel>("http://localhost:3000/api/shopping-online", productToUpdate);
    return productResponse.data;
  }

  public async getCategories(): Promise<CategoryModel[]> {
    axios.interceptors.request.use(function (config) {
      const token = sessionStorage.getItem("token");
      config.headers.Authorization = token;
      return config;
    });
    const categoriesResponse = await axios.get<CategoryModel[]>("http://localhost:3000/api/shopping-online/get-categories");
    return categoriesResponse.data;
  }
  public async getCategoryById(categoryId): Promise<CategoryModel> {
    const categoryResponse = await axios.get<CategoryModel>("http://localhost:3000/api/shopping-online/get-category-by-id/" + categoryId);
    return categoryResponse.data;
  }

  public async getProductsByCategory(categoryId): Promise<ProductModel[]> {
    const productsResponse = await axios.get<ProductModel[]>("http://localhost:3000/api/shopping-online/products-by-category/" + categoryId);
    return productsResponse.data;
  }
  public async getProductsByName(searchInput): Promise<ProductModel[]> {
    const productsResponse = await axios.get<ProductModel[]>("http://localhost:3000/api/shopping-online/products-by-name/" + searchInput);
    return productsResponse.data;
  }
  public async getCart(userId): Promise<Cart> {
    try {
      const cartResponse = await axios.get<Cart>("http://localhost:3000/api/shopping-online/cart/" + userId);
      this.cartId = cartResponse.data._id;
      return cartResponse.data;
    }
    catch {
      return null;
    }
  }
  public async getCartItems(cartId): Promise<CartProduct[]> {
    const productsResponse = await axios.get<CartProduct[]>("http://localhost:3000/api/shopping-online/cart-products/" + cartId);
    this.cartProducts = productsResponse.data;
    return productsResponse.data;
  }

  public async deleteProductFromCart(cartProductId) {
    await axios.delete<CartProduct>("http://localhost:3000/api/shopping-online/cart-products/" + cartProductId);
  }
  public async deleteAllCartProducts(cartId) {
    await axios.delete<CartProduct>("http://localhost:3000/api/shopping-online/delete-all-cart-products/" + cartId);
  }

  public async addCart(userId): Promise<Cart> {
    const productsResponse = await axios.post<Cart>("http://localhost:3000/api/shopping-online/cart/", userId);
    return productsResponse.data;
  }

  public async deleteCart(userId): Promise<Cart> {
    const productsResponse = await axios.delete<Cart>("http://localhost:3000/api/shopping-online/cart/" + userId);
    return productsResponse.data;
  }

  public async addProductToCart(product) {
    const productResponse = await axios.post<CartProduct>("http://localhost:3000/api/shopping-online/cart-products", product);
    return productResponse.data;
  }
  public async updateUnits(cartProduct: CartProduct) {
    const productPriceResponse = await axios.get("http://localhost:3000/api/shopping-online/product-price/" + cartProduct.productId);
    const productPrice = productPriceResponse.data;
    cartProduct.calculatedPrice = cartProduct.units * productPrice;
    const cartProductResponse = await axios.patch<CartProduct>("http://localhost:3000/api/shopping-online/cart-products", cartProduct);
    return cartProductResponse.data;
  }
  public async addOrder(order) {
    const orderResponse = await axios.post<OrderModel>("http://localhost:3000/api/shopping-online/order", order);
    return orderResponse.data;
  }
  public async getLastOrderDate() {
    const userId = sessionStorage.getItem("user");
    const lastOrderResponse = await axios.get<number>("http://localhost:3000/api/shopping-online/orders/last-order-date/" + userId);
    return lastOrderResponse.data;
  }
}
