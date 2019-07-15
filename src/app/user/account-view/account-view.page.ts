import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
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
                console.log(user);
                
                this.getUserImageURL();
            }
        });
        this.itemService.getAllItems().subscribe({
            next: items => this.items = items
        });
    }

    getUserImageURL() {
        const ref = this.fireStorage.ref(`profilepics/${this.user.userID}.jpg`);
        ref.getDownloadURL().subscribe({
            next: url => { this.userImageURL = url; },
            error: e => { console.log(e); }
        });

    }

    editAccount() {
        console.log('Edit');
    }

    showHistory() {
        console.log('Show History');
    }
}
