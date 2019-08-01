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
/**
 * Modal/Component to rate a transaction
 */
export class GiveRatingComponent implements OnInit {

  comment = ''; // Variable for comment, starts empty
  rating = 0;   // rating in points
  userImageURL = '../../../assets/placeholder.png'; //Placeholder imageURL
  @Input() transaction: TransactionRequest;
  @Input() type: string;

  constructor(
    public modalController: ModalController,
    private transactionService: TransactionService,
    private fireStorage: AngularFireStorage,
  ) { }

  /**
   * Fetch userImage on Init
   */
  ngOnInit() {
    this.getUserImageURL();
  }

  /**
   * Rate the transaction based on set type
   */
  rate() {
    if (this.type === 'taker') {
      this.rateTakerTransaction(this.transaction._id, this.comment, this.rating);
    } else if (this.type === 'giver') {
      this.rateGiverTransaction(this.transaction._id, this.comment, this.rating);
    }
  }

  /**
   * Rate the Transaction as taker
   * @param transactionID ID of the transaction
   * @param comment Comment to the transaction
   * @param rating Points given to the transaction
   */
  rateTakerTransaction(transactionID: string, comment: string, rating: number) {
    this.transactionService.rateTakerTransaction(transactionID, comment, rating).subscribe({
      next: () => this.modalController.dismiss()
    });
  }

/**
   * Rate the Transaction as giver
   * @param transactionID ID of the transaction
   * @param comment Comment to the transaction
   * @param rating Points given to the transaction
   */
  rateGiverTransaction(transactionID: string, comment: string, rating: number) {
    this.transactionService.rateGiverTransaction(transactionID, comment, rating).subscribe({
      next: () => this.modalController.dismiss()
    });
  }

  /**
   * Fetch URL of user iamge from server and save it
   */
  getUserImageURL() {
    const ref = this.fireStorage.ref(`profilepics/${this.transaction.user.userID}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.userImageURL = url; },
    });
  }
}
