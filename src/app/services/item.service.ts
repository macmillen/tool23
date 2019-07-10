import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../environments/environment';
import { Item } from '../models/item.model';

@Injectable({ providedIn: 'root' })

export class ItemService {

    constructor(private http){}

    createItem(itemIn: Item) {
        const res = this.http.post(SERVER_URL + '/api/item', {
            item: itemIn
        });
        // TODO Validate Data
        return res;
    }

    getItem(ID: string) {
        // Should return one item
        const res = this.http.get(SERVER_URL + '/api/item/' + ID);
        // TODO Validate Data to be Item
        return res;
    }

    getAllItems() {
        // Should return Array full of Items
        const res = this.http.get(SERVER_URL + '/api/items/');
        // TODO Validate Data to be Item Array
        return res;
    }

    deleteItem(ID: string) {
        // Should return one item
        const res = this.http.delete(SERVER_URL + '/api/item/' + ID);
        // TODO Validate Data
        return res;
    }

}