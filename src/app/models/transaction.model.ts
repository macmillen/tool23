import { ThrowStmt } from '@angular/compiler';
import { Review } from "./review.model";

export class Transaction {
    lenderID: string;
    borrowerID: string;
    startDate: Date;
    endDate: Date;
    status: string;
    review: Review;

    constructor(
        lenderID?: string, borrowerID?: string, startDate?: Date, endDate?: Date, status?: string, review?: Review) {

        this.lenderID = lenderID;
        this.borrowerID = borrowerID;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.review = review;
      }
}
