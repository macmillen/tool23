import { Review } from './review.model';

export interface Transaction {
    _id?: string;
    itemID: string;
    giverID: string;
    takerID: string;
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'accepted' | 'declined';
    review: Review;
    message: string;
}
