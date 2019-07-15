import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccountViewPage } from './account-view.page';
import { FooterComponentModule } from '../../footer/footer.component.module';
import { MoreComponent } from './more/more.component';

const routes: Routes = [
  {
    path: '',
    component: AccountViewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FooterComponentModule
  ],
  declarations: [AccountViewPage, MoreComponent],
  entryComponents: [MoreComponent]
})
export class AccountViewPageModule { }
