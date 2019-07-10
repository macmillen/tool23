import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { Address } from '../../models/address.model';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.page.html',
	styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
	user: User;
	address: Address;
	email: string;
	username: string;
	password: string;
	confirmPassword: string;
	zip: string;
	city: string;
	res: any;
	haveAccount = true;

	constructor(private router: Router) {}

	ngOnInit() {}

	async registerUser() {
		if (this.haveAccount) {
			if (this.email == null || this.password == null) return;
			this.res = await axios.post('http://localhost:3000/api/signin', {
				email: this.email,
				password: this.password
			});
		} else {
			if (
				!this.email.length ||
				!this.username.length ||
				!this.password.length ||
				!this.zip.length ||
				!this.city.length
			)
				return;
			if (this.password != this.confirmPassword) {
				throw Error('Passwords do not match!');
			}

			console.log('test');
			this.user = new User(
				null,
				null,
				this.email,
				this.username,
				this.password,
				this.zip,
				null,
				null,
				this.city
			);

			this.res = await axios.post(
				'http://localhost:3000/api/newUser',
				this.user
			);
		}
	}

	toggleHaveAccount() {
		this.haveAccount = !this.haveAccount;
		this.clearInputs();
	}

	clearInputs() {
		this.email = '';
		this.username = '';
		this.password = '';
		this.confirmPassword = '';
		this.city = '';
		this.zip = '';
	}
}
