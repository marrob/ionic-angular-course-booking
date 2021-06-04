import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController
  ) { }

  place: Place;
  form: FormGroup;


  ngOnInit() {




    this.route.paramMap.subscribe(parmMap => {
      if (!parmMap.has('placeId')) {
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }

      this.place = this.placesService.getPlace(parmMap.get('placeId'));


    });
    
    this.form = new FormGroup({
      title: new FormControl(this.place.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),

      description: new FormControl(this.place.description,{
        updateOn:'blur',
        validators:[Validators.required, Validators.maxLength(180)]
      }),

    });

  }

  onUpdateOffer() {
    if(!this.form.valid){
      return;
    }

    console.log(this.form);
  }
}
