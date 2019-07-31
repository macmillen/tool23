import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';
import { Item } from 'src/app/models/item.model';
import { User } from 'src/app/models/user.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})
export class EditItemPage implements OnInit {


  user: User;

  pageTitle: string;
  item: Item = {
    userID: '0', description: '', status: 'active', tags: [],
    title: '', address: { city: '', houseNumber: '', street: '', zip: '' }
  };
  tagInput = '';
  statusBool: boolean;
  imageBase64: any = '../../../assets/placeholder_item.png';
  downloadURL = '';
  isEditMode = false;
  itemID: string;
  imageUploaded = false;
  percent = -1;

  options: CameraOptions = {
    quality: 90,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    targetHeight: 100
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
    public plt: Platform) {
  }

  ngOnInit() {
    this.itemID = this.route.snapshot.paramMap.get('itemID');
    if (this.itemID) {
      this.isEditMode = true;
      this.loadItem(this.itemID);
      this.pageTitle = 'Item bearbeiten';
    } else {
      this.isEditMode = false;
      this.pageTitle = 'Item erstellen';
      this.loadUser();
    }
  }

  viewWillEnter() {

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
        this.loadUser();
        this.statusBool = this.item.status === 'active' ? true : false;
      }
    });
  }


  loadUser() {
    this.userService.getUser('0').subscribe({
      next: user => {
        this.user = user;
        console.log(this.user.address);
        if (!this.isEditMode) {
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
    this.item.status = this.statusBool ? 'active' : 'disabled';

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
          this.navController.navigateRoot('/account-view');
          this.loadingController.dismiss();
        }) )
      ).subscribe();
    }

    this.itemService.updateItem(this.item).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${this.item.title}' wurde aktualisiert!`,
          duration: 2000
        });
        toast.present();

      }
    });
  }

  createItem() {
    this.item.status = this.statusBool ? 'active' : 'disabled';
    this.itemService.createItem(this.item).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${this.item.title}' wurde erstellt!`,
          duration: 2000
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
          duration: 2000
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


}
