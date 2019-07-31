import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { NavController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss']
})
export class EditUserPage implements OnInit {
  id: string;
  imageBase64: any = '../../../assets/placeholder.png';
  imageUploaded = false;
  percent = -1;
  user: User = {
    email: '',
    username: '',
    address: { city: '', houseNumber: '', street: '', zip: '' }
  };

  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    targetHeight: 100
  };

  constructor(
    private userService: UserService,
    private navController: NavController,
    private fireStorage: AngularFireStorage,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private camera: Camera,
    public plt: Platform
  ) {
  }


  ngOnInit() {
    this.userService.getUser('0').subscribe({
      next: user => {
        this.user = user;
        this.getUserImageURL();
      }
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Lädt...',
    });
    await loading.present();
  }

  updateUser() {
    if ( this.imageUploaded ) {
      const ref = this.fireStorage.ref(`/user-images/${this.user.userID}.jpg`);
      const uploadTask = ref.putString(this.imageBase64, 'data_url', { contentType: 'image/jpg' });

      this.presentLoading();
      uploadTask.percentageChanges().subscribe( percent => {
        this.percent = percent;
      });
      uploadTask.snapshotChanges().pipe(
        finalize(() => ref.getDownloadURL().subscribe(itemImage => {
          this.navController.navigateRoot('/account-view');
          this.loadingController.dismiss();
        }) )
     ).subscribe();
    }

    this.userService.updateUser(this.user).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der User '${this.user.username}' wurde aktualisiert!`,
          duration: 2000
        });
        toast.present();
      }
    });
  }

  getUserImageURL() {
    const ref = this.fireStorage.ref(`user-images/${this.user.userID}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.imageBase64 = url; }
    });
  }

  openCamera() {
    this.camera.getPicture(this.options).then((imageData) => {
      // If it's base64 (DATA_URL):
      this.imageBase64 = 'data:image/jpeg;base64,' + imageData;
      this.imageUploaded = true;
    }, (err) => {
      // Handle error
    });
  }
}
