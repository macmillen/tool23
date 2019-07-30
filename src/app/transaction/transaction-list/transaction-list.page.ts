import { Component, OnInit, NgZone } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { TransactionRequest } from 'server/src/models/transaction_request';
import { User } from 'src/app/models/user.model';
import { AlertController, ModalController } from '@ionic/angular';
import { Transaction } from 'src/app/models/transaction.model';
import { GiveRatingComponent } from './give-rating/give-rating.component';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.page.html',
    styleUrls: ['./transaction-list.page.scss']
})
export class TransactionListPage implements OnInit {
    transactionRequests: TransactionRequest[];
    filter: 'inbound' | 'outbound' | 'current' = 'inbound';
    user: User;
    noData = { inbound: true, outbound: true, current: true };

    constructor(
        private transactionService: TransactionService,
        private userService: UserService,
        private alertController: AlertController,
        private modalController: ModalController,
        private ngZone: NgZone,
    ) { }

    ngOnInit() {
        this.userService.getUser('0').subscribe({
            next: user => this.user = user
        });
        this.fetchTransactions();
    }

    // change the list: inbound, outbound or current
    segmentChanged({ target: { value } }) {
        this.filter = value;
    }

    // get all transactions to display them in a list
    fetchTransactions(event?: any) {
        this.transactionRequests = [];
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

    acceptTransaction(transactionID: string, takerID: string) {
        this.transactionService.acceptTransaction(transactionID, takerID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    declineTransaction(transactionID: string, takerID: string) {
        this.transactionService.declineTransaction(transactionID, takerID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    markGivenTransaction(transactionID: string) {
        this.transactionService.markGivenTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    markTakenTransaction(transactionID: string) {
        this.transactionService.markTakenTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    markGivenBackTransaction(transactionID: string) {
        this.transactionService.markGivenBackTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    markTakenBackTransaction(transactionID: string) {
        this.transactionService.markTakenBackTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    revokeTransaction(transactionID: string) {
        this.transactionService.revokeTransaction(transactionID).subscribe({
            next: () => this.fetchTransactions()
        });
    }

    formatDate(date: Date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return (new Date(date)).toLocaleDateString('de-DE', options);
    }

    refresh(event: any) {
        this.transactionRequests = [];
        this.fetchTransactions(event);
    }

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

    setNoData(type: string) {
        this.noData[type] = false;
    }
}
