import { Component } from '@angular/core';
import { PopoverController, NavController, ToastController, IonItemSliding, ModalController } from '@ionic/angular';
import { MoreComponent } from './more/more.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { User } from 'src/app/models/user.model';
import { Item } from 'src/app/models/item.model';
import { UserService } from 'src/app/services/user.service';
import { ItemService } from 'src/app/services/item.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.page.html',
  styleUrls: ['./account-view.page.scss']
})
export class AccountViewPage {
  user: User;
  items: Item[];
  id: string;
  pending = true;

  userImageURL = 'assets/placeholder.png';
  itemImageURLs = new Map<string, string>();

  constructor(
    private popoverController: PopoverController,
    private route: ActivatedRoute,
    private userService: UserService,
    private itemService: ItemService,
    private fireStorage: AngularFireStorage,
    private navController: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController,
  ) { }


  ionViewWillEnter() {
    this.id = this.route.snapshot.paramMap.get('userID');
    this.id = this.id ? this.id : '0';

    this.pending = true;
    this.items = [];

    this.userService.getUser(this.id).subscribe({
      next: user => {
        this.user = user;
        this.getUserImageURL();
        this.getItems();
      }
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MoreComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async presentAlertConfirm(slidingItem: IonItemSliding, item: Item) {
    const alert = await this.alertController.create({
      header: 'Bestätigen',
      message: '<strong>Item wirklich löschen?</strong>',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            slidingItem.close();
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.deleteItem(item);
          }
        }
      ]
    });

    await alert.present();
  }


  getItems() {
    if (this.id === '0') {
      this.itemService.getItems('').subscribe({
        next: items => {
          this.items = items;
          items.forEach(i => this.getItemImageURL(i));
          this.pending = false;
        },
      });
    } else {
      this.itemService.getItems(this.user.userID).subscribe({
        next: items => {
          this.items = items;
          items.forEach(i => this.getItemImageURL(i));
          this.pending = false;
        },
      });
    }
  }

  updateItem(slidingItem: IonItemSliding, item: Item) {
    item.status = item.status === 'disabled' ? 'active' : 'disabled';
    slidingItem.close();
    this.itemService.updateItem(item).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${item.title}' wurde aktualisiert!`,
          position: 'top',
          duration: 2000
        });
        toast.present();

        this.navController.navigateRoot('/account-view');
      }
    });
  }

  deleteItem(item: Item) {
    this.itemService.deleteItem(item._id).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand' ${item.title} ' wurde gelöscht`,
          position: 'top',
          duration: 2000
        });
        toast.present();

        this.navController.navigateRoot('/account-view');
        this.getItems();
      }
    });
  }

  goToItemDetail(itemID: string) {
    this.navController.navigateForward(`/item-detail/${itemID}`);
  }

  goToCreateItem() {
    this.navController.navigateForward(`/edit-item/`);
  }

  goToEditAccount() {
    this.navController.navigateForward(`/edit-user/${this.user.userID}`);
  }

  getUserImageURL() {
    const ref = this.fireStorage.ref(`user-images/${this.user.userID}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.userImageURL = url; },
      error: e => { }
    });
  }

  getItemImageURL(item: Item) {
    this.itemImageURLs.set(item._id, 'assets/placeholder_item.png');
    const ref = this.fireStorage.ref(`item-images/${item._id}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => this.itemImageURLs.set(item._id, url)
    });
  }


  showHistory() {
    console.log('Show History');
  }

  async showReviews() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: ReviewsComponent,
        componentProps: {
          userID: this.id
        }
      });
    await modal.present();
  }
}
