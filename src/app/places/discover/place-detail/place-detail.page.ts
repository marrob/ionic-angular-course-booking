import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placesService: PlacesService,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loaderCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
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
}