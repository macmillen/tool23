import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { Item } from 'server/src/models/item_model';
import { ItemService } from 'src/app/services/item.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
    selector: 'app-transaction-detail',
    templateUrl: './transaction-detail.page.html',
    styleUrls: ['./transaction-detail.page.scss'],
})
export class TransactionDetailPage implements OnInit {

    item: Item;
    transaction: Transaction;
    startDateString: string;
    endDateString: string;
    errorDate = false;
    minYear = new Date().getFullYear();
    maxYear = new Date().getFullYear() + 1;

    constructor(
        private route: ActivatedRoute,
        private itemService: ItemService,
        private transactionService: TransactionService,
        private toastController: ToastController,
        private navController: NavController,
    ) { }

    ngOnInit() {
        this.getItemID();
    }

    private getItemID() {
        this.route.paramMap.subscribe(params => {
            const itemID = params.get('itemID');
            this.getItem(itemID);
        });
    }

    getItem(itemID: string) {
        this.itemService.getItem(itemID).subscribe({
            next: item => {
                this.item = item;
                this.transaction = {
                    startDate: null,
                    endDate: null,
                    message: '',
                    itemID: item._id,
                    giverID: item.userID,
                    markedAsGiven: false,
                    markedAsGivenBack: false,
                    markedAsTaken: false,
                    markedAsTakenBack: false,
                };
            },
            error: e => console.log(e)
        });
    }

    requestItem() {
        this.transactionService.requestItem(this.transaction, this.item._id).subscribe({
            next: async () => {
                const toast = await this.toastController.create({
                    message: 'Anfrage wurde gestellt.',
                    duration: 2000,
                    position: 'top'
                });
                toast.present();
                this.navController.navigateRoot('/tabs/transaction-list?segment=outbound');
            }
        });
    }

    setDate(event, type: 'start' | 'end') {
        const dateString = event.target.value;

        if (type === 'start') {
            this.transaction.startDate = new Date(dateString);
        } else if (type === 'end') {
            this.transaction.endDate = new Date(dateString);
        }
        if (this.transaction.startDate && this.transaction.endDate) {
            this.errorDate = this.transaction.endDate.getTime() - this.transaction.startDate.getTime() < 1;
        }
    }

    toDateString(date: Date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    }

}
