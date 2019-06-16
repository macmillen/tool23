import { ThrowStmt } from '@angular/compiler';

export class Review {
    lenderRating: number;
    borrowerRating: number;
    lenderComment: string;
    borrowerComment: string;

    constructor(
        lenderRating?: number, borrowerRating?: number, lenderComment?: string, borrowerComment?: string) {

        this.lenderRating = lenderRating;
        this.borrowerRating = borrowerRating;
        this.lenderComment = lenderComment;
        this.borrowerComment = borrowerComment;
      }
}
