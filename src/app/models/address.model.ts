import { ThrowStmt } from '@angular/compiler';

export class Address {
    street: string;
    houseNumber: string;
    zip: string;
    city: string;

    constructor(street?: string, houseNumber?: string, zip?: string, city?: string){
        this.street = street;
        this.houseNumber = houseNumber;
        this.zip = zip;
        this.city = city;
      }
}
