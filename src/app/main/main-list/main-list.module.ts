import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MainListPage } from './main-list.page';
import { SearchComponent } from './search/search.component';


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
  ],
  declarations: [MainListPage, SearchComponent],
  entryComponents: [SearchComponent]
})
export class MainListPageModule { }
