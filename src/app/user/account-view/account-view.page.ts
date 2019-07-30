import { Component, OnInit } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';
import { MoreComponent } from './more/more.component';
import { User } from 'src/app/models/user.model';
import { Item } from 'src/app/models/item.model';
import { UserService } from 'src/app/services/user.service';
import { ItemService } from 'src/app/services/item.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.page.html',
  styleUrls: ['./account-view.page.scss']
})
export class AccountViewPage  {
  user: User = { userID: '0', reviewScore: 0, email: '', username: '', address: null, location: null};
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
    private navController: NavController
  ) { }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MoreComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }


  ionViewWillEnter() {
    this.id = this.route.snapshot.paramMap.get('userID');
    this.id = this.id ? this.id : '0';

    this.userService.getUser(this.id).subscribe({
      next: user => {
        this.user = user;
        this.getUserImageURL();
        this.itemService.getItems('').subscribe({
          next: items => {
            this.items = items;
            items.forEach(i => this.getItemImageURL(i));
            this.pending = false;
          },
        });
      }
    });
  }

  goToItemDetail(itemID: string) {
    this.navController.navigateForward(`/item-detail/${itemID}`);
  }

  getUserImageURL() {
    const ref = this.fireStorage.ref(`user-images/${this.user.userID}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.userImageURL = url; },
      error: e => { }
    });
  }

  getItemImageURL(item: Item) {
    const ref = this.fireStorage.ref(`item-images/${item._id}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => this.itemImageURLs.set(item._id, url)
    });
  }


  goToEditAccount() {
    this.navController.navigateForward(`/edit-user/${this.user.userID}`);
  }

  showHistory() {
    console.log('Show History');
  }
}
