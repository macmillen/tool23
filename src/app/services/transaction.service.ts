import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })

export class TransactionService {

    constructor(private http){}

    getTransaction(ID: string): Promise<Transaction> {
        // Should return one transactiob
        const res = this.http.get(SERVER_URL + '/api/transaction/' + ID);
        // TODO Validate Data to be Transaction
        return res.data;
    }

    createTransaction(transIn: Transaction) {
        const res = this.http.post(SERVER_URL + '/api/transaction', {
            transaction: transIn
        });
        // TODO Validate Data
        return res;
    }
}