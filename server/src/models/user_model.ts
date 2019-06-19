export interface User {
    _id?: string;
    userID: string;
    reviewScore: number;
    email: string;
    username: string;
    address: {
        zip: number,
        street: string,
        houseNumber: number,
        city: string
    }
    password: string;
}
