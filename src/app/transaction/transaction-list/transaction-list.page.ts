import { Component, OnInit, NgZone } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { TransactionRequest } from 'server/src/models/transaction_request';
import { User } from 'src/app/models/user.model';
import { AlertController, ModalController } from '@ionic/angular';
import { Transaction } from 'src/app/models/transaction.model';
import { GiveRatingComponent } from './give-rating/give-rating.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.page.html',
    styleUrls: ['./transaction-list.page.scss']
})

/**
 * Page to display list of transactions
 */
export class TransactionListPage implements OnInit {
    transactionRequests: TransactionRequest[];
    filter: 'inbound' | 'outbound' | 'current';
    user: User;
    noData = { inbound: true, outbound: true, current: true };

    constructor(
        private transactionService: TransactionService,
        private userService: UserService,
        private alertController: AlertController,
        private modalController: ModalController,
        private ngZone: NgZone,
        private activatedRoute: ActivatedRoute,
    ) { }
    
    /**
     * Fetches current user, his transactions and  the current filter "outbound" or "inbound"
     */
    ngOnInit() {
        this.userService.getUser('0').subscribe({
            next: user => this.user = user
        });
        this.fetchTransactions();

        this.activatedRoute.queryParamMap.subscribe({
            next: params => {
                const segmentQueryParam = params.get('segment');
                if (segmentQueryParam === 'outbound') {
                    this.filter = 'outbound';
                } else {
                    this.filter = 'inbound';
                }
            }
        });
    }

    /**
    * change the list: inbound, outbound or current
    *
    */
    segmentChanged({ target: { value } }) {
        if (value) {
            this.filter = value;
        }
    }
    /**
     * get all transactions to display them in a list
     * @param event? Target event to complete
    */
    fetchTransactions(event?: any) {
        this.noData = { current: true, inbound: true, outbound: true };
        this.transactionService.getTransactions().subscribe({
            next: transactionRequests => {
                this.ngZone.run(() => {
                    this.transactionRequests = transactionRequests;
                });

                if (event) {
                    event.target.complete();
                }
            }
        });
    }

    /**
     * Accept a transaction
     * @param transactionID ID of transaction 
     * @param takerID   ID of taking user
     */
    acceptTransaction(transactionID: string, takerID: string) {
        this.transactionService.acceptTransaction(transactionID, takerID).subscribe({
            next: () => this.fetchTransactions()
        });
    }
    /**
     * Decline a transaction
     * @param transactionID ID of transaction 
     * @param takerID   ID of taking user
     */
    declineTransaction(transactionID: string, takerID: string) {
        this.transactionService.declineTransaction(transactionID, takerID).subscribe({
            next: () => this.fetchTransactions()
        });
    }
    /**
     * Marks transaction, if item is "given" to taker
     * @param transactionID ID of transaction 
     */
    markGivenTransaction(transactionID: string) {
        this.transactionService.markGivenTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }
    /**
     * Marks transaction, if item is "taken" by taker
     * @param transactionID ID of transaction 
     */
    markTakenTransaction(transactionID: string) {
        this.transactionService.markTakenTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }
    /**
     * Marks transaction, if item is "given back" to the giver by taker
     * @param transactionID ID of transaction 
     */
    markGivenBackTransaction(transactionID: string) {
        this.transactionService.markGivenBackTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }
    /**
     * Marks transaction, if item is "taken back" to the giver by taker
     * @param transactionID ID of transaction 
     */
    markTakenBackTransaction(transactionID: string) {
        this.transactionService.markTakenBackTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }
    /**
     * Revokes transaction
     * @param transactionID ID of transaction 
     */
    revokeTransaction(transactionID: string) {
        this.transactionService.revokeTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }
    /**
     * Formates date object to (german) localized string
     * @param date Date objecto to format
     * @returns {string} Formated date string
     */
    formatDate(date: Date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return (new Date(date)).toLocaleDateString('de-DE', options);
    }

    /**
     * Refreshes all transactions on event
     * @param event event to react to
     */
    refresh(event: any) {
        this.transactionRequests = [];
        this.fetchTransactions(event);
    }

    /**
     * Presents alert based on string and transaction
     * @param type String to determine, what to do.
     * Accepted are: "accepted-giver", "accepted-taker",
     * "transfered-giver", "transfered-taker"
     * @param transaction Transaction Object to work with 
     */
    async presentAlert(type: string, transaction: Transaction) {

        let options = {};

        if (type === 'accepted-giver') {
            options = {
                header: 'Bestätigung',
                message: 'Hiermit bestätigen Sie, dass die Übergabe erfolgreich ausgeführt wurde.',
                buttons: [
                    'Cancel',
                    {
                        text: 'Bestätigen',
                        handler: () => this.markGivenTransaction(transaction._id)
                    }
                ]
            };
        } else if (type === 'accepted-taker') {
            options = {
                header: 'Bestätigung',
                message: 'Hiermit bestätigen Sie, dass die Übernahme erfolgreich ausgeführt wurde.',
                buttons: [
                    'Cancel',
                    {
                        text: 'Bestätigen',
                        handler: () => this.markTakenTransaction(transaction._id),
                    }
                ]
            };
        } else if (type === 'transfered-giver') {
            options = {
                header: 'Bestätigung',
                message: 'Hiermit bestätigen Sie, dass die Rückgabe erfolgreich ausgeführt wurde.',
                buttons: [
                    'Cancel',
                    {
                        text: 'Bestätigen',
                        handler: () => this.markTakenBackTransaction(transaction._id)
                    }
                ]
            };
        } else if (type === 'transfered-taker') {
            options = {
                header: 'Bestätigung',
                message: 'Hiermit bestätigen Sie, dass die Rücknahme erfolgreich ausgeführt wurde.',
                buttons: [
                    'Cancel',
                    {
                        text: 'Bestätigen',
                        handler: () => this.markGivenBackTransaction(transaction._id)
                    }
                ]
            };
        }


        const alert = await this.alertController.create(options);

        await alert.present();
    }
    
    /**
     * Opens modal to rate the transaction
     * @param type "giver" or "taker", based on user role in the transaction
     * @param transaction Transaction to rate
     */
    async presentModal(type: string, transaction: TransactionRequest) {
        const modal = await this.modalController.create({
            component: GiveRatingComponent,
            componentProps: { type, transaction }
        });
        modal.onDidDismiss().then(() => {
            this.fetchTransactions();
        });
        return await modal.present();
    }

    /**
     * Sets "type" in noData to false
     * @param type Can be "outbound", "inbound" or "current"     
     * 
     */
    setNoData(type: string) {
        this.noData[type] = false;
    }
}
