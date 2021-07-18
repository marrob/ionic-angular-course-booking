import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
/*
interface AuthResponseData{
  kind:string;
  idToke:string;
  email:string;
  refreshToken:string;
  localId:string;
  registered?:boolean;
}
*/
interface AuthResponseData{
  kind:string;
  idToken:string;
  email:string;
  refreshToken:string;
  expiresIn:string;
  localId:string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated:boolean = false;
  private _userId:string = null;
  
  get userIsAuthenticated(){
    return this._userIsAuthenticated;
  }

    constructor(private http:HttpClient) { 
  
  
    }
    /*
      * Ezt mutatja be MAX
      * https://stackoverflow.com/questions/37322747/using-mail-and-password-to-authenticate-via-the-rest-api-firebase
      */
    singupddd(email:string, password:string){ 
      return this.http.post<AuthResponseData>(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebaseAPIKey}`,
        { email:email, password:password, returnSecureToken:true }
      );
    }

    singupV2(email:string, password:string){ 
      return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
       { email:email, password:password, returnSecureToken:true }
      );
    }
  
    get userId(){
      return this._userId;
    }
  
    login(){
      this._userIsAuthenticated=true;
    }
    
    logout(){
      this._userIsAuthenticated=false;
    }
}
