import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewOfferPageRoutingModule } from './new-offer-routing.module';

import { NewOfferPage } from './new-offer.page';
import { SharedModul } from 'src/app/shared/shared.modul';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewOfferPageRoutingModule,
    SharedModul,
  ],
  declarations: [NewOfferPage]
})
export class NewOfferPageModule {}
