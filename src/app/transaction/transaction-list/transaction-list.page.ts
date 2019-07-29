import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { TransactionRequest } from 'server/src/models/transaction_request';
import { User } from 'src/app/models/user.model';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.page.html',
    styleUrls: ['./transaction-list.page.scss']
})
export class TransactionListPage implements OnInit {
    transactionRequests: TransactionRequest[];
    filter: 'inbound' | 'outbound' | 'current' = 'inbound';
    user: User;

    constructor(
        private transactionService: TransactionService,
        private userService: UserService,
    ) { }

    ngOnInit() {
        this.userService.getUser('0').subscribe({
            next: user => this.user = user
        });
        this.fetchTransactions();
    }

    // change the list: inbound, outbound or current
    segmentChanged({ target: { value } }) {
        this.filter = value;
    }

    // get all transactions to display them in a list
    fetchTransactions(event?: any) {
        this.transactionService.getTransactions().subscribe({
            next: transactionRequests => {
                this.transactionRequests = transactionRequests;
                if (event) {
                    event.target.complete();
                }
            }
        });
    }

    acceptTransaction(transactionID: string, takerID: string) {
        this.transactionService.acceptTransaction(transactionID, takerID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    declineTransaction(transactionID: string, takerID: string) {
        this.transactionService.declineTransaction(transactionID, takerID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    markGivenTransaction(transactionID: string) {
        this.transactionService.markGivenTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    markTakenTransaction(transactionID: string) {
        this.transactionService.markTakenTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    markGivenBackTransaction(transactionID: string) {
        this.transactionService.markGivenBackTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    markTakenBackTransaction(transactionID: string) {
        this.transactionService.markTakenBackTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    rateTakerTransaction(transactionID: string, comment: string, rating: number) {
        this.transactionService.rateTakerTransaction(transactionID, comment, rating).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    rateGiverTransaction(transactionID: string, comment: string, rating: number) {
        this.transactionService.rateGiverTransaction(transactionID, comment, rating).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    revokeTransaction(transactionID: string) {
        this.transactionService.revokeTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    formatDate(date: Date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return (new Date(date)).toLocaleDateString('de-DE', options);
    }

    refresh(event: any) {
        this.transactionRequests = [];
        this.fetchTransactions(event);
    }

}
