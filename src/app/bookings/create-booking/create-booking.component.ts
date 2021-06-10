import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler/src/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from '../../places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectMode: 'select' | 'random';
  @ViewChild('f') form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableForm);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectMode == 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
        Math.random() * (availableTo.getTime() -
          7 * 24 * 60 * 60 * 1000 -
          availableFrom.getTime())).toISOString();

      this.endDate =
        new Date(
          new Date(this.startDate).getTime() +
          Math.random() * 6 * 24 * 60 * 60 * 1000
        ).toISOString();
    }
  }

  onBookPlace() {
    
    if (!this.form.valid || !this.datesValid) {
      return;
    }
    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value['first-name'],
          lastName: this.form.value['last-name'],
          guestNumber: +this.form.value['guest-number'],
          startDate: new Date(this.form.value['date-from']),
          endDate: new Date(this.form.value['date-to']),
        }
      }
      , 'confirm');
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  datesValid() {
    if (typeof (this.form) != 'undefined') {
      const startDate = new Date(this.form.value['date-from']);
      const endDate = new Date(this.form.value['date-to']);
      return endDate > startDate;
    }
    else
      return false;
  }
}

