import { Component } from '@angular/core';
import { PopoverController, NavController, ModalController, ToastController, IonItemSliding } from '@ionic/angular';
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
/**
 * Page to view an account, either your own or of an other user
 */
export class AccountViewPage {
  user: User;
  items: Item[];
  id: string;
  pending = true;

  userImageURL = 'assets/placeholder.png';    // user image with placeholder pic
  itemImageURLs = new Map<string, string>();  //Map for matching images to their corresponding image url

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


  ionViewDidEnter() {
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

  /**
  * activates and presents popover from event
  * 
  * @param {any} ev Event to present in popover
  * @returns void (closes popover)
  */  
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MoreComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  /**
  * Alert to confirm deletion of item
  * 
  * @param {IonItemSliding} slidingItem Respective html slider to inital position
  * @param {Item} item Item which should be deleted
  * @returns void (opens alert)
  */
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

  /**
  * Updates item status through slider
  * 
  * @param {IonItemSliding} slidingItem Respective html slider to inital position
  * @param {Item} item Item which status should be updated
  * @returns void (navigates to account-view)
  */
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

        this.navController.navigateRoot('/tabs/account-view');
      }
    });
  }

  /**
  * Updates item status through slider
  * 
  * @param {Item} item Item which status should be deleted
  * @returns void (navigates to account-view)
  */
  deleteItem(item: Item) {
    this.itemService.deleteItem(item._id).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand' ${item.title} ' wurde gelöscht`,
          position: 'top',
          duration: 2000
        });
        toast.present();

        this.navController.navigateRoot('/tabs/account-view');
        this.getItems();
      }
    });
  }

  /**
  * Navigate to item-detail-page of item
  * 
  * @param {string} itemID ID of item to navigate to
  */
  goToItemDetail(itemID: string) {
    this.navController.navigateForward(`/item-detail/${itemID}`);
  }

  /**
  * Navigate to item-creation-page of item
  */
  goToCreateItem() {
    this.navController.navigateForward(`/edit-item/`);
  }
  /**
  * Navigate to account-page of current user
  * 
  */
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
  /**
  * Fetches and sets item image url in class variable map
  * 
  * @param {Item} item Item to get Image from
  */
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
/**
  * Displays modal to show all reviews
  * 
  */
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
