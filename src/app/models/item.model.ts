import { ThrowStmt } from '@angular/compiler';
import { Address } from './address.model';

export class Item {
  userID: string;
  title: string;
  description: string;
  creationDate: Date;
  imageURL: string;
  address: {
      zip: string,
      street: string,
      houseNumber: string,
      city: string
  }
  tags: string[];

    constructor(
        userID?: string, title?: string, description?: string,
        creationDate?: Date, imageURL?: string, 
        zip?: string, street?: string, houseNumer?: string, city?: string,
        tags?: string[]) {

        this.userID = userID;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
        this.imageURL = imageURL;
        this.tags = tags;
        this.address.zip = zip;
        this.address.street = street;
        this.address.houseNumber = houseNumer;
        this.address.city = city;
      }
}
