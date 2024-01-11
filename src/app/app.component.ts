import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  public appPages = [
    //{ title: 'Login', url: '/login', icon: 'lock-closed'},
    { title: 'Mapa', url: '/home', icon: 'map'},
    { title: 'Postos', url: '/stations', icon: 'battery-charging'},
    { title: 'Conta', url: '/profile', icon: 'person'},
    //{ title: 'Testes', url: '/tests', icon: 'key'},
    /*{ title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
    */
  ];


  constructor(private storage: Storage, private authService: AuthService) {
    this.clearStorage();
  }

  async logout() {
    await this.storage.remove('authToken');
    await this.storage.remove('selectedVehicle');
    window.location.reload();
  }

  async clearStorage(){
    await this.storage.remove('selectedStation');
  }


}
