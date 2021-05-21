import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {


  places:Place[];

  constructor(private placesServ:PlacesService) { }

  ngOnInit() {
    this.places= this.placesServ.places;
  }

}
