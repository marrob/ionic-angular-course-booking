import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private loaderCtrl:LoadingController
  ) { }

  place: Place;
  form: FormGroup;


  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),

          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          }),
        });
      });
    });
  }


  onUpdateOffer(){


    if (!this.form.valid) {
      return;
    }
    this.loaderCtrl.create({
      message:'Updateing place...'
    }).then(loadingEl=>{
      loadingEl.present();
      this.placesService.UpdateOffer(
        this.place.id, 
        this.form.value.title,
        this.form.value.description).subscribe(()=>{
            loadingEl.dismiss();
        });
      });
  }

  ngOnDestroy() {
    if (this.placeSub)
      this.placeSub.unsubscribe();
  }
}
