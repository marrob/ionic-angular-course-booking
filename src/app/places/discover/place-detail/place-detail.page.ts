import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placesService: PlacesService,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loaderCtrl: LoadingController,
    private authService:AuthService
  ) { }

  ngOnInit() {
    
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.isLoading = true;
      let fetchedUserId :string;
      this.authService.userId.pipe(
        take(1),
        switchMap(userId=>{
          if(!userId){
          throw new Error('no User Found');
          }
          fetchedUserId  = userId;
          return this.placesService.getPlace(paramMap.get('placeId'));
        }))
        .subscribe(place => {
          this.place = place;
          this.isBookable = place.userId !== fetchedUserId;
          this.isLoading = false;
        });
      
    });
  }


  onBookPlace() {
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [{
        text: 'Select Date',
        handler: () => {
          this.openBookingModal('select');
        }
      },
      {
        text: 'Random Date',
        handler: () => {
          this.openBookingModal('random');
        }
      },
      {
        text: 'Cancel',
        role: 'destructive'
      }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    })
  }
  openBookingModal(mode: 'select' | 'random') {


    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectMode: mode }
      })
      .then(modalElement => {
        modalElement.present();
        return modalElement.onDidDismiss();
      }).then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role == 'confirm') {
          this.loaderCtrl.create({
            message: 'Booking place...'
          }).then(loadingEl => {
            loadingEl.present();
            const data = resultData.data.bookingData;
            this.bookingService.addBooking(
              this.place.id,
              this.place.title,
              this.place.imageUrl,
              data.firstName,
              data.lastName,
              data.guestNumber,
              data.startDate,
              data.endDate).subscribe(() => loadingEl.dismiss());
          });
        }
      })
  }

  ngOnDestroy() {
    if (this.placeSub)
      this.placeSub.unsubscribe();
  }

  onShowFullMap(){
    this.modalCtrl.create({
     component:MapModalComponent,
     componentProps:{
        center: {
          lat:this.place.location.lat, 
          lng:this.place.location.lng},
        selectable:false,
        closeButtonText:'Cancel',
        title:this.place.location.address
      }
    }).then(modalEl=>
      modalEl.present()
    )
  }
}