import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SearchComponent } from './search.component';
import { Routes } from '@angular/router';


@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  entryComponents: [SearchComponent]
})
export class SearchComponentModule {}
