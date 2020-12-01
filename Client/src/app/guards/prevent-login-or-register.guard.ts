import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreventLoginOrRegisterGuard implements CanActivate {
  constructor(private router: Router) { }
  async canActivate() {
    const isLoggedIn = sessionStorage.getItem("user") || sessionStorage.getItem("token");
    const isAdmin = sessionStorage.getItem("token2");
    if (isAdmin) {
      this.router.navigateByUrl("/admin-page")
      return false;
    } else if (isLoggedIn) {
      this.router.navigateByUrl('/products');
      return false;
    }
    return true;
  }

}
