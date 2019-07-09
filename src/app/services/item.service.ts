import { Injectable } from '@angular/core';
import axios from 'axios';
import { SERVER_URL } from '../../environments/environment';
import { Item } from '../models/item.model';

@Injectable({ providedIn: 'root' })

export class ItemService {

    async createItem(itemIn: Item) {
        const res = await axios.post(SERVER_URL + '/api/item', {
            item: itemIn
        });
        return res;
    }

    async getItem(ID: string) {
        //Should return one item
        const res = await axios.get(SERVER_URL + '/api/item/' + ID);
        return res;
    }

    async getAllItems() {
        //Should return Array full of Items
        const res = await axios.get(SERVER_URL + '/api/items/');
        return res;
    }

    async deleteItem(ID: string) {
        //Should return one item
        const res = await axios.delete(SERVER_URL + '/api/item/' + ID);
        return res;
    }

}