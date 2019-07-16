import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { NavController, ModalController } from '@ionic/angular';
import { Address } from 'src/app/models/address.model';
import { UserService } from 'src/app/services/user.service';
import { ItemService } from 'src/app/services/item.service';
import { User } from 'server/src/models/user_model';
import { OPENCAGE_URL } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { calcBindingFlags } from '@angular/core/src/view/util';


interface Position {
  lat: string;
  lng: string;
}

interface GeoCode {
  results: {
    0: {
      geometry: {
        lat: number;
        lng: number;
      }
    }
  }
  status: {
    code: number;
    message: string;
  }
}

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
    private http: HttpClient) {

    this.generateTestValues();

  }

  ngOnInit() {
    this.userService.getUser('0'  /* userID = '0' --> own userID */).subscribe({
      next: user => {
          this.user = user;
          console.log(user);
      }
    });
  }

  getRange(item: Item) : string{
    // TODO ** not implemented yet
    // Returns the current range to the item
    if (this.user == null){
      console.error('Unknown Error, user not found!');
    } else {
      const user_address: Address = this.user.address;
      let item_address: Address = item.address;

      let user_location: Position = this.requestGeoCode(user_address.street, user_address.houseNumber, user_address.zip, user_address.city);
      let item_location: Position = this.requestGeoCode(item_address.street, item_address.houseNumber, item_address.zip, item_address.city);

      let distance = this.calculateDistance(parseFloat(user_location.lat), parseFloat(item_location.lat), parseFloat(user_location.lng), parseFloat(item_location.lng));
      console.log(distance);
      console.log(distance*1000);
      return distance*1000+' m';

    }
    return "null";
  }

  requestGeoCode(street: string, houseNumber: string, zip: string, city: string): Position{

    this.http.get(OPENCAGE_URL + street + ' '+ houseNumber + ', '+ zip + ' '+ city ).
    subscribe((data: GeoCode ) => {
      console.log(JSON.stringify(data));
      if (data.status.code == 200) {
        let place = data.results[0];
        console.log(place.geometry);
        return place.geometry;
      } else if (data.status.code == 402) {
        console.log('hit free-trial daily limit');
        console.log('become a customer: https://opencagedata.com/pricing'); 
        return null;
      } else {
        // other possible response codes:
        // https://opencagedata.com/api#codes
        console.log('error', data.status.message);
        return null;
      }
    });
    return null;
  }

  

  calculateDistance(lat1:number, lat2:number,long1: number,long2: number){
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
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

    const item1: Item = {
      address: { city: 'Gießen', houseNumber: '75', street: 'Frankfurterstraße', zip: '35392' },
      description: '', status: 'active', tags: [], title: 'asd', userID: ''
    };

    //   let item1: Itme = {
    //   'ID1',
    //   'Hammer1',
    //   'Das ist mein Hammer',
    //   new Date(),
    //   'https://cdn.pixabay.com/photo/2016/04/01/10/49/great-hammer-1300043_960_720.png',
    //   null, null, null, null,
    //   ["hammer","zimmermanshammer","schlagen"]
    // };
    this.items.push(item1);
  }

  searchItem() { }

}
