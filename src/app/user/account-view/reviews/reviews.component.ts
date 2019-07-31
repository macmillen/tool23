import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TransactionRequest } from 'src/app/models/transaction-request.model';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'user-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})

export class ReviewsComponent implements OnInit {

  transactions: TransactionRequest[] = [];
  user: User;
  userImageURLs = new Map<string, string>();

  constructor(
    public modalController: ModalController,
    private navParams: NavParams,
    private transactionService: TransactionService,
    private userService: UserService,
    private fireStorage: AngularFireStorage,
  ) { }


  ngOnInit() {
    const userID = this.navParams.get('userID');
    this.userService.getUser(userID).subscribe({
      next: user => this.user = user
    });
  }

  ionViewDidEnter() {
    this.transactionService.getTransactions().subscribe({
      next: transactions => {
        this.transactions = transactions;
        for (const t of this.transactions) {
          this.getUserImageURL(t.user);
        }
      }
    });
  }

  getUserImageURL(user: User) {
    this.userImageURLs.set(user.userID, '../../../assets/placeholder.png');

    const ref = this.fireStorage.ref(`user-images/${user.userID}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.userImageURLs.set(user.userID, url); },
    });
  }

}
