import { Transaction } from './transaction.model';
import { User } from './user.model';
import { Item } from './item.model';

export interface TransactionRequest extends Transaction {
    user: User;
    item: Item;
}
