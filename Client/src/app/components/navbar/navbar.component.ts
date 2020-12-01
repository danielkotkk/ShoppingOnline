import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
import axios from 'axios';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public firstName: string;
  constructor(private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    this.authService.userLoggedIn.subscribe(async data => {
      if (data)
        this.firstName = await this.authService.getFirstName();
      else
        this.firstName = undefined;
    })
    this.firstName = await this.authService.getFirstName();
  }
  async navigate() {
    const token2 = sessionStorage.getItem("token2");
    if (token2) {
      const isAdmin = await this.authService.isAdmin();
      if (isAdmin) {
        this.router.navigateByUrl("/admin-page");
        return;
      }
      // if the user has token2 but the the token is illegal for example, made manually the token2.
      this.router.navigateByUrl("/products");
    }
    this.router.navigateByUrl("/products");
  }
  async signOut() {
    await axios.post("http://localhost:3000/api/auth/logout");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("token2")
    // If the user is on the main page and clicks on the sign out button it will redirect him again to the page (reload)
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/']);
  }
}
