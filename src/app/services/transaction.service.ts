import { Injectable } from '@angular/core';
import axios from 'axios';
import { SERVER_URL } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })

export class TransactionService {

    async getTransaction(ID: string): Promise<Transaction> {
        // Should return one transactiob
        const res = await axios.get(SERVER_URL + '/api/transaction/' + ID);
        // TODO Validate Data to be Transaction
        return res.data;
    }

    async createTransaction(transIn: Transaction) {
        const res = await axios.post(SERVER_URL + '/api/transaction', {
            transaction: JSON.stringify(transIn)
        });
        // TODO Validate Data
        return res;
    }
}