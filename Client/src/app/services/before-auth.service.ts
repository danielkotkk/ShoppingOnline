import { Injectable } from '@angular/core';
import axios from "axios";
@Injectable({
  providedIn: 'root'
})
export class BeforeAuthService {

  constructor() { }
  public async getProductsLength() {
    const productsLengthResponse = await axios.get<number>("http://localhost:3000/api/before-auth/products");
    return productsLengthResponse.data;
  }
  public async getOrdersLength() {
    const ordersResponse = await axios.get<number>("http://localhost:3000/api/before-auth/orders");
    return ordersResponse.data;
  }

}
