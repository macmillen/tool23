import { ThrowStmt } from '@angular/compiler';
import { Address } from './address.model';

export class Item {
    userID: string;
    title: string;
    description: string;
    creationDate: Date;
    imageURL: string;
    address: Address;
    tags: string[];

    constructor(
        userID?: string, title?: string, description?: string,
        creationDate?: Date, imageURL?: string, address?: Address, tags?: string[]) {

        this.userID = userID;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
        this.imageURL = imageURL;
        this.address = address;
        this.tags = tags;
      }
}
