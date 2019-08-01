import { Transaction } from "./transaction_model";
import { User } from "./user_model";
import { Item } from "./item_model";

/**
 * Represents the request of an transaction
 * Contains the transaction, item and the user
 */
export interface TransactionRequest extends Transaction {
    user: User;
    item: Item;
}
