import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { BehaviorSubject } from 'rxjs';
import { take,  map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';


interface PlaceData{
  availableForm: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(
    private authServcie: AuthService,
    private http:HttpClient
    ) { }

  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhatten Masion',
      'In the heart of the New York City',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.9,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romintc place in Paris!',
      'https://myldrwithafrenchman.files.wordpress.com/2017/01/eiffel_tower_in_paris__france_073036_.jpg?w=1118',
      189.9,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip',
      'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
      99.9,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
  ]);

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId:string;
    const newPlace = new Place(
      Math.random.toString(),
      title,
      description,
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      price,
      dateFrom,
      dateTo,
      this.authServcie.userId
    );

    return this.http
    .post<{name:string}>('https://ionic-angular-course-2646a-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json', 
    {...newPlace, id:null}) //ez nullazza is az id küldését
    .pipe(
      switchMap(resData=>{
        generatedId = resData.name;
        return this.places
      }),
      take(1),
      tap(places=>{
        newPlace.id=generatedId;
        this._places.next(places.concat(newPlace));
    }));
  }
  get places() {
    return this._places.asObservable();
  }
  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      
      map(places => {
        return { ...places.find(p => p.id === id) };
      }))

  }



  fetchPlaces(){
    return this.http.get<{[key:string]:PlaceData}>('https://ionic-angular-course-2646a-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json')
    .pipe(tap(respData=>{
      console.log(respData);
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
              respData[key].userId
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

  UpdateOffer(
    placeId:string, 
    title:string,
    description:string) {

      return this.places.pipe(
      
      take(1), 
      delay(1000),
      tap(places => {
        const updatedPlaceIndex = places.findIndex(pl=>pl.id=== placeId);
        const updatePlaces=[...places];
        const oldPlace=updatePlaces[updatedPlaceIndex];
        updatePlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableForm,
          oldPlace.availableTo,
          oldPlace.userId
        );
          this._places.next(updatePlaces);
      }));
    }

  
}
