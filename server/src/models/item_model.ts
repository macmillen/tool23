import { Address } from "./address_model";

export interface Item {
    _id?: string;
    userID: string;
    title: string;
    status: 'disabled' | 'active';
    description: string;
    creationDate: Date;
    imageUrl: string;
    address: Address;
    tags: string[];
}