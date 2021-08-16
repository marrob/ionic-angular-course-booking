import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { BehaviorSubject, of } from 'rxjs';
import { take,  map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './offers/location.model';
import { Place } from './place.model';


interface PlaceData{
  availableForm: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location:PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(
    private authServcie: AuthService,
    private http:HttpClient
    ) { }

  get places() {
    return this._places.asObservable();
  }
  private _places = new BehaviorSubject<Place[]>([ ]);

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location:PlaceLocation, imageUrl:string) {
    let generatedId:string;
    let newPlace:Place; 
    return this.authServcie.userId.pipe(
      take(1), 
      switchMap(userId=>{
        if(!userId)
          throw new Error('No User');
            newPlace = new Place(
            Math.random.toString(),
            title,
            description,
            imageUrl,
            price,
            dateFrom,
            dateTo,
            userId,
            location
          );   
          return this.http.post<{name:string}>('https://ionic-angular-course-2646a-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json', 
            {...newPlace, id:null})
      }),
      switchMap(resData=>{
        generatedId = resData.name;
        return this.places
      }),
      take(1),
      tap(places=>{
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
    }));
  }

  uploadImage(image: File){
    const uploadData = new FormData();
    uploadData.append('image', image);
    return this.http.post<{imageUrl:string, imagePth:string}>('https://us-central1-ionic-angular-course-2646a.cloudfunctions.net/storeImage', uploadData);
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(`https://ionic-angular-course-2646a-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${id}.json`)
    .pipe(
      map(placeData=>{
        return new Place(
          id, 
          placeData.title,
          placeData.description,
          placeData.imageUrl,
          placeData.price,
          new Date(placeData.availableForm),
          new Date(placeData.availableTo),
          placeData.userId,
          placeData.location)
      })
    )
  }



  fetchPlaces(){
    return this.authServcie.token.pipe(
      switchMap(token=>{
        return this.http.get<{[key:string]:PlaceData}>
          (`https://ionic-angular-course-2646a-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json?auth=${token}`)
      }),  
      map(respData=>{
      const places = [];
      for(const key in respData){
        if(respData.hasOwnProperty(key)){
          places.push(
            new Place(
              key,
              respData[key].title,
              respData[key].description,
              respData[key].imageUrl,
              respData[key].price,
              new Date(respData[key].availableForm),
              new Date(respData[key].availableTo),
              respData[key].userId,
              respData[key].location
          ));
        }
      }
      return places;
      }),
      tap(places=>{
        this._places.next(places);
      })
    )
  }

  UpdateOffer(placeId:string, title:string, description:string) {
   let updatedPlaces:Place[];
   return this.places.pipe(
      take(1),
      switchMap(places=>{
        if(!places || places.length<=0){
          return this.fetchPlaces();
        }
        else {
          return of(places);
        }

      }),
      switchMap(places=>{
        const updatedPlaceIndex = places.findIndex(pl=>pl.id=== placeId);
        updatedPlaces=[...places];
        const oldPlace=updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableForm,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(`https://ionic-angular-course-2646a-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id:null }
        );
      }),
      tap(()=>{
        this._places.next(updatedPlaces);
      })
    );

    return this.places;
  }
}
