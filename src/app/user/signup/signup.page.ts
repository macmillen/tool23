import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { NavController } from '@ionic/angular';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.page.html',
	styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
	user: User;
	password: string;
	confirmPassword: string;
	haveAccount = true;

	constructor(
		private router: Router,
		private userService: UserService,
		private navController: NavController
	) {}

	ngOnInit() {
		this.initUser();
		this.isAuth();
	}

	// check if the user is logged in
	isAuth() {
		this.userService.isAuthenticated().subscribe({
			next: isAuth =>
				isAuth ? this.navController.navigateRoot('/account-view') : null
		});
	}

	// create a new user
	register() {
		this.userService.register(this.user, this.password).subscribe({
			next: () => this.signin(),
			error: e => console.log(e)
		});
	}

	signin() {
		this.userService
			.signin(this.user.email, this.password)
			.subscribe(
				() => this.router.navigate(['main-list']),
				e => console.log(e)
			);
	}

	// switch between signin and signup view
	toggleHaveAccount() {
		this.haveAccount = !this.haveAccount;
		this.clearInputs();
	}

	private clearInputs() {
		this.password = '';
		this.confirmPassword = '';
	}

	private initUser() {
		this.user = {
			email: '',
			username: '',
			address: { city: '', houseNumber: '', street: '', zip: '' }
		};
	}
}
