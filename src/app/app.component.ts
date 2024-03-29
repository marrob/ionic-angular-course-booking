import { Route } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private sub :Subscription;
  private previousAuthState = false;

 
  constructor(
    private authService:AuthService,
    private router:Router
    ) {}


    ngOnInit(){
     this.sub = this.authService.userIsAuthenticated.subscribe(isAuth=>{
       if(!isAuth && this.previousAuthState !== isAuth)
          this.router.navigateByUrl('/auth');
        else
          this.previousAuthState = isAuth;
      })
    }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    if(!this.sub){
      this.sub.unsubscribe;
    }
  }
}
