import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })

export class TransactionService {

    constructor(private http: HttpClient) { }

    getTransactions() {
        return this.http.get<Transaction[]>(environment.SERVER_URL + '/api/transactions');
    }

    requestItem(transaction: Transaction, itemID: string) {
        return this.http.post(environment.SERVER_URL + '/api/request-item', { transaction, itemID });
    }
}