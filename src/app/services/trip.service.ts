import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TripData } from '../models/TripData.model';
import { TripAutonomy } from '../models/TripAutonomy.model';
import { Coordinates } from '../models/Coordinates';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private http: HttpClient) { }

  getDirections(trip: TripData): Observable<any> {
    const url = 'https://lds13.azurewebsites.net/api/Mapbox/getDirections'; 
    return this.http.post<any>(url, trip);
  }

  getDirectionsWithStations(trip: TripData): Observable<any> {
    const url = 'https://lds13.azurewebsites.net/calculoRota'; 
    return this.http.post<any>(url, trip);
  }

  getNearestStations(coords: Coordinates): Observable<any> {
    const url = 'https://lds13.azurewebsites.net/postosProximos'; 
    console.log(this.http.post<any>(url, coords));
    return this.http.post<any>(url, coords);
  }

  getNearestStationsParams(coords: Coordinates): Observable<any> {
    const url = 'https://lds13.azurewebsites.net/postosProximos';
    
    // Adapte os parâmetros para incluir as coordenadas como parâmetros de consulta
    const params = new HttpParams()
      .set('latitude', coords.latitude.toString())
      .set('longitude', coords.longitude.toString());
  
    const options = { params };
  
    console.log(this.http.post<any>(url, {}, options));
    
    // Envie a solicitação com os parâmetros de consulta
    return this.http.post<any>(url, {}, options);
  }

} 