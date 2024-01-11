
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { TripData } from '../models/TripData.model'
import { TripService } from '../services/trip.service';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';


declare var mapboxgl: any;

@Component({
 selector: 'app-home',
 templateUrl: './home.page.html',
 styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
@ViewChild(IonModal) modalPesquisa: IonModal;
@ViewChild("stepsModal") stepsModal: IonModal; 
openModal: boolean = false; 
start = []; 
end = []; 
map: any; 
route: number = 1; 
routeLoaded: boolean = false;
distance: string = ""; 
duration: string = ""; 
steps: Array<any> = []; 
routeData: any; 
coordenadas: any;
trip: TripData;
inputAutonomy: number;
vehicle: any;
autonomy: number;
connector: string;

enderecoPesquisa: string = '';
sugestoes: any[] = [];
loadingMapa: boolean = true;
 
accessToken = 'pk.eyJ1IjoiYXBwbGRzMjAyMyIsImEiOiJjbG54ZHN0eGUwZXhqMnJsZWQwdjQ2eGo3In0.sjYUyiQqmHivuVPw14GH5g';

selectedStation: any;
alertButtons = ['Adicionar'];




closeModal() {
  this.modalPesquisa.dismiss();
}

constructor(
  private http: HttpClient, 
  private tripService: TripService, 
  private alertController: AlertController,
  private storage: Storage,
  private profileService: ProfileService,
  private router: Router
) { }

ngOnInit() { 
}

ionViewDidEnter() {
  this.loadMap();
}



async getVehicle() {

  this.vehicle = this.storage.get("selectedVehicle").then(res => {
    this.vehicle = res;
    console.log(this.vehicle)
    this.autonomy = this.vehicle.autonomy
    this.connector = this.vehicle.connector
    
  
    console.log("Autonomia: ", this.autonomy);
    console.log("Connector: ", this.connector);

    if(this.vehicle == null && this.vehicle == undefined){
      this.profileService.getVehicles().subscribe(
        async data => {
          if(data == null || data == undefined){
            const alert = await this.alertController.create({
              header: 'Adicionar veículo',
              message: 'Não existem veículos no seu perfil. Adicione para utilizar a aplicação.',
              buttons: ['Adicionar'],
            });
            await alert.present();
          } else {
            console.log("Veículos", data[0]);
            this.storage.set("selectedVehicle", data[0]);  
          }
        },
        async error => {
          console.error('Erro na requisição', error);
          const alert = await this.alertController.create({
            header: 'Adicionar veículo',
            message: 'Não existem veículos no seu perfil. Adicione para utilizar a aplicação.',
            buttons: [{
              text: 'Adicionar',
              handler: () => {
                this.router.navigate(['/profile']);
              }
            }]
          });
          await alert.present();
        }
      )
    } 
  });

  
}

checkSelectedStation(){
  this.selectedStation = this.storage.get("selectedStation").then(async res => {
    this.selectedStation = res;
    if(this.selectedStation !== null && this.selectedStation !== undefined){
      this.enderecoPesquisa = this.selectedStation.name;
      this.vehicle.autonomy = 1000;
      this.vehicle.connector = "Type 2 (Socket Only)";
      this.getDirectionsBackend([this.selectedStation.stationLongitude, this.selectedStation.stationLatitude], 10000);
    } 
  });  
}


reload(){
  window.location.reload();
}

loadMap = async () => {

  this.coordenadas = await Geolocation.getCurrentPosition();

  mapboxgl.accessToken = this.accessToken
  this.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [this.coordenadas.coords.longitude, this.coordenadas.coords.latitude],
    zoom: 15,
  });

  this.start = [this.coordenadas.coords.longitude, this.coordenadas.coords.latitude];

  this.map.on('load', () => {      
          
    this.map.addLayer({
      id: 'point',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: this.start
              }
            }
          ]
        }
      },
      paint: {
        'circle-radius': 5,
        'circle-color': '#3880ff',
        'circle-stroke-color': 'white',
        'circle-stroke-width': 2,

      }
    });
  });
  this.checkSelectedStation();
  this.getVehicle();
  this.loadingMapa = false;
}

buscarSugestoes() {
  if (!this.enderecoPesquisa) {
    this.sugestoes = [];
    return;
  }

  const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.enderecoPesquisa}.json?access_token=${this.accessToken}&autocomplete=true&limit=5&country=PT`;

  this.http.get(geocodingUrl).subscribe((res: any) => {
    this.sugestoes = res.features;
  }, (error) => {
    console.error(error);
    this.sugestoes = [];
  });
}

selecionarSugestao(sugestao) {
  this.enderecoPesquisa = sugestao.place_name;
  this.sugestoes = [];
  this.storage.remove('selectedStation');
  this.getDirectionsBackend([sugestao.geometry.coordinates[0], sugestao.geometry.coordinates[1]], this.inputAutonomy);
  this.modalPesquisa.dismiss();
}

/*
pesquisarEndereco() {
  const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.enderecoPesquisa}.json?access_token=${this.accessToken}`;

  this.http.get(geocodingUrl).subscribe((res: any) => {
    const coordenadas = res.features[0].geometry.coordinates;
    this.getRoute(coordenadas);
  });
}
*/

