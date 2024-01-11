import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { NavController } from '@ionic/angular';
import { TripService } from '../services/trip.service';
import { Coordinates } from '../models/Coordinates';
import { DistanceService } from '../services/distance.service';


@Component({
  selector: 'app-stations',
  templateUrl: './stations.page.html',
  styleUrls: ['./stations.page.scss'],
})
export class StationsPage implements OnInit {

  postosCarregamento: any = [];
  localizacaoAtual: any;
  loadingStations: boolean = true;

  constructor(
    private tripService: TripService,
    private navCtrl: NavController,
    private distanceService: DistanceService,
  ) { }

  ngOnInit() {
    this.getTop10Stations();
  }

  
  async getTop10Stations() {

    this.localizacaoAtual = await Geolocation.getCurrentPosition();
    console.log(this.localizacaoAtual);

    const coords : Coordinates = {
      latitude: this.localizacaoAtual.coords.latitude,
      longitude: this.localizacaoAtual.coords.longitude
    };

    console.log("Coords: ", coords);

    this.tripService.getNearestStationsParams(coords).subscribe(
      data => {
        this.postosCarregamento = data;  
        console.log("Postos de carregamento", data);
      },
      error => {
        console.error('Erro na requisição', error);
      }

    )
    this.loadingStations = false;
    
  }

  navegarParaPaginaDestino(obj: any) {
    this.navCtrl.navigateForward(`/station-details/${obj.id}`);
  }
  
  calcularDistancia(lat1, long1, lat2, long2){
    return this.distanceService.calcularDistancia(lat1, long1, lat2, long2);
  }

  

}
