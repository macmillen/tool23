import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { NavController, ModalController } from '@ionic/angular';
import { Address } from 'src/app/models/address.model';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.page.html',
  styleUrls: ['./main-list.page.scss'],
})

export class MainListPage implements OnInit {

  items: Item[] = [];

  constructor(private navController: NavController, private modalController: ModalController) {
    this.generateTestValues();
  }

  ngOnInit() {
  }

  getRange(item: Item) {
    // TODO ** not implemented yet
    // Returns the current range to the item

    return '500m';
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
