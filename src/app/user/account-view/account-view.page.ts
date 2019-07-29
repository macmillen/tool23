import { Component, OnInit } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';
import { MoreComponent } from './more/more.component';
import { User } from 'src/app/models/user.model';
import { Item } from 'src/app/models/item.model';
import { UserService } from 'src/app/services/user.service';
import { ItemService } from 'src/app/services/item.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
    selector: 'app-account-view',
    templateUrl: './account-view.page.html',
    styleUrls: ['./account-view.page.scss']
})
export class AccountViewPage implements OnInit {
    user: User;
    items: Item[];

    userImageURL = 'assets/placeholder.png';

    constructor(
        private popoverController: PopoverController,
        private userService: UserService,
        private itemService: ItemService,
        private fireStorage: AngularFireStorage,
        private navController: NavController
    ) { }

    async presentPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: MoreComponent,
            event: ev,
            translucent: true
        });
        return await popover.present();
    }
    ngOnInit() {
        this.userService.getUser('0'  /* userID = '0' --> own userID */).subscribe({
            next: user => {
                this.user = user;
                this.getUserImageURL();
            }
        });
        this.itemService.getAllItems().subscribe({
            next: items => this.items = items
        });
    }

    ionViewWillEnter() {
        this.itemService.getAllItems().subscribe({
            next: items => this.items = items
        });
    }

    goToItemDetail(itemID: string) {
        this.navController.navigateForward(`/item-detail/${itemID}`);
    }

    getUserImageURL() {
        const ref = this.fireStorage.ref(`profile-images/${this.user.userID}.jpg`);
        ref.getDownloadURL().subscribe({
            next: url => { this.userImageURL = url; },
            error: e => {  }
        });
    }

    goToEditAccount() {
        this.navController.navigateForward(`/edit-view/${this.user.userID}`);
    }

    showHistory() {
        console.log('Show History');
    }
}
