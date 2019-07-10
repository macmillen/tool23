import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../environments/environment';
import { Item } from '../models/item.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class ItemService {

    constructor(private http: HttpClient) {}

    createItem(itemIn: Item) {
        return this.http.post(SERVER_URL + '/api/item', {
            item: itemIn
        });
    }

    getItem(ID: string) {
        return this.http.get<Item>(SERVER_URL + '/api/item/' + ID);
    }

    getAllItems() {
        // Should return Array full of Items
        return this.http.get<Item[]>(SERVER_URL + '/api/items/');

    }

    deleteItem(ID: string) {
        // Should return one item
        return this.http.delete(SERVER_URL + '/api/item/' + ID);
    }

}