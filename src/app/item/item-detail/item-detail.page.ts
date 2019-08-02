import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
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
/**
 * Shows Details to specific item
 */
export class ItemDetailPage implements OnInit {

  item: Item = {
    userID: '0', description: '', status: 'active', tags: [],
    title: '', address: { city: '', houseNumber: '', street: '', zip: '' }
  };
  user: User = { userID: '0', reviewScore: 0, email: '', username: '', address: null, location: null};
  currentUser: User;
  isAllowedToEdit = false;
  userImageURL = '../../../assets/placeholder.png';
  itemImageURL = '../../../assets/placeholder_item.png';
  dataItem = false;


  constructor(private itemService: ItemService,
              private userService: UserService,
              private fireStorage: AngularFireStorage,
              private navController: NavController,
              private route: ActivatedRoute) {
  }

  /**
   * Fetch itemID and load corresponding item
   */
  ngOnInit() {
    let id: string;
    this.route.paramMap.subscribe(params => {
      id = params.get('itemID');
    });
    this.loadItem(id);
  }

  /**
   * Load item corresponding to itemID
   * @param itemID ID of item to load
   */
  loadItem(itemID: string) {
    this.itemService.getItem(itemID).subscribe({
      next: item => {
        this.item = item;
        this.getItemImageURL();
        this.loadUser(this.item.userID);
        this.dataItem = true;
      }
    });
  }

  /**
   * Load user corresponding to userID
   * @param userID ID of user to load
   */
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

  /**
   * get Image URL of user from server
   */
  getUserImageURL() {
    const ref = this.fireStorage.ref(`user-images/${this.user.userID}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.userImageURL = url; },
    });
  }
  /**
   * get Image URL of Item from server
   */
  getItemImageURL() {
    const ref = this.fireStorage.ref(`item-images/${this.item._id}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.itemImageURL = url; },
    });
  }
  /**
   * Navigate to details of transaction
   */
  goToTransactionDetail() {
    this.navController.navigateForward(`/transaction-detail/${this.item._id}`);
  }

  /**
   * navigate forward to user page, and if allowed, display edit page
   */
  goToAccountView() {
    if (this.isAllowedToEdit) {
      this.navController.navigateForward(`/account-view/0`);
    } else {
      this.navController.navigateForward(`/account-view/${this.user.userID}`);
    }
  }

  /**
   * navigate forward to edit page of item
   */
  goToEditItem() {
    this.navController.navigateForward(`/edit-item/${this.item._id}`);
  }

}
