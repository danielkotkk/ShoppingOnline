import { Subject, BehaviorSubject } from 'rxjs';
import { UserModel } from '../models/user.model';
import { Injectable } from '@angular/core';
import axios from "axios";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userLoggedIn = new BehaviorSubject<boolean>(false);
  constructor() { }

  public emitUserLogged(userLogged: boolean) {
    this.userLoggedIn.next(userLogged);
  }
  public async login(user): Promise<UserModel> {
    try {
      const loginResponse = await axios.post("http://localhost:3000/api/auth/login", user);
      return loginResponse.data;
    }
    catch (err) {
      return err.message;
    }
  }
  public async register(user): Promise<UserModel> {
    try {
      const registerResponse = await axios.post("http://localhost:3000/api/auth/register", user);
      return registerResponse.data;
    }
    catch (err) {
      return err.message;
    }
  }
  public async getUserAddress(): Promise<UserModel> {
    try {
      const addressResponse = await axios.get("http://localhost:3000/api/auth/get-user-address/" + sessionStorage.getItem("user"));
      return addressResponse.data;

    }
    catch (err) {
      return err.message;
    }
  }
  public async getFirstName() {
    try {
      const userId = sessionStorage.getItem("user");
      if (userId) {
        const firstNameResponse = await axios.get("http://localhost:3000/api/auth/get-firstname/" + userId);
        return firstNameResponse.data;
      }
    }
    catch (err) {
      return err.message;
    }
  }
  public async isLoggedIn() {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return false;
      }
      const isLoggedInResponse = await axios.post("http://localhost:3000/api/auth/is-logged-in/");
      const responseStatus = isLoggedInResponse.status;
      if (responseStatus === 200)
        return true;
    }
    catch (err) {
      if (err.response.status === 401)
        return false;
    }
  }
  public async validateIdentityNumber(identityNumber) {
    try {
      const identityResponse = await axios.post("http://localhost:3000/api/auth/check-identity-existence/" + identityNumber);
      const identity = identityResponse.data;
      console.log(identity);
      return identity;
    }
    catch (err) {
      alert(err.message);
    }
  }
  public async isAdmin() {
    try {
      const adminToken = sessionStorage.getItem("token2");
      if (!adminToken) {
        return false;
      }
      const isAdminResponse = await axios.post("http://localhost:3000/api/auth/is-admin/", "", {
        headers: {
          authorization: "Bearer " + adminToken
        }
      })
      const responseStatus = isAdminResponse.status;
      if (responseStatus === 200)
        return true;
    }
    catch (err) {
      if (err.response.status === 401)
        return false;
    }
  }
}


