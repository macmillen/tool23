import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })

export class TransactionService {

    constructor(private http: HttpClient) {}

    getTransaction(ID: string){
        // Should return one transactiob
        return this.http.get<Transaction>(SERVER_URL + '/api/transaction/' + ID);
    }

    createTransaction(transIn: Transaction) {
        return this.http.post(SERVER_URL + '/api/transaction', {
            transaction: transIn
        });
    }
}