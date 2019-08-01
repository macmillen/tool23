import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss']
})

/**
 * SignUp Page for users to register
 */
export class SignupPage implements OnInit {
    user: User;     // User to work with
    password: string;   // password, which is inserted
    confirmPassword: string;    // password to confirm it is typed correctly
    haveAccount = true;         
    loading = false;        // True, as long as something is loading in the background, else false

    constructor(
        private userService: UserService,
        private navController: NavController,
        private toastController: ToastController
    ) { }

    /**
    * Initializes user and checks for authentication
    * 
    */
    ngOnInit() {
        this.initUser();
        this.isAuth();
    }

    /**
    * Check if user is authenticated
    * 
    */
    isAuth() {
        const isAuthSub = this.userService.isAuthenticated().subscribe({
            next: isAuth => {
                if (isAuth) {
                    this.navController.navigateRoot('/');
                } else {
                    isAuthSub.unsubscribe();
                }
            }
        });
    }

    /**
    * Registers (creates) User based on values input in the corresponding html form
    * 
    */
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
            next: () => this.signin(true),
            error: e => {
                this.presentToast('Es gab ein Server Problem. Sorry!');
                this.loading = false;
            },
        });
    }
   /**
    * Sign in of the user, based on class variable User and Password
    * 
    */
    signin(welcomeSlides?: boolean) {
        if (this.user.email === '' || this.password === '') {
            this.presentToast('Beide Felder müssen ausgefüllt werden!');
            return;
        }
        this.loading = true;
        this.userService.signin(this.user.email, this.password).subscribe(
            {
                next: () => welcomeSlides ? this.navController.navigateRoot('slide') : this.navController.navigateRoot('/'),
                error: e => {
                    this.presentToast('Es gab ein Server Problem. Sorry!');
                    this.loading = false;
                },
            });
    }

    
    /**
    * Present a toast with given message
    * @param {string} message Message to display in toast
    * 
    */
    async presentToast(message: string) {
        const toast = await this.toastController.create({
            header: 'Hinweis!',
            message,
            position: 'top',
            duration: 2000
        });
        toast.present();
    }

    
    /**
    * Toogle the boolean "haveAccount"
    * 
    */
    toggleHaveAccount() {
        this.haveAccount = !this.haveAccount;
        this.clearInputs();
    }

    /**
    * Clears typed password and confirmedPassword
    * 
    */
    private clearInputs() {
        this.password = '';
        this.confirmPassword = '';
    }

    
    /**
    * Initialize empty user to class variable user
    * 
    */
    private initUser() {
        this.user = {
            email: '',
            username: '',
            address: { city: '', houseNumber: '', street: '', zip: '' }
        };
    }
}
