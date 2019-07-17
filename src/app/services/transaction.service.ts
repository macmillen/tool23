import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })

export class TransactionService {

    constructor(private http: HttpClient) { }

    getTransactions() {
        return this.http.get<Transaction[]>(SERVER_URL + '/api/transactions');
    }

    requestItem(transaction: Transaction, itemID: string) {
        return this.http.post(SERVER_URL + '/api/request-item', { transaction, itemID });
    }
}