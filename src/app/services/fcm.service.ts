import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FCM } from '@ionic-native/fcm/ngx';
import { ToastController, NavController } from '@ionic/angular';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private userService: UserService,
    private navController: NavController,
    private fcm: FCM
  ) { }

  /**
   * Creates and refreshes token online on server, if authenticated
   */
  async getToken() {
    this.userService.isAuthenticated().subscribe({
      next: isAuth => {
        if (isAuth) {
          this.fcm.getToken().then(token => {
            this.createToken(token);
          });
          this.fcm.onTokenRefresh().subscribe(token => {
            this.createToken(token);
          });
        }
      }
    });
  }

  /**
  * Calls "createToken" over the Api on the server
  * 
  */
  private createToken(token: string) {
    this.http.post(`${environment.SERVER_URL}/api/create-token`, { token }).subscribe({
      error: e => console.log(e)
    });
  }

  /**
  * Listens to incoming FCM messages. If received in background, it navigates to transaction list,
  * in foreground, it presents a toast.
  * 
  */
  listenToNotifications() {
    this.fcm.onNotification().subscribe(async data => {
      if (data.wasTapped) {
        // Received in background
        this.navController.navigateRoot('/tabs/transaction-list');
      } else {
        // Received in foreground
        const toast = await this.toastController.create({
          message: 'Sie haben eine neue Anfrage erhalten.',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    });
  }
}
