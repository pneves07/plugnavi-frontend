import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://lds13.azurewebsites.net/'; 
  private tokenKey = 'authToken';
  private storageReady = false;

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  async init() {
    this.createStorage();
  }

  async createStorage() {
    this.storage = await this.storage.create();
    this.storageReady = true;
  }

  register(model: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register`, model);
  }

  login(model: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/login`, model);
  }

  async saveUserIdToStorage(token: string): Promise<void> {
    if (!this.storageReady) {
      await this.createStorage();
    }

    this.storage.set(this.tokenKey, token);
  }

  isLoggedIn(): boolean {
    if (!this.storageReady) {
      console.error('Banco de dados não criado. Chame init() primeiro.');
      return false;
    }
    return this.storage.get(this.tokenKey) !== null;
  }

  getToken(): Promise<string | null> {
    if (!this.storageReady) {
      console.error('Banco de dados não criado. Chame init() primeiro.');
      return Promise.resolve(null);
    }

    return this.storage.get(this.tokenKey);
  }

  logout() {
    if (!this.storageReady) {
      console.error('Banco de dados não criado. Chame init() primeiro.');
      return;
    }

    this.storage.remove(this.tokenKey);

  }

}
