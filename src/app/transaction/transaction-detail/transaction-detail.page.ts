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

/**
 * Detailpage over a specific transaction
 */
export class TransactionDetailPage implements OnInit {

    item: Item; // Item of the transaction
    transaction: Transaction;   // The transaction itself
    startDateString: string;    // String of date when transaction starts
    endDateString: string;      // String of date when transaction ends
    errorDate = false;          // Bool Value if startDate is later than endDate
    minYear = new Date().getFullYear(); // Time span start
    maxYear = new Date().getFullYear() + 1; // Time span end

    constructor(
        private route: ActivatedRoute,
        private itemService: ItemService,
        private transactionService: TransactionService,
        private toastController: ToastController,
        private navController: NavController,
    ) { }

    /**
     * Fetches the item ID
     */
    ngOnInit() {
        this.getItemID();
    }

    /**
     * Fetches the item ID from the server
     */
    private getItemID() {
        this.route.paramMap.subscribe(params => {
            const itemID = params.get('itemID');
            this.getItem(itemID);
        });
    }

    /**
     * Get item from server based on itemID
     * @param itemID ID of item to fetch
     */
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
    /**
     * Creates Request to take item
     */
    requestItem() {
        this.transactionService.requestItem(this.transaction, this.item._id).subscribe({
            next: async () => {
                const toast = await this.toastController.create({
                    message: 'Anfrage wurde gestellt.',
                    duration: 2000,
                    position: 'top'
                });
                toast.present();
                this.navController.navigateRoot('/transaction-list?segment=outbound');
            }
        });
    }
    /**
     * Sets date, based on value of event target
     * @param event event to get date data from
     * @param type specifies if start or end date
     */
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

    /**
     * Formats date object to string
     * @param date Date object to format
     * @returns formated Date string
     */
    toDateString(date: Date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    }

}
