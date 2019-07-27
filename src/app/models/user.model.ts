import { Address } from './address.model';

export interface User {
    _id?: string;
    userID?: string;
    reviewScore?: number;
    email: string;
    username: string;
    address: Address;
    location?: { type: "Point", coordinates: number[] };
}
