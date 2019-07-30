import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransactionService } from 'src/app/services/transaction.service';
import { TransactionRequest } from 'src/app/models/transaction-request.model';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-give-rating',
  templateUrl: './give-rating.component.html',
  styleUrls: ['./give-rating.component.scss'],
})
export class GiveRatingComponent implements OnInit {

  comment = '';
  rating = 0;
  userImageURL = '../../../assets/placeholder.png';
  @Input() transaction: TransactionRequest;
  @Input() type: string;

  constructor(
    public modalController: ModalController,
    private transactionService: TransactionService,
    private fireStorage: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.getUserImageURL();
  }

  rate() {
    if (this.type === 'taker') {
      this.rateTakerTransaction(this.transaction._id, this.comment, this.rating);
    } else if (this.type === 'giver') {
      this.rateGiverTransaction(this.transaction._id, this.comment, this.rating);
    }
  }

  rateTakerTransaction(transactionID: string, comment: string, rating: number) {
    this.transactionService.rateTakerTransaction(transactionID, comment, rating).subscribe({
      next: () => this.modalController.dismiss()
    });
  }

  rateGiverTransaction(transactionID: string, comment: string, rating: number) {
    this.transactionService.rateGiverTransaction(transactionID, comment, rating).subscribe({
      next: () => this.modalController.dismiss()
    });
  }

  getUserImageURL() {
    const ref = this.fireStorage.ref(`profilepics/${this.transaction.user.userID}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.userImageURL = url; },
    });
  }
}
