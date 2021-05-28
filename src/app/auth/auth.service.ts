import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EmailValidator } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private _userIsAuthenticated:boolean = false;
  private _userId:string ='';
  
  get userIsAuthenticated(){
    return this._userIsAuthenticated;
  }

    constructor(private http:HttpClient) { 
  
  
    }
  
    get userId(){
      return this._userId;
    }
    //https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
    singup(eamil:string, password:string){
      return this.http.post(`
        https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
          environment.firebaseAPIKey
        }`,{email:EmailValidator, password:password, returnSecureToken:true}
        );
    }
  
    login(){
      this._userIsAuthenticated=true;
    }
    
    logout(){
      this._userIsAuthenticated=false;
    }
}
