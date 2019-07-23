import { Component, OnInit } from '@angular/core';
import { NavParams, ToastController, NavController } from '@ionic/angular';
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
          startDate: new Date(),
          endDate: new Date(),
          message: '',
          itemID: item._id,
          giverID: item.userID,
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
          duration: 2000
        });
        toast.present();
        this.navController.navigateRoot('/transaction-list');
      }
    });
  }

}
