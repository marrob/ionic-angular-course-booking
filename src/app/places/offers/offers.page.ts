import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {


  places:Place[];
  private placesSub:Subscription;

  constructor(private placesServ:PlacesService,
    private router:Router
    ) { }

  ngOnInit() {
    this.placesSub = this.placesServ.places.subscribe(places=>{
      this.places = places;
    });
  }

  onEdit(offerId:string, slidingItem:IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/','places','tabs','offers','edit', offerId]);
    console.log("edit offer Id", offerId);
  }

  ngOnDestroy(){
    if(this.placesSub)
      this.placesSub.unsubscribe();
  }


}
