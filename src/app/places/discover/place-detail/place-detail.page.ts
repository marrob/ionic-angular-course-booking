import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private plasesServcie: PlacesService,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.place = this.plasesServcie.getPlace(paramMap.get('placeId'));
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
    }).then(actionSheetEl=>{
      actionSheetEl.present();
    })
  }
  openBookingModal(mode: 'select' | 'random') {

    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectMode: mode}
      })
      .then(modalElement => {
        modalElement.present();
        return modalElement.onDidDismiss();
      }).then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role == 'confirm') {
          console.log('BOOKED!');
        }
      })
  }
}