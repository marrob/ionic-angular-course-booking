import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {


  places:Place[];

  constructor(private placesServ:PlacesService,
    private router:Router
    ) { }

  ngOnInit() {
    this.places= this.placesServ.places;
  }

  onEdit(offerId:string, slidingItem:IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/','places','tabs','offers','edit', offerId]);
    console.log("edit offer Id", offerId);
  }


}
