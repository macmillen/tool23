import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { NavController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss']
})
export class EditUserPage implements OnInit {

  validationsForm: FormGroup;

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
    quality: 90,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    targetHeight: 100
  };


  validationsMessages = {
    email: [
      { type: 'required', message: 'Email ist benötigt.' },
      { type: 'pattern', message: 'Bitte gültige Email-Adresse angeben' }
    ],
    username: [
      { type: 'required', message: 'Beschreibung ist benötigt' }
    ],
    street: [
      { type: 'required', message: 'Straße ist benötigt' }
    ],
    houseNumber: [
      { type: 'required', message: 'Hausnummer ist benötigt' }
    ],
    zip: [
      { type: 'required', message: 'Straße ist benötigt' },
      { type: 'pattern', message: '5 Zahlen' }
    ],
    city: [
      { type: 'required', message: 'Straße ist benötigt' }
    ]
  };


  constructor(
    private userService: UserService,
    private navController: NavController,
    private fireStorage: AngularFireStorage,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private camera: Camera,
    public plt: Platform,
    public formBuilder: FormBuilder
  ) {
  }


  ngOnInit() {
    this.userService.getUser('0').subscribe({
      next: user => {
        this.user = user;
        this.setEditUser(user);
        this.getUserImageURL();
      }
    });

    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      username: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      houseNumber: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{5}')
      ])),
      city: new FormControl('', Validators.required)
    });
  }

  setEditUser(user: User) {
    this.validationsForm.get('username').setValue(user.username);
    this.validationsForm.get('email').setValue(user.email);
    this.validationsForm.get('street').setValue(user.address.street);
    this.validationsForm.get('houseNumber').setValue(user.address.houseNumber);
    this.validationsForm.get('city').setValue(user.address.city);
    this.validationsForm.get('zip').setValue(user.address.zip);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Lädt...',
    });
    await loading.present();
  }

  updateUser() {
    let uploadedImage = !this.imageUploaded;
    let uploadedUser = false;

    if ( this.imageUploaded ) {
      const ref = this.fireStorage.ref(`/user-images/${this.user.userID}.jpg`);
      const uploadTask = ref.putString(this.imageBase64, 'data_url', { contentType: 'image/jpg' });

      this.presentLoading();
      uploadTask.percentageChanges().subscribe( percent => {
        this.percent = percent;
      });
      uploadTask.snapshotChanges().pipe(
        finalize(() => ref.getDownloadURL().subscribe(itemImage => {
          this.loadingController.dismiss();
          uploadedImage = true;
          this.goToAccountView(uploadedImage, uploadedUser);
        }))
     ).subscribe();
    }

    this.userService.updateUser(this.user).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der User '${this.user.username}' wurde aktualisiert!`,
          duration: 2000,
          position: 'top'
        });
        toast.present();
        uploadedUser = true;
        this.goToAccountView(uploadedImage, uploadedUser);
      }
    });
  }

  goToAccountView(uploadedImage: boolean, uploadedItem: boolean) {
    if (uploadedImage && uploadedItem) {
      this.navController.navigateRoot('/account-view');
    }
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

  onSubmit(values) {
    console.log(values);
    this.user.username = values.username;
    this.user.email = values.email;
    this.user.address = {street: values.street, houseNumber: values.houseNumber, zip: values.zip, city: values.city};
    this.updateUser();
  }
}
