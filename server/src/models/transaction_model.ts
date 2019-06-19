export interface Transaction {
    _id?: string;
    verleiherID: string;
    ausleiherID: string;
    startDate: Date;
    endDate: Date;
    status: string;    // ["pending", "accepted", "declined"]
    review: {
        verleiherRating: number;
        ausleiherRating: number;
        verleiherComment: string;
        ausleiherComment: string;
    }

}
