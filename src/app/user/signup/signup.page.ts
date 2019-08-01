import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { NavController, ToastController } from '@ionic/angular';

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
    loading = false;

    constructor(
        private userService: UserService,
        private navController: NavController,
        private toastController: ToastController
    ) { }

    ngOnInit() {
        this.initUser();
        this.isAuth();
    }

    // check if the user is logged in
    isAuth() {
        this.userService.isAuthenticated().subscribe({
            next: isAuth => { if (isAuth) { this.navController.navigateRoot('/'); } }
        });
    }

    // create a new user
    register() {
        const {
            email,
            username,
            address: { city, houseNumber, zip }
        } = this.user;

        if (!email || !username || !city || !houseNumber || !zip) {
            this.presentToast('Alle Felder müssen ausgefüllt werden!');
            return;
        }

        if (username.length < 5) {
            this.presentToast('Der Benutzername muss mindestens fünf Zeichen lang sein!');
            return;
        }

        if (this.password.length < 6) {
            this.presentToast('Das Passwort muss mindestens sechs Zeichen lang sein!');
            return;
        }

        this.loading = true;
        this.userService.register(this.user, this.password).subscribe({
            next: () => this.signin(),
            error: e => {
                this.presentToast('Es gab ein Server Problem. Sorry!');
                this.loading = false;
            },
        });
    }

    signin() {
        if (this.user.email === '' || this.password === '') {
            this.presentToast('Beide Felder müssen ausgefüllt werden!');
            return;
        }
        this.loading = true;
        this.userService.signin(this.user.email, this.password).subscribe(
            {
                next: () => this.navController.navigateRoot('/'),
                error: e => {
                    this.presentToast('Es gab ein Server Problem. Sorry!');
                    this.loading = false;
                },
            });
    }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            header: 'Hinweis!',
            message,
            position: 'top',
            duration: 2000
        });
        toast.present();
    }

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
