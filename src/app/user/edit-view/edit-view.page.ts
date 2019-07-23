import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-edit-view',
	templateUrl: './edit-view.page.html',
	styleUrls: ['./edit-view.page.scss']
})
export class EditViewPage implements OnInit {
	user: User;
	id: string;

	constructor(
		private userService: UserService,
		private navController: NavController,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		// TODO current userID
		this.initUser();
		this.id = this.route.snapshot.paramMap.get('userID');
		this.userService.getUser(this.id).subscribe({
			next: user => {
				this.user = user;
			}
		});
	}

	updateUser() {
		this.userService.updateUser(this.user).subscribe(
			res => {
				console.log(res);
				this.navController.pop();
			},
			e => console.log(e)
		);
	}

	private initUser() {
		this.user = {
			email: '',
			username: '',
			address: { city: '', houseNumber: '', street: '', zip: '' }
		};
	}
}
