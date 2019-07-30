import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { TransactionRequest } from '../models/transaction-request.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    constructor(private http: HttpClient) { }

    getTransactions() {
        return this.http.get<TransactionRequest[]>(environment.SERVER_URL + '/api/transactions');
    }

    acceptTransaction(transactionID: string, takerID: string) {
        return this.http.post(environment.SERVER_URL + '/api/accept-transaction', { transactionID });
    }

    declineTransaction(transactionID: string, takerID: string) {
        return this.http.post(environment.SERVER_URL + '/api/decline-transaction', { transactionID });
    }

    requestItem(transaction: Transaction, itemID: string) {
        return this.http.post(environment.SERVER_URL + '/api/request-item', { transaction, itemID });
    }

    markGivenTransaction(transactionID: string) {
        return this.http.put(environment.SERVER_URL + '/api/mark-given-transaction', { transactionID });
    }

    markTakenTransaction(transactionID: string) {
        return this.http.put(environment.SERVER_URL + '/api/mark-taken-transaction', { transactionID });
    }

    markGivenBackTransaction(transactionID: string) {
        return this.http.put(environment.SERVER_URL + '/api/mark-given-back-transaction', { transactionID });
    }

    markTakenBackTransaction(transactionID: string) {
        return this.http.put(environment.SERVER_URL + '/api/mark-taken-back-transaction', { transactionID });
    }

    rateTakerTransaction(transactionID: string, comment: string, rating: number) {
        return this.http.put(environment.SERVER_URL + '/api/rate-taker-transaction',
            { transactionID, takerComment: comment, takerRating: rating });
    }

    rateGiverTransaction(transactionID: string, comment: string, rating: number) {
        return this.http.put(environment.SERVER_URL + '/api/rate-giver-transaction',
            { transactionID, giverComment: comment, giverRating: rating });
    }

    revokeTransaction(transactionID: string) {
        return this.http.put(environment.SERVER_URL + '/api/revoke-transaction', { transactionID });
    }

}
