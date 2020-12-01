import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class PreventUnauthorizedAccess implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  async canActivate() {
    const isLoggedIn = await this.authService.isLoggedIn();
    const userTokenExists = sessionStorage.getItem("user");
    if (isLoggedIn && userTokenExists) {
      return true;
    } else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      this.router.navigate(['/']);
      return false;
    }
  }
}



