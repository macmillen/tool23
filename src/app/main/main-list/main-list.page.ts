import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { NavController, ModalController } from '@ionic/angular';
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
  user: User;

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private userService: UserService,
    private itemService: ItemService,
    private fireStorage: AngularFireStorage
  ) {
    //this.generateTestValues();
    this.loadItems();
  }

  ngOnInit() {
    this.userService.getUser('0'  /* userID = '0' --> own userID */).subscribe({
      next: user => {
          this.user = user;
          console.log(user);
      }
    });
  }

  getRange(item: Item) : string {
    return (item.distance < 1)
    ? String(item.distance * 1000) + ' m'
    : String(item.distance) + ' km';
  }

  loadItems() {
      this.itemService.searchItems("Dose").subscribe();
      this.itemService.getTags().subscribe(t=>console.log(t));
  }

  calculateDistance(lat1:number, lat2:number, long1: number, long2: number) : number{
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    console.log(dis);
    return dis;
  }

  getItemImageURL(item: Item){
    const ref = this.fireStorage.ref(`itempics/${item._id}.jpg`);
    
    ref.getDownloadURL().subscribe({
        next: url => {return String(url); },
    });
  }

  gotoDetail(itemID: string) {
    this.navController.navigateForward(`/item-detail/${itemID}`);
  }

  goToCreateItem() {
    this.navController.navigateForward(`/create-item`);
  }

  generateTestValues() {
    // TODO ** needs to be removed if in production
    // Generates a set of fixed items for item list

    // const item1: Item = {
    //   address: { city: 'Gießen', houseNumber: '75', street: 'Frankfurter Straße', zip: '35392', latitude: 50.575635, longitude: 8.6626056},
    //   description: '', status: 'active', tags: ["test","hammer","fork"], title: 'asd', userID: ''
    // };

    //   let item1: Itme = {
    //   'ID1',
    //   'Hammer1',
    //   'Das ist mein Hammer',
    //   new Date(),
    //   'https://cdn.pixabay.com/photo/2016/04/01/10/49/great-hammer-1300043_960_720.png',
    //   null, null, null, null,
    //   ["hammer","zimmermanshammer","schlagen"]
    // };
    //this.items.push(item1);
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
      if (data['data'] != null) {
        console.log('The id:', data['data']);
        this.gotoDetail(data['data']._id);
      }else{
       console.log('No Return Value added!');
      }
   });

    await modal.present();
  }

}
