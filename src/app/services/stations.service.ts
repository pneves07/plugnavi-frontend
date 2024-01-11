import { Injectable } from '@angular/core';
import { Stations } from '../models/Station.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StationsService {

  private apiUrl = 'https://lds13.azurewebsites.net/'; 
  private authToken: string;

  constructor(private http: HttpClient, private storage: Storage) {
    this.getToken().then(authToken => {
      this.authToken = authToken;
    });
   }

  private async getToken(): Promise<string> {
    return this.storage.get("authToken");
  }

  getStationDetails( id: number): Observable<any> {
    const url = `${this.apiUrl}/ChargingStation/${id}`; 
    return this.http.get<any>(url);
  }

  public addNewReview(id, review): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(authToken => {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        };
        return this.http.post(`${this.apiUrl}/Review/${id}`, review ,{ headers });
      })
    );
    
  }

}
