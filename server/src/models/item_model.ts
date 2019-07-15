import { Address } from "./address_model";

export interface Item {
    _id?: string;
    userID?: string;
    title: string;
    status: 'disabled' | 'active';
    description: string;
    creationDate?: Date;
    address: Address;
    tags: string[];
}