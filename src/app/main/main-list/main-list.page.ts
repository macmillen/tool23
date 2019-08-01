import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { ItemService } from 'src/app/services/item.service';
import { User } from 'server/src/models/user_model';
import { SearchComponent } from './search/search.component';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.page.html',
  styleUrls: ['./main-list.page.scss'],
})

export class MainListPage implements OnInit {

  items: Item[] = [];
  tags: string[] = [];
  user: User;
  searchMode = false;
  searchString = '';
  searching = false;
  itemImageURLs = new Map<string, string>();

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private userService: UserService,
    private itemService: ItemService,
    private fireStorage: AngularFireStorage,
    private toastController: ToastController,
  ) { }


  ngOnInit() {
    this.getUser();
    this.searchItems('');
  }

  searchItems(searchString: string) {
    this.searching = true;
    this.items = [];
    this.itemService.searchItems(searchString).subscribe({
      next: items => {
        this.items = items;
        items.forEach(i => this.getItemImageURL(i));
      },
      error: error => this.presentToast('Upsi, bei der Suche gabs ein Problem'),
      complete: () => this.searching = false
    });
  }

  getUser() {
    this.userService.getUser('0'  /* userID = '0' --> own userID */).subscribe({
      next: user => this.user = user
    });
  }

  getRange(distance: number): string {
    const distM = Math.round(distance);
    return distance < 1000 ? distM + ' m' : (distM / 1000).toFixed(2) + ' km';
  }

  getItemImageURL(item: Item) {
    const ref = this.fireStorage.ref(`item-images/${item._id}.jpg`);
    this.itemImageURLs.set(item._id, '../../../assets/placeholder_item.png');
    ref.getDownloadURL().subscribe({
      next: url => this.itemImageURLs.set(item._id, url)
    });
  }

  gotoDetail(itemID: string) {
    this.navController.navigateForward(`/item-detail/${itemID}`);
  }

  async searchItem() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: SearchComponent,
        componentProps: {
          items: this.items
        }
      });

    modal.onDidDismiss().then(data => {
      if (!data || !data.data) { return; }
      this.searchString = data.data.searchString;
      if (this.searchString) {
        this.searchItems(this.searchString);
      }
    });

    await modal.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      header: 'Hinweis!',
      message,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

}
