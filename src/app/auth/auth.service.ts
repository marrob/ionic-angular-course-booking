import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map,tap } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseData{
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
  private _user = new BehaviorSubject<User>(null);
  private _token = new BehaviorSubject<string>(null);

  constructor(private http:HttpClient) { }
  
  get userIsAuthenticated(){

    return this._user.asObservable().pipe(
      map(user=> {
        if(user)
          return !!user.token;
        else
          return false;
      }));
  }

  get userId(){
    return this._user.asObservable().pipe(
      map(user=> {
        if(user)
          return user.id;
        else
          return null;
      }));
  }

    /*
     * https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
     */
    singup(email:string, password:string){ 
      return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
       { email:email, password:password, returnSecureToken:true }
      ).pipe(
          tap(this.setUserData.bind(this))     
      );
    }

    /*
     *https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
     */
    login(email:string, password:string){
     return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      { email:email, password:password})
        .pipe(tap(this.setUserData.bind(this)));
    }
    
    logout(){
      this._user.next(null);
    }

    private setUserData(userData: AuthResponseData ){
      const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000 ));
            this._user.next(new User(userData.localId, userData.email, userData.idToken, expirationTime));
    }
}
