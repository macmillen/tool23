import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';
import { Item } from 'src/app/models/item.model';
import { User } from 'src/app/models/user.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';



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
  isEditMode = false;
  itemID: string;
  imageUploaded = false;

  options: CameraOptions = {
    quality: 50,
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
    private userService: UserService,
    private camera: Camera,
    public plt: Platform) {
      if (this.plt.is('android')) {
        this.options.destinationType = this.camera.DestinationType.FILE_URI;
        this.options.sourceType = this.camera.PictureSourceType.CAMERA;
      }
  }

  ngOnInit() {
    this.itemID = this.route.snapshot.paramMap.get('itemID');
    if (this.itemID) {
      this.isEditMode = true;
      this.pageTitle = 'Item bearbeiten';
    } else {
      this.isEditMode = false;
      this.pageTitle = 'Item erstellen';
    }
    if (this.isEditMode) {
      this.loadItem(this.itemID);
    }
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
    const tags = new Set<string>(this.item.tags);
    tags.add(this.tagInput);
    this.item.tags = Array.from(tags);
    this.tagInput = '';
  }

  updateItem() {
    this.item.status = this.statusBool ? 'active' : 'disabled';

    if (this.imageUploaded) {
      const ref = this.fireStorage.storage.ref().child(`/item-images/${this.item._id}.jpg`);
      ref.putString(this.imageBase64, 'data_url', { contentType: 'image/jpg' });
    }

    this.itemService.updateItem(this.item).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${this.item.title}' wurde aktualisiert!`,
          duration: 2000
        });
        toast.present();

        this.navController.navigateRoot('/account-view');
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
