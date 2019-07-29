import { Transaction } from "./transaction_model";
import { User } from "./user_model";
import { Item } from "./item_model";

export interface TransactionRequest extends Transaction {
    user: User;
    item: Item;
}
