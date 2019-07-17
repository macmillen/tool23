import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { FCM } from '@ionic-native/fcm/ngx';
import { ToastController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private navController: NavController,
    private fcm: FCM
  ) { }

  // Get permission from the user
  async getToken() {
    this.fcm.getToken().then(token => {
      this.createToken(token);
    });
    this.fcm.onTokenRefresh().subscribe(token => {
      this.createToken(token);
    });
  }

  private createToken(token: string) {
    this.http.post(`${SERVER_URL}/create-token`, { token }).subscribe({
      error: e => console.log(e)
    });
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    this.fcm.onNotification().subscribe(async data => {
      if (data.wasTapped) {
        // Received in background
        this.navController.navigateRoot('/transaction-list');
      } else {
        // Received in foreground
        const toast = await this.toastController.create({
          message: 'Sie haben eine neue Anfrage erhalten.',
          duration: 2000
        });
        toast.present();
      }
    });
  }
}
