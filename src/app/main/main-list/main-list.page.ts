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

  
  items: Item[] = [];     // (Empty) array full for items to fetch into
  tags: string[] = [];    // (Empty) string array for search in tags
  user: User;             // Variable for the current user
  searchMode = false;    
  searchString = '';      
  searching = false;      // During a search true; else false
  itemImageURLs = new Map<string, string>();    // Map to match Items with their corresponding image-URL

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
    }

    ionViewDidEnter() {
        this.searchString = '';
        this.searchItems('');
    }

/**
  * Search Items on remote server, sets the class variable items.
  * 
  * @param {string} searchString String to search
  * @returns void (sets the class variable items)
  */
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
/**
  * Get the current user from the server. Sets the class variable user
  * 
  * @returns void (sets the class variable user)
  */
    getUser() {
        this.userService.getUser('0'  /* userID = '0' --> own userID */).subscribe({
            next: user => this.user = user
        });
    }
/**
  * returns given distance in m or km as string
  * 
  * @param {number} distance Distance in km
  * @returns Distance as string with ending in km or m
  */
    getRange(distance: number): string {
        const distM = Math.round(distance);
        return distance < 1000 ? distM + ' m' : (distM / 1000).toFixed(2) + ' km';
    }
/**
  * Fetches the image URL to given Item and saves it in map of images
  * 
  * @param {Item} item Item to get image for
  * @returns void (sets image in map)
  */
    getItemImageURL(item: Item) {
        const ref = this.fireStorage.ref(`item-images/${item._id}.jpg`);
        this.itemImageURLs.set(item._id, '../../../assets/placeholder_item.png');
        ref.getDownloadURL().subscribe({
            next: url => this.itemImageURLs.set(item._id, url)
        });
    }
/**
  * Navigates to item-detail-page of given item
  * 
  * @param {string} itemID ID of item
  * @returns void (navigates the navController to specific item-detail-page)
  */
    gotoDetail(itemID: string) {
        this.navController.navigateForward(`/item-detail/${itemID}`);
    }
/**
  * Opens modal for Item-Search
  * 
  * @returns void
  */
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
 /**
  * Display popup message
  * 
  * @param {string} message The message to display
  * @returns void
  */
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
