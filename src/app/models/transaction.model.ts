import { ThrowStmt } from '@angular/compiler';
import { Review } from "./review.model";

export class Transaction {
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

    constructor(
        lenderID?: string, borrowerID?: string,
        startDate?: Date, endDate?: Date, status?: string,
        verleiherRating?: number, ausleiherRating?: number,
        verleiherComment?: string, ausleiherComment?: string) {

        this.verleiherID = lenderID;
        this.ausleiherID = borrowerID;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.review.verleiherRating =  verleiherRating;
        this.review.ausleiherRating =  ausleiherRating;
        this.review.verleiherComment =  verleiherComment;
        this.review.ausleiherComment =  ausleiherComment;
      }
}
