import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { NgForm, } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLaoding = false;
  isLogin: boolean = false;

  authForm = {
    title: 'adfad',
    description: '',
    email: '',
    password: ''
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl:AlertController) {
  }
  ngOnInit() {
  }
  
  onSubmit(form: NgForm) {
    console.log(form);

    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
  }

  onSwitchAuthMode(){
    this.isLogin =!this.isLogin;
  }

  authenticate(email:string, password:string) { 
    this.isLaoding = true;
    this.authService.login();
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();   
        this.authService.singupV2(email, password).subscribe(resData=>{
          console.log(resData);       
          this.isLaoding = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, errResp =>{
           this.isLaoding = false;
           loadingEl.dismiss();
           const code = errResp.error.error.message;
           let message ='Could not sign you, please try agian';
           if(code==='EMAIL_EXISTS'){
             message = 'This email address already exists!'
           }
           this.showAlert(message);
        })
      });
  }

  private showAlert(message:string){
    this.alertCtrl
    .create({
      header:'Authetication failed', 
      message:message,
      buttons:['Okay']
      }).then(alertEl=>alertEl.present());
  }

}
