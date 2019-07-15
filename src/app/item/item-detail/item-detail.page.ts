import { Component } from '@angular/core';
import { Item } from '../../models/item.model';
import { Address } from 'src/app/models/address.model';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage {

  item: Item;

  constructor() {
    this.item = {
      address: { city: 'Gießen', houseNumber: '75', street: 'Frankfurterstraße', zip: '35392' },
      description: '', status: 'active', tags: [], title: 'asd', userID: ''
    };

    // this.item = new Item('Hans', 'Bierdose',
    // 'Ein kühles Bier zum Feierabend', new Date(),
    // 'https://dyn0.media.forbiddenplanet.com/products/3948460c.jpg.jpg',
    // new Address('Frankfurterstraße', '75', '35392', 'Gießen'));
  }



}
