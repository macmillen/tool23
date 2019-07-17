import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
	selector: 'app-transaction-list',
	templateUrl: './transaction-list.page.html',
	styleUrls: ['./transaction-list.page.scss']
})
export class TransactionListPage implements OnInit {
	filter: String;
	transactions: [];
	filteredTransactions: [];

	constructor() {}

	ngOnInit() {}

	segmentChanged({ target: { value } }) {
		this.filter = value;
		this.fetchTransactions();
	}

	async fetchTransactions() {
		const res = await axios.get('http://localhost:3000/api/transactions');

		// current user: 123
		if (this.filter == 'inbound') {
			this.filteredTransactions = res.data.filter(
				trans => trans.ausleiherID == '321' && trans.status == 'pending'
			);
		} else if (this.filter == 'outbound') {
			this.filteredTransactions = res.data.filter(
				trans => trans.verleiherID == '321'
			);
		} else if (this.filter == 'current') {
			this.filteredTransactions = res.data.filter(
				trans => trans.status == 'accepted'
			);
		}
	}

	async changeTransactionStatus(status: String, transId: String) {
		await axios.post('http://localhost:3000/api/changeTransStatus', {
			status,
			id: transId
		});
		this.fetchTransactions();
	}
}
