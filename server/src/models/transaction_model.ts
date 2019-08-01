import { Review } from "./review_model";

/**
 * represents every interaction between two users for ledning an item
 */
export interface Transaction {
    _id?: string;
    itemID: string;
    giverID: string;
    takerID?: string;
    startDate: Date;
    endDate: Date;
    status?: 'pending' | 'accepted' | 'declined' | 'transfered' | 'finished' | 'revoked';
    markedAsGiven: boolean;
    markedAsTaken: boolean;
    markedAsGivenBack: boolean;
    markedAsTakenBack: boolean;
    review?: Review;
    message: string;
}
