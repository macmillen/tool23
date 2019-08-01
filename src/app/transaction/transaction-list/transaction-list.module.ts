import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionListPage } from './transaction-list.page';
import { IonicRatingModule } from 'ionic4-rating';
import { GiveRatingComponent } from './give-rating/give-rating.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicRatingModule
  ],
  declarations: [TransactionListPage, GiveRatingComponent],
  entryComponents: [GiveRatingComponent]
})
export class TransactionListPageModule { }
