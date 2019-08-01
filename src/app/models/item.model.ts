import { Address } from './address.model';


export interface Item {
    _id?: string;
    userID?: string;
    title: string;
    status: 'disabled' | 'active';
    description: string;
    creationDate?: Date;
    address: Address;
    tags: string[];
    distance?: number;
    location?: { type: 'Point', coordinates: number[] };
}
