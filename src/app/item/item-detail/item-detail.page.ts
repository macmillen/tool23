import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { Address } from 'src/app/models/address.model';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'server/src/models/user_model';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
	selector: 'app-item-detail',
	templateUrl: './item-detail.page.html',
	styleUrls: ['./item-detail.page.scss']
})
export class ItemDetailPage implements OnInit {

  item: Item;
  user: User;
  userImageURL = '../../../assets/placeholder.png';
  itemImageURL = '../../../assets/placeholder_item.png';


  constructor(private itemService: ItemService,
              private userService: UserService,
              private fireStorage: AngularFireStorage,
              private navController: NavController,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    let id: string;
    this.route.paramMap.subscribe(params => {
      id = params.get('id');
      console.log(id);
    });
    this.loadItem(id);
    this.loadUser(this.item.userID);
  }

  loadItem(itemID: string) {
    this.itemService.getItem(itemID).subscribe({
      next: item => {
        this.item = item;
        console.log(item);

        this.getItemImageURL();
      }
    });
  }

  loadUser(userID: string) {
    this.userService.getUser(userID).subscribe({
      next: user => {
          this.user = user;
          console.log(user);

          this.getUserImageURL();
      }
    });
  }

  getUserImageURL() {
    const ref = this.fireStorage.ref(`profilepics/${this.user.userID}.jpg`);
    ref.getDownloadURL().subscribe({
        next: url => { this.userImageURL = url; },
        error: e => { console.log(e); }
    });
  }

  getItemImageURL() {
    const ref = this.fireStorage.ref(`itempics/${this.item._id}.jpg`);
    ref.getDownloadURL().subscribe({
        next: url => { this.itemImageURL = url; },
        error: e => { console.log(e); }
    });
  }

  goToTransactionDetail() {
    this.navController.navigateForward('/transaction-detail');
  }

  goToAccountView() {
    this.navController.navigateForward('/account-view');
  }
}
