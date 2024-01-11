import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {

  constructor() { }


  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const raioTerra = 6371;

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = raioTerra * c;

    return parseFloat(distancia.toFixed(2));

  }

  private toRad(valor: number): number {
    return (valor * Math.PI) / 180;
  }


}
