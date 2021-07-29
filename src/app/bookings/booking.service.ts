import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';
import { take,  map, tap, delay, switchMap } from 'rxjs/operators';

interface BookingData{
  bookedFrom: string;
  bookedTo: string;
  fristName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}


@Injectable({ providedIn: 'root' })
export class BookingService {

  constructor(
    private autService:AuthService,
    private http:HttpClient){

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
      let generatedId:string;
      let newBooking :Booking;
      return this.autService.userId.pipe(
        take(1), 
        switchMap(userId=>{
        if(!userId){
          throw new Error('No User Id Found');
        }
          newBooking = new Booking(
            Math.random().toString(),
            placeId,
            userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo 
          );
          return this.http
          .post<{name:string}>('https://ionic-angular-course-2646a-default-rtdb.europe-west1.firebasedatabase.app/bookings.json', 
          {...newBooking, id:null}) //ez nullazza is az id küldését
        }),
        switchMap(resData=>{
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap(bookings=>{
          newBooking.id=generatedId;
          this._bookings.next(bookings.concat(newBooking));
      }));
  }

  cancelBooking(bookingId:string){

    return this.http.delete(`https://ionic-angular-course-2646a-default-rtdb.europe-west1.firebasedatabase.app/bookings/${bookingId}.json`)
    .pipe(
      switchMap(()=>{
        return this.bookings;
      }),
      take(1),
      tap(bookings=>{
        this._bookings.next(bookings.filter(b=>b.id!=bookingId));
      }));
  }

  fetchBookings(){

    return this.http.get<{[ key:string]:BookingData}>(`https://ionic-angular-course-2646a-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${
      this.autService.userId
    }"`).pipe(
          map(bookingData=>{
            const bookings=[];
            for(const key in bookingData){
              if(bookingData.hasOwnProperty){
                bookings.push(
                  new Booking(
                    key, 
                    bookingData[key].placeId,
                    bookingData[key].userId,
                    bookingData[key].placeTitle,
                    bookingData[key].placeImage,
                    bookingData[key].fristName,
                    bookingData[key].lastName,
                    bookingData[key].guestNumber,
                    new Date(bookingData[key].bookedFrom),
                    new Date(bookingData[key].bookedTo) ))
              }
            }
            return bookings;
          }),tap(bookings=>{
            this._bookings.next(bookings);
          })
        );
  }

}