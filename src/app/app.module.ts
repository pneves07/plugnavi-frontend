import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TripService } from './services/trip.service';

import { StarRatingModule } from 'angular-star-rating';



@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule, 
            FormsModule, 
            BrowserModule, 
            IonicModule.forRoot({mode: 'ios'}), 
            AppRoutingModule, 
            StarRatingModule.forRoot(),
            IonicStorageModule.forRoot(),
            ServiceWorkerModule.register('ngsw-worker.js',
            {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, TripService],
  bootstrap: [AppComponent],
})
export class AppModule {}