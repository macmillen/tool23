import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Item } from '../models/item.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class ItemService {

    constructor(private http: HttpClient) { }

    createItem(item: Item) {
        return this.http.post(environment.SERVER_URL + '/api/item', { item });
    }

    getItem(itemID: string) {
        return this.http.get<Item>(environment.SERVER_URL + '/api/item/' + itemID);
    }

    getAllItems() {
        return this.http.get<Item[]>(environment.SERVER_URL + '/api/items/');
    }

    deleteItem(itemID: string) {
        return this.http.delete(environment.SERVER_URL + '/api/item/' + itemID);
    }

    updateItem(item: Item) {
        console.log(item);
        return this.http.put(environment.SERVER_URL + '/api/item/', { item });
    }
}
