import { ThrowStmt } from '@angular/compiler';
import { Address } from './address.model';

export class User {
    userID: string;
    reviewScore: number;
    email: string;
    username: string;
    password: string;
    address: Address;

    constructor(
        userID?: string, reviewScore?: number, email?: string, username?: string, password?: string, address?: Address) {

        this.userID = userID;
        this.reviewScore = reviewScore;
        this.email = email;
        this.username = username;
        this.password = password;
        this.address = address;
      }
}
