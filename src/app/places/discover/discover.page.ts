import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import {SegmentChangeEventDetail} from '@ionic/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces:Place[];s
  listedLoadedPlaces:Place[];
  private placesSub:Subscription;
  isLoading = false;

  constructor(
    private placesService:PlacesService, 
    private menuCtrl:MenuController) { }

  ngOnInit() {

   this.placesSub = this.placesService.places.subscribe(places=>{
      this.loadedPlaces = places;
      this.listedLoadedPlaces=this.loadedPlaces.slice(1);
    });

  }
  onOpenMenu(){
    this.menuCtrl.toggle();
  }

  
  ionViewWillEnter(){
    this.isLoading = true;
      this.placesService.fetchPlaces().subscribe(()=>{
        this.isLoading = false;
      });
  }

  onFilterUpdate(event:CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail);
  }

  ngOnDestroy(){
    if(this.placesSub)
      this.placesSub.unsubscribe();
  }
}
