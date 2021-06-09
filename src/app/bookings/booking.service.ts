import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {

  constructor(private autService:AuthService){

  }

  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId:string,
    placeTitle:string,
    placeImage:string,
    firstName:string,
    lastName:string,
    guestNumber:number,
    dateFrom:Date,
    dateTo:Date){
      const newBooking = new Booking(
        Math.random().toString(),
        placeId,
        this.autService.userId,
        placeTitle,
        placeImage,
        firstName,
        lastName,
        guestNumber,
        dateFrom,
        dateTo 
      );

    return this.bookings.pipe(
      take(1),
      delay(2000),
      tap(bookings => {
        setTimeout(() => {
          this._bookings.next(bookings.concat(newBooking));
        }, 3000);
      })
    );
  }

  cancelBooking(){

  }

}