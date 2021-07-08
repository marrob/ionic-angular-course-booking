import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import {environment} from '../../../../environments/environment'
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation, Coordinates } from 'src/app/places/offers/location.model';
import { of } from 'rxjs';
import { Plugins, Capacitor } from '@capacitor/core';



@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage:string;
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  isLoading = false;
  constructor(
    private modalCtrl: ModalController,
    private http:HttpClient,
    private actionSheetCtrl:ActionSheetController,
    private alertCtrl:AlertController) {} 

  ngOnInit() {}

  onPickLocation(){
    this.actionSheetCtrl.create({header:'Please Choose', buttons:[
      { text:'Auto-Locate', handler:()=>{this.locateUser()}},
      { text:'Pick on Map', handler:()=>{this.openMap()}},
      { text:'Cancel', role:'cancel'},

    ]}).then(actionSheetEl=>{
      actionSheetEl.present();
    });
  }

  private locateUser(){
    if(!Capacitor.isPluginAvailable('Geolocation')){
      this.showErrorAlret();
        return;
    }
    this.isLoading=true;
    Plugins.Geolocation.getCurrentPosition().then(geoPosition=>{
      const coordinates: Coordinates = { 
        lat: geoPosition.coords.latitude, 
        lng: geoPosition.coords.longitude
      }
      this.createPlace(coordinates.lat, coordinates.lng);
      this.isLoading=false;
    }).catch(err=>{
      this.isLoading=false;
      this.showErrorAlret();
    })
  }

  private showErrorAlret(){
      this.alertCtrl.create({
        header:'Could not fetch location',
        message:'Please use the mapt to pick a location'})
          .then(alert=>alert.present());
  }

  private createPlace(lat: number, lng: number){
    const picketLocation:PlaceLocation = {
      lat: lat,
      lng: lng,
      address:null,
      staticMapImageUrl:null
    };
    this.isLoading = true;
    this.getAddress(lat, lng)
    .pipe(
      switchMap(address => {
        picketLocation.address = address;
        let temp = this.getMapImage(picketLocation.lat, picketLocation.lng, 14)
        return of(temp);
      })
    ).subscribe(staticMapImgUrl => {
      picketLocation.staticMapImageUrl = staticMapImgUrl;
      this.selectedLocationImage = staticMapImgUrl;
      this.isLoading = false; 
      this.locationPick.emit(picketLocation);
      });
  }

  private openMap()
  {
    this.modalCtrl.create({component:MapModalComponent})
    .then(modalEl=>{
      modalEl.onDidDismiss().then(modalData=>{
        if(!modalData.data)
          return;
        const coordinates:Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng
        };  
        this.createPlace(coordinates.lat, coordinates.lng);
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
