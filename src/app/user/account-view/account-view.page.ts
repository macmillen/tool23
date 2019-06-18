import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-account-view',
	templateUrl: './account-view.page.html',
	styleUrls: ['./account-view.page.scss']
})
export class AccountViewPage implements OnInit {
	user: Object;
	items: Object[];

	constructor() {}

	ngOnInit() {
		this.user = {
			name: 'Max Euler',
			email: 'max@gmail.com',
			city: 'Frankfurt am Main',
			review: 4.9,
			image:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAfCbeRRyzbx0OPvC8R8yxQLt_sO1n8Ks5dfTSkESsU1PHxTj7'
		};

		this.items = [
			{
				name: 'Item1',
				image:
					'https://cdn1.louis.de/content/catalogue/articles/img298x298/Gedore-Schlosserhammer-60350740_910_FR01_18.JPG'
			},
			{
				name: 'Item2',
				image:
					'https://cdn1.louis.de/content/catalogue/articles/img298x298/Gedore-Schlosserhammer-60350740_910_FR01_18.JPG'
			},
			{
				name: 'Item3',
				image:
					'https://cdn1.louis.de/content/catalogue/articles/img298x298/Gedore-Schlosserhammer-60350740_910_FR01_18.JPG'
			},
			{
				name: 'Item4',
				image:
					'https://cdn1.louis.de/content/catalogue/articles/img298x298/Gedore-Schlosserhammer-60350740_910_FR01_18.JPG'
			},
			{
				name: 'Item5',
				image:
					'https://cdn1.louis.de/content/catalogue/articles/img298x298/Gedore-Schlosserhammer-60350740_910_FR01_18.JPG'
			},
			{
				name: 'Item6',
				image:
					'https://cdn1.louis.de/content/catalogue/articles/img298x298/Gedore-Schlosserhammer-60350740_910_FR01_18.JPG'
			},
			{
				name: 'Item7',
				image:
					'https://cdn1.louis.de/content/catalogue/articles/img298x298/Gedore-Schlosserhammer-60350740_910_FR01_18.JPG'
			},
			{
				name: 'Item8',
				image:
					'https://cdn1.louis.de/content/catalogue/articles/img298x298/Gedore-Schlosserhammer-60350740_910_FR01_18.JPG'
			},
			{
				name: 'Item9',
				image:
					'https://cdn1.louis.de/content/catalogue/articles/img298x298/Gedore-Schlosserhammer-60350740_910_FR01_18.JPG'
			},
			{
				name: 'Item10',
				image:
					'https://cdn1.louis.de/content/catalogue/articles/img298x298/Gedore-Schlosserhammer-60350740_910_FR01_18.JPG'
			}
		];
	}

	editAccount() {
		console.log('Edit');
	}

	showHistory() {
		console.log('Show History');
	}
}
