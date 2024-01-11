import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

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

  public getVehicles(): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(authToken => {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        };
        return this.http.get(`${this.apiUrl}/Vehicle/byUser`, { headers });
      })
    );
  }

  public getUserProfile(): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(authToken => {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        };
        return this.http.get(`${this.apiUrl}/User`, { headers });
      })
    );
  }

  public addNewVehicle(vehicleInfo): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(authToken => {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        };
        return this.http.post(`${this.apiUrl}/Vehicle`, vehicleInfo ,{ headers });
      })
    );
    
  }

  public getPointTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ChargingPointType`);
  }
  


}
