import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';
import { Item } from 'src/app/models/item.model';
import { User } from 'src/app/models/user.model';
import { ImagePicker } from '@ionic-native/image-picker';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})
export class EditItemPage implements OnInit {


  user: User;
  itemImageURL = '../../../assets/placeholder_item.png';

  item: Item = {userID: '0', description: '', status: 'active', tags: [],
                title: '', address: { city: '', houseNumber: '', street: '', zip: '' } };
  tagInput = '';
  statusBool: boolean;

  constructor(private navController: NavController,
              private route: ActivatedRoute,
              private fireStorage: AngularFireStorage,
              private itemService: ItemService,
              private toastController: ToastController,
              private userService: UserService,
              private imagePicker: ImagePicker) {
}

  ngOnInit() {
    let id: string;
    this.route.paramMap.subscribe(params => {
      id = params.get('itemID');
    });
    this.loadItem(id);
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
    const ref = this.fireStorage.ref(`itempics/${this.item._id}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.itemImageURL = url; },
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

  selectImage() {
    // this.imagePicker.getPictures({maximumImagesCount: 1, width: 100, height: 100}).then((results) => {
    //   for (var i = 0; i < results.length; i++) {
    //       console.log('Image URI: ' + results[i]);
    //   }
    // }, (err) => { });
  }

}
