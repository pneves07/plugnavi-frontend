import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';

import { IonModal } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-tests',
  templateUrl: './tests.page.html',
  styleUrls: ['./tests.page.scss'],
})
export class TestsPage implements OnInit {
  map: mapboxgl.Map;
  start = []; //Coordenadas iniciais
  enderecoPesquisa: string = '';
  coordenadas: any;
  sugestoes: any[] = [];
  access_token = 'pk.eyJ1IjoiYXBwbGRzMjAyMyIsImEiOiJjbG54ZHN0eGUwZXhqMnJsZWQwdjQ2eGo3In0.sjYUyiQqmHivuVPw14GH5g'; // Substitua com seu Mapbox Access Token

  constructor(private http: HttpClient) {}

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap = async() => {
    this.coordenadas = await Geolocation.getCurrentPosition();
    this.start = [this.coordenadas.coords.longitude, this.coordenadas.coords.latitude];


    //Define as coordenadas iniciais com o local do dispositivo
    (mapboxgl as any).accessToken = this.access_token;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.coordenadas.coords.longitude, this.coordenadas.coords.latitude], // Coordenadas iniciais
      zoom: 15
    });

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

  }

  buscarSugestoes() {
    if (!this.enderecoPesquisa) {
      this.sugestoes = [];
      return;
    }

    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.enderecoPesquisa}.json?access_token=${this.access_token}&autocomplete=true&limit=5&country=PT`;

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
    this.calcularRota([sugestao.geometry.coordinates[0], sugestao.geometry.coordinates[1]]);
  }

  pesquisarEndereco() {
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.enderecoPesquisa}.json?access_token=${this.access_token}`;

    this.http.get(geocodingUrl).subscribe((res: any) => {
      const coordenadas = res.features[0].geometry.coordinates;
      this.calcularRota(coordenadas);
    });
  }

  calcularRota(destino: [number, number]) {
    navigator.geolocation.getCurrentPosition((posicao) => {
      const origem = [posicao.coords.longitude, posicao.coords.latitude];
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origem.join(',')};${destino.join(',')}?geometries=geojson&access_token=${this.access_token}`;

      this.http.get(directionsUrl).subscribe((res: any) => {
        const rota = res.routes[0].geometry;
        this.desenharRota(rota);
      });
    });
  }

  desenharRota(rota) {
    if (this.map.getSource('rota')) {
      this.map.removeLayer('rota');
      this.map.removeSource('rota');
    }

    this.map.addLayer({
      id: 'rota',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: rota
        }
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#888',
        'line-width': 8
      }
    });
  }
}
