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

  offers:Place[];
  private sub:Subscription;
  isLoading = false;

  constructor(private placesServ:PlacesService,
    private router:Router
    ) { }

  ngOnInit() {
    this.sub = this.placesServ.places.subscribe(offers=>{
      this.offers = offers;
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
      this.placesServ.fetchPlaces().subscribe(()=>{
        this.isLoading = false;
      });
  }

  onEdit(offerId:string, slidingItem:IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/','places','tabs','offers','edit', offerId]);
    console.log("edit offer Id", offerId);
  }

  ngOnDestroy(){
    if(this.sub)
      this.sub.unsubscribe();
  }


}
