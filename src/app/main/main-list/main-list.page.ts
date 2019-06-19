import { Component, OnInit } from '@angular/core';
import {Item} from '../../models/item.model';
import { NavController, ModalController } from '@ionic/angular';
import { Address } from 'src/app/models/address.model';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.page.html',
  styleUrls: ['./main-list.page.scss'],
})

export class MainListPage implements OnInit {

  //Needed for navigation with NavController
  navController: NavController;

  items: Item[] = [];

  constructor(private navCtrl: NavController, private modalController: ModalController) {
    this.navController = navCtrl;
    this.generateTestValues();
  }

  ngOnInit() {
  }

  getRange(item: Item) {
    // TODO ** not implemented yet
    // Returns the current range to the item

    return '500m';
  }

  gotoDetail(item: Item) {
    // TODO ** not implemented yet
    // Navigates to the detail page of an item
  }

  generateTestValues(){
    // TODO ** needs to be removed if in production
    // Generates a set of fixed items for item list

      let item1 = new Item(
      'ID1',
      'Hammer1',
      'Das ist mein Hammer',
      new Date(),
      'https://cdn.pixabay.com/photo/2016/04/01/10/49/great-hammer-1300043_960_720.png',
      new Address());
      this.items.push(item1);
  }

}
