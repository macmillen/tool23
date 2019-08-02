import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { TransactionRequest } from '../models/transaction-request.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    constructor(private http: HttpClient) { }

    /**
     * Get all Transactions from one user
     * @param userID ID of user
     */
    getTransactions(userID: string) {
        return this.http.get<TransactionRequest[]>(environment.SERVER_URL + '/api/transactions/' + userID);
    }

    /**
     * Accept a transaction
     * @param transactionID ID of transaction
     * @param takerID ID of taker (user)
     */
    acceptTransaction(transactionID: string, takerID: string) {
        return this.http.post(environment.SERVER_URL + '/api/accept-transaction', { transactionID });
    }
    /**
     * Decline a transaction
     * @param transactionID ID of transaction
     * @param takerID ID of taker (user)
     */
    declineTransaction(transactionID: string, takerID: string) {
        return this.http.post(environment.SERVER_URL + '/api/decline-transaction', { transactionID });
    }

    /**
     * Send item Request to server
     * @param transaction transaction to send
     * @param itemID ID of item of transaction
     */
    requestItem(transaction: Transaction, itemID: string) {
        return this.http.post(environment.SERVER_URL + '/api/request-item', { transaction, itemID });
    }

    /**
     * Send Update to server that item has been given away
     * @param transactionID ID of transaction
     */
    markGivenTransaction(transactionID: string) {
        return this.http.put(environment.SERVER_URL + '/api/mark-given-transaction', { transactionID });
    }

    /**
     * Send Update to server that item has been taken
     * @param transactionID ID of transaction
     */
    markTakenTransaction(transactionID: string) {
        return this.http.put(environment.SERVER_URL + '/api/mark-taken-transaction', { transactionID });
    }

    /**
     * Send Update to server that item has been given back to giver
     * @param transactionID 
     */
    markGivenBackTransaction(transactionID: string) {
        return this.http.put(environment.SERVER_URL + '/api/mark-given-back-transaction', { transactionID });
    }

    /**
     * Send Update to server that Taker gave Item back to giver
     * @param transactionID 
     */
    markTakenBackTransaction(transactionID: string) {
        return this.http.put(environment.SERVER_URL + '/api/mark-taken-back-transaction', { transactionID });
    }

    /**
     * Rate the transaction as Taker
     * @param transactionID ID of transaction
     * @param comment Comment of Taker 
     * @param rating Rating of Taker
     */
    rateTakerTransaction(transactionID: string, comment: string, rating: number) {
        return this.http.put(environment.SERVER_URL + '/api/rate-taker-transaction',
            { transactionID, takerComment: comment, takerRating: rating });
    }

    /**
     * Rate the transaction as Giver
     * @param transactionID ID of transaction
     * @param comment Comment of Giver 
     * @param rating Rating of Giver
     */
    rateGiverTransaction(transactionID: string, comment: string, rating: number) {
        return this.http.put(environment.SERVER_URL + '/api/rate-giver-transaction',
            { transactionID, giverComment: comment, giverRating: rating });
    }
    
    /**
     * Revoke transaction before it is finished
     * @param transactionID ID of transaction
     */
    revokeTransaction(transactionID: string) {
        return this.http.put(environment.SERVER_URL + '/api/revoke-transaction', { transactionID });
    }

}
