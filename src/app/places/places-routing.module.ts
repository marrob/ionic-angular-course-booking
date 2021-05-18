import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlacesPage } from './places.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: PlacesPage,
    children:[
        {
          path: 'discover',
          children:[
            {
              path:'',
              loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)
            },
            {
              path: ':placeId',
              loadChildren: () => import('./discover/place-detail/place-detail.module').then( m => m.PlaceDetailPageModule)
            },
          ]
        },
        {
          path: 'offers',
          children:[
            {
              path:'',
              //loadChildren:'./offers/offers.module#OffersPageModule'
              loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
            },
            {
              path:'new',
              //loadChildren:'./offers/new-offer.module#NewOfferPageModule'
              loadChildren: () => import('./offers/new-offer/new-offer.module').then( m => m.NewOfferPageModule)
            },
            {
              path:'edit/:placeId',
              //loadChildren:'./offers/edit-offer.module#EditOfferPageModule'
              loadChildren: () => import('./offers/edit-offer/edit-offer.module').then( m => m.EditOfferPageModule)
            },
            {
              path:':placeId',
              //loadChildren:'./offers/place-bookings.module#PlaceBookingsPageModule'
              loadChildren: () => import('./offers/place-bookings/place-bookings.module').then( m => m.PlaceBookingsPageModule)
            }
          ]
        },
        {
          path:'',
          redirectTo:'/places/tabs/discover',
          pathMatch:'full'
        }
    ]
  },
  {
    path:'',
    redirectTo:'/places/tabs/discover',
    pathMatch:'full'
  }
];

@NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule],
    })
export class PlacesPageRoutingModule { }
