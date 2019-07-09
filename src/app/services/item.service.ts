import { Injectable } from '@angular/core';
import axios from 'axios';
import { SERVER_URL } from '../../environments/environment';
import { Item } from '../models/item.model';

@Injectable({ providedIn: 'root' })

export class ItemService {

    async createItem(itemIn: Item) {
        const res = await axios.post(SERVER_URL + '/api/item', {
            item: JSON.stringify(itemIn)
        });
        // TODO Validate Data
        return res;
    }

    async getItem(ID: string): Promise<Item>{
        // Should return one item
        const res = await axios.get(SERVER_URL + '/api/item/' + ID);
        // TODO Validate Data to be Item
        return res.data;
    }

    async getAllItems(): Promise<Item[]> {
        // Should return Array full of Items
        const res = await axios.get(SERVER_URL + '/api/items/');
        // TODO Validate Data to be Item Array
        return res.data;
    }

    async deleteItem(ID: string) {
        // Should return one item
        const res = await axios.delete(SERVER_URL + '/api/item/' + ID);
        // TODO Validate Data
        return res;
    }

}