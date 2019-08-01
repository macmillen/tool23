import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, AlertController, IonInput } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';
import { Item } from 'src/app/models/item.model';
import { User } from 'src/app/models/user.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})
export class EditItemPage implements OnInit {

  validationsForm: FormGroup;

  user: User;
  pageTitle: string;
  item: Item;
  // errors: Map<string, string> = new Map<string, string>();
  tagInput = '';
  statusBool: boolean;
  imageBase64: any = '../../../assets/placeholder_item.png';
  downloadURL = '';
  isEditMode = false;
  imageUploaded = false;
  itemID: string;
  percent = -1;

  @ViewChild('itemTitle')
  private itemTitleRef: IonInput;

  options: CameraOptions = {
    quality: 90,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    targetHeight: 100
  };

  validationsMessages = {
    title: [
      { type: 'required', message: 'Titel ist benötig.' },
      { type: 'minlength', message: 'Titel muss mindesten 5 Charakter lang sein.' },
      { type: 'maxlength', message: 'Titel kann nicht länger als 25 Charaktere sein.' }
    ],
    description: [
      { type: 'required', message: 'Beschreibung ist benötigt' }
    ],
    street: [
      { type: 'required', message: 'Straße ist benötigt' }
    ],
    houseNumber: [
      { type: 'required', message: 'Straße ist benötigt' }
    ],
    zip: [
      { type: 'required', message: 'Straße ist benötigt' },
      { type: 'pattern', message: '5 Zahlen'}
    ],
    city: [
      { type: 'required', message: 'Straße ist benötigt' }
    ],
  };

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private fireStorage: AngularFireStorage,
    private itemService: ItemService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private userService: UserService,
    private camera: Camera,
    private alertController: AlertController,
    public formBuilder: FormBuilder,
    public plt: Platform) {
  }

  ngOnInit() {
    this.itemID = this.route.snapshot.paramMap.get('itemID');
    if (this.itemID) {
      this.isEditMode = true;
      this.loadItem(this.itemID);
      this.loadUser();
      this.pageTitle = 'Item bearbeiten';
    } else {
      this.isEditMode = false;
      this.pageTitle = 'Item erstellen';
      this.loadUser();
    }

    // Validation

    this.validationsForm = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.required
      ])),
      description: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      houseNumber: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{5}')
      ])),
      city: new FormControl('', Validators.required)
    });
  }

  ionViewDidEnter() {
    if (!this.isEditMode) {
      this.itemTitleRef.setFocus();
    }
  }

  async presentAlertConfirm(item: Item) {
    const alert = await this.alertController.create({
      header: 'Bestätigen',
      message: '<strong>Item wirklich löschen?</strong>',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.deleteItem();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Lädt...',
    });
    await loading.present();
  }


  loadItem(itemID: string) {
    this.itemService.getItem(itemID).subscribe({
      next: item => {
        this.item = item;
        this.getItemImageURL();
        this.statusBool = this.item.status === 'active' ? true : false;
      }
    });
  }


  loadUser() {
    this.userService.getUser('0').subscribe({
      next: user => {
        this.user = user;
        if (!this.isEditMode) {
          this.item = {
            userID: '0', description: '', status: 'active', tags: [],
            title: '', address: null
          };
          this.item.address = this.user.address;
        }
      }
    });
  }

  getItemImageURL() {
    const ref = this.fireStorage.ref(`item-images/${this.item._id}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.imageBase64 = url; }
    });
  }

  addTag() {
    if (!this.tagInput) { return; }
    const tags = new Set<string>(this.item.tags);
    tags.add(this.tagInput);
    this.item.tags = Array.from(tags);
    this.tagInput = '';
  }

  updateItem() {
    // this.errors.clear();

    // if (!this.item.title) {
    //   this.errors.set('itemTitle', 'Title darf nicht leer sein!');
    // }

    // if (!this.item.description) {
    //   this.errors.set('itemDescription', 'Beschreibung darf nicht leer sein!');
    // }

    // if (!this.item.address.street) {
    //   this.errors.set('addressStreet', 'Straße darf nicht leer sein!');
    // }

    // if (!this.item.address.houseNumber) {
    //   this.errors.set('addressHouseNumber', 'Hausnummer darf nicht leer sein!');
    // }

    // if (!this.item.address.zip) {
    //   this.errors.set('addressZip', 'PLZ darf nicht leer sein!');
    // }

    // if (!this.item.address.city) {
    //   this.errors.set('addressCity', 'Stadt darf nicht leer sein!');
    // }

    // if (this.errors.size === 0) {
    //   if (this.isEditMode) {
    //     console.log('Keine Errors');
    //     this.uploadItem();
    //   } else {
    //     // Toast Controller anzeigen
    //   }
    // }
    this.uploadItem();
  }

  uploadItem() {
    this.item.status = this.statusBool ? 'active' : 'disabled';
    let uploadedImage = !this.imageUploaded;
    let uploadedItem = false;

    // Uploading Image
    if (this.imageUploaded) {
      const ref = this.fireStorage.ref(`/item-images/${this.item._id}.jpg`);
      const uploadTask = ref.putString(this.imageBase64, 'data_url', { contentType: 'image/jpg' });

      // Presenting the Loading Screen
      this.presentLoading();
      uploadTask.percentageChanges().subscribe( percent => {
        this.percent = percent;
      });
      uploadTask.snapshotChanges().pipe(
        finalize(() => ref.getDownloadURL().subscribe(itemImage => {
          this.loadingController.dismiss();
          uploadedImage = true;
          this.goToAccountView(uploadedImage, uploadedItem);
        }) )
      ).subscribe();
    }

    this.itemService.updateItem(this.item).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${this.item.title}' wurde aktualisiert!`,
          duration: 2000,
          position: 'top'
        });
        toast.present();
        uploadedItem = true;
        this.goToAccountView(uploadedImage, uploadedItem);
      },
      error: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${this.item.title}' konnte nicht aktualisiert werden!`,
          duration: 2000
        });
        toast.present();
        this.imageUploaded = false;
        this.goToAccountView(uploadedImage, uploadedItem);
      }
    });
  }


  goToAccountView(uploadedImage: boolean, uploadedItem: boolean) {
    if ( uploadedImage && uploadedItem ) {
      this.navController.navigateRoot('/account-view');
    }
  }

  createItem() {
    this.item.status = this.statusBool ? 'active' : 'disabled';
    this.itemService.createItem(this.item).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${this.item.title}' wurde erstellt!`,
          duration: 2000,
          position: 'top'
        });
        toast.present();

        this.navController.navigateRoot('/account-view');
      }
    });
  }


  deleteItem() {
    this.itemService.deleteItem(this.item._id).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand' ${this.item.title} ' wurde gelöscht`,
          duration: 2000,
          position: 'top'
        });
        toast.present();

        this.navController.navigateRoot('/account-view');
      }
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
    this.navController.navigateRoot('/account-view');
  }

}
