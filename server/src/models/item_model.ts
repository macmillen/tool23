export interface Item {
    _id?: string;
    userID: string;
    title: string;
    description: string;
    creationDate: Date;
    imageUrl: string;
    address: {
        zip: string,
        street: string,
        houseNumber: string,
        city: string
    }
    tags: string[];
}