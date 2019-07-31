import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Item } from '../models/item.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class ItemService {

    constructor(private http: HttpClient) { }


    /**
    * Sends and create Item at Server
    * @param Item to send
    * @returns Observable of POST-Method; Error 404 if failed.
    */
    createItem(item: Item) {
        return this.http.post(environment.SERVER_URL + '/api/item', { item });
    }

    /**
    * Gets Item from Server
    * @param ItemID to identify item
    * @returns Observable with Item in data; Error 404 if item isnt found
    */
    getItem(itemID: string) {
        return this.http.get<Item>(environment.SERVER_URL + '/api/item/' + itemID);
    }

    /**
    * Gets all Items from a user from the server
    * @param UserID to identify user to fetch items from
    * @returns Observable with Array of Items which are owned by user; Error 404 if item isnt found
    */
    getItems(userID: string) {
        return this.http.get<Item[]>(environment.SERVER_URL + `/api/items/${userID}`);
    }

    /**
    * Delete Item on server
    * @param ItemID of item which is deleted
    * @returns Observable with response; Error 404 if failed
    */
    deleteItem(itemID: string) {
        return this.http.delete(environment.SERVER_URL + '/api/item/' + itemID);
    }

    /**
    * Update Item on server
    * @param Item with updated values
    * @returns Observable with response; Error 404 if failed
    */
    updateItem(item: Item) {
        return this.http.put(environment.SERVER_URL + '/api/item/', { item });
    }

    /**
    * Search for items, search based on name and tags
    * @param Search-String to search for
    * @returns Observable with response; Error 404 if failed
    */
    searchItems(searchString: string) {
        return this.http.get<Item[]>(environment.SERVER_URL + '/api/search-items/' + searchString);
    }

    /**
    * Get all used tags of items
    * @returns Observable with Array full of used tags; Error 404 if failed
    */
    getTags() {
        return this.http.get<string[]>(environment.SERVER_URL + '/api/tags');
    }
}
