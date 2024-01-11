import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationsService } from '../services/stations.service';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@capacitor/geolocation';
import { DistanceService } from '../services/distance.service';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.page.html',
  styleUrls: ['./station-details.page.scss'],
})
export class StationDetailsPage implements OnInit {


  objReceived: any;
  details: any;
  dataReady = false;
  showReviewForm = false;
  reviewSended = false;
  localizacaoAtual: any;
  distance: number = 0;
  
  newReview = {
    rating: 0,
    comment: ''
  }

  nameStar1: string = "star-outline"; 
  nameStar2: string = "star-outline";
  nameStar3: string = "star-outline";
  nameStar4: string = "star-outline";
  nameStar5: string = "star-outline";
  styleStar1: string = "color: white;"
  styleStar2: string = "color: white;"
  styleStar3: string = "color: white;"
  styleStar4: string = "color: white;"
  styleStar5: string = "color: white;"




  constructor(
    private route: ActivatedRoute, 
    private stationService: StationsService,
    private storage: Storage,
    private router: Router,
    private toastController: ToastController,
    private distanceService: DistanceService
    ) {
      
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.objReceived = params;
    });    
    this.getDetails(this.objReceived.id);
  }


  async saveToStorage(station: any): Promise<void> {
    this.storage.set("selectedStation", station);
    this.router.navigate(['/home']);
  }


  getDetails(id: number){
    this.stationService.getStationDetails(id).subscribe(data => {
      this.details = data;
      console.log("Detalhes: ", this.details)
      this.dataReady = true;
      this.calcularDistancia(this.details.stationLatitude, this.details.stationLongitude)
    });
  }

  addNewReview(review) {
    this.stationService.addNewReview(this.objReceived.id, review).subscribe(
      (response: any) => {
        console.log('Review adicionada', response);
        this.reviewSended = true
        this.showReviewForm = false
        this.presentToastSucess("bottom")
      },
      (error) => {
        console.error('Failed', error);
      }
    );
  }

  async presentToastSucess(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Comentário adicionado com sucesso!',
      duration: 1500,
      position: position,
      color: 'success'
    });

    await toast.present();
  }

  changeRating(value: number){
    this.newReview.rating = value;
    this.nameStar1 = "star-outline";
    this.nameStar2 = "star-outline";
    this.nameStar3 = "star-outline";
    this.nameStar4 = "star-outline";
    this.nameStar5 = "star-outline";

    switch(value){
      case 1: 
        this.nameStar1 = "star";
        break;
      case 2: 
        this.nameStar1 = "star";
        this.nameStar2 = "star";
        break;
      case 3: 
        this.nameStar1 = "star"; 
        this.nameStar2 = "star"; 
        this.nameStar3 = "star";
        break;
      case 4: 
        this.nameStar1 = "star";
        this.nameStar2 = "star"; 
        this.nameStar3 = "star"; 
        this.nameStar4 = "star";
        break;
      case 5: 
        this.nameStar1 = "star"; 
        this.nameStar2 = "star";
        this.nameStar3 = "star";
        this.nameStar4 = "star";
        this.nameStar5 = "star";
        break;
    }
  }

  async calcularDistancia(lat, long){
    this.localizacaoAtual = await Geolocation.getCurrentPosition();
    this.distance = this.distanceService.calcularDistancia(this.localizacaoAtual.coords.latitude, this.localizacaoAtual.coords.longitude, lat, long);
  }

}
