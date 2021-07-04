import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import {environment} from '../../../../environments/environment'
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation } from 'src/app/places/offers/location.model';
import { of } from 'rxjs';


@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage:string;
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  constructor(private modalCtrl: ModalController,
    private http:HttpClient) { 

  }

  ngOnInit() {}

  onPickLocation(){
    this.modalCtrl.create({component:MapModalComponent})
      .then(modalEl=>{
        modalEl.onDidDismiss().then(modalData=>{
          if(!modalData.data)
            return;
          const picketLocation:PlaceLocation = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
            address:null,
            staticMapImageUrl:null
          };
          this.getAddress(modalData.data.lat, modalData.data.lng).pipe(
            switchMap(address => {
              picketLocation.address = address;
              let temp = this.getMapImage(picketLocation.lat, picketLocation.lng, 14)
              return of(temp);
            })
          ).subscribe(staticMapImgUrl => {
            picketLocation.staticMapImageUrl = staticMapImgUrl;
            this.selectedLocationImage = staticMapImgUrl;
            this.locationPick.emit(picketLocation);
            });
        });
        modalEl.present();
      })
  }

  private getAddress(lat:number, lng:number){
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`)
    .pipe(map( (geoData: any) =>{ 
      console.log(geoData);
      if(!geoData || !geoData.results || geoData.results.length ==0 ){
        return null;
      }
      return geoData.results[0].formatted_address;
    }));
  }

  private getMapImage(lat:number, lng:number, zoom:number){
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:blue%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapsAPIKey}`;
  }

}
