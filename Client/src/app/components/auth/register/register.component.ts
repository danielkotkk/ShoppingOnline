import { AuthService } from './../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public confirmPassword: string;
  public isLinear = true;
  public identityForm: FormGroup;
  public matcher = new PasswordsStateMatcher();
  public addressForm: FormGroup;
  public user = new UserModel();
  public isIdentityExist: boolean = false;
  public cities = ["Jerusalem", "Tel Aviv", "Haifa", "Rishon Le Ziyon", "Petah Tikva", "Ashdod", "Netanya", "Beer Sheva", "Bnei Brak", "Holon"];
  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.user.password = "";
    this.confirmPassword = "";
    // First step
    this.identityForm = this.formBuilder.group({
      identity: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });

    // Second step
    this.addressForm = this.formBuilder.group({
      city: ['', [Validators.required]],
      street: ['', [Validators.required, Validators.minLength(2), this.noWhitespaceValidator]],
      firstName: ['', [Validators.required, Validators.minLength(2), this.noWhitespaceValidator]],
      lastName: ['', [Validators.required, Validators.minLength(2), this.noWhitespaceValidator]],
    });
  }

  checkPasswords(group: FormGroup) {
    let password = group.controls.password.value;
    let confirmPassword = group.controls.confirmPassword.value;
    return password === confirmPassword ? null : { notSame: true };
  }
  // Validates if there is white space
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length <= 1;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  // Validates identity existence
  public async checkIdentityExistence() {
    if (this.user.identity && this.user.identity.length === 9) {
      const foundUser = await this.authService.validateIdentityNumber(this.user.identity);
      if (foundUser) {
        this.identityForm.controls.identity.setErrors({ identityExists: true });
        this.isIdentityExist = true;
      }
      else
        this.isIdentityExist = false;
    }
    else
      this.isIdentityExist = false;
  }

  validateConfirmPassword() {
    // If clicked on next button but the confirm password is empty, marking it as pending will add invalid classes to the form control to prevent the next button.
    if (this.confirmPassword === "" || !this.confirmPassword) {
      this.identityForm.controls.confirmPassword.markAsPending();
    }
  }
  public async register() {
    try {
      const loggingUser = await this.authService.register(this.user);
      sessionStorage.setItem("token", loggingUser.token);
      sessionStorage.setItem("user", loggingUser._id.toString());
      this.authService.emitUserLogged(true);
      this.router.navigateByUrl("/");
    }
    catch (err) {
      alert(err.message);
    }

  }
  ngOnInit(): void { }

}

export class PasswordsStateMatcher implements ErrorStateMatcher {
  // Checking if there are error at passwords matching.
  isErrorState(control: FormControl | null): boolean {
    return control.parent.errors && control.parent.errors['notSame'] || control.parent.status === "PENDING";
  }
}
