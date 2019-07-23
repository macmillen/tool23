import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MainListPage } from './main-list.page';
import { FooterComponentModule} from '../../footer/footer.component.module';
import { SearchComponentModule } from './search/search.component.module';


const routes: Routes = [
  {
    path: '',
    component: MainListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FooterComponentModule,
    SearchComponentModule
  ],
  declarations: [MainListPage]
})
export class MainListPageModule {}
