import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage{

  model: any = {
    username:'',
    emai:'',
    password:'',
    role:'User'
  };
  isLoggedIn = this.authService.isLoggedIn();
  hidePassword: boolean = true;


  constructor(
    private authService: AuthService, 
    private toastController: ToastController,
    private router: Router
  ){}

  register() {
    this.authService.register(this.model).subscribe(
      (response) => {
        console.log('Register successful', response);
        this.router.navigate(['/login']);
        this.presentToastSucess('top');
      },
      (error) => {
        console.error('Register failed', error);
        this.presentToast('top');
      }
    );
  }

  async presentToastSucess(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Conta criada com sucesso! Insira os dados de login.',
      duration: 1500,
      position: position,
      color: 'success'
    });

    await toast.present();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Dados Inválido!',
      duration: 1500,
      position: position,
      color: 'danger'
    });

    await toast.present();
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
