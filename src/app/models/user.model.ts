import { ThrowStmt } from '@angular/compiler';

export class User {
  userID: string;
  reviewScore: number;
  email: string;
  username: string;
  address: {
      zip: string,
      street: string,
      houseNumber: string,
      city: string
  }
  password: string;

    constructor(
        userID?: string, reviewScore?: number, email?: string,
        username?: string, password?: string,
        zip?: string, street?: string, houseNumer?: string, city?: string) {

        this.userID = userID;
        this.reviewScore = reviewScore;
        this.email = email;
        this.username = username;
        this.password = password;
        this.address.zip = zip;
        this.address.street = street;
        this.address.houseNumber = houseNumer;
        this.address.city = city;
      }
}
