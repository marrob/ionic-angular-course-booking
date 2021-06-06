import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { NewOfferPageModule } from './offers/new-offer/new-offer.module';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>( [
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

  addPlace(title:string, description:string, price :number, dateFrom:Date, dateTo:Date){
    const newPlace=new Place(
      Math.random.toString(),
      title, 
      description,
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      price, 
      dateFrom,
      dateTo,
      this.authServcie.userId
    );

    this._places.asObservable().pipe(take(1)).subscribe((places)=>{
      this._places.next(places.concat(newPlace));
    });
    
  }
  get places() {
    return this._places.asObservable();
  }
  getPlace(id:string) {
    return this.places.pipe(
      take(1), 
      map(places=>{
        return {...places.find( p=>p.id === id)};
    }))
    
  }

  constructor(private authServcie:AuthService) { }
}
