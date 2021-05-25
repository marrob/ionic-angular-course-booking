import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { NgForm, } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  authForm = {
    title: 'adfad',
    description: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService, 
    private router:Router) {
  }

  isLogin: boolean;

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    console.log("email-password", email, password);


    if (this.isLogin) {

    }
    else {
      this.authService.singup(this.authForm.email, this.authForm.password);
    }
  }

  onLogin(){
    this.authService.login();
    this.router.navigateByUrl('/places/tabs/discover');
  }

}
