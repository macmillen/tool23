import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TransactionRequest } from 'src/app/models/transaction-request.model';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'user-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})

export class ReviewsComponent implements OnInit {

  transactions: TransactionRequest[] = [];
  id: string;
  constructor(
    public modalController: ModalController,
    private navParams: NavParams,
    private transactionService: TransactionService
  ) {
    this.id = navParams.get("id_");
  }


  ngOnInit() {
  }

  ionViewDidEnter() {
    this.transactionService.getTransactions().subscribe({
      next: transactions_ => {
        this.transactions = transactions_;
      }
    });

    console.log(this.transactions);
    console.log(this.id);
  }

}
