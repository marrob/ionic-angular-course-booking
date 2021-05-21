import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place(
      'p1',
      'Manhatten Masion',
      'In the heart of the New York City',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.9
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romintc place in Paris!',
      'https://myldrwithafrenchman.files.wordpress.com/2017/01/eiffel_tower_in_paris__france_073036_.jpg?w=1118',
      189.9
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip',
      'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
      99.9
    ),
  ];

  get places() {
    return [...this._places];
  }

  getPlace(id:string){
    return {...this._places.find( p=>p.id === id)};
  }

  constructor() { }
}
