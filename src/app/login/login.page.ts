import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  model: any = {};
  isLoggedIn = this.authService.isLoggedIn();
  hidePassword: boolean = true;

  constructor(
    private authService: AuthService, 
    private toastController: ToastController,
    private router: Router
  ){}


  login() {
    this.authService.login(this.model).subscribe(
      (response: any) => {
        console.log('Login successful', response);
        this.authService.saveUserIdToStorage(response.token);
        this.router.navigate(['/home']);
        this.presentToastSucess('bottom');
      },
      (error) => {
        console.error('Login failed', error);
        this.presentToastFailed('top');
      }
    );
  }


  async presentToastFailed(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Login Inválido!',
      duration: 1500,
      position: position,
      color: 'danger'
    });

    await toast.present();
  }

  async presentToastSucess(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Bem vindo!',
      duration: 1500,
      position: position,
      color: 'success'
    });

    await toast.present();
  }



  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


}
