import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from 'server/src/models/transaction_model';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';

@Component({
	selector: 'app-transaction-list',
	templateUrl: './transaction-list.page.html',
	styleUrls: ['./transaction-list.page.scss']
})
export class TransactionListPage implements OnInit {
	filter: String;
	transactions: [];
	filteredTransactions: Transaction[];
	user: User;

	constructor(
		private transactionService: TransactionService,
		private userService: UserService
	) {}

	ngOnInit() {}

	// change the list: inbound, outbound or current
	segmentChanged({ target: { value } }) {
		this.filter = value;
		this.fetchTransactions();
	}

	// get all transactions to display them in a list
	async fetchTransactions() {
		this.userService.getUser('0').subscribe({
			next: user => (this.user = user)
		});

		this.transactionService.getTransactions().subscribe({
			next: trans => {
				if (this.filter == 'inbound') {
					this.filteredTransactions = trans.filter(
						tr => tr.giverID == this.user.userID && tr.status == 'pending'
					);
				} else if (this.filter == 'outbound') {
					this.filteredTransactions = trans.filter(
						tr => tr.giverID != this.user.userID
					);
				} else if (this.filter == 'current') {
					this.filteredTransactions = trans.filter(
						tr => tr.status == 'accepted'
					);
				}
			}
		});
	}

	// accept or decline a transaction
	async changeTransactionStatus(status: String, trans: Transaction) {
		if (status == 'accept') {
			this.transactionService.acceptTransaction(trans).subscribe({
				next: () =>
					(this.filteredTransactions = this.filteredTransactions.filter(
						transaction => transaction._id != trans._id
					))
			});
		} else {
			this.transactionService.declineTransaction(trans).subscribe({
				next: () =>
					(this.filteredTransactions = this.filteredTransactions.filter(
						transaction => transaction._id != trans._id
					))
			});
		}
	}
}
