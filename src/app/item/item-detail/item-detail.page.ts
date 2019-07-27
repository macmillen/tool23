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
  currentUser: User;
  isAllowedToEdit = false;
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
      id = params.get('itemID');
    });
    this.loadItem(id);
  }


  loadItem(itemID: string) {
    this.itemService.getItem(itemID).subscribe({
      next: item => {
        this.item = item;
        this.getItemImageURL();
        this.loadUser(this.item.userID);
      }
    });
  }

  loadUser(userID: string) {
    this.userService.getUser(userID).subscribe({
      next: user => {
        this.user = user;
        this.getUserImageURL();
      }
    });

    this.userService.getUser('0').subscribe({
      next: user => {
        this.currentUser = user;
        if (this.item.userID === this.currentUser.userID) {
          this.isAllowedToEdit = true;
        }
      }
    });
  }

  getUserImageURL() {
    const ref = this.fireStorage.ref(`profilepics/${this.user.userID}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.userImageURL = url; },
    });
  }

  getItemImageURL() {
    const ref = this.fireStorage.ref(`itempics/${this.item._id}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.itemImageURL = url; },
    });
  }

  goToTransactionDetail() {
    this.navController.navigateForward(`/transaction-detail/${this.item._id}`);
  }

  goToAccountView() {
    this.navController.navigateForward('/account-view');
  }

  goToEditItem() {
  
    this.navController.navigateForward(`/edit-item/${this.item._id}`);
  }

}
