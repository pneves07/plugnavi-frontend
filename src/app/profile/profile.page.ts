import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Vehicle } from '../models/Vehicle.model';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  openAddVehicle: boolean = false;
  selectedVehicle: Vehicle;
  vehicles;
  connectorType: any;
  newVehicle: Vehicle = {
    UserID: '',
    Autonomy: 0,
    Connector: '',
    Model: ''
  };
  listChargingPointTypes: any;

  user : any = "";

  constructor(
    private profileService: ProfileService,
    private toastController: ToastController,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.getVehicles();
    this.getUserProfile();
    this.getChargingPointTypes();
  }

  showFormVehicle(){
    this.openAddVehicle=!this.openAddVehicle;
  }

  changeVehicle(){
    this.storage.set("selectedVehicle", this.selectedVehicle)
  }

  async getVehicles(){
    this.profileService.getVehicles().subscribe(
      data => {
        this.vehicles = data;
        this.storage.get("selectedVehicle").then(res => {
          if (res == null || res == undefined){
            this.selectedVehicle = data[0];
          } else {
            for (let i = 0; i < this.vehicles.length; i++){
              console.log(this.vehicles[i])
              if (JSON.stringify(this.vehicles[i]) === JSON.stringify(res)){
                this.selectedVehicle = this.vehicles[i]
              }
            }
          }
        })
      }

      
    )
}

  async getUserProfile(){
    this.profileService.getUserProfile().subscribe(
      data => {
        this.user = data;
        console.log("User", this.user);
      },
      error => {
        console.error('Erro na requisição', error);
      }
    )
  
  }
  
  addNewVehicle() {
    this.newVehicle.Connector = this.connectorType.slot
    this.profileService.addNewVehicle(this.newVehicle).subscribe(
      (response: any) => {
        console.log('Veículo adicionado', response);
        this.presentToastSucess('bottom');
        this.openAddVehicle = false;
        this.getVehicles();
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }

  async presentToastSucess(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: this.newVehicle.Model + ' adicionado com sucesso!',
      duration: 1500,
      position: position,
      color: 'success'
    });

    await toast.present();
  }

  newFormVehicle(){
    console.log("Veículos", this.newVehicle);
  }

  getChargingPointTypes(){
    this.profileService.getPointTypes().subscribe(
      (data) => {
        this.listChargingPointTypes = data
        console.log(this.listChargingPointTypes)
      }
    );
    
  }





}
