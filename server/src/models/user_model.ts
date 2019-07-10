import { Address } from "./address_model";

export interface User {
    _id?: string;
    userID: string;
    reviewScore: number;
    email: string;
    username: string;
    address: Address;
    password: string;
}