/*
 async getRoute(end) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXBwbGRzMjAyMyIsImEiOiJjbG54ZHN0eGUwZXhqMnJsZWQwdjQ2eGo3In0.sjYUyiQqmHivuVPw14GH5g';

    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${this.start[0]},${this.start[1]};${end[0]},${end[1]}?steps=true&alternatives=true&annotations=distance%2Cduration%2Cspeed%2Cclosure&geometries=geojson&language=pt&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    this.routeData = await query.json();
    console.log(this.routeData);
    this.drawRoute();
 }
*/

 async getDirectionsBackend(destination, currentAutonomy) {
  this.loadingMapa = true;
  const trip: TripData = {
    currentAutonomy: currentAutonomy,
    originMapLongitude: this.coordenadas.coords.longitude,
    originMapLatitude: this.coordenadas.coords.latitude,
    destinationMapLongitude: destination[0],
    destinationMapLatitude: destination[1],
    slot: this.vehicle.connector,
    maxAutonomy: this.vehicle.autonomy
  };
  this.tripService.getDirectionsWithStations(trip).subscribe(
    data => {
      this.routeData = data;
      this.drawRoute();
      this.loadingMapa = false;
    },
    error => {
      console.error('Erro na requisição', error);
    }
  )

  console.log(trip);
}

drawRoute() {
    console.log(this.routeData);
    let r = this.route == 1 ? this.routeData.routes[0].geometry.coordinates : this.routeData.routes[1].geometry.coordinates;

    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: r
      }
    };
    if (this.map.getSource('route')) {
      this.map.getSource('route').setData(geojson);
    }
    else {
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3880ff',
          'line-width': 3,
          'line-opacity': 0.75
        }
      });
    }

    if (this.route == 1) {
      this.steps = this.routeData.routes[0].legs[0].steps;
      this.duration = this.secondsToHms(this.routeData.routes[0].duration);
      this.distance = this.formatDistance(this.routeData.routes[0].distance);
    }
    else {
      this.steps = this.routeData.routes[1].legs[0].steps;
      this.duration = this.secondsToHms(this.routeData.routes[1].duration);
      this.distance = this.formatDistance(this.routeData.routes[1].distance);
    }

    this.routeLoaded = true;
}

secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (" h, ") : "";
    var mDisplay = m > 0 ? m + (" m, ") : "";
    var sDisplay = s > 0 ? s + (" s") : "";
    return hDisplay + mDisplay + sDisplay;
}

formatDistance(distance) {
    return (distance / 1000).toFixed(2) + " km";
}

changeRoute(r) {
    this.route = r;
    this.drawRoute();
}

openSteps() {
    this.openModal = true;

    this.stepsModal.onWillDismiss().then(() => {
      this.openModal = false;
    });
}


/*
startRealTimeUpdates() {
  // Atualize a posição em tempo real
  navigator.geolocation.watchPosition(
    (position) => {
      // Obtenha a posição atual
      const currentLocation = [position.coords.longitude, position.coords.latitude];

      // Atualize a posição do carro no mapa
      this.updateCarPosition(currentLocation);

      // Verifique se chegou ao próximo passo da rota
      const nextStep = this.steps[this.currentStepIndex];
      const nextStepCoordinates = nextStep.maneuver.location;
      const distanceToNextStep = this.calculateDistance(currentLocation, nextStepCoordinates);

      if (distanceToNextStep < 50) { // 50 metros, ajuste conforme necessário
        // Chegou ao próximo passo, faça o que for necessário
        console.log('Chegou ao próximo passo:', nextStep.instruction);

        // Atualize para o próximo passo
        this.currentStepIndex++;

        if (this.currentStepIndex >= this.routeData.length) {
          // A rota foi concluída, faça o que for necessário
          console.log('Rota concluída!');
        }
      }
    },
    (error) => {
      console.error('Erro ao obter localização:', error);
    },
    { enableHighAccuracy: true, maximumAge: 0 }
  );
}


updateCarPosition(coordinates: number[]) {
  // Remova marcadores antigos (opcional)
  this.map.getSource('car-marker')?.setData({
    type: 'Point',
    coordinates: coordinates,
  });

  // Adicione um novo marcador para representar a posição em tempo real
  this.map.addSource('car-marker', {
    type: 'geojson',
    data: {
      type: 'Point',
      coordinates: coordinates,
    },
  });

  this.map.addLayer({
    id: 'car-marker',
    type: 'symbol',
    source: 'car-marker',
    layout: {
      'icon-image': 'car-icon',
      'icon-size': 0.1,
    },
  });

  // Centre o mapa na nova posição
  this.map.flyTo({ center: coordinates, zoom: 15 });
}
*/


calculateDistance(coord1: number[], coord2: number[]): number {
  // Função para calcular a distância entre duas coordenadas (em metros)
  const earthRadius = 6371; // Raio médio da Terra em quilômetros
  const lat1 = this.toRadians(coord1[1]);
  const lon1 = this.toRadians(coord1[0]);
  const lat2 = this.toRadians(coord2[1]);
  const lon2 = this.toRadians(coord2[0]);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c * 1000; // Distância em metros
  return distance;
}

toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

}

