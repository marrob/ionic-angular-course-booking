import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { NgForm, } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLaoding = false;

  authForm = {
    title: 'adfad',
    description: '',
    email: '',
    password: ''
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController) {
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
    if (this.isLogin) {}
    else {this.authService.singup(this.authForm.email, this.authForm.password); }
  }

  onLogin() { 
    this.isLaoding = true;
    this.authService.login();
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();   
        setTimeout(() => {
          this.isLaoding = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, 1500);
      });



  }

}
